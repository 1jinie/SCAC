# ☕ SCAC Backend

> **Study Cafe Access Control Backend**

---

### ⚙️ Spring Boot REST API Server

SCAC 키오스크 및 관리자 시스템의 비즈니스 로직과 데이터를 처리하는  
Spring Boot 기반 백엔드 애플리케이션입니다.

---

## 📖 프로젝트 소개

SCAC Backend는 스터디카페 키오스크와 관리자 웹 애플리케이션에서  
공통으로 사용하는 REST API 서버입니다.

회원과 인증, 이용권, 결제, 좌석, 입·퇴실, 스터디룸 예약, 관리자 기능과  
장치 상태 및 로그를 처리하며 MySQL 데이터베이스와 연동하여 서비스 데이터를 관리합니다.

단순한 데이터 등록·수정·삭제 및 상태 변경에는 **Spring Data JPA**를 사용하고,  
복잡한 조회가 필요한 일부 기능에는 **MyBatis**를 함께 사용합니다.

---

## 🎯 프로젝트 목표

- 키오스크와 관리자 애플리케이션을 위한 REST API 제공
- 사용자와 관리자의 인증 흐름 분리
- 회원, 이용권, 결제, 좌석 및 예약 데이터 관리
- 입실·퇴실·외출·복귀 상태 관리
- 실시간 좌석 및 스터디룸 현황 제공
- 관리자용 회원·좌석·결제·로그·장치 관리 기능 제공
- JWT 기반 인증 및 비밀번호 암호화 적용
- 일관된 요청 검증과 공통 응답·예외 처리
- AOP 기반 시스템 로그 기록
- 유지보수와 협업이 쉬운 도메인 중심 구조 설계

---

## ✨ 주요 기능

### 👤 회원 및 인증

- 회원가입 및 비회원 등록
- 사용자 로그인·토큰 재발급·로그아웃
- 관리자 로그인·토큰 재발급·로그아웃
- 회원 정보 조회
- 입실 비밀번호 확인 및 변경
- BCrypt 기반 비밀번호 암호화
- JWT 기반 사용자 인증 및 인가
- 관리자 전용 접근 제어 보완 진행 중

### 🎫 이용권

- 이용권 목록 및 상세 조회
- 이용권 등록·수정·삭제
- 이용권 판매 상태 변경
- 사용자 이용권 발급
- 시간권 및 기간권 사용 상태 관리

### 💳 결제

- 결제 요청 생성
- Toss Payments 결제 승인
- 개발용 Mock 카드 결제 승인
- 결제 단건 및 전체 내역 조회
- 사용자별 결제 내역 조회
- 결제 취소 및 취소 사유 관리
- 결제 내역 삭제
- 관리자 결제 조회·취소 권한 보완 진행 중
- 기간·상태·결제수단별 검색 및 매출 통계 예정

### 🪑 좌석 및 입·퇴실

- 전체 좌석 현황 및 상세 조회
- 사용 중인 좌석 조회
- 회원·비회원 입실 준비 및 입실 처리
- 외출·복귀·퇴실 처리
- 관리자 좌석 상태 변경
- 관리자 강제 퇴실
- 이용시간 차감 및 시간 만료 처리 스케줄러 보완 중

### 🏠 스터디룸 예약

- 스터디룸 목록 및 상세 조회
- 전체 예약 내역 조회
- 날짜별 예약 가능 시간 조회
- 스터디룸 예약 및 예약 취소
- 관리자 예약 관리 기능 보완 중

### 🛠 관리자

- 관리자 계정 관리
- 대시보드 요약 정보 조회
- 회원 목록·상세 조회 및 페널티 관리
- 좌석 현황·이용자 정보·강제 퇴실 관리
- 이용권·결제·예약 관리
- 인수인계 메모 CRUD
- 시스템 로그 및 좌석 로그 조회
- 장치 상태 및 장치 로그 관리

### 🖨 장치 및 시스템

- 장치 전체·상세 상태 조회
- 장치별 로그 조회
- 관리자 장치 상태 변경
- RTOS 장치 이벤트 수신 및 로그 저장
- AOP 기반 관리자 시스템 로그 기록
- 출입문 작동 신호 연동 예정

