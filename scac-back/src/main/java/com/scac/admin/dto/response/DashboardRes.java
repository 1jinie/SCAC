package com.scac.admin.dto.response;

public record DashboardRes(
    long totalUsers,        // 전체 회원 수
    long activeUsers,       // 정상 이용 회원 수
    long suspendedUsers,    // 이용 정지 회원 수
    long bannedUsers,       // 영구 제재 회원 수
    long totalSeats,        // 전체 좌석 수
    long occupiedSeats,     // 현재 이용 중인 좌석 수
    long availableSeats,    // 이용 가능한 좌석 수
    long todayRevenue,      // 당일 누적 매출액 (원)
    long totalDevices,      // 전체 장비 수
    long normalDevices,     // 정상 장비 수
    long errorDevices,      // 오류/오프라인 장비 수
    long todayErrorLogs     // 금일 에러 로그 발생 수
) {
}