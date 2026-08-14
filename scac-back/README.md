# ☕ SCAC Backend

> **Study Cafe Access Control REST API Server**

SCAC Backend는 사용자 키오스크(`scac-front`)와 관리자 웹(`scac-admin`)에서 공통으로 사용하는 Spring Boot 기반 REST API 서버입니다.

회원/인증, 이용권, 결제, 좌석, 입·퇴실, 스터디룸 예약, 관리자 기능, 장치 상태, 시스템 로그와 SMS 알림을 처리하며 MySQL과 연동합니다.

---

## 🎯 프로젝트 목표

- 키오스크와 관리자 애플리케이션에 일관된 REST API 제공
- JWT 기반 사용자/관리자 인증 및 권한 분리
- JPA와 MyBatis를 역할에 맞게 함께 사용
- 이용권 결제와 스터디룸 예약 결제를 하나의 결제 흐름으로 관리
- 스케줄러를 통한 좌석 이용시간, 예약 상태, 제재 상태 자동 갱신
- Toss Payments와 SMS 외부 서비스 연동
- 공통 응답/예외 처리 및 시스템 로그 기록
- RTOS 장치 이벤트 연동 기반 마련

---

## ✨ 주요 기능

### 👤 회원 및 인증

- 회원가입 / 비회원 등록
- 사용자 로그인 / Refresh / 로그아웃
- 관리자 로그인 / Refresh / 로그아웃
- 전화번호 존재 여부 확인
- 내 정보 조회
- 입실 비밀번호 검증 및 변경
- SMS 인증번호 발송 및 검증
- BCrypt 비밀번호 암호화
- JWT 기반 Stateless 인증

### 🎫 이용권

- 이용권 전체 / 상세 조회
- 스터디룸용 이용권 조회
- 관리자 이용권 등록 / 수정 / 판매상태 변경 / 삭제
- 결제 성공 시 사용자 이용권(`TicketUsage`) 발급
- 좌석용 사용 가능 이용권 보유 여부 확인
- 시간권 / 기간권 상태 및 만료 관리

### 💳 결제

- 좌석 이용권 결제 요청
- 스터디룸 예약 결제 요청
- 서버 기준 상품/예약 금액 검증
- Mock 카드 승인
- Toss Payments 승인
- 결제 완료 후 `TicketUsage` 발급
- 예약 결제 완료 후 예약 `CONFIRMED` 처리
- 사용자 본인 결제 단건 조회
- 관리자 전체 / 사용자별 결제 이력 조회
- 결제 취소 및 취소 사유 저장
- 결제 취소 시 이용내역과 예약 상태 연동
- MyBatis + `vw_payment_history` 기반 관리자 결제 목록 조회

### 🪑 좌석 및 입·퇴실

- 전체 좌석 / 단건 / 사용 중 좌석 조회
- 회원 / 비회원 입실 준비 및 입실
- 외출 / 복귀 / 퇴실
- 관리자 좌석 이용자 정보 조회
- 좌석 상태 변경
- 관리자 강제 퇴실
- 1분 단위 이용시간 차감 및 자동 퇴실

### 🏠 스터디룸 예약

- 스터디룸 목록 / 상세 조회
- 전체 예약 조회
- 예약 생성
- 예약 취소
- 날짜별 예약 가능 시간 조회
- 현재 사용자 예약 조회
- 관리자 예약 목록 조회
- 사용자 본인 예약 단건 조회
- 결제 대기 / 확정 / 사용 중 / 완료 상태 관리
- 결제 대기 30분 초과 예약 자동 취소

### 🛠 관리자

- 대시보드 요약 조회
- 관리자 계정 CRUD
- 회원 목록 / 상세 / 제재 처리
- 이용권 관리
- 좌석 상태 변경 / 강제 퇴실
- 결제 조회 / 취소 / 삭제
- 관리자 메모 CRUD
- 시스템 로그 및 좌석 로그 조회
- 장치 목록 / 상세 / 로그 / 상태 변경

### 🖨 장치