---

## 🛠 Tech Stack

### Backend

- Java 21
- Spring Boot 3.5.16
- Spring Web
- Spring Security
- Spring Data JPA
- MyBatis 3.0.5
- Bean Validation
- JJWT 0.13.0
- Lombok
- Spring Dotenv
- Gradle

### External API

- Toss Payments API

### Database

- MySQL

### Development Tools

- Visual Studio Code
- Postman
- MySQL Workbench
- Git
- GitHub

---

## 🏗 System Architecture

```text
┌──────────────────────┐
│   SCAC Kiosk React   │
│     scac-front       │
└──────────┬───────────┘
           │
           │ REST API / JWT
           │
           ▼
┌─────────────────────────────┐
│      SCAC Spring Boot       │
│          scac-back          │
│                             │
│  Controller                 │
│      ↓                      │
│  Service                    │
│      ↓                      │
│  Repository / Mapper        │
└─────────────┬───────────────┘
              │
              │ JPA / MyBatis
              │
              ▼
┌─────────────────────────────┐
│            MySQL            │
└─────────────────────────────┘
              ▲
              │
              │ REST API / JWT
              │
┌─────────────┴───────────────┐
│     SCAC Admin React        │
│        scac-admin           │
└─────────────────────────────┘

SCAC Backend ───── Toss Payments API
      │
      └─────────── RTOS Device Event API
```

---

## 📂 Project Structure

```text
scac-back
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── scac
│   │   │           ├── admin
│   │   │           ├── auth
│   │   │           ├── checkin
│   │   │           ├── device
│   │   │           ├── global
│   │   │           │   ├── config
│   │   │           │   ├── controller
│   │   │           │   ├── enums
│   │   │           │   ├── exception
│   │   │           │   ├── log
│   │   │           │   ├── response
│   │   │           │   └── scheduler
│   │   │           ├── meetingroom
│   │   │           ├── memo
│   │   │           ├── payment
│   │   │           ├── seat
│   │   │           ├── system
│   │   │           ├── ticket
│   │   │           ├── ticketusage
│   │   │           └── user
│   │   │
│   │   └── resources
│   │       ├── mappers
│   │       │   └── payment
│   │       │       └── PaymentMapper.xml
│   │       └── application.properties
│   │
│   └── test
│       └── java
│           └── com
│               └── scac
│                   └── ScacBackApplicationTests.java
│
├── .gitignore
├── build.gradle
├── gradlew
├── gradlew.bat
├── settings.gradle
└── README.md
```

> 실제 폴더 구조는 기능 구현과 리팩터링에 따라 변경될 수 있습니다.

> 공통 설정과 예외, 응답, Enum, 로그 기능은 `global` 패키지에서 관리합니다.

---

## 📦 Domain Structure

각 기능은 도메인 단위로 분리하여 관리합니다.

```text
payment
├── client
│   └── TossPaymentClient.java
├── controller
│   └── PaymentController.java
├── dto
│   ├── PaymentRequestDTO.java
│   ├── PaymentConfirmDTO.java
│   ├── PaymentCancelDTO.java
│   ├── PaymentHistoryDTO.java
│   ├── PaymentResDTO.java
│   └── TossPaymentResponse.java
├── entity
│   └── Payment.java
├── mapper
│   └── PaymentMapper.java
├── repository
│   └── PaymentRepository.java
└── service
    └── PaymentService.java
```

- `client`: 외부 API 요청 처리
- `controller`: HTTP 요청 및 응답 처리
- `dto`: 요청·응답 및 계층 간 데이터 전달
- `domain` / `entity`: 데이터베이스 테이블과 매핑되는 객체
- `repository`: JPA 기반 CRUD 및 단순 조회
- `mapper`: MyBatis 기반 복잡한 조회
- `service`: 비즈니스 로직 및 트랜잭션 처리
- `scheduler`: 정기 실행이 필요한 작업 처리

---

## 🔄 Request Flow

