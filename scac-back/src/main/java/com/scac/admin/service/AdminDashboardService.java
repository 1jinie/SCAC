    package com.scac.admin.service;

    import java.util.List;

    import org.springframework.stereotype.Service;
    import org.springframework.transaction.annotation.Transactional;

    import com.scac.admin.dto.response.DashboardRes;
    import com.scac.device.dto.DeviceResDTO;
    import com.scac.device.service.DeviceService;
    import com.scac.global.enums.DeviceStatus;
    import com.scac.global.enums.UserStatus;
    import com.scac.payment.service.PaymentService;
    import com.scac.seat.repository.SeatRepository;
    import com.scac.system.service.SystemLogService;
    import com.scac.user.repository.UserRepository;

    import lombok.RequiredArgsConstructor;

    @Service
    @RequiredArgsConstructor
    @Transactional(readOnly = true)
    public class AdminDashboardService {

        private final UserRepository userRepository;
        private final SeatRepository seatRepository;
        private final DeviceService deviceService;          // 💡 device 도메인 서비스 재사용
        private final SystemLogService systemLogService;  // 💡 system 도메인 서비스 재사용
        private final PaymentService paymentService;  // 💡 payment 도메인 서비스 연동

        /**
         * 대시보드 통합 요약 정보 조회
         */
        public DashboardRes getDashboardSummary() {

            // 1. 회원 현황 집계
            long totalUsers = userRepository.count();
            long activeUsers = userRepository.findByUserStatus(UserStatus.ACTIVE).size();
            long suspendedUsers = userRepository.findByUserStatus(UserStatus.SUSPENDED).size();
            long bannedUsers = userRepository.findByUserStatus(UserStatus.BANNED).size();

            // 2. 좌석 현황 집계
            long totalSeats = seatRepository.count();
            long occupiedSeats = seatRepository.findByCurrentUserIdIsNotNull().size();
            long availableSeats = Math.max(0, totalSeats - occupiedSeats);

            // 3. 당일 매출액 집계 (PaymentService 연동)[cite: 14]
            long todayRevenue = paymentService.getTodayRevenue();

            // 4. 디바이스 상태 집계 (DeviceService 활용)
            List<DeviceResDTO> devices = deviceService.findAllCurrentStatus();
            long totalDevices = devices.size();
            long errorDevices = devices.stream()
                    .filter(d -> d.getStatus() == DeviceStatus.ERROR || d.getStatus() == DeviceStatus.OFFLINE)
                    .count();
            long normalDevices = totalDevices - errorDevices;

            // 5. 금일 시스템 에러 로그 수 (SystemLogService 활용)
            long todayErrorLogs = systemLogService.getTodayErrorCount();

            return new DashboardRes(
                    totalUsers, activeUsers, suspendedUsers, bannedUsers,
                    totalSeats, occupiedSeats, availableSeats,
                    todayRevenue,
                    totalDevices, normalDevices, errorDevices,
                    todayErrorLogs
            );
        }
    }