# ☕ SCAC Backend

> **Study Cafe Access Control REST API Server**

SCAC Backend는 사용자 키오스크 `scac-front`, 관리자 웹 `scac-admin`, RTOS Client `scac-rtos`가 공통으로 사용하는 Spring Boot 기반 REST API 서버입니다.

회원/인증, 이용권, 결제, 좌석, 입·퇴실, 스터디룸 예약, 관리자 기능, 장치 상태, 시스템 로그와 SMS 알림을 처리하며 MySQL과 연동합니다.

---

## 🎯 프로젝트 목표

- 사용자 키오스크와 관리자 애플리케이션에 일관된 REST API 제공
- JWT 기반 사용자 / 관리자 인증 및 권한 분리
- JPA와 MyBatis를 역할에 맞게 함께 사용
- 이용권 결제와 스터디룸 예약 결제를 하나의 Payment 도메인으로 관리
- 스케줄러를 이용한 좌석, 예약, 장치, 회원 제재 상태 자동 갱신
- Toss Payments 결제 연동
- SOLAPI SMS 연동
- 공통 응답 및 전역 예외 처리
- AOP 기반 SystemLog 자동 기록
- HTTP Polling 기반 RTOS 장치 명령 처리 및 Health Check 연동

---

## ✨ 주요 기능

### 👤 회원 및 인증

- 회원가입
- 비회원 등록
- 사용자 로그인
- 사용자 Refresh Token 재발급
- 사용자 로그아웃
- 관리자 로그인
- 관리자 Refresh Token 재발급
- 관리자 로그아웃
- 전화번호 존재 여부 확인
- 현재 로그인 사용자 조회
- 사용자 프로필 조회
- 입실 비밀번호 검증
- 입실 비밀번호 변경
- SMS 인증번호 발송 및 검증
- BCrypt 비밀번호 암호화
- JWT 기반 Stateless 인증

### 🎫 이용권

- 이용권 전체 조회
- 이용권 상세 조회
- 스터디룸용 이용권 조회
- 관리자 이용권 등록
- 관리자 이용권 수정
- 판매 상태 변경
- 이용권 삭제
- 결제 성공 시 `TicketUsage` 발급
- 좌석 이용 가능 이용권 보유 여부 조회
- 시간권 / 기간권 상태 관리

### 💳 결제

- 좌석 이용권 결제 요청
- 스터디룸 예약 결제 요청
- 서버 기준 상품 금액 검증
- 서버 기준 예약 금액 검증
- CARD Mock 승인
- Toss Payments 승인
- 결제 완료 시 `TicketUsage` 발급
- 예약 결제 완료 시 예약 `CONFIRMED`
- 사용자 본인 결제 단건 조회
- 관리자 결제 목록 조회
- 관리자 결제 상세 조회
- 사용자별 결제 이력 조회
- 결제 취소
- 취소 사유 저장
- 결제 취소 시 이용권 / 예약 상태 연동
- MyBatis + `vw_payment_history` 기반 결제 이력 조회

### 💺 좌석 및 입·퇴실

- 전체 좌석 조회
- 좌석 상세 조회
- 사용 중 좌석 조회
- 회원 / 비회원 입실 준비
- 입실
- 외출
- 외출 복귀
- 퇴실
- 관리자 좌석 이용자 조회
- 관리자 좌석 상태 변경
- 관리자 강제 퇴실
- 1분 단위 시간권 차감
- 이용권 소진 시 다음 이용권 자동 전환
- 사용 가능한 이용권이 없을 경우 자동 퇴실

### 🏢 스터디룸 예약

- 스터디룸 목록 조회
- 스터디룸 상세 조회
- 전체 예약 조회
- 임시 예약 생성
- 예약 취소
- 결제 대기 예약 취소
- 날짜별 예약 가능 시간 조회
- 현재 사용자 예약 조회
- 사용자 본인 예약 단건 조회
- 관리자 예약 목록 조회
- 관리자 예약 취소
- 동일 스터디룸의 동시 예약 방지를 위한 비관적 락 적용
- `PENDING_PAYMENT`
- `CONFIRMED`
- `IN_USE`
- `COMPLETED`
- `CANCELED`
- 결제 대기 5분 초과 예약 자동 취소