```text
Client Request
      ↓
Security Filter / JWT Validation
      ↓
Controller
      ↓
Request DTO Validation
      ↓
Service
      ↓
Repository / Mapper / External API Client
      ↓
MySQL / External API
      ↓
Response DTO
      ↓
ApiResponse
      ↓
Client Response
```

---

## 📬 Common Response

대부분의 API는 공통 응답 객체인 `ApiResponse`를 사용합니다.

```json
{
  "success": true,
  "message": "요청을 성공적으로 처리했습니다.",
  "data": {}
}
```

요청 검증 실패, 존재하지 않는 리소스, 비즈니스 예외 등은  
`GlobalExceptionHandler`에서 공통 형식으로 처리합니다.

---

## 🗃 JPA & MyBatis

SCAC Backend는 JPA와 MyBatis를 함께 사용합니다.

| 구분             | 사용 기술 | 주요 용도                          |
| ---------------- | --------- | ---------------------------------- |
| 등록·수정·삭제   | JPA       | 엔티티 저장 및 상태 변경           |
| 단건 조회        | JPA       | 식별자를 이용한 기본 조회          |
| 단순 목록 조회   | JPA       | 단일 조건 또는 연관관계 기반 조회  |
| 복잡한 검색      | MyBatis   | 여러 테이블과 조건이 결합된 조회   |
| 관리자 목록 조회 | MyBatis   | 결제 내역 등 화면에 맞춘 복합 조회 |

### 사용 원칙

```text
단순 CRUD 및 데이터 변경
→ Spring Data JPA

복잡한 조건 검색 및 화면 맞춤 조회
→ MyBatis
```

같은 기능을 JPA와 MyBatis로 중복 구현하지 않으며,  
복잡한 조회가 필요한 시점에 해당 도메인의 Mapper를 추가합니다.

---

## 📡 API

기본 API 주소:

```text
http://localhost:8888/api
```

### 주요 API 영역

| Domain        | Base Path            | Description                         |
| ------------- | -------------------- | ----------------------------------- |
| User Auth     | `/api/auth`          | 사용자 로그인·토큰 재발급·로그아웃  |
| Admin Auth    | `/api/admin/auth`    | 관리자 로그인·토큰 재발급·로그아웃  |
| Users         | `/api/users`         | 회원가입·비회원 등록·회원 정보 관리 |
| Tickets       | `/api/tickets`       | 이용권 관리                         |
| Ticket Usages | `/api/ticket-usages` | 사용자 이용권 발급 및 사용 관리     |
| Payments      | `/api/payments`      | 결제 생성·승인·조회·취소 관리       |
| Seats         | `/api/seats`         | 좌석 현황 조회                      |
| Check-in      | `/api/checkin`       | 입실·외출·복귀·퇴실 관리            |
| Rooms         | `/api/rooms`         | 스터디룸 조회                       |
| Reservations  | `/api/meeting-rooms` | 스터디룸 예약 및 가능 시간 조회     |
| Admin         | `/api/admin`         | 관리자 대시보드·회원·좌석·계정 관리 |
| Admin Memos   | `/api/admin/memos`   | 관리자 인수인계 메모 관리           |
| Admin Logs    | `/api/admin/logs`    | 시스템 및 좌석 로그 조회            |
| Devices       | `/api/devices`       | 장치 상태·로그·RTOS 이벤트 관리     |
| Test          | `/api/test`          | 서버 연결 확인                      |

> 전체 엔드포인트와 요청·응답 명세는 프로젝트 사이트의 API 명세서에서 관리합니다.

---

## 💳 Payment API

| Method   | Endpoint                                 | Description                       | Authentication         |
| -------- | ---------------------------------------- | --------------------------------- | ---------------------- |
| `POST`   | `/api/payments`                          | 결제 요청 생성                    | 사용자 또는 비회원 JWT |
| `POST`   | `/api/payments/confirm`                  | Toss Payments 결제 승인           | 사용자 또는 비회원 JWT |
| `POST`   | `/api/payments/{paymentId}/mock-confirm` | 개발용 Mock 카드 결제 승인        | 사용자 또는 비회원 JWT |
| `GET`    | `/api/payments/{paymentId}`              | 결제 단건 조회                    | 관리자 권한 보완 중    |
| `GET`    | `/api/payments`                          | 전체 또는 사용자별 결제 내역 조회 | 관리자 권한 보완 중    |
| `PATCH`  | `/api/payments/{paymentId}/cancel`       | 결제 취소                         | 관리자 권한 보완 중    |
| `DELETE` | `/api/payments/{paymentId}`              | 결제 내역 삭제                    | 관리자 권한 보완 중    |

