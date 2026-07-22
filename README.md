# ☕ SCAC

> **Study Cafe Access Control**

---

### 🖥 Smart Study Cafe Kiosk & Admin System

Spring Boot + React 기반의 스터디카페 키오스크 및 관리자 시스템

---

## 📖 프로젝트 소개

SCAC는 **스터디카페 키오스크 및 관리자 통합 관리 시스템**입니다.

사용자는 키오스크를 통해 회원가입, 로그인, 이용권 구매, 좌석 선택,  
스터디룸 예약 및 입·퇴실을 수행할 수 있습니다.

관리자는 별도의 PC용 관리자 웹 애플리케이션을 통해  
좌석 현황, 스터디룸 예약, 이용권, 결제, 장치 및 이용 로그를 관리할 수 있습니다.

키오스크와 관리자 화면은 서로 다른 React 프로젝트로 분리하여  
각 환경에 적합한 UI와 기능을 제공하며,  
공통 Spring Boot 백엔드와 REST API를 통해 데이터를 주고받습니다.

---

## 🎯 프로젝트 목표

- 직관적인 키오스크 UI 제공
- 키오스크와 관리자 시스템의 프론트엔드 분리
- 사용자와 관리자의 권한 및 기능 분리
- 실시간 좌석 및 스터디룸 현황 관리
- 이용권 및 결제 기능 제공
- 이용 및 상태 변경 로그 관리
- 유지보수가 쉬운 구조 설계

---

## ✨ 주요 기능

### 👤 사용자 / 키오스크

- 회원가입
- 로그인
- 내 정보 조회
- 이용권 구매
- 결제
- 좌석 선택
- 입실
- 퇴실
- 외출
- 스터디룸 예약
- 예약 취소

### 🛠 관리자 / PC

- 관리자 로그인
- 전체 좌석 현황 관리
- 좌석 상태 변경
- 사용자 강제 퇴실
- 좌석 이용 로그 조회
- 스터디룸 현황 조회
- 스터디룸 날짜별 예약 조회
- 스터디룸 예약 관리
- 이용권 관리
- 결제 관리
- 장치 관리
- 전체 로그 조회

---

## 🛠 Tech Stack

### Kiosk Frontend

- React
- React Router
- Axios
- Zustand
- React Hook Form
- CSS

### Admin Frontend

- React
- React Router
- Axios
- Zustand
- React Hook Form
- CSS

### Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Security
- Spring Data JPA
- MyBatis
- Bean Validation
- Lombok
- MySQL
- Gradle

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
┌──────────────────────┐
│     Spring Boot      │
│      scac-back       │
└──────────┬───────────┘
           │
           │ JPA / MyBatis
           │
           ▼
┌──────────────────────┐
│        MySQL         │
└──────────────────────┘
           ▲
           │
           │ REST API
           │
┌──────────┴───────────┐
│   SCAC Admin React   │
│     scac-admin       │
└──────────────────────┘
```

---

## 📂 Project Structure

```text
SCAC
│
├── docs
│
├── scac-front
│   └── 키오스크 사용자용 React 애플리케이션
│
├── scac-admin
│   └── 관리자 PC용 React 애플리케이션
│
└── scac-back
    └── Spring Boot 백엔드
```

---

## 📑 Documents

> 🚧 프로젝트 진행에 따라 순차적으로 추가될 예정입니다.

| Document         | Description       |
| ---------------- | ----------------- |
| Requirements     | 요구사항 명세서   |
| Meeting          | 회의록            |
| Work Log         | 작업일지          |
| ERD              | 데이터베이스 설계 |
| API              | API 명세          |
| Sequence Diagram | 시퀀스 다이어그램 |
| Figma            | 화면 설계         |

---

## 🚀 Getting Started

### Kiosk Frontend

```bash
cd scac-front
npm install
npm start
```

기본 개발 서버:

```text
http://localhost:3000
```

---

### Admin Frontend

```bash
cd scac-admin
npm install
npm start
```

기본 개발 서버:

```text
http://localhost:3001
```

`.env` 예시:

```env
PORT=3001
REACT_APP_API_URL=http://localhost:8888
```

---

### Backend

```bash
cd scac-back
```

환경변수를 설정한 후 애플리케이션을 실행합니다.

#### Windows

```bash
gradlew.bat bootRun
```

#### macOS / Linux

```bash
./gradlew bootRun
```

기본 서버:

```text
http://localhost:8888
```

기본 API 주소:

```text
http://localhost:8888/api
```

> 데이터베이스 및 환경변수 설정 방법은  
> [`scac-back/README.md`](./scac-back/README.md)를 참고합니다.

---

## 👥 Team

| Name   | Role                                                         |
| ------ | ------------------------------------------------------------ |
| 김수영 | 회원 · 인증 · 권한 · DB 설계 및 관리 · 입실 비밀번호 관리    |
| 장원진 | 좌석 · 예약 · 입실/퇴실 · Git 저장소 관리 · Vercel 배포 관리 |
| 이지현 | 결제 · 이용권 · 관리자 · 프로젝트 문서 관리                  |

---

## 📅 Development Period

2026.07.03 ~ Present

---

## 🎨 UI Design

### Kiosk

Figma를 기반으로  
**32인치 세로형 키오스크(1080×1920)** 환경에 최적화된 UI를 설계하였습니다.

터치 환경을 고려하여 큰 버튼과 명확한 상태 표현을 적용했습니다.

### Admin

관리자 페이지는 별도의 PC 환경에서 사용할 수 있도록  
키오스크와 독립된 React 애플리케이션으로 구성하였습니다.

대시보드, 테이블, 페이지네이션 및 상태 배지를 활용하여  
좌석, 스터디룸, 결제 및 이용 로그를 효율적으로 관리할 수 있도록 설계했습니다.

---

## 📌 Project Status

| Status         | Progress       |
| -------------- | -------------- |
| UI Design      | ✅ Complete    |
| Prototype      | ✅ Complete    |
| Kiosk Frontend | ✅ Complete    |
| Admin Frontend | ✅ Complete    |
| Backend        | 🟡 In Progress |
| Documentation  | 🟡 In Progress |

---

## 📅 Development Milestone

| Milestone        | Target Date | Status         |
| ---------------- | ----------- | -------------- |
| Frontend 완료    | 2026.07.22  | ✅ Complete    |
| Backend 완료     | 2026.08.14  | 🟡 In Progress |
| 통합 테스트 완료 | 2026.08.28  | ⚪ Pending     |
| 최종 발표        | 2026.09.02  | ⚪ Pending     |

---

## 📝 Documentation Version

- **README v2.0**
- Last Updated : 2026.07.22

### History

- README v1.0 (2026.07.11)
- README v1.1 (2026.07.11)
- README v1.2 (2026.07.14)
- README v1.3 (2026.07.19)
- README v2.0 (2026.07.22)

---

## 📄 License

본 프로젝트는 K-Digital Training 교육 및 팀 프로젝트 목적으로 제작되었습니다.
