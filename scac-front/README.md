# 📚 SCAC Frontend

> React 기반 스터디카페 사용자 키오스크 Frontend

SCAC Frontend는 사용자가 스터디카페 키오스크를 통해
회원가입, 로그인, 이용권 구매, 결제, 좌석 선택, 입·퇴실 및 스터디룸 예약 등의 기능을 이용할 수 있도록 구현한 React 애플리케이션입니다.

Spring Boot Backend와 연동하며, RTOS 장치 명령 API를 통해
카드 리딩, 영수증 출력 및 출입문 제어 기능을 처리합니다.

관리자 시스템은 별도의 `scac-admin` 프로젝트로 분리하여 관리합니다.

---

## ✨ 주요 기능

### 👤 회원

- 회원가입
- 비회원 정보 입력
- 로그인
- 내 정보 조회
- 로그아웃
- Access Token / Refresh Token 기반 인증

### 🎫 이용권

- 시간권 조회 및 선택
- 기간권 조회 및 선택
- 이용권 구매
- 보유 이용권 확인
- 결제 완료 시 이용권 발급

### 💳 결제

- 결제 수단 선택
- CARD Mock 결제
- Toss Payments 간편 결제
- RTOS `CARD_READING` 명령 연동
- 결제 진행 상태 표시
- 결제 성공 / 실패 처리
- 결제 완료 후 RTOS 영수증 출력

### 💺 좌석

- 전체 좌석 현황 조회
- 좌석 선택
- 입실
- 퇴실
- 외출
- 외출 복귀
- 입·퇴실 시 RTOS 출입문 제어 명령 연동

### 🏢 스터디룸

- 스터디룸 목록 조회
- 스터디룸 상세 조회
- 날짜별 예약 가능 시간 조회
- 시작 / 종료 시간 선택
- 스터디룸 예약
- 예약 정보 확인
- 스터디룸 결제
- 결제 전 임시 예약 처리

### 🖨 RTOS 장치 연동

- 카드 리딩 명령 생성
- 출입문 개방 명령 생성
- 영수증 출력 명령 생성
- 장치 명령 처리 결과 Polling
- Spring Boot ↔ RTOS 장치 명령 연동

---

## 🛠 Tech Stack

| Category         | Technology        |
| ---------------- | ----------------- |
| Framework        | React             |
| Language         | JavaScript ES6+   |
| Routing          | React Router DOM  |
| HTTP Client      | Axios             |
| State Management | Zustand           |
| Form             | React Hook Form   |
| Payment          | Toss Payments SDK |
| QR               | QRCode React      |
| Style            | CSS3              |
| Build            | React Scripts     |

---

## 📂 Project Structure

```text
scac-front
│
├── public
│   ├── icons
│   │   ├── admin
│   │   ├── common
│   │   ├── payment
│   │   └── reservation
│   ├── images
│   ├── logo
│   └── logo.png
│
├── src
│   ├── api                        # API 통신
│   │   ├── authApi.js
│   │   ├── axiosInstance.js
│   │   ├── checkinApi.js
│   │   ├── deviceApi.js
│   │   ├── paymentApi.js
│   │   ├── reservationApi.js
│   │   ├── roomApi.js
│   │   ├── seatApi.js
│   │   ├── ticketApi.js
│   │   ├── ticketusageApi.js
│   │   └── userApi.js
│   │
│   ├── components                 # 공통 컴포넌트
│   │   ├── button
│   │   │   ├── CancelButton.jsx
│   │   │   ├── CloseButton.jsx
│   │   │   └── SelectButton.jsx
│   │   │
│   │   ├── common
│   │   │   └── KioskErrorState.jsx
│   │   │
│   │   ├── modal
│   │   │   ├── ChooseInModal.jsx
│   │   │   ├── InOutModal.jsx
│   │   │   └── KioskAlertModal.jsx
│   │   │
│   │   └── HeaderTime.jsx
│   │
│   ├── constants                  # 상수 관리
│   │   ├── payment.js
│   │   └── SeatLayout.js
│   │
│   ├── hooks                      # Custom Hook
│   │   └── useResetStore.js
│   │
│   ├── layouts                    # 공통 레이아웃
│   │   └── KioskLayout.jsx
│   │
│   ├── pages                      # 페이지 컴포넌트
│   │   ├── Error
│   │   ├── Login
│   │   ├── Main
│   │   ├── MyPage
│   │   ├── Payment
│   │   ├── Reservation
│   │   ├── Seat
│   │   ├── Signup
│   │   └── Ticket
│   │
│   ├── routes                     # React Router 설정
│   │   └── index.jsx
│   │
│   ├── store                      # Zustand 전역 상태 관리
│   │   ├── authStore.js
│   │   ├── checkInStore.js
│   │   ├── paymentStore.js
│   │   ├── reservationStore.js
│   │   ├── roomStore.js
│   │   ├── seatStore.js
│   │   ├── ticketStore.js
│   │   └── userStore.js
│   │
│   ├── styles                     # 공통 및 전역 스타일
│   │
│   └── utils                      # 공통 유틸리티 함수
│
├── .env.example
├── .prettierrc
├── .gitignore
├── package.json
└── README.md
```

