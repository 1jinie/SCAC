package com.scac.device.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.scac.device.dto.DeviceHealthRequest;
import com.scac.device.entity.TaskCommand;
import com.scac.device.service.DeviceService;
import com.scac.device.service.TaskStore;
import com.scac.global.exception.TaskNotFoundException;
import com.scac.global.response.ApiResponse;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class TaskController {
    private static final Logger log = LoggerFactory.getLogger(TaskController.class);
    private final DeviceService deviceService;
    private final TaskStore store;

    public TaskController(TaskStore store, DeviceService deviceService) {
        this.store = store;
        this.deviceService = deviceService;
    }

    /**
     * React -> Spring
     * 
     * 새로운 장치 작업 생성
     */
    @PostMapping("/commands")
    @ResponseStatus(HttpStatus.CREATED)
    public TaskCommand create(@Valid @RequestBody CreateRequest request) {

        TaskCommand command = store.create(request.taskType(), request.payload());

        log.info("[React -> Spring] Command created. id={}, taskType={}, payload={}", command.id(),
            command.taskType(), command.payload());
        return command;
    }

    /**
     * RTOS -> Spring
     * 
     * 처리해야 할 작업 1개 조회
     */
    @GetMapping("/commands/pending")
    public TaskCommand pending() {
        return store.pending();
    }

    /**
     * 작업 상세 조회
     */
    @GetMapping("/commands/{id}")
    public TaskCommand find(@PathVariable("id") long id) {
        return store.find(id);
    }

    /**
     * RTOS -> Spring
     * 
     * 작업 처리 완료/실패 보고
     */
    @PatchMapping("/commands/{id}/finish")
    public TaskCommand finish(@PathVariable("id") long id, @Valid @RequestBody CompleteRequest request) {
        TaskCommand command;

        if ("COMPLETED".equalsIgnoreCase(request.status())) {
            command = store.complete(id, request.result());
        } else if ("FAILED".equalsIgnoreCase(request.status())) {
            command = store.fail(id, request.result());
        } else {
            throw new IllegalArgumentException("지원하지 않는 작업 상태입니다: " + request.status());
        }

        log.info("[RTOS -> Spring] Command finished. id={}, status={}, result={}", id, request.status(),
            request.result());

        return command;
    }

    /**
     * RTOS -> Spring
     * 
     * 장치 상태 보고
     */
    // RTOS Health Check 수신
    @PostMapping("/devices/health")
    public ResponseEntity<ApiResponse<Void>> handleHealthCheck(@RequestBody DeviceHealthRequest request) {
        log.info(
            "[RTOS -> Spring] Health Check. kioskId={}, kioskName={}, status={}, door={}, cardReader={}, printer={}",
            request.kioskId(), request.kioskName(), // dto 수정 후 주석 해제
            request.status(), request.door(), request.cardReader(), request.printer());
        deviceService.handleHealthCheck(request);

        return ResponseEntity.ok(ApiResponse.success("장치 Health Check 처리를 완료했습니다.", null));
    }

    @ExceptionHandler(TaskNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> notFound(TaskNotFoundException exception) {
        return Map.of("message", exception.getMessage());
    }

    public record CreateRequest(@NotBlank String taskType, String payload) {
    }

    public record CompleteRequest(@NotBlank String status, @NotBlank String result) {
    }
}
