# 🛠️ SCAC Admin

> 스터디카페 운영자를 위한 React 기반 관리자 Frontend

SCAC Admin은 좌석, 스터디룸 예약, 이용권, 회원, 결제, 장치, 시스템 로그와 관리자 메모를 한 화면에서 관리하기 위한 웹 애플리케이션입니다.

사용자 키오스크 화면은 별도의 `scac-front` 프로젝트에서 관리합니다.

---

## ✨ 주요 기능

### 📊 관리자 대시보드

- 전체 좌석 / 이용 중 좌석 현황 조회
- 당일 결제 매출액 조회
- 장비 장애 건수 조회
- 당일 오류 로그 건수 조회
- 장치 현재 상태 조회
- 최근 시스템 로그 조회
- 자주 사용하는 관리 페이지 바로가기

### 💺 좌석 관리

- 전체 좌석 현황 조회
- 좌석 선택 및 상세 정보 확인
- 현재 이용자 정보 조회
- 좌석 상태 변경
- 관리자 강제 퇴실
- 전체 / 좌석별 이용 로그 조회

### 🏢 스터디룸 예약 관리

- 스터디룸 배치도 및 현재 상태 확인
- 날짜별 예약 현황 조회
- 스터디룸 상세 정보 확인
- 최근 예약 목록 조회
- 관리자 예약 취소
- 오늘부터 최대 14일까지의 예약 일정 확인

### 🎫 이용권 관리

- 시간권 / 기간권 탭 분리
- 이용권 목록 및 상세 조회
- 이용권 등록
- 이용권 정보 수정
- 판매 상태 변경
- 이용권 삭제

### 👤 회원 관리

- 전체 회원 / 비회원 목록 조회
- 사용자 ID 또는 전화번호 검색
- 사용자 상태 필터
- 사용자 역할 필터
- 사용자 상세 정보 조회
- 이용 정지 / 영구 정지 / 제재 해제 처리
- 제재 종료일 관리

### 💳 결제 내역 관리

- 전체 결제 이력 조회
- 결제 ID 또는 전화번호 검색
- 결제 상태 필터 (`PENDING`, `PAID`, `CANCELED`, `FAILED`)
- 결제수단 필터 (`CARD`, `TOSSPAY`)
- 결제일 시작일 / 종료일 필터
- 필터 결과 기준 결제 건수 및 완료 결제 금액 요약
- 10건 단위 페이지네이션
- 결제 상세 조회
- 취소 사유 입력 후 결제 취소
- 스터디룸 예약 결제의 예약 번호 표시

### 🖥️ 장치 관리

- 전체 장치 상태 조회
- 장치 상세 조회
- 장치별 로그 조회
- 장치 상태 변경
- 장치 유형: `PRINTER`, `CARD_READER`, `DOOR`, `NETWORK`
- 장치 상태: `NORMAL`, `ERROR`, `OFFLINE`

### 🧾 관리자 메모

- 인수인계 메모 전체 조회
- 메모 등록
- 메모 수정
- 메모 삭제

### 📋 시스템 로그

- 시스템 로그 전체 조회
- 로그 내용 / 사용자 ID / 관리자 ID 검색
- 로그 유형 및 중요도 필터
- 10건 단위 페이지네이션
- 로그 상세 페이지 이동
- 좌석 로그 API 연동

---

## 🛠 Tech Stack

- React 19.2.7
- JavaScript (ES6+)
- React Router 7.18.1
- Axios 1.18.1
- Zustand 5.0.14
- React Scripts 5.0.1
- CSS3

---

## 📂 Project Structure