### 📌 Directory Convention

- 공통으로 사용하는 컴포넌트는 `components`에 작성합니다.
- 특정 페이지에서만 사용하는 컴포넌트는 해당 페이지의 `components` 폴더에 작성합니다.
- API 요청은 `api` 폴더에서 기능별로 분리하여 관리합니다.
- Zustand를 사용하는 전역 상태는 `store` 폴더에서 기능별로 분리하여 관리합니다.
- 공통 스타일은 `styles` 폴더에서 관리합니다.
- 특정 페이지에 종속된 스타일은 해당 페이지의 `css` 폴더에서 관리합니다.

### 📌 Directory Description

| Directory    | Description                                 |
| ------------ | ------------------------------------------- |
| `api`        | Axios Instance 및 기능별 API 요청 관리      |
| `public`     | 이미지, 아이콘, 로고 등 정적 리소스         |
| `components` | 여러 페이지에서 재사용 가능한 공통 컴포넌트 |
| `constants`  | 프로젝트 전역에서 사용하는 상수             |
| `hooks`      | Custom Hook                                 |
| `layouts`    | 키오스크 공통 레이아웃                      |
| `pages`      | 기능 및 화면 단위 Page 컴포넌트             |
| `routes`     | React Router 경로 관리                      |
| `store`      | Zustand 전역 상태 관리                      |
| `styles`     | 공통 및 전역 CSS                            |
| `utils`      | 날짜, 포맷팅 등 공통 유틸리티 함수          |

---

## 🏗 Frontend Architecture

```text
User
 │
 ▼
Page Components
 │
 ├───────────────┐
 ▼               ▼
Components     Zustand Store
 │               │
 └───────┬───────┘
         ▼
      API Layer
         │
         ▼
   Axios Instance
         │
         ▼
   Spring Boot API
         │
         ├──────────────▶ MySQL
         │
         ▼
      RTOS Client
         │
         ├── CARD_READING
         ├── PRINT_RECEIPT
         └── DOOR_OPEN
```

---

## 🔐 Authentication Flow

SCAC Frontend는 JWT 기반 인증을 사용합니다.

```text
Login
  ↓
Access Token / Refresh Token 발급
  ↓
Zustand + Local Storage 저장
  ↓
Axios Request Interceptor
  ↓
Authorization: Bearer {AccessToken}
```

Access Token 만료 등으로 API 요청에서 `401 Unauthorized`가 발생하면
Refresh Token을 이용하여 새로운 Access Token 발급을 시도합니다.

```text
API Request
    ↓
401 Unauthorized
    ↓
Refresh Token으로 Access Token 재발급
    ↓
성공 ──▶ 기존 API 요청 재시도
    │
    └ 실패 ──▶ 인증 정보 제거 → 로그인 화면 이동
```

---

## 🌐 API Convention

모든 API 요청 함수는 `api` 폴더에서 관리합니다.

