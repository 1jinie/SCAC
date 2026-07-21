# 🛠️ SCAC Admin

> React 기반 스터디카페 관리자 Frontend 프로젝트

SCAC Admin은 스터디카페 운영자가 관리자 웹을 통해  
좌석, 스터디룸 예약, 이용권, 회원, 장치, 결제 내역, 시스템 로그 및 관리자 메모를 관리할 수 있도록 구현한 React 애플리케이션입니다.

키오스크 사용자 화면은 별도의 `scac-front` 프로젝트로 분리하여 관리합니다.

---

## ✨ 주요 기능

### 📊 관리자 대시보드

- 전체 좌석 및 사용 중 좌석 현황 확인
- 스터디룸 예약 확인 필요 건수 표시
- 장치 이상 상태 확인
- 주요 장치 상태 조회
- 최근 시스템 로그 조회
- 자주 사용하는 관리자 기능 바로가기

### 💺 좌석 관리

- 전체 좌석 현황 조회
- 좌석별 상세 정보 확인
- 좌석 상태 변경
- 좌석 이용자 정보 입력
- 좌석 이용 로그 조회

### 🏢 스터디룸 예약 관리

- 스터디룸 예약 목록 조회
- 예약 상세 정보 확인
- 예약 상태 변경
- 예약 일정 및 이용 상태 관리

### 🎫 이용권 관리

- 이용권 목록 및 상세 정보 조회
- 이용권 가격 변경
- 이용권 판매 여부 설정
- 시간권 및 기간권 관리

### 👤 회원 관리

- 회원 목록 및 상세 정보 조회
- 전화번호 및 조건별 회원 검색
- 회원 권한과 이용 상태 변경
- 이용 정지 및 제재 기간 관리

### 💳 결제 내역 관리

- 전체 결제 내역 조회
- 결제 상태별 검색 및 필터링
- 결제 상세 정보 확인
- 결제 취소 처리
- 결제 상태별 건수 및 총 결제 금액 확인

### 🖥️ 장치 관리

- 키오스크 및 연결 장치 목록 조회
- 장치 종류와 현재 상태 확인
- 정상·점검 필요·오류 상태 관리
- 마지막 장치 점검 시간 확인

### 🧾 메모 관리

- 관리자 메모 작성과 조회
- 운영 관련 전달 사항 관리

---

## 🛠 Tech Stack

- React
- JavaScript (ES6+)
- React Router
- Axios
- Zustand
- React Hook Form
- CSS3

---

## 📂 Project Structure

```text
scac-admin
│
├── public                         # 정적 리소스
│   ├── fonts
│   ├── icons
│   ├── images
│   ├── logo
│   ├── admin_seat_log_dummy.csv
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
│
├── src
│   ├── api                        # API 통신
│   │   ├── adminApi.js
│   │   ├── adminUserApi.js
│   │   ├── authApi.js
│   │   ├── axiosInstance.js
│   │   ├── paymentApi.js
│   │   ├── reservationApi.js
│   │   ├── seatApi.js
│   │   ├── ticketApi.js
│   │   └── userApi.js
│   │
│   ├── components                 # 공통 컴포넌트
│   │   ├── common
│   │   │   ├── css
│   │   │   │   └── AdminSummary.css
│   │   │   ├── Pagination.jsx
│   │   │   └── Summary.jsx
│   │   ├── seat
│   │   │   ├── css
│   │   │   ├── SeatItem.jsx
│   │   │   └── SeatList.jsx
│   │   ├── AdminHeader.jsx
│   │   ├── AdminSidebar.jsx
│   │   └── HeaderTime.jsx
│   │
│   ├── constants                  # 상수 관리
│   │   ├── device.js
│   │   ├── payment.js
│   │   ├── seat.js
│   │   └── user.js
│   │
│   ├── data                       # 개발 및 테스트용 임시 데이터
│   ├── hooks
│   │   └── useResetStore.js
│   ├── layouts
│   │   └── AdminLayout.jsx
│   │
│   ├── pages                      # 관리자 기능별 페이지
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
│   │   └── index.jsx
│   │
│   ├── store                      # Zustand 전역 상태 관리
│   │   ├── adminUserStore.js
│   │   ├── authStore.js
│   │   ├── checkInStore.js
│   │   ├── deviceStore.js
│   │   ├── paymentStore.js
│   │   ├── reservationStore.js
│   │   ├── seatStore.js
│   │   ├── ticketStore.js
│   │   └── userStore.js
│   │
│   ├── styles
│   │   ├── common.css
│   │   ├── global.css
│   │   ├── reset.css
│   │   └── variables.css
│   │
│   ├── utils
│   │   ├── date.js
│   │   ├── formatter.js
│   │   ├── getSeatStyle.js
│   │   └── ticket.js
│   │
│   ├── App.js
│   └── index.js
│
├── .env
├── .gitignore
├── .prettierrc
├── package.json
└── README.md
```

