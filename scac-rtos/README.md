# ⚙️ SCAC RTOS

> **FreeRTOS POSIX 기반 SCAC 장치 제어 Client**

SCAC RTOS는 스터디카페 키오스크 시스템의 카드 리더기, 영수증 프린터, 출입문 등의 장치 동작을 시뮬레이션하기 위한 FreeRTOS 기반 Client입니다.

Spring Boot Backend와 HTTP 통신을 수행하며,
Backend에서 생성된 장치 명령을 조회하여 처리한 뒤 결과를 다시 서버로 전달합니다.

또한 일정 주기로 장치 상태를 Health Check 형태로 전송하여
관리자 시스템에서 장치의 현재 상태와 마지막 연결 정보를 확인할 수 있도록 구성하였습니다.

> 현재 프로젝트에서는 실제 물리 장비 대신 **FreeRTOS POSIX 환경에서 장치 동작을 시뮬레이션**합니다.

---

## ✨ 주요 기능

### 💳 카드 리딩

- Spring Boot에서 생성된 `CARD_READING` 명령 조회
- 카드 리더기 동작 시뮬레이션
- 처리 완료 결과를 Spring Boot에 반환
- 카드 결제 Flow와 연동

정상 처리 예시:

```text
[WorkerTask -> Spring]
id=4, status=COMPLETED, result=카드 읽기 성공
```

---

### 🧾 영수증 출력

- 결제 완료 후 `PRINT_RECEIPT` 명령 수신
- 전달받은 결제 정보를 파싱
- 터미널에 영수증 형태로 출력
- 처리 결과를 `COMPLETED` 또는 `FAILED`로 반환

예시:

```text
+--------------------------------------+
|          KIOSK RECEIPT               |
+--------------------------------------+
  주문 번호 : PAYMENT-15
  품목 : 2시간 이용권
  사용 시간 : - ~ -
  결제 금액 : 5000원
+--------------------------------------+
```

---

### 🚪 출입문 제어

- `DOOR_OPEN` 명령 처리
- 출입문 개방 상태 시뮬레이션
- 개방 후 5초가 지나면 자동으로 닫힘 처리
- 별도의 `DOOR_CLOSE` 명령 처리
- 입·퇴실 Flow와 연동

---

### ❤️ Health Check

RTOS Client는 **5초마다** 현재 장치 상태를 Spring Boot Backend로 전송합니다.

전달하는 주요 상태:

- Kiosk 연결 상태
- Door 상태
- Card Reader 상태
- Printer 상태

정상 로그:

```text
[HealthCheckTask -> Spring] 상태 전송 성공
```

Spring Boot는 전달받은 정보를 이용하여 장치의 현재 상태와 마지막 연결 시간을 갱신합니다.

일정 시간 동안 Health Check가 수신되지 않으면 Backend에서 해당 장치를 `OFFLINE`으로 판단합니다.

---

## 🏗 System Architecture

```text
┌──────────────────────┐
│     React Kiosk      │
│     scac-front       │
└──────────┬───────────┘
           │
           │ Device Command 요청
           ▼
┌──────────────────────┐
│     Spring Boot      │
│      scac-back       │
│                      │
│  Command 생성        │
│  Device 상태 관리    │
└──────────┬───────────┘
           │
           │ PENDING Command 조회
           ▼
┌──────────────────────┐
│     RTOS Client      │
│      scac-rtos       │
│                      │
│  CARD_READING        │
│  PRINT_RECEIPT       │
│  DOOR_OPEN           │
│  DOOR_CLOSE          │
└──────────┬───────────┘
           │
           │ 처리 결과
           │ Health Check
           ▼
┌──────────────────────┐
│     Spring Boot      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│     Admin System     │
│     scac-admin       │
│                      │
│ 장치 상태 / 로그 조회 │
└──────────────────────┘
```

---

## 🔄 Communication Flow

SCAC RTOS는 크게 두 가지 통신 흐름을 사용합니다.

### 1. Command 처리: Spring → RTOS → Spring

장치 제어가 필요한 경우 Backend에서 Command를 생성합니다.