```text
scac-admin
├── public
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
│   ├── components
│   │   ├── common
│   │   │   ├── Pagination.jsx
│   │   │   └── Summary.jsx
│   │   ├── seat
│   │   ├── AdminHeader.jsx
│   │   ├── AdminSidebar.jsx
│   │   └── HeaderTime.jsx
│   ├── constants
│   │   ├── SeatLayout.js
│   │   ├── device.js
│   │   ├── log.js
│   │   ├── payment.js
│   │   ├── seat.js
│   │   └── user.js
│   ├── data
│   │   └── admin_sidebar.json
│   ├── hooks
│   │   └── useResetStore.js
│   ├── layouts
│   │   └── AdminLayout.jsx
│   ├── pages
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
│   ├── routes
│   │   ├── AdminPrivateRoute.jsx
│   │   └── index.jsx
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
│   ├── styles
│   └── utils
│       ├── date.js
│       ├── formatter.js
│       ├── getSeatStyle.js
│       └── ticket.js
├── package.json
└── README.md
```

---

## 🗺 Routes

| Route          | Page                    | Description        |
| -------------- | ----------------------- | ------------------ |
| `/`            | `AdminMainPage`         | 관리자 대시보드    |
| `/seat`        | `AdminSeatPage`         | 전체 좌석 관리     |
| `/reservation` | `AdminReservationPage`  | 스터디룸 예약 관리 |
| `/ticket`      | `AdminTicketManagePage` | 이용권 관리        |
| `/user`        | `AdminUserPage`         | 회원 관리          |
| `/payment`     | `AdminPaymentPage`      | 결제 내역 관리     |
| `/device`      | `AdminDevicePage`       | 장치 관리          |
| `/memo`        | `AdminMemoPage`         | 관리자 메모        |
| `/log`         | `AdminLogPage`          | 시스템 로그 목록   |
| `/log/:logId`  | `AdminLogDetailPage`    | 시스템 로그 상세   |
| `/login`       | `AdminLoginPage`        | 관리자 로그인      |
| `*`            | `AdminErrorPage`        | 404 처리           |

---

## 🏗 Frontend Architecture

```text
Admin Page
    │
    ├── Page Components
    │      └── page/components
    │
    ├── Zustand Store
    │
    └── API Layer
           │
           ▼
     Axios Instance
           │
      Authorization
     Bearer AccessToken
           │
           ▼
   Spring Boot Backend
```

---

## 🌐 API Layer

모든 서버 요청은 `src/api`에서 관리하며 공통 `axiosInstance`를 사용합니다.

```javascript
const API_URL =
  process.env.REACT_APP_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:8888`;
