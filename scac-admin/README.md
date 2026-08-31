# 🛠️ SCAC Admin

> 스터디카페 운영자를 위한 React 기반 관리자 Frontend

SCAC Admin은 스터디카페의 회원, 좌석, 스터디룸 예약, 이용권, 결제, 장치, 시스템 로그 및 관리자 메모를 통합 관리하기 위한 React 애플리케이션입니다.

사용자 키오스크는 별도의 `scac-front` 프로젝트에서 관리하며,
Spring Boot Backend의 관리자 전용 API와 JWT 기반 인증을 사용합니다.

---

## ✨ 주요 기능

### 📊 관리자 대시보드

- 전체 좌석 현황 조회
- 이용 중 좌석 현황 조회
- 당일 결제 및 매출 정보 확인
- 장치 상태 요약
- 최근 시스템 로그 및 장치 오류 현황
- 주요 관리 페이지 바로가기

### 💺 좌석 관리

- 전체 좌석 현황 조회
- 좌석 상세 정보 확인
- 현재 좌석 이용자 조회
- 좌석 상태 변경
- 관리자 강제 퇴실
- 좌석 이용 로그 확인

### 🏢 스터디룸 예약 관리

- 스터디룸 배치 및 상태 확인
- 날짜별 예약 현황 조회
- 스터디룸 상세 조회
- 예약 목록 조회
- 예약 상세 정보 확인
- 관리자 예약 취소
- 예약 상태 확인

### 🎫 이용권 관리

- 시간권 / 기간권 탭 분리
- 이용권 목록 조회
- 이용권 상세 조회
- 이용권 신규 등록
- 이용권 수정
- 판매 상태 변경
- 이용권 삭제

### 👤 회원 관리

- 전체 회원 / 비회원 조회
- 사용자 ID 검색
- 전화번호 검색
- 사용자 상태 필터
- 사용자 역할 필터
- 사용자 상세 정보 조회
- 이용 정지
- 영구 정지
- 제재 해제
- 제재 종료일 관리

### 💳 결제 관리

> 결제 이력 보존을 위해 관리자 화면에서는 결제 삭제 대신 취소 기능을 제공합니다.

- 전체 결제 이력 조회
- 결제 ID 검색
- 전화번호 검색
- 결제 상태 필터
  - `PENDING`
  - `PAID`
  - `CANCELED`
  - `FAILED`
- 결제수단 필터
  - `CARD`
  - `TOSSPAY`
- 결제 시작일 / 종료일 필터
- 필터 결과 기준 결제 건수 요약
- 필터 결과 기준 완료 결제 금액 요약
- 페이지네이션
- 결제 상세 조회
- 이용권 / 스터디룸 결제 구분
- 스터디룸 예약 번호 확인
- 취소 사유 입력 후 관리자 결제 취소

### 🖥️ 장치 관리

- 운영 중 장치 목록 조회
- 비활성 장치 포함 조회
- 전체 / 정상 / 점검 필요 / 오프라인 장치 Summary
- 장치 상세 조회
- 장치별 로그 조회
- 장치 등록
- 장치 정보 수정
- 장치 삭제
- 장치 활성화 / 비활성화
- 관리자 장치 상태 변경
- 장치 상태 주기적 자동 갱신
- 장치 `ERROR` 발생 시 관리자 알림

장치 유형:

```text
PRINTER
CARD_READER
DOOR
NETWORK
```

장치 상태:

```text
NORMAL
ERROR
OFFLINE
```

> 장치 로그가 존재하는 장치는 Backend 정책상 삭제할 수 없습니다.

### 📋 시스템 로그

- 시스템 로그 전체 조회
- 로그 내용 검색
- 사용자 ID 검색
- 관리자 ID 검색
- 로그 유형 필터
- 중요도 필터
- 페이지네이션
- 로그 상세 조회
- 좌석 로그 연동

### 🧾 관리자 메모

- 인수인계 메모 전체 조회
- 메모 상세 조회
- 메모 등록
- 메모 수정
- 메모 삭제