```text
React Kiosk
    │
    │ 장치 동작 요청
    ▼
Spring Boot
    │
    │ Command 생성
    │ status = PENDING
    ▼
RTOS Client
    │
    │ Command Polling
    ▼
장치 동작 처리
    │
    ▼
Spring Boot
    │
    ├── COMPLETED
    └── FAILED
```

주요 Command:

```text
CARD_READING
PRINT_RECEIPT
DOOR_OPEN
```

---

### 2. RTOS → Spring

장치의 현재 상태는 RTOS에서 주기적으로 Backend에 전달합니다.

```text
RTOS Client
    │
    │ every 5 seconds
    ▼
POST /api/devices/health
    │
    ▼
Spring Boot
    │
    ├── NETWORK
    ├── DOOR
    ├── CARD_READER
    └── PRINTER
    │
    ▼
Device / DeviceLog
    │
    ▼
Admin Device Page
```

---

## ⏱ Task 구성

RTOS Client에서는 역할별 Task를 분리하여 동작합니다.

### Worker Task

Spring Boot에서 처리 대기 중인 장치 Command를 조회합니다.

```text
GET /api/commands/pending
```

대기 중인 Command가 존재하면 종류에 따라 장치 동작을 수행합니다.

```text
CARD_READING
      │
      └── 카드 리딩 처리

PRINT_RECEIPT
      │
      └── 영수증 출력 처리

DOOR_OPEN
      │
      └── 출입문 개방 처리

DOOR_CLOSE
      │
      └── 출입문 닫힘 처리
```

처리 완료 후 결과를 다시 Spring Boot에 전달합니다.

---

### Health Check Task

5초마다 장치 상태를 Spring Boot로 전송합니다.

```text
RTOS
  │
  │ 5 sec
  ▼
Spring Boot
  │
  ▼
Device 상태 및 lastConnectedAt 갱신
```

---

## 🌐 Backend API

RTOS Client는 다음 Spring Boot API와 통신합니다.

### Command API

| Method  | Endpoint                    | Description                      |
| ------- | --------------------------- | -------------------------------- |
| `GET`   | `/api/commands/pending`     | 가장 오래된 PENDING Command 조회 |
| `GET`   | `/api/commands/{id}`        | Command 처리 상태 조회           |
| `PATCH` | `/api/commands/{id}/finish` | Command 처리 결과 반환           |

---

### Device API

| Method | Endpoint                         | Description            |
| ------ | -------------------------------- | ---------------------- |
| `POST` | `/api/devices/health`            | 장치 Health Check 전송 |
| `GET`  | `/api/devices/{deviceId}/status` | 장치 현재 상태 조회    |

키오스크 Frontend에서는 필요한 장치 동작을 다음 API를 통해 생성합니다.

| Method | Endpoint        | Description            |
| ------ | --------------- | ---------------------- |
| `POST` | `/api/commands` | RTOS 장치 Command 생성 |

---

## 📦 Command Status

장치 Command는 다음 상태를 사용합니다.

| Status       | Description                            |
| ------------ | -------------------------------------- |
| `PENDING`    | RTOS 처리 대기                         |
| `PROCESSING` | RTOS가 조회하여 처리 중인 상태         |
| `COMPLETED`  | RTOS 처리 성공                         |
| `FAILED`     | 지원하지 않는 명령 또는 장치 처리 실패 |

예시:

```text
Spring
  │
  │ Command 생성
  ▼
PENDING
  │
  │ RTOS가 GET /api/commands/pending 호출
  ▼
PROCESSING
  │
  │ RTOS 처리
  ├── 성공 ──▶ COMPLETED
  └── 실패 ──▶ FAILED
```

---

## 🛠 Tech Stack

| Category      | Technology          |
| ------------- | ------------------- |
| Language      | C11                 |
| RTOS          | FreeRTOS            |
| Runtime       | FreeRTOS POSIX Port |
| OS            | Ubuntu / Linux      |
| Build         | CMake               |
| Compiler      | GCC                 |
| Build Tool    | Make                |
| Communication | HTTP                |
| Thread        | POSIX / pthread     |

---

## 📂 Project Structure

```text
scac-rtos
│
├── config
│   └── FreeRTOSConfig.h
│
├── src
│   ├── main.c
│   ├── http_client.c
│   └── http_client.h
│
├── CMakeLists.txt
├── Makefile
└── README.md
```