사용자별 결제 내역은 Query Parameter로 조회합니다.

```http
GET /api/payments?userId=1
```

### 결제 요청 생성 예시

```http
POST /api/payments
Authorization: Bearer {accessToken}
Content-Type: application/json
```

```json
{
  "ticketId": 1,
  "amount": 4000,
  "paymentMethod": "CARD"
}
```

### Toss 결제 승인 예시

```http
POST /api/payments/confirm
Authorization: Bearer {accessToken}
Content-Type: application/json
```

```json
{
  "paymentKey": "test-payment-key",
  "orderId": "order-20260805-001",
  "amount": 4000
}
```

### Mock 카드 결제 승인 예시

```http
POST /api/payments/1/mock-confirm
Authorization: Bearer {accessToken}
```

### 결제 취소 요청 예시

```http
PATCH /api/payments/1/cancel
Content-Type: application/json
```

```json
{
  "cancelReason": "사용자 요청"
}
```

> 취소 사유는 필수이며 최대 200자까지 입력할 수 있습니다.

> 실제 서비스에서는 결제 내역을 삭제하기보다  
> 상태를 `CANCELED`로 변경하고 취소 정보를 보존하는 것을 기본 원칙으로 합니다.

---

## 🔐 Authentication API

### 사용자 인증

| Method | Endpoint            | Description                |
| ------ | ------------------- | -------------------------- |
| `POST` | `/api/auth/login`   | 사용자 로그인              |
| `POST` | `/api/auth/refresh` | 사용자 Access Token 재발급 |
| `POST` | `/api/auth/logout`  | 사용자 로그아웃            |

### 관리자 인증

| Method | Endpoint                  | Description                |
| ------ | ------------------------- | -------------------------- |
| `POST` | `/api/admin/auth/login`   | 관리자 로그인              |
| `POST` | `/api/admin/auth/refresh` | 관리자 Access Token 재발급 |
| `POST` | `/api/admin/auth/logout`  | 관리자 로그아웃            |

인증이 필요한 요청은 다음 형식으로 Access Token을 전달합니다.

```http
Authorization: Bearer {accessToken}
```

---

## 🖨 Device API

| Method  | Endpoint                         | Description              |
| ------- | -------------------------------- | ------------------------ |
| `GET`   | `/api/devices`                   | 전체 장치 현재 상태 조회 |
| `GET`   | `/api/devices/{deviceId}`        | 특정 장치 현재 상태 조회 |
| `GET`   | `/api/devices/{deviceId}/logs`   | 특정 장치 로그 조회      |
| `PATCH` | `/api/devices/{deviceId}/status` | 장치 상태 변경           |
| `POST`  | `/api/devices/events`            | RTOS 장치 이벤트 수신    |

> 관리자 화면과 장치 API의 최종 경로 및 접근 권한을 통합 점검 중입니다.

---

## 🚀 Getting Started

### 1. Repository Clone

```bash
git clone [SCAC Repository URL]
cd SCAC-main/scac-back
```

또는 백엔드 저장소를 별도로 Clone한 경우:

```bash
git clone [SCAC Backend Repository URL]
cd scac-back
```

### 2. Environment Variables

`scac-back` 최상위 경로에 `.env` 파일을 생성합니다.

```env
DB_URL=jdbc:mysql://localhost:3306/scac
DB_USERNAME=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
TOSS_SECRET_KEY=your_toss_secret_key
```

> 실제 `.env` 파일과 비밀키는 Git에 업로드하지 않습니다.

> 공용 데이터베이스를 사용하는 경우 팀에서 공유한 접속 정보를 입력합니다.

### 3. Run Application

#### Windows

```bash
gradlew.bat bootRun
```

#### macOS / Linux

