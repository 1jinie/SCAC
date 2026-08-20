# ☕ SCAC

> **Study Cafe Access Control**  
> 스터디카페 키오스크, 관리자 웹, Spring Boot API 서버와 RTOS 장치 연동 실습을 하나의 프로젝트로 구성한 풀스택 팀 프로젝트입니다.

---

## 📖 프로젝트 소개

SCAC는 스터디카페의 **회원/비회원 이용, 좌석 입·퇴실, 이용권 구매, 스터디룸 예약·결제, 관리자 운영 기능, 장치 상태 관리**를 통합하는 시스템입니다.

프로젝트는 사용자 키오스크, 관리자 웹, 백엔드 서버, RTOS 연동 코드로 분리되어 있습니다.

```text
SCAC
├── scac-front    # 사용자용 Kiosk Frontend
├── scac-admin    # 관리자용 Web Frontend
├── scac-back     # Spring Boot REST API Server
├── scac-rtos     # FreeRTOS POSIX 기반 장치 연동 실습 코드
└── docs          # 작업 기록 및 프로젝트 문서
```

---

## 🎯 주요 목표

- 회원/비회원이 키오스크에서 좌석 및 스터디룸 서비스를 이용할 수 있는 흐름 구현
- 시간권/기간권 구매와 스터디룸 예약 결제를 하나의 결제 도메인으로 통합
- 관리자 웹에서 좌석, 예약, 이용권, 회원, 결제, 장치, 로그, 메모를 관리
- JWT 기반 사용자/관리자 인증 및 권한 분리
- JPA와 MyBatis를 역할에 맞게 함께 사용
- Toss Payments 연동 및 개발용 Mock 카드 결제 지원
- 이용권 만료 예정 SMS 알림과 시스템 스케줄러 구성
- RTOS 장치 이벤트/명령 연동을 위한 통신 구조 실습

---

## ✨ 주요 기능

### 👤 사용자 / 인증

- 회원가입 및 비회원 등록
- 전화번호 기반 로그인
- JWT Access Token / Refresh Token 발급 및 재발급
- 사용자 / 관리자 인증 흐름 분리
- 입실 비밀번호 검증 및 변경
- SMS 인증번호 발송 및 검증

### 🪑 좌석 / 입·퇴실

- 전체 좌석 및 사용 중 좌석 조회
- 좌석 선택 후 입실
- 외출 / 복귀 / 퇴실
- 시간권 잔여시간 1분 단위 차감
- 이용권 소진 시 다음 이용권 자동 전환 또는 자동 퇴실
- 관리자 좌석 상태 변경 및 강제 퇴실

### 🎫 이용권

- 시간권 / 기간권 목록 조회
- 관리자 이용권 등록·수정·삭제
- 판매 상태 변경
- 결제 완료 시 `TicketUsage` 발급
- 좌석 이용 가능 이용권 보유 여부 확인

### 🏠 스터디룸 예약

- 스터디룸 목록 및 상세 조회
- 날짜별 예약 가능 시간 조회
- 스터디룸 임시 예약 생성
- 예약 결제 완료 후 `CONFIRMED` 처리
- 결제 대기 5분 초과 시 자동 취소
- 이용 시간에 따라 `IN_USE` → `COMPLETED` 상태 자동 전환
- 사용자 및 관리자 예약 조회/취소

### 💳 결제

- 좌석 이용권 결제와 스터디룸 예약 결제 지원
- 결제 요청 시 서버에서 상품/예약 금액 재검증
- 실물 카드 단말기 흐름을 대신하는 Mock 카드 승인
- Toss Payments 간편결제 승인 및 취소
- 결제 완료 시 이용권/예약 이용내역 발급
- 관리자 결제 내역 조회 및 취소
- MyBatis View 기반 결제 이력 조회

### 🛠 관리자

- 대시보드 요약 통계
- 좌석 관리
- 스터디룸 예약 관리
- 이용권 관리
- 회원 검색 및 제재
- 결제 검색·필터·취소
- 장치 상태 및 장치 로그 관리
- 시스템 로그 조회
- 인수인계 메모 CRUD