### 주요 역할

| File / Directory | Description                   |
| ---------------- | ----------------------------- |
| `config`         | FreeRTOS 설정                 |
| `src`            | RTOS Task 및 장치 처리 코드   |
| `main.c`         | RTOS Client 시작 및 Task 구성 |
| `http_client.c`  | Spring Boot HTTP 통신         |
| `CMakeLists.txt` | CMake Build 설정              |
| `Makefile`       | Build / Run 명령              |

---

## 🚀 Getting Started

### 1. 실행 환경

`scac-rtos`는 **Windows Git Bash가 아닌 Ubuntu / Linux 환경에서 실행**합니다.

Windows에서 개발하는 경우 WSL Ubuntu 사용을 권장합니다.

정상적인 Ubuntu Terminal 예시:

```text
administrator@DESKTOP:~$
```

다음과 같이 표시된다면 Git Bash입니다.

```text
Administrator@DESKTOP MINGW64
```

`MINGW64` 환경에서는 `apt`, `sudo` 등의 Ubuntu 명령을 사용할 수 없습니다.

---

### 2. Required Packages

Ubuntu Terminal에서 필요한 Build Tool을 설치합니다.

```bash
sudo apt update
sudo apt install -y cmake build-essential
```

설치 확인:

```bash
cmake --version
make --version
gcc --version
```

각 명령에서 Version 정보가 출력되어야 합니다.

---

### 3. Project Directory

Windows의 프로젝트가 다음 경로에 있다면:

```text
C:\ex\project\scac-rtos
```

WSL에서는 다음 경로로 접근합니다.

```bash
cd /mnt/c/ex/project/scac-rtos
```

현재 위치 확인:

```bash
pwd
```

예시:

```text
/mnt/c/ex/project/scac-rtos
```

---

### 4. FreeRTOS Kernel

SCAC RTOS를 Build하려면 FreeRTOS Kernel이 필요합니다.

예시 경로:

```text
~/rtos-kiosk-course/third_party/FreeRTOS-Kernel
```

Kernel 위치를 확인합니다.

```bash
ls ~/rtos-kiosk-course/third_party/FreeRTOS-Kernel/CMakeLists.txt
```

없다면 경로에 FreeRTOS를 설치해줍니다.

```bash
git clone --depth 1 https://github.com/FreeRTOS/FreeRTOS-Kernel.git
```

FreeRTOS Kernel이 다른 위치에 있는 경우 환경변수를 설정합니다.

```bash
export FREERTOS_KERNEL_PATH=/path/to/FreeRTOS-Kernel
```

예시:

```bash
export FREERTOS_KERNEL_PATH=~/rtos-kiosk-course/third_party/FreeRTOS-Kernel
```

---

### 5. Build

기존 Build 파일을 제거합니다.

```bash
rm -rf build
```

CMake 설정:

```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug
```

Build:

```bash
cmake --build build -j
```

정상적으로 완료되면:

```text
[100%] Built target day05_rtos
```

가 출력됩니다.

실행 파일 확인:

```bash
ls build/day05_rtos
```

---

## ▶️ Run

### Case 1. Spring Boot와 RTOS를 같은 Linux 환경에서 실행

Spring Boot가 동일한 환경의 `8888` Port에서 실행 중이라면:

```bash
./build/day05_rtos http://localhost:8888
```

---

### Case 2. Spring Boot는 Windows, RTOS는 WSL

Spring Boot를 Windows에서 실행하고 RTOS를 WSL Ubuntu에서 실행하는 경우
RTOS에서 `localhost:8888`을 사용하면 Spring Boot에 접근하지 못할 수 있습니다.

Windows Host IP를 확인합니다.

```bash
WIN_HOST=$(ip route | awk '/default/ {print $3; exit}')
echo $WIN_HOST
```

예시:

```text
172.29.160.1
```

먼저 Spring Boot 연결 여부를 확인합니다.

> `/api/commands/pending`는 대기 명령이 존재할 경우 해당 명령을 `PROCESSING`으로 변경합니다.
> 실제 대기 명령이 없는 상태에서 연결 확인용으로 사용하세요.

