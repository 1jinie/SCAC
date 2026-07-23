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

회원, 인증, 이용권, 결제, 좌석, 입·퇴실, 스터디룸 예약 및 관리자 기능을 처리하며,  
MySQL 데이터베이스와 연동하여 서비스 데이터를 관리합니다.

단순한 데이터 등록·수정·삭제 및 상태 변경에는 **Spring Data JPA**를 사용하고,  
복잡한 조건 검색과 통계 조회에는 **MyBatis**를 함께 사용합니다.

---

## 🎯 프로젝트 목표

- 키오스크와 관리자 애플리케이션을 위한 REST API 제공
- 사용자와 관리자의 인증 및 권한 분리
- 회원, 이용권, 결제, 좌석 및 예약 데이터 관리
- 입실·퇴실·외출 상태 관리
- 실시간 좌석 및 스터디룸 현황 제공
- 관리자용 검색 및 통계 조회 기능 제공
- 일관된 요청 검증 및 예외 응답 처리
- 유지보수와 협업이 쉬운 도메인 중심 구조 설계

---

## ✨ 주요 기능

### 👤 회원 및 인증

- 회원가입
- 사용자 로그인
- 관리자 로그인
- 회원 정보 조회 및 수정
- 사용자와 관리자 권한 구분
- 입실 비밀번호 관리
- JWT 기반 인증 및 인가

### 🎫 이용권

- 이용권 등록
- 이용권 목록 및 상세 조회
- 이용권 정보 수정
- 이용권 판매 상태 관리
- 사용자 이용권 발급 및 사용 관리

### 💳 결제

- 결제 내역 등록
- 결제 단건 및 전체 조회
- 사용자별 결제 내역 조회
- 결제 상태 변경
- 관리자 결제 취소
- 취소 사유 및 취소 일자 관리
- 기간·상태·결제수단별 조회 예정
- 매출 통계 조회 예정

### 🪑 좌석 및 입·퇴실

- 전체 좌석 현황 조회
- 좌석 선택
- 입실
- 퇴실
- 외출 및 복귀
- 좌석 상태 변경
- 관리자 강제 퇴실
- 좌석 이용 기록 관리

### 🏠 스터디룸 예약

- 스터디룸 현황 조회
- 날짜 및 시간별 예약 조회
- 스터디룸 예약
- 예약 변경 및 취소
- 관리자 예약 관리
- 스터디룸 상태 관리

### 🛠 관리자

- 회원 및 이용 현황 조회
- 좌석 및 스터디룸 관리
- 이용권 관리
- 결제 및 취소 관리
- 장치 상태 관리
- 전체 이용 로그 조회
- 조건별 검색 및 통계 조회

---

## 🛠 Tech Stack

### Backend

- Java 21
- Spring Boot 3.5.14
- Spring Web
- Spring Security
- Spring Data JPA
- MyBatis
- Bean Validation
- Lombok
- Gradle

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
           │ REST API
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
              │ REST API
              │
┌─────────────┴───────────────┐
│     SCAC Admin React        │
│        scac-admin           │
└─────────────────────────────┘
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
│   │   │           ├── global
│   │   │           │   ├── config
│   │   │           │   ├── controller
│   │   │           │   ├── enums
│   │   │           │   ├── exception
│   │   │           │   └── response
│   │   │           │
│   │   │           ├── auth
│   │   │           ├── user
│   │   │           ├── ticket
│   │   │           ├── payment
│   │   │           ├── seat
│   │   │           ├── usage
│   │   │           ├── reservation
│   │   │           ├── device
│   │   │           └── log
│   │   │
│   │   └── resources
│   │       ├── mapper
│   │       │   ├── payment
│   │       │   ├── ticket
│   │       │   └── reservation
│   │       └── application.properties
│   │
│   └── test
│       └── java
│
├── .env.example
├── .gitignore
├── build.gradle
├── gradlew
├── gradlew.bat
└── README.md
```

> 실제 폴더 구조는 기능 구현에 따라 변경될 수 있습니다.

> 상수는 enums 패키지에서 주로 관리합니다.

---

## 📦 Domain Structure

각 기능은 도메인 단위로 분리하여 관리합니다.

```text
payment
├── controller
│   └── PaymentController.java
├── dto
│   ├── PaymentRequest.java
│   ├── PaymentResponse.java
│   ├── PaymentCancelRequest.java
│   └── PaymentStatusUpdateRequest.java
├── entity
│   └── Payment.java
├── repository
│   └── PaymentRepository.java
├── mapper
│   └── PaymentMapper.java
└── service
    └── PaymentService.java
