# SCAC API 명세서

> SCAC Backend가 제공하는 사용자 키오스크, 관리자 시스템 및 RTOS 장치 연동 API를 정리한 문서입니다.

- 기준 브랜치: `main`
- Backend: Spring Boot
- Base URL: `http://localhost:8888`
- API 수: 88개
- 최종 수정일: 2026-08-31

---

## 목차

1. [공통 규칙](#공통-규칙)
2. [인증 및 권한](#인증-및-권한)
3. [관리자 API](#관리자-api)
4. [사용자 인증 API](#사용자-인증-api)
5. [입실·퇴실 API](#입실퇴실-api)
6. [RTOS 명령 및 장치 API](#rtos-명령-및-장치-api)
7. [스터디룸 예약 API](#스터디룸-예약-api)
8. [결제 API](#결제-api)
9. [스터디룸·좌석·이용권 조회 API](#스터디룸좌석이용권-조회-api)
10. [사용자 API](#사용자-api)
11. [주요 상태값](#주요-상태값)
12. [구현 및 운영 참고사항](#구현-및-운영-참고사항)

---

## 공통 규칙

### 요청 형식

JSON Body를 전달하는 요청은 다음 Header를 사용합니다.

```http
Content-Type: application/json
```

JWT 인증이 필요한 요청은 Access Token을 전달합니다.

```http
Authorization: Bearer {accessToken}
```

### 공통 성공 응답

대부분의 API는 다음 공통 응답 형식을 사용합니다.

```json
{
  "isSuccess": true,
  "message": "요청을 처리했습니다.",
  "data": {}
}
```

데이터가 없는 경우 `data`는 `null`입니다.

```json
{
  "isSuccess": true,
  "message": "요청을 처리했습니다.",
  "data": null
}
```

### 공통 실패 응답

```json
{
  "isSuccess": false,
  "message": "요청 처리에 실패했습니다.",
  "data": null
}
```

### 장치 상태 API 응답 예외

다음 API는 현재 `ApiResponse`로 감싸지 않고 데이터를 직접 반환합니다.

```text
GET   /api/devices/{deviceId}/status
PATCH /api/devices/{deviceId}/status
```

장치 상태 조회 응답 예시:

```json
{
  "deviceId": 1,
  "status": "NORMAL"
}
```

### 주요 HTTP 상태 코드

| Status | 의미 |
| --- | --- |
| `200 OK` | 조회·수정·삭제 및 일반 요청 성공 |
| `201 Created` | 리소스 생성 성공 |
| `400 Bad Request` | 요청값 또는 상태 전이 검증 실패 |
| `401 Unauthorized` | 인증 정보가 없거나 토큰이 유효하지 않음 |
| `403 Forbidden` | 접근 권한 부족 |
| `404 Not Found` | 요청한 리소스를 찾을 수 없음 |
| `409 Conflict` | 예약 시간 중복 등 현재 상태와 요청이 충돌함 |
| `500 Internal Server Error` | 서버 내부 오류 |

---

## 인증 및 권한

| 구분 | 설명 |
| --- | --- |
| Public | 로그인 또는 JWT 없이 접근 가능한 API |
| User | 사용자 Access Token 필요 |
| Admin | `STAFF` 또는 `SUPER_ADMIN` 권한 필요 |
| Super Admin | `SUPER_ADMIN` 권한 필요 |
| RTOS | RTOS Client와 Backend 간 장치 연동 API |

관리자 계정 관리 API인 `/api/admin/accounts/**`는 `SUPER_ADMIN`만 접근할 수 있습니다.

그 외 관리자 API는 기본적으로 `STAFF` 또는 `SUPER_ADMIN` 권한이 필요합니다.

---

## 관리자 API

### 관리자 계정 및 인증

| Method | Endpoint | 설명 | 권한 |
| --- | --- | --- | --- |
| `GET` | `/api/admin/accounts` | 관리자 계정 목록 조회 | Super Admin |
| `POST` | `/api/admin/accounts` | 관리자 계정 생성 | Super Admin |
| `GET` | `/api/admin/accounts/{adminId}` | 관리자 계정 상세 조회 | Super Admin |
| `PATCH` | `/api/admin/accounts/{adminId}` | 관리자 정보·역할·비밀번호 수정 | Super Admin |
| `DELETE` | `/api/admin/accounts/{adminId}` | 관리자 계정 삭제 | Super Admin |
| `POST` | `/api/admin/auth/login` | 관리자 로그인 | Public |
| `POST` | `/api/admin/auth/refresh` | 관리자 Access Token 재발급 | Public |
| `POST` | `/api/admin/auth/logout` | 관리자 로그아웃 | Admin |

### 대시보드

| Method | Endpoint | 설명 | 권한 |
| --- | --- | --- | --- |
| `GET` | `/api/admin/dashboard` | 좌석·매출·장치·로그 등 대시보드 요약 조회 | Admin |

### 장치 관리

| Method | Endpoint | 설명 | 권한 |
| --- | --- | --- | --- |
| `GET` | `/api/admin/devices` | 비활성 장치 포함 여부를 적용한 장치 목록 조회 | Admin |
| `POST` | `/api/admin/devices` | 장치 등록 | Admin |
| `GET` | `/api/admin/devices/{deviceId}` | 장치 상세 조회 | Admin |
| `PUT` | `/api/admin/devices/{deviceId}` | 장치 정보 수정 | Admin |
| `DELETE` | `/api/admin/devices/{deviceId}` | 장치 삭제 | Admin |
| `PATCH` | `/api/admin/devices/{deviceId}/active` | 장치 활성화·비활성화 | Admin |
| `GET` | `/api/admin/devices/{deviceId}/logs` | 장치별 로그 조회 | Admin |
| `PATCH` | `/api/admin/devices/{deviceId}/status` | 관리자 장치 상태 변경 | Admin |

> 장치 로그가 존재하는 장치는 Backend 정책상 삭제할 수 없습니다.

### 시스템 로그

| Method | Endpoint | 설명 | 권한 |
| --- | --- | --- | --- |
| `GET` | `/api/admin/logs` | 조건 검색 및 페이지네이션을 적용한 시스템 로그 조회 | Admin |
| `GET` | `/api/admin/logs/{logId}` | 시스템 로그 상세 조회 | Admin |
| `GET` | `/api/admin/logs/seat` | 전체 좌석 이용 로그 조회 | Admin |
| `GET` | `/api/admin/logs/seat/{seatId}` | 특정 좌석 이용 로그 조회 | Admin |

### 관리자 메모

| Method | Endpoint | 설명 | 권한 |
| --- | --- | --- | --- |
| `GET` | `/api/admin/memos` | 관리자 인수인계 메모 목록 조회 | Admin |
| `POST` | `/api/admin/memos` | 관리자 메모 생성 | Admin |
| `PUT` | `/api/admin/memos/{memoId}` | 관리자 메모 수정 | Admin |
| `DELETE` | `/api/admin/memos/{memoId}` | 관리자 메모 삭제 | Admin |

### 결제 관리

| Method | Endpoint | 설명 | 권한 |
| --- | --- | --- | --- |
| `GET` | `/api/admin/payments` | 조건 검색 및 페이지네이션을 적용한 결제 목록 조회 | Admin |
| `GET` | `/api/admin/payments/{paymentId}` | 결제 상세 조회 | Admin |
| `PATCH` | `/api/admin/payments/{paymentId}/cancel` | 사유를 입력하여 결제 취소 | Admin |
| `DELETE` | `/api/admin/payments/{paymentId}` | 결제 내역 삭제 | Admin |

> 결제 이력 보존을 위해 관리자 화면에서는 삭제보다 취소 API 사용을 권장합니다.

### 좌석 관리

| Method | Endpoint | 설명 | 권한 |
| --- | --- | --- | --- |
| `GET` | `/api/admin/seats/{seatId}/user` | 현재 좌석 이용자 조회 | Admin |
| `PATCH` | `/api/admin/seats/{seatId}/status` | 관리자 좌석 상태 변경 | Admin |
| `POST` | `/api/admin/seats/{seatId}/force-checkout` | 관리자 강제 퇴실 | Admin |

### 이용권 관리

| Method | Endpoint | 설명 | 권한 |
| --- | --- | --- | --- |
| `POST` | `/api/admin/tickets` | 이용권 생성 | Admin |
| `PUT` | `/api/admin/tickets/{ticketId}` | 이용권 수정 | Admin |
| `PATCH` | `/api/admin/tickets/{ticketId}/status` | 이용권 판매 여부 변경 | Admin |
| `DELETE` | `/api/admin/tickets/{ticketId}` | 이용권 삭제 | Admin |

### 회원 관리

| Method | Endpoint | 설명 | 권한 |
| --- | --- | --- | --- |
| `GET` | `/api/admin/users` | 검색·필터를 적용한 회원 목록 조회 | Admin |
| `GET` | `/api/admin/users/{userId}` | 회원 상세 조회 | Admin |
| `PATCH` | `/api/admin/users/{userId}/penalty` | 이용 정지·영구 정지·제재 해제 | Admin |

---

## 사용자 인증 API

| Method | Endpoint | 설명 | 권한 |
| --- | --- | --- | --- |
| `POST` | `/api/auth/login` | 사용자 로그인 | Public |
| `POST` | `/api/auth/refresh` | 사용자 Access Token 재발급 | Public |
| `POST` | `/api/auth/logout` | 사용자 로그아웃 | User |
| `POST` | `/api/auth/send-code` | SOLAPI 연동 휴대전화 인증번호 발송 | Public |
| `POST` | `/api/auth/verify-code` | 휴대전화 인증번호 검증 | Public |

Access Token 만료 시 Refresh Token을 사용하여 새 Access Token 발급을 시도합니다. 재발급에 실패하면 저장된 인증 정보를 제거하고 다시 로그인해야 합니다.

---

## 입실·퇴실 API

회원용 API는 로그인 사용자 정보를 사용하고, 비회원용 API는 전화번호 등의 사용자 식별 정보를 요청으로 전달합니다.

| Method | Endpoint | 설명 | 권한 |
| --- | --- | --- | --- |
| `POST` | `/api/checkin/prepare` | 비회원·전화번호 기반 입실 준비 | Public |
| `POST` | `/api/checkin/prepare/member` | 로그인 회원 입실 준비 | User |
| `POST` | `/api/checkin` | 준비 결과를 사용한 입실 처리 | Public/User |
| `PATCH` | `/api/checkin/away` | 비회원·전화번호 기반 외출 | Public |
| `PATCH` | `/api/checkin/away/member` | 로그인 회원 외출 | User |
| `PATCH` | `/api/checkin/comeback` | 비회원·전화번호 기반 외출 복귀 | Public |
| `PATCH` | `/api/checkin/comeback/member` | 로그인 회원 외출 복귀 | User |
| `PATCH` | `/api/checkin/checkout` | 비회원·전화번호 기반 퇴실 | Public |
| `PATCH` | `/api/checkin/checkout/member` | 로그인 회원 퇴실 | User |

---

## RTOS 명령 및 장치 API

### 장치 명령

| Method | Endpoint | 설명 | 권한 |
| --- | --- | --- | --- |
| `POST` | `/api/commands` | RTOS 장치 명령 생성 | User/System |
| `GET` | `/api/commands/pending` | 가장 오래된 대기 명령 조회 및 처리 시작 | RTOS |
| `GET` | `/api/commands/{id}` | 장치 명령 처리 상태 조회 | User/RTOS |
| `PATCH` | `/api/commands/{id}/finish` | RTOS 처리 성공·실패 결과 보고 | RTOS |

`GET /api/commands/pending`는 단순 조회가 아닙니다. 조회된 명령은 다음과 같이 상태가 변경됩니다.

```text
PENDING → PROCESSING
```

전체 명령 상태 전이:

```text
PENDING → PROCESSING → COMPLETED
                     └→ FAILED
```

지원하는 장치 명령:

| Command | 설명 |
| --- | --- |
| `CARD_READING` | 카드 리더기 동작 및 카드 인식 |
| `PRINT_RECEIPT` | 결제 완료 후 영수증 출력 |
| `DOOR_OPEN` | 출입문 개방 |
| `DOOR_CLOSE` | 출입문 닫힘 처리 |

### 장치 상태 및 Health Check

| Method | Endpoint | 설명 | 권한 |
| --- | --- | --- | --- |
| `GET` | `/api/devices/{deviceId}/status` | 장치 현재 상태 조회 | RTOS/System |
| `PATCH` | `/api/devices/{deviceId}/status` | 시연용 장치 상태 변경 | Demo |
| `POST` | `/api/devices/health` | RTOS 장치 Health Check 전송 | RTOS |

RTOS Client는 일정 주기로 장치 상태를 전송합니다. Backend는 마지막 연결 시각과 장치 상태를 갱신하며, 정해진 시간 동안 Health Check가 수신되지 않으면 장치를 `OFFLINE`으로 판단합니다.

---

## 스터디룸 예약 API

| Method | Endpoint | 설명 | 권한 |
| --- | --- | --- | --- |
| `GET` | `/api/meeting-rooms` | 전체 스터디룸 예약 목록 조회 | Admin/System |
| `GET` | `/api/meeting-rooms/{roomId}/availability` | 날짜별 예약 가능 시간 조회 | Public/User |
| `GET` | `/api/meeting-rooms/admin/reservations` | 관리자 예약 목록 조회 | Admin |
| `GET` | `/api/meeting-rooms/current` | 현재 사용자의 유효 예약 조회 | User |
| `POST` | `/api/meeting-rooms/reservations` | 결제 전 임시 예약 생성 | User |
| `GET` | `/api/meeting-rooms/reservations/{reservationId}` | 사용자 본인 예약 상세 조회 | User |
| `PATCH` | `/api/meeting-rooms/reservations/{reservationId}/cancel` | 예약 및 연동 결제 취소 | Admin |
| `PATCH` | `/api/meeting-rooms/reservations/{reservationId}/cancel-pending` | 사용자 본인의 결제 대기 예약 취소 | User |

예약 생성 요청 예시:

```json
{
  "roomId": 1,
  "reservationDate": "2026-08-31",
  "startHour": 10,
  "endHour": 12
}
```

예약 시간은 `startTime`, `endTime`이 아니라 `startHour`, `endHour`를 사용합니다.

동일한 스터디룸과 시간대의 동시 예약을 방지하기 위해 예약 생성 과정에서 동시성 제어를 적용합니다.

`PENDING_PAYMENT` 상태의 임시 예약은 5분 안에 결제되지 않으면 만료될 수 있습니다.

---

## 결제 API

| Method | Endpoint | 설명 | 권한 |
| --- | --- | --- | --- |
| `POST` | `/api/payments` | 이용권 또는 스터디룸 결제 주문 생성 | User |
| `POST` | `/api/payments/confirm` | Toss Payments 결제 승인 | User |
| `POST` | `/api/payments/{paymentId}/mock-confirm` | 일반 카드 Mock 결제 승인 | User |
| `GET` | `/api/payments/{paymentId}` | 사용자 본인 결제 상세 조회 | User |

결제 생성 요청에는 `ticketId`와 `reservationId` 중 정확히 하나만 전달합니다.

이용권 결제 예시:

```json
{
  "ticketId": 1,
  "reservationId": null,
  "paymentMethod": "CARD"
}
```

스터디룸 예약 결제 예시:

```json
{
  "ticketId": null,
  "reservationId": 10,
  "paymentMethod": "TOSSPAY"
}
```

스터디룸 결제 금액은 클라이언트가 전달한 금액을 그대로 신뢰하지 않고 예약 시간과 스터디룸의 시간당 금액을 기준으로 Backend에서 검증합니다.

---

## 스터디룸·좌석·이용권 조회 API

### 스터디룸

| Method | Endpoint | 설명 | 권한 |
| --- | --- | --- | --- |
| `GET` | `/api/rooms` | 스터디룸 목록 조회 | Public |
| `GET` | `/api/rooms/{roomId}` | 스터디룸 상세 조회 | Public |

### 좌석

| Method | Endpoint | 설명 | 권한 |
| --- | --- | --- | --- |
| `GET` | `/api/seats` | 전체 좌석 현황 조회 | Public |
| `GET` | `/api/seats/{seatId}` | 좌석 상세 조회 | Public |
| `GET` | `/api/seats/occupied` | 사용 중인 좌석 조회 | Public |

### 이용권

| Method | Endpoint | 설명 | 권한 |
| --- | --- | --- | --- |
| `GET` | `/api/tickets` | 판매 중인 좌석 이용권 목록 조회 | Public |
| `GET` | `/api/tickets/{ticketId}` | 이용권 상세 조회 | Public |
| `GET` | `/api/tickets/room` | 스터디룸용 이용권 조회 | Public |
| `GET` | `/api/ticket-usages/available-seat/exists` | 사용 가능한 좌석 이용권 보유 여부 조회 | User |

---

## 사용자 API

| Method | Endpoint | 설명 | 권한 |
| --- | --- | --- | --- |
| `GET` | `/api/users/check-phone` | 휴대전화 번호 가입 여부 조회 | Public |
| `POST` | `/api/users/signup` | 회원가입 | Public |
| `POST` | `/api/users/guest` | 비회원 등록 | Public |
| `GET` | `/api/users/me` | 현재 로그인 사용자 정보 조회 | User |
| `GET` | `/api/users/{userId}` | 사용자 프로필 단건 조회 | User |
| `POST` | `/api/users/entry-password/verify` | 입실 비밀번호 검증 | User |
| `PATCH` | `/api/users/{userId}/entry-password` | 입실 비밀번호 변경 | User |

---

## 주요 상태값

### 결제 상태

| Status | 설명 |
| --- | --- |
| `PENDING` | 결제 대기 |
| `PAID` | 결제 완료 |
| `CANCELED` | 결제 취소 |
| `FAILED` | 결제 실패 |

### 결제 수단

| Method | 설명 |
| --- | --- |
| `CARD` | 일반 카드 Mock 결제 |
| `TOSSPAY` | Toss Payments 간편 결제 |

### 예약 상태

| Status | 설명 |
| --- | --- |
| `PENDING_PAYMENT` | 결제 대기 중인 임시 예약 |
| `CONFIRMED` | 결제 완료 및 예약 확정 |
| `IN_USE` | 스터디룸 이용 중 |
| `COMPLETED` | 이용 완료 |
| `CANCELED` | 예약 취소 |

### 장치 상태

| Status | 설명 |
| --- | --- |
| `NORMAL` | 정상 |
| `ERROR` | 오류 또는 점검 필요 |
| `OFFLINE` | Health Check 미수신 또는 연결 끊김 |

### 장치 명령 상태

| Status | 설명 |
| --- | --- |
| `PENDING` | RTOS 처리 대기 |
| `PROCESSING` | RTOS 처리 중 |
| `COMPLETED` | 처리 성공 |
| `FAILED` | 처리 실패 |

---

## 구현 및 운영 참고사항

- 사용자 및 관리자 인증은 JWT Access Token과 Refresh Token을 사용합니다.
- Access Token은 Axios Request Interceptor에서 `Authorization` Header에 자동으로 첨부됩니다.
- 관리자 계정 API는 `SUPER_ADMIN` 전용입니다.
- 결제 이력은 삭제보다 취소를 우선합니다.
- 예약 취소 시 해당 예약과 연결된 결제도 함께 취소될 수 있습니다.
- RTOS 장치 명령은 현재 Backend의 In-Memory 저장소를 사용하므로 Backend 재시작 시 초기화될 수 있습니다.
- 완료된 장치 명령의 상태를 DB나 메모리에서 임의로 `PENDING`으로 되돌리면 실제 장치 작업이 다시 실행될 수 있습니다.
- 본 프로젝트의 카드 리더기, 영수증 프린터 및 출입문은 FreeRTOS POSIX 환경에서 시뮬레이션합니다.
- 상세 요청·응답 DTO는 `scac-back/src/main/java`의 각 도메인별 `dto`와 `controller` 구현을 기준으로 합니다.

---

## 관련 프로젝트

```text
SCAC
├── scac-front     # 사용자 키오스크 Frontend
├── scac-admin     # 관리자 Frontend
├── scac-back      # Spring Boot Backend
└── scac-rtos      # FreeRTOS POSIX Device Client
```

---

본 문서는 SCAC 프로젝트의 최신 Backend Controller와 DevProject Hub API 명세를 기준으로 작성되었습니다.