### 🛠 관리자

- 대시보드 요약 조회
- 관리자 계정 CRUD
- `SUPER_ADMIN` 관리자 계정 접근 제어
- 회원 목록 / 상세 조회
- 회원 제재 / 제재 해제
- 이용권 관리
- 좌석 상태 변경
- 관리자 강제 퇴실
- 결제 조회 / 취소 / 삭제 API
- 관리자 메모 CRUD
- 시스템 로그 조회
- 좌석 로그 조회
- 장치 등록 / 수정 / 삭제
- 장치 활성화 / 비활성화
- 장치 현재 상태 / 로그 조회

> 결제 삭제 API는 구현되어 있지만, 운영 이력 보존을 위해 관리자 화면에서는 삭제 대신 취소 기능을 사용합니다.

### 🖨 RTOS / 장치 연동

- Spring에서 RTOS 작업 명령 생성
- RTOS에서 대기 중 명령 Polling
- RTOS 처리 결과 반환
- `CARD_READING`
- `PRINT_RECEIPT`
- `DOOR_OPEN`
- `DOOR_CLOSE`
- 장치 처리 결과 `COMPLETED` / `FAILED`
- RTOS Health Check 수신
- 네트워크 상태 갱신
- 출입문 상태 갱신
- 카드리더기 상태 갱신
- 프린터 상태 갱신
- 마지막 통신 시간 갱신
- 장치 로그 저장
- 20초 이상 Health Check 미수신 시 `OFFLINE`

### 🔔 SMS / Notification

- 회원가입 SMS 인증번호 발송
- SOLAPI 미설정 시 Mock SMS 로그 출력
- 시간권 잔여 30분 이하 만료 예정 알림
- 기간권 24시간 이내 만료 예정 알림
- SOLAPI 발송 결과 상태 동기화
- `notification_log` 발송 이력 저장
- 동일 사용 건 중복 알림 방지
- 최대 2회 실패 제한
- 실패 한도 도달 시 `RETRY_EXHAUSTED`
- 알림 Scheduler 기본 비활성화

### 📋 System Log

- 관리자 주요 변경 작업 기록
- AOP `@AutoLog` 기반 로그 자동 기록
- 로그 목록 조회
- 로그 상세 조회
- 사용자 / 관리자 / 대상 정보 기록
- 장치 상태 변경 등 운영 이벤트 기록

---

## 🛠 Tech Stack

### Backend

- Java 21
- Spring Boot 3.5.16
- Spring Web
- Spring Security
- Spring Data JPA
- MyBatis Spring Boot Starter 3.0.5
- Bean Validation
- JJWT 0.13.0
- Lombok
- Spring Dotenv 4.0.0
- Gradle Wrapper

### External API

- Toss Payments
- SOLAPI

### Database

- MySQL

---

## 📂 Project Structure

```text
scac-back
│
├── src
│   ├── main
│   │   ├── java/com/scac
│   │   │   ├── admin
│   │   │   ├── auth
│   │   │   ├── checkin
│   │   │   ├── device
│   │   │   ├── global
│   │   │   ├── meetingroom
│   │   │   ├── notification
│   │   │   ├── payment
│   │   │   ├── seat
│   │   │   ├── system
│   │   │   ├── ticket
│   │   │   ├── ticketusage
│   │   │   └── user
│   │   │
│   │   └── resources
│   │       ├── mappers
│   │       │   └── payment
│   │       │       └── PaymentMapper.xml
│   │       └── application.properties
│   │
│   └── test
│
├── http
├── build.gradle
├── gradlew
├── gradlew.bat
└── README.md
```

---

## 🧱 Domain Layer

일반적인 도메인은 다음 구조를 사용합니다.

```text
{domain}
├── controller
├── dto
├── entity / domain
├── repository
├── service
├── mapper
├── client
└── scheduler
```

### Layer Role

| Layer           | Role                           |
| --------------- | ------------------------------ |
| Controller      | HTTP Request / Response 처리   |
| DTO             | Request / Response 데이터 전달 |
| Entity / Domain | DB Table 및 Domain 상태 표현   |
| Repository      | JPA 기반 저장 및 단순 조회     |
| Mapper          | MyBatis 기반 복합 조회         |
| Service         | Business Logic 및 Transaction  |
| Client          | Toss / SOLAPI 등 외부 API 연동 |
| Scheduler       | 시간 기반 자동 처리            |