> 📌 여러 관리자 페이지에서 재사용하는 컴포넌트는 `components/common`에 작성합니다.
>
> 📌 특정 페이지에서만 사용하는 컴포넌트는 해당 페이지의 `components` 폴더에 작성합니다.
>
> 📌 상태 코드와 화면 표시 라벨은 `constants` 폴더에서 관리합니다.
>
> 📌 공통 스타일은 `styles`에서, 페이지 전용 스타일은 각 페이지의 `css` 폴더에서 관리합니다.

---

## 📌 Directory Description

| Directory    | Description                                    |
| ------------ | ---------------------------------------------- |
| `api`        | Axios Instance 및 기능별 API 요청 관리         |
| `public`     | 이미지, 아이콘, 폰트 등 정적 리소스            |
| `components` | 여러 페이지에서 재사용 가능한 공통 컴포넌트    |
| `constants`  | 프로젝트 전역에서 사용하는 상수                |
| `data`       | 개발 및 테스트용 임시 데이터                   |
| `hooks`      | Custom Hook                                    |
| `layouts`    | 관리자 Header와 Sidebar를 포함한 공통 레이아웃 |
| `pages`      | 기능 및 화면 단위 Page 컴포넌트                |
| `routes`     | React Router 경로 관리                         |
| `store`      | Zustand 전역 상태 관리                         |
| `styles`     | 공통 및 전역 CSS                               |
| `utils`      | 날짜, 포맷팅 등 공통 유틸리티 함수             |

---

## 🏗 Frontend Architecture

```text
Administrator
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
```

---

## 📊 Summary Component

관리자 대시보드와 각 관리 페이지의 주요 현황을 카드 형태로 표시하는 공통 컴포넌트입니다.

```javascript
const summaryItems = [
  {
    key: 'total',
    label: '전체 장치',
    value: 4,
    unit: '대',
    description: '등록된 장치',
    color: 'blue',
  },
  {
    key: 'error',
    label: '오류',
    value: 1,
    unit: '대',
    description: '즉시 확인 필요',
    color: 'red',
    alert: true,
  },
];

<AdminSummary items={summaryItems} />;
```

| Color    | Use                             |
| -------- | ------------------------------- |
| `blue`   | 전체 현황 및 기본 정보          |
| `mint`   | 정상 상태 및 완료 정보          |
| `orange` | 확인 또는 점검이 필요한 정보    |
| `red`    | 오류 및 즉시 확인이 필요한 정보 |
| `dark`   | 금액 및 주요 집계 정보          |

> ⚠️ `alert`가 `true`이고 `value`가 0보다 크면 `확인 필요` 배지가 표시됩니다.

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
| DB Table     | snake_case    | `payment_history`                           |
| DB Column    | snake_case    | `ticket_id`, `ticket_price`                 |
| HTML id      | snake_case    | `login_form`                                |
| HTML class   | snake_case    | `payment_container`                         |

### 2. Code Style

| 항목          | 규칙               |
| ------------- | ------------------ |
| 들여쓰기      | Space 2칸          |
| 세미콜론      | 사용 (`;`)         |
| 문자열        | Single Quote (`'`) |
| JSX Attribute | Double Quote (`"`) |

### 3. Event Function

버튼 클릭, 입력 변경 등 이벤트를 처리하는 함수는 `handle` 접두어를 사용합니다.

```javascript
const handleLoginSubmit = () => {};

const handleSeatSelect = () => {};

const handlePayment = () => {};
```

### 4. Boolean Variable

참/거짓을 나타내는 변수는 `is` 접두어를 사용합니다.

```javascript
const isLoggedIn = true;

const isSelected = true;

const isPaymentComplete = false;
```