```

- `controller`: HTTP 요청 및 응답 처리
- `dto`: 계층 간 요청 및 응답 데이터 전달
- `entity`: 데이터베이스 테이블과 매핑되는 객체
- `repository`: JPA 기반 CRUD 및 단순 조회
- `mapper`: MyBatis 기반 복잡한 조회
- `service`: 비즈니스 로직 및 트랜잭션 처리

---

## 🔄 Request Flow

```text
Client Request
      ↓
Controller
      ↓
Request DTO Validation
      ↓
Service
      ↓
Repository / Mapper
      ↓
MySQL
      ↓
Response DTO
      ↓
Client Response
```

---

## 🗃 JPA & MyBatis

SCAC Backend는 JPA와 MyBatis를 함께 사용합니다.

| 구분             | 사용 기술 | 주요 용도                            |
| ---------------- | --------- | ------------------------------------ |
| 등록·수정·삭제   | JPA       | 엔티티 저장 및 상태 변경             |
| 단건 조회        | JPA       | 식별자를 이용한 기본 조회            |
| 단순 목록 조회   | JPA       | 사용자별 목록 등의 단순 조건 조회    |
| 복잡한 검색      | MyBatis   | 기간·상태·키워드 등의 다중 조건 검색 |
| 통계 및 집계     | MyBatis   | 일별·월별 매출 및 이용 통계          |
| 다중 테이블 조회 | MyBatis   | 관리자용 복합 데이터 조회            |

### 사용 원칙

```text
단순 CRUD 및 데이터 변경
→ Spring Data JPA

복잡한 조건 검색 및 통계
→ MyBatis
```

같은 기능을 JPA와 MyBatis로 중복 구현하지 않으며,  
MyBatis가 필요한 시점에 해당 도메인의 Mapper를 추가합니다.

---

## 📡 API

기본 API 주소:

```text
http://localhost:8888/api
```

### 주요 API 영역

| Domain       | Base Path           | Description          |
| ------------ | ------------------- | -------------------- |
| Auth         | `/api/auth`         | 로그인 및 인증       |
| Users        | `/api/users`        | 회원 관리            |
| Tickets      | `/api/tickets`      | 이용권 관리          |
| Payments     | `/api/payments`     | 결제 및 취소 관리    |
| Seats        | `/api/seats`        | 좌석 관리            |
| Usages       | `/api/usages`       | 입·퇴실 및 이용 관리 |
| Reservations | `/api/reservations` | 스터디룸 예약 관리   |
| Devices      | `/api/devices`      | 장치 관리            |
| Logs         | `/api/logs`         | 이용 및 관리자 로그  |
| Test         | `/api/test`         | 서버 연결 확인       |

---

## 💳 Payment API

| Method   | Endpoint                           | Description             |
| -------- | ---------------------------------- | ----------------------- |
| `POST`   | `/api/payments`                    | 결제 등록               |
| `GET`    | `/api/payments`                    | 전체 결제 내역 조회     |
| `GET`    | `/api/payments/{paymentId}`        | 결제 단건 조회          |
| `GET`    | `/api/payments/users/{userId}`     | 사용자별 결제 내역 조회 |
| `PATCH`  | `/api/payments/{paymentId}/status` | 결제 상태 변경          |
| `PATCH`  | `/api/payments/{paymentId}/cancel` | 관리자 결제 취소        |
| `DELETE` | `/api/payments/{paymentId}`        | 결제 내역 삭제          |

> 실제 서비스에서 결제 내역은 삭제하는 대신  
> 상태를 `CANCELED`로 변경하는 것을 기본 원칙으로 합니다.

### 결제 등록 요청 예시

```http
POST /api/payments
Content-Type: application/json
```

```json
{
  "usageId": 1,
  "userId": 1,
  "amount": 4000,
  "paymentMethod": "CARD",
  "approvalNum": "12345678",
  "paymentKey": "test-payment-key"
}
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