```bash
curl --connect-timeout 3 -i http://$WIN_HOST:8888/api/commands/pending
```

다음과 같이 HTTP 응답이 오면 Backend까지 연결된 상태입니다.

```text
HTTP/1.1 200
```

RTOS 실행:

```bash
./build/day05_rtos http://$WIN_HOST:8888
```

또는 Host IP를 직접 지정할 수 있습니다.

```bash
./build/day05_rtos http://---.--.---.-:8888
```

> WSL을 재시작하면 Windows Host IP가 변경될 수 있으므로 고정값 대신 `ip route`로 다시 확인하는 것을 권장합니다.

---

### ⚠️ `make run` 사용 시 주의

Makefile의 `run` Command가 다음처럼 구성된 경우:

```makefile
run: all
	./build/day05_rtos http://localhost:8888
```

Spring Boot를 Windows에서 실행하고 RTOS를 WSL에서 실행하면
`localhost:8888` 연결이 실패할 수 있습니다.

이 환경에서는 다음처럼 직접 실행하는 것을 권장합니다.

```bash
WIN_HOST=$(ip route | awk '/default/ {print $3; exit}')
./build/day05_rtos http://$WIN_HOST:8888
```

---

## ✅ 정상 실행 확인

RTOS와 Spring Boot가 정상적으로 연결되면 다음과 같은 로그를 확인할 수 있습니다.

### Health Check

```text
[HealthCheckTask -> Spring] 상태 전송 성공
```

### Card Reading

```text
[WorkerTask -> Spring]
id=4, status=COMPLETED, result=카드 읽기 성공
```

### Receipt

```text
[WorkerTask -> Spring]
id=5, status=COMPLETED, result=영수증 출력: PAYMENT-15
```

이 상태라면:

```text
RTOS ↔ Spring Boot
```

통신이 정상적으로 동작하고 있는 것입니다.

관리자 장치관리 화면에서도 장치 상태를 확인할 수 있습니다.

---

## 🔍 Troubleshooting

### 1. `make: command not found`

```text
bash: make: command not found
```

Ubuntu에 Build Tool이 설치되지 않은 경우입니다.

```bash
sudo apt update
sudo apt install -y build-essential
```

---

### 2. `cmake: command not found`

```text
bash: cmake: command not found
```

CMake를 설치합니다.

```bash
sudo apt update
sudo apt install -y cmake
```

확인:

```bash
cmake --version
```

---

### 3. `sudo: command not found`

다음과 같은 Terminal을 사용하고 있는지 확인합니다.

```text
MINGW64
```

이는 Ubuntu가 아니라 Windows Git Bash입니다.

Windows에서 WSL Ubuntu Terminal을 실행한 뒤 다시 진행합니다.

---

### 4. `localhost:8888 연결 실패: Connection refused`

예시:

```text
[HTTP] localhost:8888 연결 실패: Connection refused
[HealthCheckTask] 상태 전송 실패: HTTP 0
```

Spring Boot를 Windows에서 실행하고 RTOS를 WSL에서 실행하는 경우 발생할 수 있습니다.

Windows Host IP를 확인합니다.

```bash
WIN_HOST=$(ip route | awk '/default/ {print $3; exit}')
```

연결 테스트:

```bash
curl -i http://$WIN_HOST:8888/api/commands/pending
```

정상 응답을 확인한 후:

```bash
./build/day05_rtos http://$WIN_HOST:8888
```

로 실행합니다.

---

### 5. Spring Boot 8888 Port 확인

Windows에서 Spring Boot가 실제로 `8888` Port를 사용하고 있는지 확인할 수 있습니다.

WSL에서:

```bash
powershell.exe -NoProfile -Command "netstat -ano | Select-String ':8888'"
```

정상 예시:

```text
TCP    0.0.0.0:8888    0.0.0.0:0    LISTENING
```

Spring Boot Log에서도 다음 내용을 확인합니다.

```text
Tomcat started on port 8888
```

---

### 6. `Interrupted system call`

FreeRTOS POSIX 환경에서는 RTOS Tick을 위한 Signal 때문에
Linux Socket System Call이 `EINTR`로 중단될 수 있습니다.

