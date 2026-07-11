# ☕ SCAC

> **Study Cafe Access Control**

---

### 🖥 Smart Study Cafe Kiosk System

Spring Boot + React 기반의 스터디카페 키오스크 시스템

---

## 📖 프로젝트 소개

SCAC는 **스터디카페 키오스크 관리 시스템**입니다.

사용자가 키오스크를 통해 회원가입, 로그인, 이용권 구매, 좌석 선택, 스터디룸 예약 및 입·퇴실을 수행할 수 있으며,
관리자는 관리자 페이지를 통해 키오스크와 이용 현황을 관리할 수 있습니다.

---

## 🎯 프로젝트 목표

- 직관적인 키오스크 UI 제공
- 사용자와 관리자의 기능 분리
- 실시간 좌석 관리
- 이용권 및 결제 기능 제공
- 유지보수가 쉬운 구조 설계

---

## ✨ 주요 기능

### 👤 사용자

- 회원가입
- 로그인
- 내 정보
- 이용권 구매
- 결제
- 좌석 선택
- 입실
- 퇴실
- 외출
- 스터디룸 예약

### 🛠 관리자

- 관리자 로그인
- 좌석 관리
- 이용권 관리
- 회원 관리
- 결제 관리
- 로그 조회

---

## 🛠 Tech Stack

### Frontend

- React
- React Router
- Axios
- Zustand
- React Hook Form
- CSS

### Backend

- Spring Boot
- Spring Security
- Spring Data JPA
- MyBatis
- MySQL

---

## 🏗 System Architecture

```text
React
   │
REST API
   │
Spring Boot
   │
Spring Data JPA
   │
MySQL
```

---

## 📂 Project Structure

```text
SCAC
│
├── docs
│
├── scac-front
│
└── scac-back
```

---

## 📑 Documents

> 🚧 프로젝트 진행에 따라 순차적으로 추가될 예정입니다.

| Document         | Description       |
| ---------------- | ----------------- |
| Requirements     | 요구사항 명세서   |
| Meeting          | 회의록            |
| ERD              | 데이터베이스 설계 |
| API              | API 명세          |
| Sequence Diagram | 시퀀스 다이어그램 |
| Figma            | 화면 설계         |

---

## 🚀 Getting Started

### Frontend

```bash
cd scac-front
npm install
npm start
```

### Backend

```bash
cd scac-back

Backend Project is under development.
```

---

## 👥 Team

| Name   | Role                      |
| ------ | ------------------------- |
| 김수영 | 회원 / 인증 / 권한        |
| 장원진 | 좌석 / 예약 / 입실 / 퇴실 |
| 이지현 | 결제 / 이용권 / 관리자    |

---

## 📅 Development Period

2026.07 ~ Present

---

## 🎨 UI Design

Figma를 기반으로 32인치 세로형 키오스크(1080×1920)에 최적화된 UI를 설계하였습니다.

---

## 📌 Project Status

| Status        | Progress       |
| ------------- | -------------- |
| UI Design     | ✅ Complete    |
| Prototype     | ✅ Complete    |
| Frontend      | 🟡 In Progress |
| Backend       | 🟡 In Progress |
| Documentation | 🟡 In Progress |