### 🔔 알림 / 스케줄링

- 시간권 잔여 30분 이하 만료 예정 문자 알림
- 기간권 24시간 이내 만료 예정 문자 알림
- SOLAPI 발송 결과 동기화
- 사용자 제재 기간 만료 자동 해제
- 좌석 이용시간 차감 및 자동 퇴실
- 스터디룸 예약 상태 자동 갱신

---

## 🏗 System Architecture

```text
┌──────────────────────┐        ┌──────────────────────┐
│  SCAC Kiosk Frontend │        │  SCAC Admin Frontend │
│     scac-front       │        │     scac-admin       │
│   React / Zustand    │        │   React / Zustand    │
└──────────┬───────────┘        └──────────┬───────────┘
           │ REST API / JWT                         │
           └──────────────────┬─────────────────────┘
                              ▼
                  ┌────────────────────────┐
                  │      scac-back         │
                  │ Spring Boot REST API   │
                  │ JPA + MyBatis + JWT    │
                  └───────────┬────────────┘
                              │
              ┌───────────────┼────────────────┐
              ▼               ▼                ▼
          ┌───────┐     ┌──────────────┐   ┌─────────┐
          │ MySQL │     │ Toss Payments│   │ SOLAPI  │
          └───────┘     └──────────────┘   └─────────┘
                              ▲
                              │ HTTP 연동 실습
                       ┌──────┴───────┐
                       │  scac-rtos   │
                       │ FreeRTOS/C   │
                       └──────────────┘
```

---

## 🛠 Tech Stack

| 영역           | 기술                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| Kiosk Frontend | React 19.2.7, React Router 7.18.1, Axios, Zustand, React Hook Form, Toss Payments SDK, QRCode React, CSS            |
| Admin Frontend | React 19.2.7, React Router 7.18.1, Axios, Zustand, CSS                                                              |
| Backend        | Java 21, Spring Boot 3.5.16, Spring Security, Spring Data JPA, MyBatis 3.0.5, Bean Validation, JJWT, Lombok, Gradle |
| Database       | MySQL                                                                                                               |
| External API   | Toss Payments, SOLAPI, SMS Provider(Mock / CoolSMS / Naver SENS)                                                    |
| RTOS           | C11, FreeRTOS POSIX Port, CMake 3.16+, pthread                                                                      |
| Collaboration  | Git, GitHub, Figma, Postman, MySQL Workbench                                                                        |

---

## 📂 Repository Structure

```text
.
├── README.md
├── .env example
├── docs
│   └── worklog
│       ├── 2026-07.md
│       └── 2026-08.md
├── scac-front
│   ├── public
│   ├── src
│   ├── package.json
│   └── README.md
├── scac-admin
│   ├── public
│   ├── src
│   ├── package.json
│   └── README.md
├── scac-back
│   ├── src
│   ├── http
│   ├── build.gradle
│   └── README.md
└── scac-rtos
    ├── config
    ├── src
    ├── CMakeLists.txt
    └── Makefile
```

---

## 🚀 Getting Started

### 1. Backend

필수 환경:

- Java 21
- MySQL

`scac-back/.env` 예시:

```env
DB_URL=jdbc:mysql://localhost:3306/scac
DB_USERNAME=scac
DB_PASSWORD=your_password
JWT_SECRET=your_long_random_secret
TOSS_SECRET_KEY=test_sk_...

# 이용권 만료 알림을 실제 발송할 담당자만 true
NOTIFICATION_ENABLED=false
SOLAPI_API_KEY=
SOLAPI_API_SECRET=
SOLAPI_SENDER_NUMBER=
```

실행:

```bash
cd scac-back

# Windows
./gradlew.bat bootRun

# macOS / Linux
./gradlew bootRun
```

기본 주소:

```text
http://localhost:8888
```

### 2. Kiosk Frontend

```bash
cd scac-front
npm install
npm start
```

`.env` 예시:

```env
PORT=3000
REACT_APP_API_URL=http://localhost:8888
REACT_APP_TOSS_CLIENT_KEY=test_ck_...
```