### 🔐 관리자 계정 관리

- 관리자 계정 목록 조회
- 관리자 계정 상세 조회
- 신규 `STAFF` 계정 생성
- 관리자 정보 수정
- 관리자 역할 수정
- 관리자 비밀번호 수정
- 관리자 계정 삭제
- `SUPER_ADMIN` 전용 접근 제어

### 관리자 권한

| 기능                       | STAFF | SUPER_ADMIN |
| -------------------------- | :---: | :---------: |
| 대시보드 및 운영 현황 조회 |  ✅   |     ✅      |
| 좌석·예약·이용권 관리      |  ✅   |     ✅      |
| 회원·결제·장치 관리        |  ✅   |     ✅      |
| 시스템 로그 및 메모 관리   |  ✅   |     ✅      |
| 관리자 계정 관리           |  ❌   |     ✅      |

`/account`와 `/api/admin/accounts/**`는 `SUPER_ADMIN`만 접근할 수 있습니다.

---

## 🛠 Tech Stack

| Category         | Technology              |
| ---------------- | ----------------------- |
| Framework        | React 19.2.7            |
| Language         | JavaScript ES6+         |
| Routing          | React Router DOM 7.18.1 |
| HTTP Client      | Axios 1.18.1            |
| State Management | Zustand 5.0.14          |
| Build            | React Scripts 5.0.1     |
| Style            | CSS3                    |

---

## 📂 Project Structure

```text
scac-admin
│
├── public
│
├── src
│   ├── api
│   │   ├── adminApi.js
│   │   ├── adminUserApi.js
│   │   ├── authApi.js
│   │   ├── axiosInstance.js
│   │   ├── deviceApi.js
│   │   ├── memoApi.js
│   │   ├── paymentApi.js
│   │   ├── reservationApi.js
│   │   ├── roomApi.js
│   │   ├── seatApi.js
│   │   ├── ticketApi.js
│   │   └── userApi.js
│   │
│   ├── components
│   │   ├── common
│   │   │   ├── Pagination.jsx
│   │   │   ├── Summary.jsx
│   │   │   └── LoadingOverlay.jsx
│   │   ├── seat
│   │   ├── AdminHeader.jsx
│   │   ├── AdminSidebar.jsx
│   │   └── HeaderTime.jsx
│   │
│   ├── constants
│   │   ├── SeatLayout.js
│   │   ├── device.js
│   │   ├── log.js
│   │   ├── payment.js
│   │   ├── seat.js
│   │   └── user.js
│   │
│   ├── data
│   │   └── admin_sidebar.json
│   │
│   ├── hooks
│   │   └── useResetStore.js
│   │
│   ├── layouts
│   │   └── AdminLayout.jsx
│   │
│   ├── pages
│   │   ├── Account
│   │   ├── Device
│   │   ├── Error
│   │   ├── Log
│   │   ├── Login
│   │   ├── Main
│   │   ├── Memo
│   │   ├── Payment
│   │   ├── Reservation
│   │   ├── Seat
│   │   ├── Ticket
│   │   └── User
│   │
│   ├── routes
│   │   ├── AdminPrivateRoute.jsx
│   │   ├── SuperAdminRoute.jsx
│   │   └── index.jsx
│   │
│   ├── store
│   │   ├── adminUserStore.js
│   │   ├── authStore.js
│   │   ├── deviceStore.js
│   │   ├── paymentStore.js
│   │   ├── reservationStore.js
│   │   ├── roomStore.js
│   │   ├── seatStore.js
│   │   ├── ticketStore.js
│   │   └── userStore.js
│   │
│   ├── styles
│   │
│   └── utils
│       ├── date.js
│       ├── formatter.js
│       ├── getSeatStyle.js
│       └── ticket.js
│
├── .env.example
├── package.json
└── README.md
```

---

## 🗺 Routes