---

## 🚀 Getting Started

### 1. Repository Clone

```bash
git clone [SCAC Backend Repository URL]
cd scac-back
```

### 2. Environment Variables

프로젝트 최상위 경로에 `.env` 파일을 생성합니다.

```env
DB_URL=jdbc:mysql://localhost:3306/scac
DB_USERNAME=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
```

> 실제 `.env` 파일은 Git에 업로드하지 않습니다.  
> 필요한 환경변수 형식은 `.env.example`을 참고합니다.

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

정상적으로 실행된 경우:

```json
{
  "status": "success",
  "message": "SCAC 백엔드 연결 성공!"
}
```

---

## ⚙️ Application Configuration

`application.properties` 예시:

```properties
spring.application.name=scac-back

server.port=8888

spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

mybatis.mapper-locations=classpath:mapper/**/*.xml
mybatis.configuration.map-underscore-to-camel-case=true
```

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

API 요청은 Postman을 이용하여 테스트합니다.

---

## 🔐 Security

- 사용자와 관리자의 권한을 분리합니다.
- 인증이 필요한 요청에는 JWT를 사용합니다.
- 비밀번호는 암호화하여 저장합니다.
- 환경변수와 비밀키는 `.env`로 관리합니다.
- `.env`와 개인 개발환경 설정은 Git에 업로드하지 않습니다.
- 클라이언트의 요청값은 Bean Validation으로 검증합니다.

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

| Type         | Convention         | Example             |
| ------------ | ------------------ | ------------------- |
| Class        | PascalCase         | `PaymentService`    |
| Method       | camelCase          | `cancelPayment`     |
| Variable     | camelCase          | `paymentId`         |
| Database     | snake_case         | `payment_id`        |
| Constant     | UPPER_SNAKE_CASE   | `PAYMENT_COMPLETED` |
| Request DTO  | `{Domain}Request`  | `PaymentRequest`    |
| Response DTO | `{Domain}Response` | `PaymentResponse`   |

### API

- URL에는 명사를 사용합니다.
- 복수형 리소스명을 사용합니다.
- HTTP Method로 작업의 종류를 구분합니다.
- 요청과 응답에는 Entity를 직접 노출하지 않고 DTO를 사용합니다.

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
| 이지현 | 결제 · 이용권 · 관리자 · 프로젝트 문서 관리               |

---

## 📅 Development Period

2026.07.03 ~ Present

---

## 📌 Project Status

| Domain               | Status         |
| -------------------- | -------------- |
| 프로젝트 기본 설정   | ✅ Complete    |
| 데이터베이스 연결    | ✅ Complete    |
| 키오스크 연결 테스트 | ✅ Complete    |
| 회원 및 인증         | 🟡 In Progress |
| 이용권               | 🟡 In Progress |
| 결제 CRUD            | 🟡 In Progress |
| 좌석 및 입·퇴실      | 🟡 In Progress |
| 스터디룸 예약        | 🟡 In Progress |
| 관리자 API           | ⚪ Pending     |
| 통합 테스트          | ⚪ Pending     |
| API 문서화           | 🟡 In Progress |

---

## 📅 Development Milestone

| Milestone             | Target Date | Status         |
| --------------------- | ----------- | -------------- | ----------- |
| 백엔드 기본 구조 설정 | 설정        | 2026.07.22     | ✅ Complete |
| Backend 완료          | 2026.08.14  | 🟡 In Progress |
| 통합 테스트 완료      | 2026.08.28  | ⚪ Pending     |
| 최종 발표             | 2026.09.02  | ⚪ Pending     |

---

## 📝 Documentation Version

- **README v1.1**
- Last Updated : 2026.07.23

### History

- README v1.0 (2026.07.22)
- README v1.1 (2026.07.23)

---

## 📄 License

본 프로젝트는 K-Digital Training 교육 및 팀 프로젝트 목적으로 제작되었습니다.
