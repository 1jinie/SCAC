#include "http_client.h"
#include "FreeRTOS.h"
#include "task.h"


#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>


#define RESPONSE_CAPACITY 2048
#define RESULT_CAPACITY 256


/* Spring Boot 명령을 RTOS에서 사용하기 위한 공통 작업 구조체입니다. */
typedef struct {
    uint32_t id;
    char task_type[32];
    char payload[256];
} work_t;


/* 모든 Handler는 같은 입력과 출력 형식을 사용합니다. 0은 성공, -1은 실패입니다. */
typedef int (*task_handler_t)(const work_t *work, char *result, size_t result_size);


/* Spring HandlerMapping처럼 문자열 taskType과 실제 처리 함수를 연결합니다. */
typedef struct {
    const char *task_type;
    task_handler_t handler;
} task_handler_mapping_t;

// 전역 변수
static http_server_t spring_server;
static volatile BaseType_t worker_running = pdFALSE;
static volatile BaseType_t door_open = pdFALSE;

static const char *json_value(const char *json, const char *key) {
    static char pattern[64];
    snprintf(pattern, sizeof(pattern), "\"%s\":", key);
    const char *value = strstr(json, pattern);
    return value == NULL ? NULL : value + strlen(pattern);
}


static int json_string(const char *json, const char *key, char *out, size_t size) {
    const char *value = json_value(json, key);
    if (value == NULL || *value++ != '\"') return -1;
    size_t index = 0;
    while (*value && *value != '\"' && index + 1 < size) out[index++] = *value++;
    out[index] = '\0';
    return *value == '\"' ? 0 : -1;
}


static int parse_work(const char *json, work_t *work) {
    if (strstr(json, "[]") != NULL) return 0;
    const char *id_value = json_value(json, "id");
    if (id_value == NULL) return -1;
    work->id = (uint32_t) strtoul(id_value, NULL, 10);
    return json_string(json, "taskType", work->task_type, sizeof(work->task_type)) == 0 &&
           json_string(json, "payload", work->payload, sizeof(work->payload)) == 0 ? 1 : -1;
}

// 도어 닫힘
static int handle_door_close(
        const work_t *work,
        char *result,
        size_t result_size){
    (void) work;

    door_open = pdFALSE;
    printf("[DOOR] CLOSE\n");
    fflush(stdout);

    vTaskDelay(pdMS_TO_TICKS(500));

    snprintf(result, result_size, "door closed");

    return 0;
}

// 도어 열림
static int handle_door_open(
        const work_t *work,
        char *result,
        size_t result_size){
    (void) work;

    // 문 열기
    door_open = pdTRUE;
    printf("[DOOR] OPEN\n");
    fflush(stdout);

    vTaskDelay(pdMS_TO_TICKS(500));

    // 5초 동안 문을 열어둠
    printf("[DOOR] OPEN 유지 - 5초 후 자동 닫힘\n");
    fflush(stdout);

    vTaskDelay(pdMS_TO_TICKS(5000));

    // 문 닫기
    char close_result[RESULT_CAPACITY] = {0};

    handle_door_close(work, close_result, sizeof(close_result));

    snprintf(result, result_size, "door opened and automatically closed after 5 sec");

    return 0;
}

// 카드 리더기
static int handle_card_reading(const work_t *work, char *result, size_t result_size){
    (void) work;

    printf("[CARD READER] 카드 인식 대기 중...\n");
    fflush(stdout);

    // 카드 인식 시뮬레이션
    vTaskDelay(pdMS_TO_TICKS(5000));

    printf("[CARD READER] 카드 인식 완료\n");
    fflush(stdout);

    snprintf(result, result_size, "card reading completed");

    return 0;
}

static int handle_print_receipt(const work_t *work, char *result, size_t result_size) {
    char payload[sizeof(work->payload)];
    snprintf(payload, sizeof(payload), "%s", work->payload);
    char *order_id = strtok(payload, "|");
    char *items = strtok(NULL, "|");
    char *start_time = strtok(NULL, "|");
    char *end_time = strtok(NULL, "|");
    char *price = strtok(NULL, "|");
    if (order_id == NULL || items == NULL || start_time == NULL || end_time == NULL || price == NULL) {
        snprintf(result, result_size, "invalid receipt payload");
        return -1;
    }


    printf("\n+--------------------------------------+\n");
    printf("|          KIOSK RECEIPT               |\n");
    printf("+--------------------------------------+\n");
    printf("  주문 번호 : %s\n", order_id);
    printf("  품목 : %s\n", items);
    if(start_time != NULL && end_time != NULL){
        printf("  사용 시간 : %s ~ %s\n", start_time, end_time);
    }
    printf("  결제 금액 : %s원\n", price);
    printf("+--------------------------------------+\n\n");
    time_t now = time(NULL);
    struct tm tm_now;
    if(localtime_r(&now, &tm_now) == NULL){
        snprintf(result, result_size, "failed to get local time");
        return -1;
    }
    char datetime[32];
    strftime(datetime, sizeof(datetime), "%Y-%m-%d %H:%M", &tm_now);
    printf("  발행 일시 : %s\n", datetime);
    printf("+--------------------------------------+\n\n");
    fflush(stdout);
    vTaskDelay(pdMS_TO_TICKS(1200));
    snprintf(result, result_size, "receipt printed: %s", order_id);
    return 0;
}

/* 새 작업을 추가할 때 Handler를 구현하고 이 테이블에 한 줄 등록합니다. */
static const task_handler_mapping_t task_handlers[] = {
    {"DOOR_OPEN", handle_door_open},
    {"DOOR_CLOSE", handle_door_close},
    {"CARD_READING", handle_card_reading},
    {"PRINT_RECEIPT", handle_print_receipt},
};