---

## 🗃 JPA & MyBatis

SCAC Backend는 데이터 변경 및 단순 조회에는 JPA를 사용하고,
화면에 맞춘 복합 조회에는 MyBatis를 사용합니다.

```text
Create
Update
Delete
단순 조회
      │
      ▼
Spring Data JPA
```

```text
복잡한 Join
View
관리자 결제 목록
      │
      ▼
MyBatis
```

현재 관리자 결제 이력 조회는 MyBatis에서 `vw_payment_history` View를 사용합니다.

```xml
<select
  id="findAllPaymentHistory"
  resultType="com.scac.payment.dto.PaymentHistoryDTO">
  SELECT *
  FROM vw_payment_history
  ORDER BY payment_id DESC
</select>
```

---

## 🔄 Payment Flow

### 1. 좌석 이용권 결제

```text
Ticket 선택
    │
    ▼
POST /api/payments
(ticketId + amount + paymentMethod)
    │
    ▼
이용권 판매 상태 / 가격 검증
    │
    ▼
Payment
PENDING
    │
    ├── CARD
    │      └── Mock 승인
    │
    └── TOSSPAY
           └── Toss 승인
    │
    ▼
Payment
PAID
    │
    ▼
TicketUsage 발급
```

### 2. 스터디룸 예약 결제

```text
예약 생성
PENDING_PAYMENT
    │
    ▼
POST /api/payments
(reservationId + amount + paymentMethod)
    │
    ▼
예약 소유자 / 금액 검증
    │
    ▼
Payment
PENDING
    │
    ▼
결제 승인
    │
    ▼
Reservation
CONFIRMED
```

`PaymentRequestDTO`는 `ticketId`와 `reservationId` 중 결제 대상에 해당하는 값을 전달합니다.

좌석 이용권:

```json
{
  "ticketId": 1,
  "reservationId": null,
  "amount": 4000,
  "paymentMethod": "CARD"
}
```

스터디룸:

```json
{
  "ticketId": null,
  "reservationId": 10,
  "amount": 12000,
  "paymentMethod": "TOSSPAY"
}
```

---

## 🖨 RTOS Command Flow

### 1. 장치 명령 생성

```text
React Kiosk
    │
    │ POST /api/commands
    ▼
TaskStore
    │
    │ PENDING
    ▼
RTOS Client
```

### 2. RTOS Polling

RTOS Client는 1초 주기로 대기 중 작업을 조회합니다.

```http
GET /api/commands/pending
```

지원 Command:

```text
CARD_READING
PRINT_RECEIPT
DOOR_OPEN
DOOR_CLOSE
```

### 3. 처리 결과 반환

```text
RTOS Client
    │
    ▼
PATCH /api/commands/{id}/finish
    │
    ├── COMPLETED
    └── FAILED
```

예시:

```json
{
  "status": "COMPLETED",
  "result": "card reading completed"
}
```

> 현재 `TaskStore`는 `ConcurrentHashMap` 기반 In-Memory Store이므로 Backend 재시작 시 기존 명령은 초기화됩니다.

---

## ❤️ Device Health Check

RTOS Client는 5초마다 장치 상태를 Backend로 전송합니다.

```http
POST /api/devices/health
```

전송 정보:

```json
{
  "kioskId": 1,
  "kioskName": "KIOSK-01",
  "status": "ONLINE",
  "door": "CLOSE",
  "cardReader": "WAITING",
  "printer": "READY"
}
```

Backend는 Health Check를 이용해 다음 장치의 상태와 마지막 연결 시간을 갱신합니다.

```text
NETWORK
DOOR
CARD_READER
PRINTER
```

Backend `DeviceHealthScheduler`는 5초마다 마지막 통신 시간을 검사합니다.

```text
마지막 Health Check
       │
       ├── 20초 이내 ──▶ 현재 상태 유지
       │
       └── 20초 초과 ──▶ OFFLINE
```

OFFLINE 전환 시 `DeviceLog`에 `HEALTH_TIMEOUT` 이벤트를 기록합니다.

---

## 📬 Common Response