```bash
./gradlew bootRun
```

또는 `ScacBackApplication.java`의 `main()` 메서드를 실행합니다.

### 4. Server Address

```text
http://localhost:8888
```

### 5. Connection Test

```http
GET http://localhost:8888/api/test
```

정상적으로 실행된 경우 서버 연결 성공 응답을 반환합니다.

---

## ⚙️ Application Configuration

현재 `application.properties`의 주요 설정은 다음과 같습니다.

```properties
spring.application.name=scac-back
server.port=8888

spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=false
spring.jpa.open-in-view=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

jwt.secret=${JWT_SECRET}
jwt.access-expiration=1800000
jwt.refresh-expiration=604800000

mybatis.mapper-locations=classpath:mappers/**/*.xml
mybatis.configuration.map-underscore-to-camel-case=true

spring.config.import=optional:file:.env[.properties]

app.frontend-url=http://localhost:3000,http://localhost:3001

toss.secret-key=${TOSS_SECRET_KEY}
```

- Access Token 유효시간: 30분
- Refresh Token 유효시간: 7일
- 키오스크 개발 서버: `http://localhost:3000`
- 관리자 개발 서버: `http://localhost:3001`

> 공용 데이터베이스의 테이블이 임의로 변경되지 않도록  
> `spring.jpa.hibernate.ddl-auto=none`을 사용합니다.

---

## 🧪 Test

### Compile

#### Windows

```bash
gradlew.bat clean compileJava
```

#### macOS / Linux

```bash
./gradlew clean compileJava
```

### 전체 테스트

#### Windows

```bash
gradlew.bat test
```

#### macOS / Linux

```bash
./gradlew test
```

### API 테스트

API 요청과 응답은 Postman을 이용하여 확인합니다.

주요 확인 항목:

- 회원·비회원 로그인 및 JWT 발급
- 이용권 목록과 상태 변경
- 결제 생성·승인·취소
- 입실·외출·복귀·퇴실 흐름
- 관리자 화면 API 연동
- 장치 상태 및 로그 수신
- 권한이 없는 요청의 차단 여부

---

## 🔐 Security

- 사용자와 관리자의 인증 API를 분리합니다.
- 인증이 필요한 요청에는 JWT Access Token을 사용합니다.
- Refresh Token을 이용하여 Access Token을 재발급합니다.
- 비밀번호는 BCrypt로 암호화하여 저장합니다.
- 세션을 사용하지 않는 Stateless 방식으로 동작합니다.
- CORS 허용 Origin은 키오스크와 관리자 개발 서버로 제한합니다.
- 환경변수와 비밀키는 `.env`로 관리합니다.
- 클라이언트 요청값은 Bean Validation으로 검증합니다.
- 관리자 전용 API의 세부 권한 정책은 통합 테스트와 함께 보완 중입니다.

---

## 🧾 Logging & Scheduling

### Logging

- `ApiResponse`를 이용한 공통 응답 형식
- `GlobalExceptionHandler`를 이용한 공통 예외 처리
- `@AutoLog`와 `SystemLogAspect`를 이용한 관리자 작업 로그 저장
- 장치 이벤트 수신 시 장치 로그 저장

### Scheduling

- 이용권 잔여시간 차감 및 시간 만료 처리
- 사용자 페널티 상태 갱신

> 스케줄러의 세부 만료 조건과 강제 퇴실 흐름은 통합 테스트를 진행하며 보완하고 있습니다.

---

## 📌 Development Convention

### Package

```text
com.scac.{domain}.{layer}
```

예시:

```text
com.scac.payment.controller
com.scac.payment.dto
com.scac.payment.entity
com.scac.payment.repository
com.scac.payment.service
```

### Naming

| Type         | Convention                                              | Example                                       |
| ------------ | ------------------------------------------------------- | --------------------------------------------- |
| Class        | PascalCase                                              | `PaymentService`                              |
| Method       | camelCase                                               | `cancelPayment`                               |
| Variable     | camelCase                                               | `paymentId`                                   |
| Database     | snake_case                                              | `payment_id`                                  |
| Constant     | UPPER_SNAKE_CASE                                        | `PAYMENT_COMPLETED`                           |
| Request DTO  | `{Domain}Request` 또는 `{Domain}Req`                    | `CheckinRequest`, `LoginReq`                  |
| Response DTO | `{Domain}Response`, `{Domain}Res` 또는 `{Domain}ResDTO` | `CheckinResponse`, `UserRes`, `PaymentResDTO` |