- 공통 Axios Instance인 `axiosInstance.js`를 사용합니다.
- 컴포넌트 내부에서 직접 Axios Instance를 생성하지 않습니다.
- 기능별 API 파일을 분리하여 관리합니다.
- Access Token은 Request Interceptor에서 자동으로 Authorization Header에 추가합니다.
- `401` 발생 시 Refresh Token을 이용하여 Access Token 재발급을 시도합니다.
- Access Token 재발급 성공 시 기존 API 요청을 자동으로 재시도합니다.
- 재발급 실패 시 인증 정보를 제거하고 로그인 화면으로 이동합니다.

```text
api
├── authApi.js
├── axiosInstance.js
├── checkinApi.js
├── deviceApi.js
├── paymentApi.js
├── reservationApi.js
├── roomApi.js
├── seatApi.js
├── ticketApi.js
├── ticketusageApi.js
└── userApi.js
```

---

## 🖨 RTOS Command Flow

키오스크에서 장치 동작이 필요한 경우 Spring Boot Backend를 통해
RTOS 클라이언트에 명령을 전달합니다.

```text
React Kiosk
    │
    │ POST /api/commands
    ▼
Spring Boot
    │
    │ Command 생성
    │ PENDING
    ▼
RTOS Client
    │
    ├── CARD_READING
    ├── PRINT_RECEIPT
    └── DOOR_OPEN
    │
    │ 처리 결과
    ▼
Spring Boot
    │
    ├── COMPLETED
    └── FAILED
    │
    ▼
React Kiosk
```

### 장치 명령

| Command         | Description                   |
| --------------- | ----------------------------- |
| `CARD_READING`  | 카드 리더기 동작 및 카드 인식 |
| `PRINT_RECEIPT` | 결제 완료 후 영수증 출력      |
| `DOOR_OPEN`     | 입·퇴실 시 출입문 개방        |

RTOS 클라이언트는 별도로 장치 Health Check를 Spring Boot에 전송하며,
장치 상태 모니터링은 관리자 Frontend인 `scac-admin`에서 확인할 수 있습니다.

---

## 🗂 Zustand Convention

기능별 Store를 생성합니다.

- 하나의 Store는 하나의 주요 역할을 담당하도록 구성합니다.
- 여러 페이지에서 공유해야 하는 상태를 Store에서 관리합니다.

```text
store
├── authStore.js
├── checkInStore.js
├── paymentStore.js
├── reservationStore.js
├── roomStore.js
├── seatStore.js
├── ticketStore.js
└── userStore.js
```

---

## 🧩 Component Convention

공통으로 재사용되는 컴포넌트는 `src/components`에서 관리합니다.

```text
components
├── button
├── common
├── modal
└── HeaderTime.jsx
```

특정 기능이나 페이지에서만 사용하는 컴포넌트는 해당 페이지 내부에서 관리합니다.

```text
pages
└── Payment
    ├── components
    ├── css
    └── ...
```

---

## 📌 Coding Convention

### 1. Naming Convention

| 대상         | 규칙          | 예시                                        |
| ------------ | ------------- | ------------------------------------------- |
| 변수         | camelCase     | `userName`                                  |
| 함수         | camelCase     | `getUserInfo()`                             |
| 이벤트 함수  | handle + 동사 | `handleLoginSubmit()`, `handleSeatSelect()` |
| Boolean 변수 | is + 명사     | `isLoggedIn`, `isSelected`                  |
| Component    | PascalCase    | `TicketPage.jsx`, `PaymentResultCard.jsx`   |
| Custom Hook  | use + 기능명  | `useResetStore.js`                          |
| Store        | camelCase     | `ticketStore.js`, `seatStore.js`            |
| API          | camelCase     | `paymentApi.js`, `seatApi.js`               |
| DB Table     | snake_case    | `payment_table`                             |
| DB Column    | snake_case    | `ticket_id`, `payment_id`                   |
| HTML id      | snake_case    | `login_form`                                |
| HTML class   | snake_case    | `payment_container`                         |

### 2. Code Style

| 항목          | 규칙               |
| ------------- | ------------------ |
| 들여쓰기      | Space 2칸          |
| 세미콜론      | 사용 (`;`)         |
| 문자열        | Single Quote (`'`) |
| JSX Attribute | Double Quote (`"`) |