기본 개발 주소:

```text
http://localhost:3000
```

### 3. Admin Frontend

```bash
cd scac-admin
npm install
npm start
```

`.env` 예시:

```env
PORT=3001
REACT_APP_API_URL=http://localhost:8888
```

관리자 개발 주소:

```text
http://localhost:3001
```

> `REACT_APP_API_URL`을 생략하면 현재 브라우저 hostname의 `:8888`을 API 서버로 사용합니다.

### 4. RTOS

`scac-rtos`는 FreeRTOS POSIX 포트를 사용한 장치 연동 실습 코드입니다. **현재 스냅샷은 백엔드 API 계약과 빌드 코드 정리가 필요한 연동 진행 상태**입니다.

필요 환경:

- Linux / Ubuntu
- GCC
- CMake 3.16+
- FreeRTOS-Kernel

현재 백엔드 기본 포트는 `8888`이므로 실행 시 서버 URL을 명시하는 편이 안전합니다.

```bash
cd scac-rtos
cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug
cmake --build build -j
./build/day05_rtos http://localhost:8888
```

---

## 🔐 Authentication & Security

- 사용자 권한: `USER`, `GUEST`
- 관리자 권한: `SUPER_ADMIN`, `STAFF`
- JWT 기반 Stateless 인증
- Access Token: 30분
- Refresh Token: 7일
- BCrypt 비밀번호 암호화
- 관리자 API(`/api/admin/**`)는 백엔드에서 관리자 Role을 요구
- 프론트 Axios Interceptor에서 Access Token 자동 첨부 및 401 발생 시 Refresh Token 재발급 시도

> 현재 관리자 프론트의 `AdminPrivateRoute` 컴포넌트는 구현되어 있지만 개발 편의를 위해 실제 Router 적용 부분은 주석 처리되어 있습니다.

---

## 📬 Common API Response

백엔드 공통 응답 필드는 `isSuccess`, `message`, `data`입니다.

```json
{
  "isSuccess": true,
  "message": "요청을 성공적으로 처리했습니다.",
  "data": {}
}
```

---

## 📌 Current Integration Notes

2026-08-14 코드 기준으로 다음 내용을 README에 명확히 구분합니다.

- ✅ 좌석 이용권과 스터디룸 예약 결제가 `Payment` 흐름으로 통합됨
- ✅ 관리자 결제 조회 API가 `/api/admin/payments`로 분리됨
- ✅ 결제 이력 조회는 `vw_payment_history` + MyBatis 사용
- ✅ SOLAPI 기반 이용권 만료 예정 알림 코드 추가
- ✅ 회원관리, 결제 필터, 장치/로그/메모 관리자 화면 존재
- ⚠️ 관리자 프론트 보호 라우트는 현재 개발용으로 비활성화 상태
- ⚠️ RTOS 코드가 호출하는 `/api/commands`, `/api/faults`, `/api/devices/health` 경로는 현재 `scac-back`에 구현되어 있지 않아 API 계약 정리가 필요
- ⚠️ `scac-rtos/Makefile`의 기본 실행 URL은 `8080`이므로 백엔드 `8888`과 맞추어 수정 필요
- ⚠️ 현재 `scac-rtos/Makefile` 명령부가 탭이 아닌 공백 들여쓰기를 사용하고, `src/main.c`의 Health Check JSON 선언에도 문법 정리가 필요해 RTOS는 바로 통합 실행 가능한 상태가 아님
- ⚠️ `GET /api/meeting-rooms/**`가 Public으로 허용되어 있어 `/api/meeting-rooms/admin/reservations`도 현재 인증 없이 매칭됨. 관리자 전용 의도라면 Security 경로 정리 필요
- ⚠️ 실제 배포용 CORS는 현재 모든 Origin 허용 설정을 개발/시연 환경에 맞게 제한해야 함

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
- README v2.1 (2026.08.05)
- README v3.0 (2026.08.14)

---

## 📄 License

본 프로젝트는 K-Digital Training 교육 및 팀 프로젝트 목적으로 제작되었습니다.