static task_handler_t find_task_handler(const char *task_type) {
    size_t count = sizeof(task_handlers) / sizeof(task_handlers[0]);
    for (size_t index = 0; index < count; index++) {
        if (strcmp(task_handlers[index].task_type, task_type) == 0)
            return task_handlers[index].handler;
    }
    return NULL;
}

static int fetch_printer_status(void) {
    char body[RESPONSE_CAPACITY];
    http_response_t response = {0};

    int result = http_request(
        &spring_server,
        "GET",
        "/api/devices/1/status",
        NULL,
        body,
        sizeof(body),
        &response
    );

    if (result != 0 || response.status_code != 200) {
        printf(
            "[PrinterStatus] 상태 조회 실패: HTTP %d\n",
            response.status_code
        );

        // 상태를 알 수 없으면 일단 EMPTY로 취급
        return 0;
    }

    char status[32] = {0};

    if (json_string(body, "status", status, sizeof(status)) != 0) {
        printf("[PrinterStatus] status 파싱 실패\n");
        return 0;
    }

    if (strcmp(status, "NORMAL") == 0) {
        return 1;   // READY
    }

    if (strcmp(status, "ERROR") == 0) {
        return 0;   // EMPTY
    }

    // NORMAL / ERROR 이외의 상태도 안전하게 EMPTY 처리
    return 0;
}

static void health_check_task(void *parameter){
    (void) parameter;

    for(;;){
        int printer_ready = fetch_printer_status();
        const char *printer_status = printer_ready ? "READY" : "EMPTY";
        const char *door_status = door_open ? "OPEN" : "CLOSE";
        char json[512];

        snprintf(
            json,
            sizeof(json),
            "{"
            "\"kioskId\":1,"
            "\"kioskName\":\"KIOSK-01\","
            "\"status\":\"ONLINE\","
            "\"door\":\"%s\","
            "\"cardReader\":\"WAITING\","
            "\"printer\":\"%s\""
            "}",
            door_status,
            printer_status
        );

        char body[RESPONSE_CAPACITY];

        http_response_t response = {0};

        int result = http_request(
            &spring_server,
            "POST",
            "/api/devices/health",
            json,
            body,
            sizeof(body),
            &response
        );

        if(result == 0 && response.status_code == 200){
            printf("[HealthCheckTask -> Spring] 상태 전송 성공\n");
        }else{
            fprintf(
                stderr,
                "[HealthCheckTask] 상태 전송 실패: HTTP %d\n",
                response.status_code
            );
        }

        vTaskDelay(pdMS_TO_TICKS(5000));
    }
}


static void report_result(const work_t *work, const char *status, const char *result) {
    char path[96], json[512], response_body[RESPONSE_CAPACITY];
    http_response_t response = {0};
    snprintf(path, sizeof(path), "/api/commands/%u/finish", work->id);
    snprintf(json, sizeof(json), "{\"status\":\"%s\",\"result\":\"%s\"}",
            status, result);
    if (http_request(&spring_server, "PATCH", path, json,
            response_body, sizeof(response_body), &response) == 0 &&
            response.status_code == 200) {
        printf("[WorkerTask -> Spring] id=%u, status=%s, result=%s\n",
                work->id, status, result);
    } else {
        fprintf(stderr, "[WorkerTask] 결과 보고 실패: id=%u\n", work->id);
    }
}


static void worker_task(void *parameter) {
    work_t work = *(work_t *) parameter;
    vPortFree(parameter);
    char result[RESULT_CAPACITY] = {0};

    task_handler_t handler = find_task_handler(work.task_type);

    if (handler == NULL) {
        snprintf(result, sizeof(result), "unsupported taskType: %s", work.task_type);
        report_result(&work, "FAILED", result);
    } else if (handler(&work, result, sizeof(result)) == 0) {
        report_result(&work, "COMPLETED", result);
    } else {
        report_result(&work, "FAILED", result);
    }


    worker_running = pdFALSE;
    vTaskDelete(NULL);
}


static void command_poll_task(void *parameter) {
    (void) parameter;
    for (;;) {
        if (!worker_running) {
            char body[RESPONSE_CAPACITY];
            http_response_t response = {0};
            work_t parsed = {0};
            int request_ok = http_request(&spring_server, "GET", "/api/commands/pending",
                    NULL, body, sizeof(body), &response);
            if (request_ok == 0 && response.status_code == 200 &&
                    parse_work(body, &parsed) == 1) {
                work_t *work = pvPortMalloc(sizeof(*work));
                if (work != NULL) {
                    *work = parsed;
                    worker_running = pdTRUE;
                    if (xTaskCreate(worker_task, "WorkerTask", 2048,
                            work, 3, NULL) != pdPASS) {
                        worker_running = pdFALSE;
                        vPortFree(work);
                    }
                }
            }
        }
        vTaskDelay(pdMS_TO_TICKS(1000));
    }
}

void vApplicationMallocFailedHook(void) { abort(); }

int main(int argc, char **argv) {
    const char *url = argc >= 2 ? argv[1] : "http://localhost:8888";
    if (http_server_parse(url, &spring_server) < 0) return EXIT_FAILURE;
    configASSERT(xTaskCreate(command_poll_task, "CommandPollTask",
            2048, NULL, 2, NULL) == pdPASS);
    configASSERT(xTaskCreate(health_check_task, "HealthCheckTask",
            2048, NULL, 2, NULL) == pdPASS);
    vTaskStartScheduler();
    return EXIT_FAILURE;
}