- RTOS 장치 이벤트 수신: `POST /api/devices/events`
- 장치 상태 및 마지막 통신시간 갱신
- 장치 이벤트 이력 저장
- 관리자 장치 현재 상태 / 로그 조회

### 🔔 알림

- 시간권 잔여 30분 이하 사용자 만료 예정 문자
- 기간권 24시간 이내 만료 사용자 만료 예정 문자
- SOLAPI 발송 접수 및 결과 상태 동기화
- 알림 이력 `notification_log` 저장
- 알림 기능 기본값 `false`

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
- SMS Provider: Mock / CoolSMS / Naver SENS

### Database

- MySQL

---

## 📂 Project Structure

```text
scac-back
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
│   │   └── resources
│   │       ├── mappers
│   │       │   └── payment/PaymentMapper.xml
│   │       └── application.properties
│   └── test
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
├── entity 또는 domain
├── repository
├── service
├── mapper        # 복잡한 조회가 필요한 경우
├── client        # 외부 API가 필요한 경우
└── scheduler     # 주기 작업이 필요한 경우
```

### 역할

| Layer           | Role                             |
| --------------- | -------------------------------- |
| Controller      | HTTP 요청/응답 처리              |
| DTO             | Request / Response 데이터 전달   |
| Entity / Domain | DB 테이블과 도메인 상태 표현     |
| Repository      | JPA 기반 저장 및 단순 조회       |
| Mapper          | MyBatis 기반 화면 맞춤/복합 조회 |
| Service         | 비즈니스 로직 및 트랜잭션        |
| Client          | Toss / SOLAPI 등 외부 API 연동   |
| Scheduler       | 시간 기반 상태 갱신              |

---

## 🗃 JPA & MyBatis

SCAC Backend는 데이터 변경과 단순 조회에는 JPA를 사용하고, 화면에 맞춘 복합 조회에는 MyBatis를 사용합니다.

```text
Create / Update / Delete / 단순 조회
→ Spring Data JPA

복잡한 Join / View / 관리자 목록 조회
→ MyBatis
```

현재 결제 이력 조회는 MyBatis에서 `vw_payment_history` View를 사용합니다.

```xml
<select id="findAllPaymentHistory"
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
  ↓
POST /api/payments
(ticketId + amount + paymentMethod)
  ↓
서버에서 이용권 판매상태 / 가격 재검증
  ↓
Payment(PENDING)
  ↓
CARD: Mock 승인
TOSSPAY: Toss 승인
  ↓
Payment(PAID)
  ↓
TicketUsage 발급
```

### 2. 스터디룸 예약 결제

```text
임시 예약 생성
(PENDING_PAYMENT)
  ↓
POST /api/payments
(reservationId + amount + paymentMethod)
  ↓
예약 소유자 / 서버 계산 금액 검증
  ↓
Payment(PENDING)
  ↓
결제 승인
  ↓
Meeting Room TicketUsage 발급
  ↓
Reservation(CONFIRMED)
```

`PaymentRequestDTO`는 `ticketId`와 `reservationId` 중 **정확히 하나만** 받아야 합니다.

```json
{
  "ticketId": 1,
  "reservationId": null,
  "amount": 4000,
  "paymentMethod": "CARD"
}
```

또는:

```json
{
  "ticketId": null,
  "reservationId": 10,
  "amount": 12000,
  "paymentMethod": "TOSSPAY"
}
```

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

> JSON 필드명은 `success`가 아니라 **`isSuccess`** 입니다.

`GlobalExceptionHandler`에서 검증 오류, 존재하지 않는 리소스, 비즈니스 예외 등을 공통 처리합니다.

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

| Method | Endpoint                             | Description             |
| ------ | ------------------------------------ | ----------------------- |
| GET    | `/api/users/check-phone`             | 전화번호 존재 여부      |
| POST   | `/api/users/signup`                  | 회원가입                |
| POST   | `/api/users/guest`                   | 비회원 등록             |
| GET    | `/api/users/me`                      | 현재 로그인 사용자 조회 |
| GET    | `/api/users/{userId}`                | 사용자 상세 조회        |
| POST   | `/api/users/entry-password/verify`   | 입실 비밀번호 검증      |
| PATCH  | `/api/users/{userId}/entry-password` | 입실 비밀번호 변경      |