공통 응답 객체는 `ApiResponse<T>`입니다.

```json
{
  "isSuccess": true,
  "message": "요청을 성공적으로 처리했습니다.",
  "data": {}
}
```

실패 응답:

```json
{
  "isSuccess": false,
  "message": "오류 메시지",
  "data": null
}
```

`GlobalExceptionHandler`에서 Validation 오류, 존재하지 않는 Resource, Business Exception 등을 공통 처리합니다.

---

## 📡 API Overview

기본 주소:

```text
http://localhost:8888
```

### Authentication

| Method | Endpoint                  | Description        |
| ------ | ------------------------- | ------------------ |
| POST   | `/api/auth/login`         | 사용자 로그인      |
| POST   | `/api/auth/refresh`       | 사용자 토큰 재발급 |
| POST   | `/api/auth/logout`        | 사용자 로그아웃    |
| POST   | `/api/auth/send-code`     | 인증번호 발송      |
| POST   | `/api/auth/verify-code`   | 인증번호 검증      |
| POST   | `/api/admin/auth/login`   | 관리자 로그인      |
| POST   | `/api/admin/auth/refresh` | 관리자 토큰 재발급 |
| POST   | `/api/admin/auth/logout`  | 관리자 로그아웃    |

### Users

| Method | Endpoint                             | Description        |
| ------ | ------------------------------------ | ------------------ |
| GET    | `/api/users/check-phone`             | 전화번호 존재 여부 |
| POST   | `/api/users/signup`                  | 회원가입           |
| POST   | `/api/users/guest`                   | 비회원 등록        |
| GET    | `/api/users/me`                      | 현재 로그인 사용자 |
| GET    | `/api/users/{userId}`                | 사용자 상세        |
| POST   | `/api/users/entry-password/verify`   | 입실 비밀번호 검증 |
| PATCH  | `/api/users/{userId}/entry-password` | 입실 비밀번호 변경 |

### Tickets / TicketUsage

| Method | Endpoint                                   | Description                |
| ------ | ------------------------------------------ | -------------------------- |
| GET    | `/api/tickets`                             | 이용권 목록                |
| GET    | `/api/tickets/room`                        | 스터디룸용 이용권          |
| GET    | `/api/tickets/{ticketId}`                  | 이용권 상세                |
| GET    | `/api/ticket-usages/available-seat/exists` | 좌석 이용 가능 이용권 여부 |
| POST   | `/api/admin/tickets`                       | 이용권 등록                |
| PUT    | `/api/admin/tickets/{ticketId}`            | 이용권 수정                |
| PATCH  | `/api/admin/tickets/{ticketId}/status`     | 판매 상태 변경             |
| DELETE | `/api/admin/tickets/{ticketId}`            | 이용권 삭제                |

### Payments

| Method | Endpoint                                 | Description      |
| ------ | ---------------------------------------- | ---------------- |
| POST   | `/api/payments`                          | 결제 요청 생성   |
| POST   | `/api/payments/confirm`                  | Toss 결제 승인   |
| POST   | `/api/payments/{paymentId}/mock-confirm` | CARD Mock 승인   |
| GET    | `/api/payments/{paymentId}`              | 본인 결제 단건   |
| GET    | `/api/admin/payments`                    | 관리자 결제 목록 |
| GET    | `/api/admin/payments/{paymentId}`        | 관리자 결제 상세 |
| PATCH  | `/api/admin/payments/{paymentId}/cancel` | 관리자 결제 취소 |
| DELETE | `/api/admin/payments/{paymentId}`        | 관리자 결제 삭제 |

### Seats / Check-in

| Method | Endpoint                                   | Description      |
| ------ | ------------------------------------------ | ---------------- |
| GET    | `/api/seats`                               | 전체 좌석        |
| GET    | `/api/seats/{seatId}`                      | 좌석 상세        |
| GET    | `/api/seats/occupied`                      | 이용 중 좌석     |
| POST   | `/api/checkin/prepare`                     | 비회원 입실 준비 |
| POST   | `/api/checkin/prepare/member`              | 회원 입실 준비   |
| POST   | `/api/checkin`                             | 입실             |
| PATCH  | `/api/checkin/away`                        | 외출             |
| PATCH  | `/api/checkin/away/member`                 | 로그인 회원 외출 |
| PATCH  | `/api/checkin/comeback`                    | 복귀             |
| PATCH  | `/api/checkin/comeback/member`             | 로그인 회원 복귀 |
| PATCH  | `/api/checkin/checkout`                    | 퇴실             |
| PATCH  | `/api/checkin/checkout/member`             | 로그인 회원 퇴실 |
| GET    | `/api/admin/seats/{seatId}/user`           | 좌석 이용자 조회 |
| PATCH  | `/api/admin/seats/{seatId}/status`         | 좌석 상태 변경   |
| POST   | `/api/admin/seats/{seatId}/force-checkout` | 관리자 강제 퇴실 |