예시:

```text
[HTTP] 172.xx.xx.xx:8888 연결 실패: Interrupted system call
```

HTTP Client에서는 `EINTR` 발생 시 통신 자체의 장애로 판단하지 않고 재시도하도록 처리합니다.

```text
connect / send / recv
        │
        ▼
errno == EINTR
        │
        ▼
retry
```

이를 통해 일시적인 POSIX Signal 간섭으로 인해 Health Check가 실패하는 현상을 줄였습니다.

---

### 7. `invalid receipt payload`

영수증 Command는 구분자를 이용하여 데이터를 전달합니다.

예시:

```text
orderId|itemName|startTime|endTime|amount
```

빈 문자열을 연속 구분자로 전달하면 C의 문자열 Parsing 과정에서 필드가 누락될 수 있습니다.

따라서 값이 없는 항목은 빈 문자열 대신 `-` 등의 Placeholder를 전달합니다.

예시:

```text
PAYMENT-15|2시간 이용권|-|-|5000
```

---

## 🧪 Manual Connection Test

RTOS를 실행하기 전 Spring Boot API를 직접 확인할 수 있습니다.

### Pending Command

> 이 API는 가장 오래된 `PENDING` 명령을 조회하면서 `PROCESSING`으로 변경합니다.
> RTOS 실행 전 수동 호출하면 RTOS가 해당 명령을 다시 조회할 수 없으므로 테스트 데이터에서만 사용하세요.

```bash
curl -i http://$WIN_HOST:8888/api/commands/pending
```

### Device Status

```bash
curl -i http://$WIN_HOST:8888/api/devices/1/status
```

### Health Check

```bash
curl -i -X POST http://$WIN_HOST:8888/api/devices/health \
  -H "Content-Type: application/json" \
  -d '{"kioskId":1,"kioskName":"KIOSK-01","status":"ONLINE","door":"CLOSE","cardReader":"WAITING","printer":"READY"}'
```

HTTP `200` 응답이 확인되면 WSL → Spring Boot 통신이 정상입니다.

---

## 🖨 Device Status

현재 SCAC에서는 다음 장치 유형을 관리합니다.

```text
NETWORK
DOOR
CARD_READER
PRINTER
```

Backend의 관리자 장치관리에서는 다음 상태를 사용합니다.

```text
NORMAL
ERROR
OFFLINE
```

RTOS Health Check에서는 실제 장치 동작을 표현하기 위해 다음과 같은 상태를 전달합니다.

```text
status      = ONLINE
door        = CLOSE / OPEN
cardReader  = WAITING
printer     = READY / EMPTY
```

Spring Boot에서 해당 정보를 SCAC의 Device 상태로 변환하여 관리합니다.

| Health Check 필드 | RTOS 상태                 | Backend Device 상태 |
| ----------------- | ------------------------- | ------------------- |
| `status`          | `ONLINE`                  | `NORMAL`            |
| `door`            | `OPEN`, `CLOSE`, `CLOSED` | `NORMAL`            |
| `cardReader`      | `WAITING`, `READY`        | `NORMAL`            |
| `printer`         | `READY`, `EMPTY`          | `NORMAL`            |
| 모든 장치         | `OFFLINE`                 | `OFFLINE`           |

RTOS Client는 현재 `/api/devices/1/status`를 조회하여 프린터 상태를 결정합니다.
조회 결과가 `NORMAL`이면 `READY`, `ERROR`이거나 조회에 실패하면 `EMPTY`로 전송합니다.

---

## 📌 Final Implementation Status

2026-08-31 최신 `main` 코드 기준입니다.

### 구현 완료