```

### 주요 연동 API

| 기능               | Endpoint                                    |
| ------------------ | ------------------------------------------- |
| 관리자 로그인      | `POST /api/admin/auth/login`                |
| 관리자 토큰 재발급 | `POST /api/admin/auth/refresh`              |
| 대시보드           | `GET /api/admin/dashboard`                  |
| 회원               | `/api/admin/users`                          |
| 좌석 관리          | `/api/admin/seats`                          |
| 이용권 관리        | `/api/admin/tickets`                        |
| 결제 관리          | `/api/admin/payments`                       |
| 장치 관리          | `/api/admin/devices`                        |
| 시스템 로그        | `/api/admin/logs`                           |
| 메모               | `/api/admin/memos`                          |
| 관리자 예약 조회   | `GET /api/meeting-rooms/admin/reservations` |

---

## 🔐 Authentication

관리자 로그인 성공 시 다음 값을 `localStorage`에 저장합니다.

```text
accessToken
refreshToken
userInfo
```

`userInfo`에는 `adminId`, `loginId`, `role`, `isAdmin` 정보가 저장됩니다.

Axios Interceptor는:

1. Access Token을 `Authorization: Bearer ...`에 자동 첨부
2. 401 응답 시 Refresh Token으로 재발급 시도
3. 재발급 성공 시 원 요청 재시도
4. 실패 시 저장된 인증 정보를 초기화

백엔드 `/api/admin/**`는 `SUPER_ADMIN` 또는 `STAFF` 권한을 요구합니다.

---

## 📊 Common Components

### `Summary.jsx`

관리자 화면 상단의 요약 카드 공통 컴포넌트입니다.

주요 사용 페이지:

- 대시보드
- 결제 관리
- 회원 관리
- 로그 관리
- 장치 관리

### `Pagination.jsx`

목록 화면의 공통 페이지네이션에 사용합니다.

현재 결제와 로그 화면은 10건 단위로 페이지를 나눕니다.

---

## 🚀 Getting Started

### 1. Install

```bash
cd scac-admin
npm install
```

### 2. Environment Variables

`scac-admin/.env`:

```env
PORT=3001
REACT_APP_API_URL=http://localhost:8888
```

> 현재 Admin 소스에서 직접 사용하는 환경변수는 `REACT_APP_API_URL`입니다. `PORT`는 Create React App 개발 서버 포트 설정에 사용합니다.

> `scac-admin/.env example`에 남아 있는 `REACT_APP_TOSS_CLIENT_KEY`, `REACT_APP_PUBLIC_ORIGIN`은 현재 Admin 코드에서는 사용하지 않습니다.

### 3. Run

```bash
npm start
```

개발 주소:

```text
http://localhost:3001
```

---

## 📌 Coding Convention

| 대상              | 규칙             | 예시                                 |
| ----------------- | ---------------- | ------------------------------------ |
| Component         | PascalCase       | `AdminPaymentPage.jsx`               |
| 변수 / 함수       | camelCase        | `selectedPayment`, `fetchPayments()` |
| 이벤트 함수       | `handle` + 동작  | `handleCancelPayment()`              |
| Boolean           | `is` 접두어 권장 | `isLoading`, `isCanceling`           |
| Store             | 기능명 + Store   | `paymentStore.js`                    |
| API               | 기능명 + Api     | `paymentApi.js`                      |
| DB Table / Column | snake_case       | `payment_table`, `payment_id`        |

공통 API 통신, Store, 상수와 공통 컴포넌트는 각 전용 디렉터리에서 관리합니다.

---

## ⚠️ Current Notes

2026-08-14 코드 기준:

- ✅ 회원 관리 페이지가 실제 API와 연결됨
- ✅ 결제 관리가 `/api/admin/payments` 전용 API로 분리됨
- ✅ 결제 검색에 상태 / 결제수단 / 결제일 범위 필터 추가됨
- ✅ 결제 요약은 **전체 데이터가 아니라 현재 필터 결과**를 기준으로 계산됨
- ✅ 장치 관리와 관리자 메모 API가 연결됨
- ✅ 시스템 로그 `/api/admin/logs`가 연결됨
- ⚠️ 관리자 보호 라우트는 현재 주석 처리 상태
- ⚠️ `adminApi.getAdminProfile()`이 `/api/admin/profile`을 호출하지만 현재 백엔드에는 해당 Controller 경로가 보이지 않아 사용 전 확인 필요
- ⚠️ 관리자 예약 목록은 `/api/meeting-rooms/admin/reservations`를 사용하며, 현재 백엔드 `SecurityConfig`의 Public GET `/api/meeting-rooms/**`에 포함됩니다. 관리자 전용 API라면 경로 또는 Security Rule 정리가 필요
- ⚠️ 최종 배포 전 로그인 실패/토큰 만료/직접 URL 접근 흐름을 통합 테스트할 필요가 있음

---

## 🔗 Related Projects

```text
SCAC
├── scac-front    # 사용자 Kiosk Frontend
├── scac-admin    # 관리자 Frontend
├── scac-back     # Backend
└── scac-rtos     # RTOS 연동 실습
```

---

## 👥 Team

| Name   | Role                                                      |
| ------ | --------------------------------------------------------- |
| 김수영 | 회원 · 인증 · 권한 · 입실 비밀번호 관리 · DB 설계 및 관리 |
| 장원진 | 좌석 · 예약 · 입실/퇴실 · Git 저장소 및 배포 관리         |
| 이지현 | 결제 · 이용권 · 관리자 · 장치 관리 · 프로젝트 문서 관리   |

---

## 📝 Documentation Version

- **README v2.0**
- Last Updated: **2026.08.14**

### History

- README v1.0 (2026.07.21)
- README v1.1 (2026.07.22)
- README v2.0 (2026.08.14)

---

## 📄 License

본 프로젝트는 K-Digital Training 교육 및 팀 프로젝트 목적으로 제작되었습니다.