> Prettier 설정은 프로젝트의 `.prettierrc`를 기준으로 적용합니다.

### 3. Event Function

버튼 클릭, 입력 변경 등 이벤트를 처리하는 함수는 `handle` 접두어를 사용합니다.

```javascript
const handleLoginSubmit = () => {};

const handleSeatSelect = () => {};

const handlePayment = () => {};
```

### 4. Boolean Variable

참 / 거짓을 나타내는 변수는 `is` 접두어를 사용합니다.

```javascript
const isLoggedIn = true;
const isSelected = true;
const isPaymentComplete = false;
```

---

## ⭐ Git Convention

### 🌿 Branch Convention

```text
feature/login
feature/payment
feature/ticket
feature/seat
feature/reservation

fix/payment-error
fix/login-error

docs/readme
```

### ✍ Commit Convention

| Type       | Description             |
| ---------- | ----------------------- |
| `feat`     | 새로운 기능 추가        |
| `fix`      | 버그 수정               |
| `style`    | CSS 및 코드 스타일 수정 |
| `refactor` | 코드 리팩토링           |
| `docs`     | 문서 수정               |
| `chore`    | 환경설정 및 기타 변경   |

예시:

```text
feat: 로그인 기능 추가
feat: 좌석 선택 기능 추가
fix: 결제 오류 수정
docs: README 수정
style: 버튼 CSS 수정
```

---

## 🚀 Getting Started

### 1. Repository Clone

```bash
git clone <repository-url>
cd scac-front
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

프로젝트 루트에 `.env` 파일을 생성합니다.

```env
PORT=3000

REACT_APP_API_URL=http://localhost:8888
REACT_APP_TOSS_CLIENT_KEY=토스_테스트_클라이언트_키
```

다른 PC 또는 태블릿에서 개발 서버에 접근해야 하는 경우 환경에 따라 다음 설정을 사용할 수 있습니다.

```env
HOST=0.0.0.0
```

> 실제 `.env` 파일과 API Key는 Git 저장소에 포함하지 않습니다.
> 환경 변수 예시는 `.env.example` 파일을 참고합니다.

### 4. Start Development Server

```bash
npm start
```

기본 개발 서버:

```text
http://localhost:3000
```

---

## 🔗 Related Projects

SCAC는 사용자 키오스크, 관리자 시스템, Backend 및 RTOS 클라이언트로 구성됩니다.

```text
SCAC
├── scac-front     # 사용자 키오스크 Frontend
├── scac-admin     # 관리자 PC Frontend
├── scac-back      # Spring Boot Backend
└── scac-rtos      # FreeRTOS POSIX Device Client
```

`scac-front`는 키오스크 사용자 기능을 담당하며,
관리자 기능은 별도의 `scac-admin` 프로젝트에서 관리합니다.

장치 명령 및 Health Check 처리는 `scac-back`과 `scac-rtos` 간 연동을 통해 수행합니다.

---

## 👥 Team

| Name   | Role                                                      |
| ------ | --------------------------------------------------------- |
| 김수영 | 회원 · 인증 · 권한 · DB 설계 및 관리 · 입실 비밀번호 관리 |
| 장원진 | 좌석 · 예약 · 입실/퇴실 · Git 저장소 관리 · 배포 관리     |
| 이지현 | 결제 · 이용권 · 관리자 · 프로젝트 문서 및 QA 관리         |

---

## 📝 Documentation Version

**README v3.0**
**Last Updated: 2026.08.21**

### History

- README v1.0 — 2026.07.03
- README v1.1 — 2026.07.11
- README v1.2 — 2026.07.14
- README v1.3 — 2026.07.19
- README v2.0 — 2026.07.22
- README v3.0 — 2026.08.21
  - 현재 프로젝트 구조 반영
  - 결제 및 스터디룸 예약 흐름 현행화
  - JWT Refresh Token 처리 반영
  - RTOS 카드 리딩 / 영수증 출력 / 출입문 제어 연동 반영

---

## 📄 License

본 프로젝트는 K-Digital Training 교육 및 팀 프로젝트 목적으로 제작되었습니다.
