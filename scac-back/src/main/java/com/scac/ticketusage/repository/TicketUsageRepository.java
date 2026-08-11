package com.scac.ticketusage.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.scac.global.enums.TicketType;
import com.scac.global.enums.TicketUsageStatus;
import com.scac.ticketusage.entity.TicketUsage;

public interface TicketUsageRepository extends JpaRepository<TicketUsage, Long> {

        // 구매일 기준 오래된 것부터 단일 상태별 좌석 이용권 조회
        Optional<TicketUsage> findFirstByUserIdAndStatusAndTicketIdIsNotNullOrderByCreatedAtDesc(Long userId,
                TicketUsageStatus status);

        // 구매일 기준 오래된 것부터 여러 상태별(USING, READY 동시 조회라던지 등) 좌석 이용권 조회
        Optional<TicketUsage> findFirstByUserIdAndStatusInAndTicketIdIsNotNullOrderByCreatedAtDesc(
                Long userid, List<TicketUsageStatus> statuses);

        // 만료 예정 시간권 알림 대상 조회
        List<TicketUsage> findByStatusAndTicketTypeAndRemainingTimeBetween(TicketUsageStatus status,
                TicketType ticketType, Integer minRemainingTime, Integer maxRemainingTime);

        // 만료 예정 기간권 알림 대상 조회
        List<TicketUsage> findByStatusAndTicketTypeAndEndAtBetween(TicketUsageStatus status,
                TicketType ticketType, LocalDateTime startAt, LocalDateTime endAt);

        @Query(value = """
                SELECT tu.* FROM ticket_usage tu JOIN ticket_table tt ON tu.ticket_id = tt.ticket_id
                WHERE tu.user_id = :userId AND tu.status IN ('USING', 'READY') AND tt.target_type = 'SEAT'
                ORDER BY tu.created_at DESC LIMIT 1
                """, nativeQuery = true)
        Optional<TicketUsage> findLatestSeatTicketUsage(@Param("userId") Long userId);

        // 구매일 기준 오래된 것부터 상태별 이용권 조회에다가 이용권 종류 추가
        Optional<TicketUsage> findFirstByUserIdAndStatusAndTicketTypeOrderByCreatedAtAsc(Long userId,
                TicketUsageStatus status, TicketType ticketType);

        // 예약 이용권 존재 여부 확인
        boolean existsByReservationId(Long reservationId);
}
