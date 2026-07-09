# 📚 SCAC Frontend

> **SCAC (Study Cafe Access Control) Frontend**

스터디카페 키오스크 시스템 Frontend 프로젝트입니다.

---

## 🛠 Tech Stack

- React
- JavaScript
- React Router
- Axios
- Zustand
- CSS

---

## 📂 Project Structure

```text
src
├── api                     # API 통신
│   ├── authApi.js
│   ├── axios.js
│   ├── paymentApi.js
│   └── reservationApi.js
│
├── assets                  # 정적 리소스
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
├── components              # 공통 컴포넌트
│
├── constants               # 상수 관리
│
├── hooks                   # Custom Hooks
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
│   ├── Reservation
│   └── Signup
│
├── routes                  # Router 설정
│
├── store                   # Zustand Store
│   ├── userStore.js
│   ├── reservationStore.js
│   └── paymentStore.js
│
├── styles                  # 전역 스타일
│   ├── common.css
│   ├── global.css
│   ├── reset.css
│   └── variables.css
│
├── utils                   # 공통 함수
│   ├── date.js
│   └── formatter.js
│
├── App.js
└── index.js
```

---

## 📌 Directory Description

| Directory | Description |
|------------|-------------|
| api | Axios 및 API 요청 관리 |
| assets | 이미지, 아이콘, 폰트 등 정적 리소스 |
| components | 재사용 가능한 공통 컴포넌트 |
| constants | 프로젝트에서 사용하는 상수 |
| hooks | Custom Hook |
| layouts | 공통 레이아웃 |
| pages | 화면(Page) 컴포넌트 |
| routes | React Router 관리 |
| store | Zustand 전역 상태 관리 |
| styles | 전역 CSS |
| utils | 공통 함수 |

---

## 👥 Team

- Frontend
- Backend

---