### Meeting Rooms

| Method | Endpoint                                                         | Description        |
| ------ | ---------------------------------------------------------------- | ------------------ |
| GET    | `/api/rooms`                                                     | 스터디룸 목록      |
| GET    | `/api/rooms/{roomId}`                                            | 스터디룸 상세      |
| GET    | `/api/meeting-rooms`                                             | 전체 예약          |
| POST   | `/api/meeting-rooms/reservations`                                | 임시 예약 생성     |
| PATCH  | `/api/meeting-rooms/reservations/{reservationId}/cancel`         | 예약 취소          |
| PATCH  | `/api/meeting-rooms/reservations/{reservationId}/cancel-pending` | 결제대기 예약 취소 |
| GET    | `/api/meeting-rooms/{roomId}/availability`                       | 예약 가능 시간     |
| GET    | `/api/meeting-rooms/current`                                     | 현재 사용자 예약   |
| GET    | `/api/meeting-rooms/admin/reservations`                          | 관리자 예약 목록   |
| GET    | `/api/meeting-rooms/reservations/{reservationId}`                | 사용자 예약 단건   |

### RTOS Commands

| Method | Endpoint                         | Description                   |
| ------ | -------------------------------- | ----------------------------- |
| POST   | `/api/commands`                  | 장치 명령 생성                |
| GET    | `/api/commands/pending`          | 가장 오래된 PENDING 명령 조회 |
| GET    | `/api/commands/{id}`             | 장치 명령 상세                |
| PATCH  | `/api/commands/{id}/finish`      | RTOS 처리 결과 반환           |
| GET    | `/api/devices/{deviceId}/status` | 장치 상태 조회                |
| PATCH  | `/api/devices/{deviceId}/status` | 시연용 장치 상태 변경         |
| POST   | `/api/devices/health`            | RTOS Health Check             |

### Admin Devices

| Method | Endpoint                               | Description        |
| ------ | -------------------------------------- | ------------------ |
| GET    | `/api/admin/devices`                   | 장치 목록          |
| GET    | `/api/admin/devices/{deviceId}`        | 장치 상세          |
| POST   | `/api/admin/devices`                   | 장치 등록          |
| PUT    | `/api/admin/devices/{deviceId}`        | 장치 수정          |
| DELETE | `/api/admin/devices/{deviceId}`        | 장치 삭제          |
| PATCH  | `/api/admin/devices/{deviceId}/status` | 장치 상태 변경     |
| PATCH  | `/api/admin/devices/{deviceId}/active` | 장치 활성 / 비활성 |

### Admin Accounts

| Method | Endpoint                        | Description      |
| ------ | ------------------------------- | ---------------- |
| GET    | `/api/admin/accounts`           | 관리자 계정 목록 |
| GET    | `/api/admin/accounts/{adminId}` | 관리자 계정 상세 |
| POST   | `/api/admin/accounts`           | 관리자 계정 생성 |
| PATCH  | `/api/admin/accounts/{adminId}` | 관리자 계정 수정 |
| DELETE | `/api/admin/accounts/{adminId}` | 관리자 계정 삭제 |

---

## 🔐 Security

### User Role

```text
USER
GUEST
```

### Admin Role

```text
SUPER_ADMIN
STAFF
```

정책:

- JWT Access Token: 30분
- JWT Refresh Token: 7일
- Session: Stateless
- Password: BCrypt
- Public API는 `SecurityConfig`에서 Method / Path 기준 허용
- 사용자 개인정보 및 사용자 전용 기능은 `USER`, `GUEST` 인증 필요
- 사용자 결제 요청 / 승인 API는 `USER`, `GUEST` 권한 필요
- `/api/admin/**`는 `SUPER_ADMIN`, `STAFF` 권한 필요
- `/api/admin/accounts/**`는 `SUPER_ADMIN`만 접근 가능
- 관리자 스터디룸 예약 API도 관리자 권한 적용

### CORS

현재 시연 환경에서는:

```java
configuration.setAllowedOriginPatterns(List.of("*"));
```

로 모든 Origin을 허용합니다.

실제 배포 시에는 허용할 Frontend Origin만 등록하도록 변경해야 합니다.

---

## ⏱ Scheduling

| Scheduler               | Interval  | Role                                     |
| ----------------------- | --------- | ---------------------------------------- |
| `CheckinScheduler`      | 1분       | 시간권 차감, 이용권 전환, 자동 퇴실      |
| `ReservationScheduler`  | 1분       | 예약 상태 변경, 결제대기 5분 만료        |
| `DeviceHealthScheduler` | 5초       | 마지막 Health Check 확인 및 OFFLINE 처리 |
| `NotificationScheduler` | 매분 15초 | 이용권 만료 예정 문자 대상 확인 및 발송  |
| `NotificationScheduler` | 매분 45초 | SOLAPI 실제 발송 결과 동기화             |
| `UserPenaltyScheduler`  | 매시 정각 | 제재 기간이 끝난 회원 자동 해제          |

---

## 🔔 Notification

알림 기능은 기본적으로 비활성화되어 있습니다.

```properties
notification.enabled=${NOTIFICATION_ENABLED:false}
notification.expiration.time-minutes=30
notification.expiration.period-hours=24
```

실제 발송이 필요한 환경에서만:

```env
NOTIFICATION_ENABLED=true

SOLAPI_API_KEY=...
SOLAPI_API_SECRET=...
SOLAPI_SENDER_NUMBER=...
```

를 설정합니다.

### 만료 예정 알림

시간권:

```text
TIME_PACK
현재 사용 중
잔여시간 1 ~ 30분
```

기간권:

```text
PERIOD_PACK
현재 사용 중
종료 시각 24시간 이내
```

### Retry Policy

- 동일 알림의 실패 이력을 확인
- 최대 실패 횟수: `2`
- 최대 횟수에 도달하면 `RETRY_EXHAUSTED`
- `PENDING`, `SUCCESS`, `RETRY_EXHAUSTED` 상태는 중복 발송 대상에서 제외

---

## ⚙️ Environment Variables

`scac-back/.env`:

```env
DB_URL=jdbc:mysql://localhost:3306/scac
DB_USERNAME=scac
DB_PASSWORD=your_password

JWT_SECRET=your_long_random_secret

TOSS_SECRET_KEY=test_sk_...

NOTIFICATION_ENABLED=false

SOLAPI_API_KEY=
SOLAPI_API_SECRET=
SOLAPI_SENDER_NUMBER=
```

### Required

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`

### Feature Specific

- `TOSS_SECRET_KEY`
  - Toss Payments를 사용할 경우

- `SOLAPI_API_KEY`
- `SOLAPI_API_SECRET`
- `SOLAPI_SENDER_NUMBER`
  - 실제 SMS 발송을 사용할 경우

- `NOTIFICATION_ENABLED=true`
  - 이용권 만료 예정 알림 Scheduler를 실제 발송 모드로 사용할 경우

SOLAPI 설정이 없는 개발 환경에서는 회원가입 인증 문자를 Mock Log로 출력합니다.

### Database Prerequisite

현재 JPA 설정은 다음과 같습니다.

```properties
spring.jpa.hibernate.ddl-auto=none
```

따라서 애플리케이션 실행 전에 SCAC MySQL Schema와 관리자 결제 조회에 사용하는
`vw_payment_history` View가 생성되어 있어야 합니다. 이 저장소에는 전체 Schema 생성 SQL이 포함되어 있지 않으므로,
팀에서 관리하는 최신 DB 명세와 DDL을 기준으로 데이터베이스를 준비해야 합니다.

---

## 🚀 Getting Started

### Run

```bash
cd scac-back
```

Windows:

```bash
./gradlew.bat bootRun
```

macOS / Linux:

```bash
./gradlew bootRun
```

서버 주소:

```text
http://localhost:8888
```

---

## 🧪 Test

Windows:

```bash
./gradlew.bat test
```

macOS / Linux:

```bash
./gradlew test
```

테스트 및 애플리케이션 실행 전 다음 환경변수가 필요합니다.

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`