### Tickets / TicketUsage

| Method | Endpoint                                   | Description                     |
| ------ | ------------------------------------------ | ------------------------------- |
| GET    | `/api/tickets`                             | 이용권 목록                     |
| GET    | `/api/tickets/room`                        | 스터디룸용 이용권 조회          |
| GET    | `/api/tickets/{ticketId}`                  | 이용권 상세                     |
| GET    | `/api/ticket-usages/available-seat/exists` | 좌석 이용 가능 이용권 보유 여부 |
| POST   | `/api/admin/tickets`                       | 이용권 등록                     |
| PUT    | `/api/admin/tickets/{ticketId}`            | 이용권 수정                     |
| PATCH  | `/api/admin/tickets/{ticketId}/status`     | 판매 상태 변경                  |
| DELETE | `/api/admin/tickets/{ticketId}`            | 이용권 삭제                     |

### Payments

| Method | Endpoint                                 | Description           |
| ------ | ---------------------------------------- | --------------------- |
| POST   | `/api/payments`                          | 사용자 결제 요청 생성 |
| POST   | `/api/payments/confirm`                  | Toss 결제 승인        |
| POST   | `/api/payments/{paymentId}/mock-confirm` | Mock 카드 승인        |
| GET    | `/api/payments/{paymentId}`              | 본인 결제 단건 조회   |
| GET    | `/api/admin/payments`                    | 관리자 결제 이력 조회 |
| GET    | `/api/admin/payments/{paymentId}`        | 관리자 결제 상세 조회 |
| PATCH  | `/api/admin/payments/{paymentId}/cancel` | 관리자 결제 취소      |
| DELETE | `/api/admin/payments/{paymentId}`        | 관리자 결제 이력 삭제 |

관리자 결제 목록은 `userId` Query Parameter를 선택적으로 받을 수 있습니다.

```http
GET /api/admin/payments?userId=75
```

### Seats / Check-in

| Method | Endpoint                                   | Description                    |
| ------ | ------------------------------------------ | ------------------------------ |
| GET    | `/api/seats`                               | 전체 좌석                      |
| GET    | `/api/seats/{seatId}`                      | 좌석 상세                      |
| GET    | `/api/seats/occupied`                      | 사용 중 좌석                   |
| POST   | `/api/checkin/prepare`                     | 비회원/전화번호 기반 입실 준비 |
| POST   | `/api/checkin/prepare/member`              | 로그인 회원 입실 준비          |
| POST   | `/api/checkin`                             | 입실                           |
| PATCH  | `/api/checkin/away`                        | 외출                           |
| PATCH  | `/api/checkin/away/member`                 | 로그인 회원 외출               |
| PATCH  | `/api/checkin/comeback`                    | 복귀                           |
| PATCH  | `/api/checkin/comeback/member`             | 로그인 회원 복귀               |
| PATCH  | `/api/checkin/checkout`                    | 퇴실                           |
| PATCH  | `/api/checkin/checkout/member`             | 로그인 회원 퇴실               |
| GET    | `/api/admin/seats/{seatId}/user`           | 좌석 이용자 정보               |
| PATCH  | `/api/admin/seats/{seatId}/status`         | 좌석 상태 변경                 |
| POST   | `/api/admin/seats/{seatId}/force-checkout` | 관리자 강제 퇴실               |

### Meeting Rooms