---

## 🌐 API Convention

- 모든 API 요청 함수는 `api` 폴더에서 관리합니다.
- 공통 Axios Instance인 `axiosInstance.js`를 사용합니다.
- 컴포넌트 내부에서 직접 Axios Instance를 생성하지 않습니다.
- 기능별 API 파일을 분리하여 관리합니다.

```text
api
├── authApi.js
├── paymentApi.js
├── reservationApi.js
├── seatApi.js
├── ticketApi.js
└── userApi.js
```

---

## 🗂 Zustand Convention

- 기능별 Store를 생성합니다.
- 하나의 Store는 하나의 주요 역할을 담당하도록 구성합니다.
- 여러 페이지에서 공유해야 하는 상태를 Store에서 관리합니다.

```text
store
├── authStore.js
├── checkInStore.js
├── paymentStore.js
├── reservationStore.js
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
├── modal
├── seat
└── HeaderTime.jsx
```

특정 기능이나 페이지에서만 사용하는 컴포넌트는 해당 페이지 내부에서 관리합니다.

```text
pages
└── Payment
    ├── components
    ├── css
    ├── PaymentMethodPage.jsx
    ├── PaymentProcess.jsx
    └── PaymentResult.jsx
```

---

## 🧱 Constants Convention

백엔드에서 전달받은 영문 상태값은 `constants`에서 화면 표시용 한글 라벨로 변환합니다.

```javascript
export const DEVICE_STATUS_LABELS = {
  NORMAL: '정상',
  WARNING: '점검 필요',
  ERROR: '오류',
};

export const DEVICE_TYPE_LABELS = {
  KIOSK: '키오스크',
  CARD_READER: '카드 리더기',
  RECEIPT_PRINTER: '영수증 프린터',
  DOOR: '출입문 장치',
  QR_SCANNER: 'QR 스캐너',
  SEAT_TERMINAL: '좌석 단말기',
};
```

```javascript
<span>{DEVICE_STATUS_LABELS[device.status]}</span>
```

---

## ⭐ Git Convention

### 🌿 Branch Convention

#### 예시

```text
feature/admin-login
feature/admin-payment
feature/admin-ticket
feature/admin-seat
feature/admin-reservation

fix/admin-payment-error
fix/admin-login-error

docs/admin-readme
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

#### 예시

```text
feat: 관리자 로그인 기능 추가
feat: 좌석 관리 기능 추가
fix: 결제 오류 수정
docs: 관리자 README 수정
style: 버튼 CSS 수정
```

---

## 🚀 Getting Started

### 1. Repository Clone

```bash
git clone <repository-url>
cd scac-admin
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm start
```

기본 개발 서버:

```text
http://localhost:3000
```

---

## 🔐 Environment Variables

프로젝트 실행에 필요한 환경 변수는 `.env` 파일에서 관리합니다.

```env
REACT_APP_API_URL=http://localhost:8888
```

> ⚠️ 실제 `.env` 파일은 Git 저장소에 포함하지 않습니다.
>
> 환경 변수 예시는 `.env.example` 파일을 참고합니다.

---

## 🔗 Related Projects

SCAC는 키오스크, 관리자, 백엔드 애플리케이션으로 분리하여 개발합니다.

```text
SCAC
├── scac-front    # 관리자 PC Frontend
├── scac-admin    # 관리자 PC Frontend
└── scac-back     # Backend
```

`scac-admin`은 **관리자 기능만 담당**하며,  
키오스크 사용자 기능은 별도의 `scac-front` 프로젝트에서 관리합니다.

---

## 👥 Team

| Name   | Role                                                      |
| ------ | --------------------------------------------------------- |
| 김수영 | 회원 · 인증 · 권한 · DB 설계 및 관리 · 입실 비밀번호 관리 |
| 장원진 | 좌석 · 예약 · 입실/퇴실 · Git 저장소 관리                 |
| 이지현 | 결제 · 이용권 · 관리자 · 프로젝트 문서 관리               |

---

## 📝 Documentation Version

- **README v1.0**
- Last Updated : 2026.07.21

### History

- README v1.0 (2026.07.21)

---

## 📄 License

본 프로젝트는 K-Digital Training 교육 및 팀 프로젝트 목적으로 제작되었습니다.