| Route          | Page                    | Description        |
| -------------- | ----------------------- | ------------------ |
| `/`            | `AdminMainPage`         | 관리자 대시보드    |
| `/seat`        | `AdminSeatPage`         | 좌석 관리          |
| `/reservation` | `AdminReservationPage`  | 스터디룸 예약 관리 |
| `/ticket`      | `AdminTicketManagePage` | 이용권 관리        |
| `/user`        | `AdminUserPage`         | 회원 관리          |
| `/payment`     | `AdminPaymentPage`      | 결제 관리          |
| `/device`      | `AdminDevicePage`       | 장치 관리          |
| `/memo`        | `AdminMemoPage`         | 관리자 메모        |
| `/log`         | `AdminLogPage`          | 시스템 로그        |
| `/log/:logId`  | `AdminLogDetailPage`    | 시스템 로그 상세   |
| `/account`     | `AdminAccountPage`      | 관리자 계정 관리   |
| `/login`       | `AdminLoginPage`        | 관리자 로그인      |
| `*`            | `AdminErrorPage`        | 404 처리           |

`/account`는 `SUPER_ADMIN`만 접근할 수 있습니다.

---

## 🏗 Frontend Architecture

```text
Admin
  │
  ▼
AdminPrivateRoute
  │
  ▼
AdminLayout
  │
  ├───────────────┐
  ▼               ▼
Page Components  Zustand Store
  │               │
  └───────┬───────┘
          ▼
       API Layer
          │
          ▼
    Axios Instance
          │
          │ Authorization
          │ Bearer AccessToken
          ▼
   Spring Boot Backend
```

관리자 계정 페이지는 추가로:

```text
AdminPrivateRoute
      │
      ▼
SuperAdminRoute
      │
      ▼
AdminAccountPage
```

구조로 접근 권한을 제한합니다.

---

## 🔐 Authentication

관리자 로그인 성공 시 인증 정보를 저장하고 관리자 전용 화면에 접근합니다.

```text
Admin Login
    │
    ▼
Access Token
Refresh Token
userInfo
    │
    ▼
localStorage
```

`userInfo`에는 관리자 ID, 로그인 ID, 역할 등의 정보가 저장됩니다.

Axios Interceptor:

1. Access Token을 `Authorization: Bearer {token}` Header에 자동 첨부
2. API 응답이 `401 Unauthorized`인 경우 Refresh Token으로 재발급 시도
3. 재발급 성공 시 기존 요청 재시도
4. 재발급 실패 시 인증 정보 초기화

Backend 관리자 권한:

```text
SUPER_ADMIN
STAFF
```

`/api/admin/accounts/**`는 `SUPER_ADMIN`만 접근할 수 있습니다.

---

## 🌐 API Layer

모든 서버 요청은 `src/api`에서 관리하며 공통 `axiosInstance`를 사용합니다.

```javascript
const API_URL =
  process.env.REACT_APP_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:8888`;
```

### 주요 API

| 기능               | Endpoint                                |
| ------------------ | --------------------------------------- |
| 관리자 로그인      | `POST /api/admin/auth/login`            |
| 관리자 토큰 재발급 | `POST /api/admin/auth/refresh`          |
| 관리자 로그아웃    | `POST /api/admin/auth/logout`           |
| 대시보드           | `GET /api/admin/dashboard`              |
| 관리자 계정        | `/api/admin/accounts`                   |
| 회원 관리          | `/api/admin/users`                      |
| 좌석 관리          | `/api/admin/seats`                      |
| 이용권 관리        | `/api/admin/tickets`                    |
| 결제 관리          | `/api/admin/payments`                   |
| 장치 관리          | `/api/admin/devices`                    |
| 시스템 로그        | `/api/admin/logs`                       |
| 메모               | `/api/admin/memos`                      |
| 관리자 예약        | `/api/meeting-rooms/admin/reservations` |

---

## 🖥 Device Management Flow

RTOS Client에서 전달한 Health Check 정보는 Backend를 통해 관리자 장치관리 화면에 반영됩니다.

```text
RTOS Client
    │
    │ POST /api/devices/health
    ▼