> DTO 명명 방식은 기존 도메인별 구현 차이가 있어  
> 최종 리팩터링 시 하나의 규칙으로 통일할 예정입니다.

### API

- URL에는 명사를 사용합니다.
- 리소스는 가능한 한 복수형으로 표현합니다.
- HTTP Method로 작업의 종류를 구분합니다.
- 요청과 응답에 Entity를 직접 노출하지 않고 DTO를 사용합니다.
- 성공 응답은 가능한 한 `ApiResponse` 형식으로 통일합니다.

```text
GET    /api/payments
POST   /api/payments
PATCH  /api/payments/{paymentId}/cancel
```

---

## 👥 Team

| Name   | Role                                                      |
| ------ | --------------------------------------------------------- |
| 김수영 | 회원 · 인증 · 권한 · 입실 비밀번호 관리 · DB 설계 및 관리 |
| 장원진 | 좌석 · 예약 · 입실/퇴실 · Git 저장소/Vercel 배포 관리     |
| 이지현 | 결제 · 이용권 · 관리자 · 장치 관리 · 프로젝트 문서 관리   |

---

## 📅 Development Period

2026.07.03 ~ 2026.09.02

---

## 📌 Project Status

| Domain                       | Status         |
| ---------------------------- | -------------- |
| 프로젝트 기본 설정           | ✅ Complete    |
| 데이터베이스 연결            | ✅ Complete    |
| 공통 응답 및 예외 처리       | ✅ Complete    |
| 이용권 관리 API              | ✅ Complete    |
| 사용자·관리자 인증 및 권한   | 🟡 In Progress |
| 결제 및 환불 관리            | 🔵 In Review   |
| 좌석 및 입·퇴실              | 🔵 In Review   |
| 스터디룸 예약                | 🔵 In Review   |
| 관리자 API 연동              | 🟡 In Progress |
| 장치 상태 및 RTOS 이벤트 API | 🔵 In Review   |
| Frontend ↔ Backend 통합      | 🟡 In Progress |
| 통합 테스트 및 버그 수정     | 🟡 In Progress |
| API 및 프로젝트 문서화       | 🟡 In Progress |
| 출입문 하드웨어 연동         | ⚪ Pending     |

---

## 📅 Development Milestone

| Milestone                      | Target Date | Status         |
| ------------------------------ | ----------- | -------------- |
| 백엔드 기본 구조 설정          | 2026.07.23  | ✅ Complete    |
| 핵심 Backend 기능 구현 및 보완 | 2026.08.14  | 🟡 In Progress |
| Frontend ↔ Backend 통합        | 2026.08.14  | 🟡 In Progress |
| 전체 기능 테스트 및 안정화     | 2026.08.28  | 🟡 In Progress |
| 최종 발표                      | 2026.09.02  | ⚪ Pending     |

---

## ⚠️ Known Issues & Pending Tasks

- 관리자 로그인 이후 보호 라우트와 토큰 저장 흐름 통합
- 관리자 API에 대한 역할 기반 접근 권한 보완
- 관리자 장치 화면과 Backend API 경로 최종 통일
- 비회원 등록 후 이용권 구매 흐름 오류 수정
- 이용시간 만료 및 강제 퇴실 스케줄러 검증
- 출입문 작동 신호와 실제 하드웨어 연동
- API 명세서·README·ERD 최종 현행화

---

## 📝 Documentation Version

- **README v2.0**
- Last Updated: 2026.08.05

### History

- README v1.0 (2026.07.22)
- README v1.1 (2026.07.23)
- README v2.0 (2026.08.05) — 8월 4일 프로젝트 구조 및 API 기준 현행화

---

## 📄 License

본 프로젝트는 K-Digital Training 교육 및 팀 프로젝트 목적으로 제작되었습니다.