Toss Payments 및 SOLAPI 관련 환경변수는 해당 외부 연동 기능을 실제로 사용할 때 설정합니다.

---

## 📌 Final Implementation Status

2026-08-31 최신 `main` 코드 기준입니다.

### 구현 완료

- 사용자 / 관리자 JWT 인증 및 Refresh Token 처리
- 관리자 API 권한 분리 및 `SUPER_ADMIN` 전용 계정 관리
- Payment가 `ticketId` 또는 `reservationId`를 결제 대상으로 처리
- 이용권 결제와 스터디룸 예약 결제 통합
- 서버 기준 상품 및 예약 결제금액 재검증
- 결제 승인·취소 시 이용권 또는 예약 상태 연동
- 관리자 결제 목록에 MyBatis + `vw_payment_history` 적용
- 결제대기 예약 5분 초과 자동 취소
- 동일 스터디룸 동시 예약 방지를 위한 비관적 락 적용
- 예약 시간 경계값 `24:00` 처리 및 예약 상태 자동 전환
- SOLAPI 인증 문자 및 이용권 만료 예정 문자 구현
- 알림 실패 2회 도달 시 `RETRY_EXHAUSTED` 처리
- `CARD_READING`, `PRINT_RECEIPT`, `DOOR_OPEN`, `DOOR_CLOSE` 명령 처리
- `/api/devices/health` Health Check 수신
- Health Check 20초 미수신 시 장치 `OFFLINE` 처리
- 관리자 장치 등록 / 수정 / 삭제 / 활성화 API 구현
- 관리자 스터디룸 예약 경로 Security 적용

### 기술적 한계 및 향후 개선

- RTOS Command는 In-Memory `TaskStore`에서 관리되어 Backend 재시작 시 초기화됩니다.
- 장치 제어는 실제 물리 하드웨어 대신 FreeRTOS POSIX 환경에서 시뮬레이션합니다.
- 시연 환경에서는 CORS Origin을 전체 허용하므로 실제 배포 시 허용 Origin을 제한해야 합니다.
- 결제 삭제 API는 존재하지만 실제 운영에서는 이력 보존을 위해 취소 중심 정책을 권장합니다.

---

## 👥 Team

| Name   | Role                                                                                                         |
| ------ | ------------------------------------------------------------------------------------------------------------ |
| 김수영 | 회원 · 인증 · 권한 · DB · 시스템 로그 · SMS 공통 모듈 및 회원 인증 알림                                      |
| 장원진 | 좌석 · 입·퇴실 · 스터디룸 예약 · RTOS C Client · 관리자 좌석·예약 화면 · Git 및 배포 관리                    |
| 이지현 | 결제 · 이용권 · 관리자 주요 화면 · 장치관리 API·화면 연동 · SOLAPI 이용권 만료 알림 및 재시도 정책 · 문서·QA |

---

## 📅 Development Period

**2026.07.03 ~ 2026.09.02**

---

## 📝 Documentation Version

**README v4.1**

**Last Updated: 2026.08.31**

### History

- README v1.0 — 2026.07.22
- README v1.1 — 2026.07.23
- README v2.0 — 2026.08.05
- README v3.0 — 2026.08.14
- README v4.0 — 2026.08.21
  - RTOS Command API 구현 현행화
  - Health Check 및 OFFLINE 처리 추가
  - 장치 CRUD API 추가
  - 관리자 계정 권한 현행화
  - 예약 결제대기 5분 정책 반영
  - SOLAPI Retry 정책 현행화
- README v4.1 — 2026.08.31
  - 스터디룸 동시 예약 방지 및 예약 상태 처리 현행화
  - RTOS `DOOR_CLOSE` 명령과 최종 연동 상태 반영
  - 실행 환경, DB 선행 조건 및 기술적 한계 최신화

---

## 📄 Project Notice

본 프로젝트는 K-Digital Training 교육과정의 팀 프로젝트로 제작되었습니다.