Spring Boot
    │
    ▼
Device / DeviceLog
    │
    ▼
GET /api/admin/devices
    │
    ▼
Admin Device Page
```

관리자 화면은 장치 상태를 주기적으로 다시 조회하여 최신 상태를 반영합니다.

```text
NORMAL
ERROR
OFFLINE
```

`ERROR` 장치가 감지되면 관리자에게 확인 알림을 표시합니다.

---

## 📊 Common Components

### `Summary.jsx`

각 관리 화면의 주요 현황을 카드 형태로 표시합니다.

사용 예:

- 대시보드
- 회원 관리
- 결제 관리
- 로그 관리
- 장치 관리

### `Pagination.jsx`

목록 데이터의 페이지 이동을 위한 공통 컴포넌트입니다.

### `LoadingOverlay.jsx`

기존 영역의 크기를 유지하면서 로딩 상태를 표시하기 위한 Overlay 컴포넌트입니다.

---

## 📌 Coding Convention

### Naming Convention

| 대상        | 규칙           | 예시                                 |
| ----------- | -------------- | ------------------------------------ |
| Component   | PascalCase     | `AdminPaymentPage.jsx`               |
| 변수 / 함수 | camelCase      | `selectedPayment`, `fetchPayments()` |
| 이벤트 함수 | handle + 동작  | `handleCancelPayment()`              |
| Boolean     | is 접두어      | `isLoading`, `isCanceling`           |
| Store       | 기능명 + Store | `paymentStore.js`                    |
| API         | 기능명 + Api   | `paymentApi.js`                      |
| DB Table    | snake_case     | `payment_table`                      |
| DB Column   | snake_case     | `payment_id`                         |

공통 API, Store, 상수 및 재사용 컴포넌트는 각 전용 디렉터리에서 관리합니다.

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd scac-admin
npm install
```

### 2. Environment Variables

`.env` 파일을 생성합니다.

```env
PORT=3001
REACT_APP_API_URL=http://localhost:8888
```

> 실제 `.env` 파일은 Git 저장소에 포함하지 않습니다.

### 3. Start Development Server

```bash
npm start
```

개발 주소:

```text
http://localhost:3001
```

`REACT_APP_API_URL`이 없을 경우 현재 브라우저 hostname의 `:8888`을 API Server 주소로 사용합니다.

---

## 🔗 Related Projects

```text
SCAC
├── scac-front     # 사용자 Kiosk Frontend
├── scac-admin     # 관리자 Frontend
├── scac-back      # Spring Boot Backend
└── scac-rtos      # FreeRTOS POSIX Client
```

---

## 👥 Team

> 관리자 Frontend는 기능별 화면과 API 연동을 분담하여 공동 구현했습니다.

| Name   | Admin Contribution                                                                   |
| ------ | ------------------------------------------------------------------------------------ |
| 김수영 | 관리자 인증·권한 · 회원관리 연동 · 시스템 로그 API 및 후반 기능 고도화               |
| 장원진 | 관리자 좌석·스터디룸 예약 화면 및 관련 API 연동                                      |
| 이지현 | 관리자 Frontend 초기 구조와 공통 UI · 결제·이용권·장치·계정 등 주요 화면 및 API 연동 |

---

## 📅 Development Period

**2026.07.03 ~ 2026.09.02**

---

## 📝 Documentation Version

**README v3.1**

**Last Updated: 2026.08.31**

### History

- README v1.0 — 2026.07.21
- README v1.1 — 2026.07.22
- README v2.0 — 2026.08.14
- README v3.0 — 2026.08.21
- README v3.1 — 2026.08.31
  - 최종 구현 기능 및 관리자 권한 현행화
  - 결제 이력 보존 정책 명시
  - 실행 환경 및 프로젝트 안내 최신화

---

## 📄 Project Notice

본 프로젝트는 K-Digital Training 교육 및 팀 프로젝트 목적으로 제작되었습니다.