| Method | Endpoint                                                 | Description         |
| ------ | -------------------------------------------------------- | ------------------- |
| GET    | `/api/rooms`                                             | 스터디룸 목록       |
| GET    | `/api/rooms/{roomId}`                                    | 스터디룸 상세       |
| GET    | `/api/meeting-rooms`                                     | 전체 예약 목록      |
| POST   | `/api/meeting-rooms/reservations`                        | 임시 예약 생성      |
| PATCH  | `/api/meeting-rooms/reservations/{reservationId}/cancel` | 예약 취소           |
| GET    | `/api/meeting-rooms/{roomId}/availability`               | 날짜별 가능 시간    |
| GET    | `/api/meeting-rooms/current`                             | 현재 사용자 예약    |
| GET    | `/api/meeting-rooms/admin/reservations`                  | 관리자 예약 목록    |
| GET    | `/api/meeting-rooms/reservations/{reservationId}`        | 본인 예약 단건 조회 |

### Admin

| Domain    | Base Endpoint          |
| --------- | ---------------------- |
| Dashboard | `/api/admin/dashboard` |
| Accounts  | `/api/admin/accounts`  |
| Users     | `/api/admin/users`     |
| Tickets   | `/api/admin/tickets`   |
| Payments  | `/api/admin/payments`  |
| Seats     | `/api/admin/seats`     |
| Devices   | `/api/admin/devices`   |
| Memos     | `/api/admin/memos`     |
| Logs      | `/api/admin/logs`      |

### Devices

| Method | Endpoint                               | Description      |
| ------ | -------------------------------------- | ---------------- |
| POST   | `/api/devices/events`                  | 장치 이벤트 수신 |
| GET    | `/api/admin/devices`                   | 전체 장치 상태   |
| GET    | `/api/admin/devices/{deviceId}`        | 장치 상세        |
| GET    | `/api/admin/devices/{deviceId}/logs`   | 장치 로그        |
| PATCH  | `/api/admin/devices/{deviceId}/status` | 관리자 상태 변경 |

---

## 🔐 Security

- 사용자 권한: `USER`, `GUEST`
- 관리자 권한: `SUPER_ADMIN`, `STAFF`
- JWT Access Token: 30분
- JWT Refresh Token: 7일
- Session: Stateless
- Password: BCrypt
- `/api/admin/**`: 관리자 Role 필요
- 사용자 결제 생성/승인: `USER` 또는 `GUEST` 필요
- 나머지 Public API는 `SecurityConfig`의 Method/Path 규칙에 따라 허용

> 현재 `GET /api/meeting-rooms/**`가 Public으로 선언되어 있으므로 `/api/meeting-rooms/admin/reservations`도 같은 규칙에 먼저 매칭됩니다. 관리자 전용 조회가 목적이라면 `/api/admin/...` 경로로 이동하거나 Security Rule 순서를 조정해야 합니다.

### CORS

현재 시연/개발을 위해:

```java
configuration.setAllowedOriginPatterns(List.of("*"));
```

로 설정되어 있습니다.

> 최종 배포 시 `app.frontend-url`에 등록된 실제 Origin만 허용하도록 변경하는 것이 권장됩니다.

---

## ⏱ Scheduling

| Scheduler               | Interval         | Role                                                            |
| ----------------------- | ---------------- | --------------------------------------------------------------- |
| `CheckinScheduler`      | 1분              | 시간권 차감, 이용권 전환, 자동 퇴실                             |
| `ReservationScheduler`  | 1분              | 예약 `CONFIRMED → IN_USE → COMPLETED`, 결제 대기 30분 만료 처리 |
| `NotificationScheduler` | 매분 15초 / 45초 | 만료 예정 문자 발송 / SOLAPI 상태 동기화                        |
| `UserPenaltyScheduler`  | 매시 정각        | 만료된 회원 제재 자동 해제                                      |

---

## 🔔 Notification

알림 기능은 기본적으로 꺼져 있습니다.

```properties
notification.enabled=${NOTIFICATION_ENABLED:false}
notification.expiration.time-minutes=30
notification.expiration.period-hours=24
```

실제 문자 발송 담당자의 `.env`에서만 활성화합니다.

```env
NOTIFICATION_ENABLED=true
SOLAPI_API_KEY=...
SOLAPI_API_SECRET=...
SOLAPI_SENDER_NUMBER=...
```

현재 만료 예정 알림 정책:

- `TIME_PACK`: 사용 중이며 잔여시간 1~30분인 이용권
- `PERIOD_PACK`: 사용 중이며 종료 시각이 24시간 이내인 이용권
- 동일 사용 건에 이미 `PENDING` 또는 `SUCCESS` 알림이 있으면 중복 발송하지 않음

---

## ⚙️ Environment Variables

`scac-back/.env`:

```env
DB_URL=jdbc:mysql://localhost:3306/scac
DB_USERNAME=scac
DB_PASSWORD=your_password
JWT_SECRET=your_long_random_secret
TOSS_SECRET_KEY=test_sk_...

# 회원가입 인증번호 발송 Provider
SMS_PROVIDER=mock
SMS_API_KEY=
SMS_API_SECRET=
SMS_FROM_NUMBER=01000000000
SMS_SENS_SERVICE_ID=

# 이용권 만료 예정 알림
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
- `TOSS_SECRET_KEY` — Toss 결제를 사용할 경우

### Optional

- `SMS_*` — 인증번호 실발송 시 사용. 기본 Provider는 `mock`
- `SOLAPI_*`, `NOTIFICATION_ENABLED` — 만료 예정 알림 실발송 시 사용

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

서버:

```text
http://localhost:8888
```

연결 확인:

```http
GET /api/test
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

테스트 시 `.env` 또는 실행 환경에 DB/JWT 관련 환경변수가 필요할 수 있습니다.

---

## ⚠️ Current Notes

2026-08-14 코드 기준:

- ✅ `Payment`가 `ticketId` 또는 `reservationId` 중 하나를 결제 대상으로 사용
- ✅ 결제 승인 후 좌석 이용권 / 스터디룸 이용내역을 분기 발급
- ✅ 예약 결제 승인 후 예약 상태 `CONFIRMED` 처리
- ✅ 관리자 결제 목록이 `/api/admin/payments`로 분리됨
- ✅ 결제 목록 MyBatis 쿼리가 `vw_payment_history`를 기준으로 동작
- ✅ SOLAPI 만료 예정 알림 스케줄러 추가
- ✅ 관리자 API는 `SUPER_ADMIN`, `STAFF` 권한으로 제한
- ⚠️ `/api/devices/events`는 현재 Public 예외에 포함되어 있지 않아 RTOS가 인증 없이 전송하려면 Security 정책 정리가 필요
- ⚠️ `GET /api/meeting-rooms/**` Public 규칙 때문에 `/api/meeting-rooms/admin/reservations`도 현재 인증 없이 접근 가능한 경로로 매칭됨
- ⚠️ `DoorAccessController`, `DoorAccessService`, 일부 장치 명령 DTO는 현재 골격 상태
- ⚠️ `scac-rtos`가 사용하는 `/api/commands`, `/api/faults`, `/api/devices/health` API는 현재 Backend Controller에 구현되어 있지 않음
- ⚠️ 관리자 결제 삭제 API는 존재하지만 운영 정책상 이력 보존을 위해 실제 화면에서는 취소 중심으로 사용하는 것이 안전함

---

## 👥 Team

| Name   | Role                                                      |
| ------ | --------------------------------------------------------- |
| 김수영 | 회원 · 인증 · 권한 · 입실 비밀번호 관리 · DB 설계 및 관리 |
| 장원진 | 좌석 · 예약 · 입실/퇴실 · Git 저장소 및 배포 관리         |
| 이지현 | 결제 · 이용권 · 관리자 · 장치 관리 · 프로젝트 문서 관리   |

---

## 📅 Development Period

**2026.07.03 ~ 2026.09.02**

---

## 📝 Documentation Version

- **README v3.0**
- Last Updated: **2026.08.14**

### History

- README v1.0 (2026.07.22)
- README v1.1 (2026.07.23)
- README v2.0 (2026.08.05)
- README v3.0 (2026.08.14)

---

## 📄 License

본 프로젝트는 K-Digital Training 교육 및 팀 프로젝트 목적으로 제작되었습니다.
