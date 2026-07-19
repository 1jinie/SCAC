# 📚 SCAC Frontend

> React 기반 스터디카페 키오스크 Frontend 프로젝트

SCAC Frontend는 사용자가 스터디카페 키오스크를 통해  
회원가입, 로그인, 이용권 구매, 결제, 좌석 선택, 입·퇴실 및 스터디룸 예약 등의 기능을 이용할 수 있도록 구현한 React 애플리케이션입니다.

관리자 시스템은 별도의 `scac-admin` 프로젝트로 분리하여 관리합니다.

---

## ✨ 주요 기능

### 👤 회원

- 회원가입
- 비회원 정보 입력
- 로그인
- 내 정보 조회

### 🎫 이용권

- 시간권 조회 및 선택
- 기간권 조회 및 선택
- 이용권 구매

### 💳 결제

- 결제 수단 선택
- 카드 결제
- 간편 결제
- 결제 진행 상태 표시
- 결제 결과 확인

### 💺 좌석

- 전체 좌석 현황 조회
- 좌석 선택
- 입실
- 퇴실
- 외출
- 외출 복귀

### 🏢 스터디룸

- 스터디룸 조회
- 스터디룸 예약
- 예약 정보 확인

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
scac-front
│
├── public                         # 정적 리소스
│   ├── fonts
│   ├── icons
│   │   ├── admin
│   │   ├── common
│   │   ├── payment
│   │   ├── reservation
│   │   └── user
│   ├── images
│   └── logo
│
├── src
│   ├── api                        # API 통신
│   │   ├── authApi.js
│   │   ├── axiosInstance.js
│   │   ├── paymentApi.js
│   │   ├── reservationApi.js
│   │   ├── seatApi.js
│   │   ├── ticketApi.js
│   │   └── userApi.js
│   │
│   ├── components                 # 공통 컴포넌트
│   │   ├── button
│   │   │   ├── CancelButton.jsx
│   │   │   └── SelectButton.jsx
│   │   │
│   │   ├── modal
│   │   │   └── InOutModal.jsx
│   │   │
│   │   ├── seat
│   │   │   ├── SeatItem.jsx
│   │   │   └── SeatList.jsx
│   │   │
│   │   └── HeaderTime.jsx
│   │
│   ├── constants                  # 상수 관리
│   │
│   ├── data                       # 임시 데이터 관리
│   │   ├── CheckIn.js
│   │   ├── Reservations.js
│   │   ├── RoomInfo.js
│   │   ├── Seats.js
│   │   ├── tickets.json
│   │   └── User.js
│   │
│   ├── hooks                      # 커스텀 훅
│   │   └── useResetStore.js
│   │
│   ├── layouts                    # 공통 레이아웃
│   │   └── KioskLayout.jsx
│   │
│   ├── pages                      # 페이지 컴포넌트
│   │   ├── Error
│   │   │   └── KioskErrorPage.jsx
│   │   │
│   │   ├── Login
│   │   │   └── Login.jsx
│   │   │
│   │   ├── Main
│   │   │   ├── Home.jsx
│   │   │   └── LoginHome.jsx
│   │   │
│   │   ├── MyPage
│   │   │   └── MyPage.jsx
│   │   │
│   │   ├── Payment
│   │   │   ├── components
│   │   │   │   ├── PaymentResultCard.jsx
│   │   │   │   ├── ProceedCard.jsx
│   │   │   │   ├── ProceedPayment.jsx
│   │   │   │   ├── ProceedSimplePay.jsx
│   │   │   │   ├── SeatPayment.jsx
│   │   │   │   ├── StudyRoomPayment.jsx
│   │   │   │   ├── WaitingCard.jsx
│   │   │   │   ├── WaitingPayment.jsx
│   │   │   │   └── WaitingSimplePay.jsx
│   │   │   │
│   │   │   ├── css
│   │   │   ├── PaymentMethodPage.jsx
│   │   │   ├── PaymentProcess.jsx
│   │   │   └── PaymentResult.jsx
│   │   │
│   │   ├── Reservation
│   │   │   └── Reservation.jsx
│   │   │
│   │   ├── Seat
│   │   │   ├── Room.jsx
│   │   │   ├── Seat.jsx
│   │   │   └── SeatPage.jsx
│   │   │
│   │   ├── Signup
│   │   │   ├── css
│   │   │   ├── NonmemberSignup.jsx
│   │   │   └── Signup.jsx
│   │   │
│   │   └── Ticket
│   │       ├── components
│   │       │   └── TicketCard.jsx
│   │       ├── css
│   │       │   └── TicketPage.css
│   │       ├── TicketList.jsx
│   │       └── TicketPage.jsx
│   │
│   ├── routes                     # React Router 설정
│   │   └── index.jsx
│   │
│   ├── store                      # Zustand 전역 상태 관리
│   │   ├── authStore.js
│   │   ├── checkInStore.js
│   │   ├── paymentStore.js
│   │   ├── reservationStore.js
│   │   ├── seatStore.js
│   │   ├── ticketStore.js
│   │   └── userStore.js
│   │
│   ├── styles                     # 공통 및 페이지 스타일
│   │   ├── Auth.css
│   │   ├── common.css
│   │   ├── global.css
│   │   ├── Home.css
│   │   ├── inOutModal.css
│   │   ├── kiosk.css
│   │   ├── LoginHome.css
│   │   ├── Mypage.css
│   │   ├── reservation.css
│   │   ├── reset.css
│   │   ├── seat.css
│   │   └── variables.css
│   │
│   └── utils                      # 공통 유틸리티 함수
│       ├── date.js
│       ├── formatter.js
│       ├── getSeatStyle.js
│       └── reservationUtils.js
│
├── .prettierrc                    # Prettier 설정
├── .gitignore                     # Git 제외 파일
├── package.json                   # 프로젝트 정보 및 의존성
└── README.md                      # Frontend 프로젝트 문서
```

> 📌 공통으로 사용하는 컴포넌트는 `components`에 작성합니다.
>
> 📌 특정 페이지에서만 사용하는 컴포넌트는 해당 페이지의 `components` 폴더에 작성합니다.
>
> 📌 API 요청은 `api` 폴더에서 기능별로 분리하여 관리합니다.
>
> 📌 Zustand를 사용하는 전역 상태는 `store` 폴더에서 기능별로 분리하여 관리합니다.
>
> 📌 공통 스타일은 `styles` 폴더에서 관리하며, 특정 페이지에 종속된 스타일은 해당 페이지의 `css` 폴더에서 관리합니다.

---

## 📌 Directory Description

| Directory    | Description                                 |
| ------------ | ------------------------------------------- |
| `api`        | Axios Instance 및 기능별 API 요청 관리      |
| `public`     | 이미지, 아이콘, 폰트 등 정적 리소스         |
| `components` | 여러 페이지에서 재사용 가능한 공통 컴포넌트 |
| `constants`  | 프로젝트 전역에서 사용하는 상수             |
| `data`       | 개발 및 테스트용 임시 데이터                |
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

## ⭐ Git Convention

### 🌿 Branch Convention

#### 예시

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

#### 예시

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
├── scac-front    # 키오스크 Frontend
├── scac-admin    # 관리자 PC Frontend
└── scac-back     # Backend
```

`scac-front`는 **키오스크 사용자 기능만 담당**하며,  
관리자 기능은 별도의 `scac-admin` 프로젝트에서 관리합니다.

---

## 👥 Team

| Name   | Role                                                      |
| ------ | --------------------------------------------------------- |
| 김수영 | 회원 · 인증 · 권한 · DB 설계 및 관리 · 입실 비밀번호 관리 |
| 장원진 | 좌석 · 예약 · 입실/퇴실 · Git 저장소 관리                 |
| 이지현 | 결제 · 이용권 · 관리자 · 프로젝트 문서 관리               |

---

## 📝 Documentation Version

- **README v1.3**
- Last Updated : 2026.07.19

### History

- README v1.0 (2026.07.03)
- README v1.1 (2026.07.11)
- README v1.2 (2026.07.14)
- README v1.3 (2026.07.19)