- FreeRTOS POSIX 기반 RTOS Client Build 및 실행
- Spring Boot와 HTTP 통신
- 1초 주기 Command Polling 및 단일 Worker 실행 제어
- `PENDING → PROCESSING → COMPLETED / FAILED` 상태 전이
- `CARD_READING` 명령 및 카드 인식 시뮬레이션
- `PRINT_RECEIPT` 명령 및 영수증 정보 Terminal 출력
- `DOOR_OPEN` 명령과 5초 후 자동 닫힘 처리
- `DOOR_CLOSE` 명령 처리
- 지원하지 않는 taskType의 `FAILED` 결과 반환
- 완료 또는 실패 결과의 Spring Boot 반환
- 5초 주기 Health Check
- 프린터 상태 조회 및 `READY` / `EMPTY` 변환
- 장치 상태 및 마지막 연결 시간 Backend 연동
- 관리자 장치관리 화면의 상태 및 로그 조회 연동
- POSIX Socket `EINTR` 재시도 처리
- Windows Spring Boot ↔ WSL RTOS 실행 환경 검증

### 기술적 한계 및 향후 개선

- 실제 카드 리더기, 프린터, 출입문 대신 FreeRTOS POSIX 환경에서 장치 동작을 시뮬레이션합니다.
- Spring Boot의 RTOS Command Store는 In-Memory 방식이므로 Backend 재시작 시 Command가 초기화됩니다.
- 완료된 commandId를 RTOS에서 별도로 영속화하지 않아 Backend 상태가 다시 `PENDING`으로 변경되면 동일 작업이 재실행될 수 있습니다.
- 프린터 상태 조회 대상이 현재 `/api/devices/1/status`로 고정되어 있어 환경별 실제 프린터 deviceId 설정이 필요합니다.
- `ERROR`를 `EMPTY`로 변환해 전송하지만 Backend는 현재 `EMPTY`를 `NORMAL`로 변환하므로, 실제 운영에서는 프린터 오류 상태 매핑 정책을 보완해야 합니다.
- WSL의 Windows Host IP는 환경 재시작 후 변경될 수 있습니다.

---

## 🔗 Related Projects

```text
SCAC
├── scac-front     # 사용자 Kiosk Frontend
├── scac-admin     # 관리자 Frontend
├── scac-back      # Spring Boot Backend
└── scac-rtos      # FreeRTOS POSIX Device Client
```

### `scac-front`

사용자가 이용권 구매, 카드 결제, 좌석 입·퇴실 및 스터디룸 예약을 수행하는 키오스크 Frontend입니다.

장치 동작이 필요한 경우 Spring Boot를 통해 RTOS Command를 생성합니다.

### `scac-back`

사용자 / 관리자 REST API를 제공하며 RTOS Command와 Device Health Check를 관리합니다.

### `scac-admin`

RTOS Health Check를 통해 전달된 장치 상태와 DeviceLog를 관리자 화면에서 조회합니다.

---

## 👥 Team

| Name   | Role                                                                                                         |
| ------ | ------------------------------------------------------------------------------------------------------------ |
| 김수영 | 회원 · 인증 · 권한 · DB · 시스템 로그 · SMS 공통 모듈 및 회원 인증 알림                                      |
| 장원진 | 좌석 · 입·퇴실 · 스터디룸 예약 · RTOS C Client · 관리자 좌석·예약 화면 · Git 및 배포 관리                    |
| 이지현 | 결제 · 이용권 · 관리자 주요 화면 · 장치관리 API·화면 연동 · SOLAPI 이용권 만료 알림 및 재시도 정책 · 문서·QA |

---

## 📅 Development Period

**2026.08.13 ~ 2026.09.02**

---

## 📝 Documentation Version

**README v1.1**

**Last Updated: 2026.08.31**

### History

- README v1.0 — 2026.08.21
  - RTOS 프로젝트 문서 최초 작성
  - Build / 실행 방법 정리
  - Windows Spring Boot ↔ WSL RTOS 연결 방법 정리
  - CARD_READING / PRINT_RECEIPT / DOOR_OPEN Command 정리
  - 5초 주기 Health Check 구조 정리
  - POSIX Socket 및 주요 Troubleshooting 정리
- README v1.1 — 2026.08.31
  - `PROCESSING` 상태 전이와 완료·실패 검증 반영
  - `DOOR_CLOSE` 명령 및 출입문 자동 닫힘 처리 반영
  - 프린터 상태 변환과 RTOS 중복 실행 한계 현행화
  - 문서 제목 구조와 최종 구현 상태 정리

---

## 📄 Project Notice

본 프로젝트는 K-Digital Training 교육과정의 팀 프로젝트로 제작되었습니다.
