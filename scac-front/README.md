# 📚 SCAC Frontend

> React 기반 스터디카페 키오스크 Frontend 프로젝트

주요 기능

- 로그인 / 회원가입
- 좌석 예약
- 결제
- 이용권 관리
- 관리자 기능

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
public                     # 정적 리소스
├── fonts
├── icons
│   ├── admin
│   ├── common
│   ├── payment
│   ├── reservation
│   └── user
├── images
└── logo

src
├── api                     # API 통신
│   ├── authApi.js
│   ├── axios.js
│   ├── paymentApi.js
│   ├── reservationApi.js
│   └── userApi.js
│
│
├── components              # 공통 컴포넌트
│   ├── button
│   │   ├── CancelButton.jsx
│   │   └── SelectButton.jsx
│   └── HeaderTime.jsx
│
├── constants               # 상수 관리
│
├── data                    # 임시 데이터 관리
│
├── hooks                   # 커스텀 훅
│
├── layouts                 # 레이아웃 컴포넌트
│
├── pages                   # 페이지
│   ├── Admin
│   ├── Error
│   ├── Login
│   ├── Main
│   ├── MyPage
│   ├── Payment
│   │   ├── components
│   │   └── Payment.jsx
│   ├── Reservation
│   ├── Seat
│   ├── Signup
│   └── Ticket
│       ├── components
│       └── TicketPage.jsx
│
├── routes                  # Router 설정
│
├── store                   # Zustand Store
│   ├── authStore.js
│   ├── paymentStore.js
│   ├── reservationStore.js
│   ├── ticketStore.js
│   └── userStore.js
│
├── styles                  # 공통 및 페이지 스타일
│   ├── common.css
│   ├── global.css
│   ├── reset.css
│   ├── variables.css
│   ├── Login.css
│   ├── Mypage.css
│   ├── reservation.css
│   ├── seat.css
│   └── SignUp.css
│
├── utils                   # 공통 함수
│   ├── date.js
│   └── formatter.js
│
├── App.js
├── App.css
├── index.js
└── index.css

.prettierrc            # Prettier 설정
.gitignore             # Git 제외 파일
package.json           # 프로젝트 정보 및 의존성
README.md              # 프로젝트 문서
```

> 📌 공통으로 사용하는 컴포넌트는 `components`에 작성합니다.
>
> 📌 특정 페이지에서만 사용하는 컴포넌트는 해당 페이지의 `components` 폴더에 작성합니다.
>
> 📌 스타일은 현재 `styles` 폴더에서 통합 관리하고 있으며, 필요 시 페이지 단위로 분리할 수 있습니다.

---

## 📌 Directory Description

| Directory  | Description                         |
| ---------- | ----------------------------------- |
| api        | Axios 및 API 요청 관리              |
| public     | 이미지, 아이콘, 폰트 등 정적 리소스 |
| components | 재사용 가능한 공통 컴포넌트         |
| constants  | 프로젝트에서 사용하는 상수          |
| hooks      | Custom Hook                         |
| layouts    | 공통 레이아웃                       |
| pages      | 화면(Page) 컴포넌트                 |
| routes     | React Router 관리                   |
| store      | Zustand 전역 상태 관리              |
| styles     | 전역 CSS                            |
| utils      | 공통 함수                           |

---

## 📌 Coding Convention

### 1. Naming Convention

| 대상         | 규칙          | 예시                                        |
| ------------ | ------------- | ------------------------------------------- |
| 변수         | camelCase     | `userName`                                  |
| 함수         | camelCase     | `getUserInfo()`                             |
| 이벤트 함수  | handle + 동사 | `handleLoginSubmit()`, `handleSeatSelect()` |
| Boolean 변수 | is + 명사     | `isLoggedIn`, `isAdmin`                     |
| Component    | PascalCase    | `LoginPage.jsx`, `PaymentCard.jsx`          |
| Store        | camelCase     | `userStore.js`                              |
| API          | camelCase     | `paymentApi.js`                             |
| DB Table     | snake_case    | `payment_history`                           |
| DB Column    | snake_case    | `member_id`, `ticket_price`                 |
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

const isAdmin = false;

const isSelected = true;

const isPaymentComplete = false;
```

### 5. 🌐 API Convention

- 모든 API는 `api` 폴더에서 관리합니다.
- Axios Instance를 사용합니다.
- 직접 axios를 호출하지 않습니다.

### 6. 🗂 Zustand Convention

- 기능별 Store를 생성합니다.
- 하나의 Store에는 하나의 역할만 작성합니다.

---

## ⭐ Git Convention

### 🌿 Branch Convention

#### 예시

```text
feature/login
feature/payment
feature/ticket
fix/payment-error
docs/readme
```

### ✍ Commit Convention

| Type     | Description             |
| -------- | ----------------------- |
| feat     | 새로운 기능 추가        |
| fix      | 버그 수정               |
| style    | CSS 및 코드 스타일 수정 |
| refactor | 코드 리팩토링           |
| docs     | 문서 수정               |
| chore    | 환경설정 및 기타 변경   |

#### 예시

```text
feat: 로그인 기능 추가
fix: 결제 오류 수정
docs: README 수정
style: 버튼 CSS 수정
```

---

## 🚀 Getting Started

```bash
cd scac-front

npm install

npm start
```

---

## 👥 Team

| Name   | Role                                        |
| ------ | ------------------------------------------- |
| 김수영 | 회원 · 인증 · 권한 · DB 설계 및 관리        |
| 장원진 | 좌석 · 예약 · 입실/퇴실 · Git 저장소 관리   |
| 이지현 | 결제 · 이용권 · 관리자 · 프로젝트 문서 관리 |

---

## 📝 Documentation Version

- README v1.1
- Last Updated : 2026.07.11

### History

- README v1.0 (2026.07.03)
- README v1.1 (2026.07.11)
