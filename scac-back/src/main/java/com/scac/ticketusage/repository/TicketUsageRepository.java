package com.scac.ticketusage.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.scac.global.enums.TicketType;
import com.scac.global.enums.TicketUsageStatus;
import com.scac.ticketusage.entity.TicketUsage;

public interface TicketUsageRepository extends JpaRepository<TicketUsage, Long> {
    Optional<TicketUsage> findFirstByUserIdAndStatusInOrderByCreatedAtDesc(Long userId,
            List<TicketUsageStatus> statuses);

    // 구매순으로 이용권 조회
    List<TicketUsage> findByUserIdAndRemainingTimeGreaterThanOrderByCreatedAtAsc(Long userId, Integer remainingTime);

    // 구매일 기준 오래된 것부터 상태별 이용권 조회
    Optional<TicketUsage> findFirstByUserIdAndStatusOrderByCreatedAtAsc(Long userId, TicketUsageStatus status);

    Optional<TicketUsage> findFirstByUserIdAndStatusInOrderByCreatedAtAsc(Long userid,
            List<TicketUsageStatus> statuses);

    // 만료 예정 시간권 알림 대상 조회
    List<TicketUsage> findByStatusAndTicketTypeAndRemainingTimeBetween(
            TicketUsageStatus status, TicketType ticketType, Integer minRemainingTime, Integer maxRemainingTime);

    // 만료 예정 기간권 알림 대상 조회
    List<TicketUsage> findByStatusAndTicketTypeAndEndAtBetween(
            TicketUsageStatus status, TicketType ticketType, LocalDateTime startAt, LocalDateTime endAt);

    @Query(value = """
            SELECT tu.* FROM ticket_usage tu JOIN ticket_table tt ON tu.ticket_id = tt.ticket_id
            WHERE tu.user_id = :userId AND tu.status IN ('USING', 'READY') AND tt.target_type = 'SEAT'
            ORDER BY tu.created_at DESC LIMIT 1
            """, nativeQuery = true)
    Optional<TicketUsage> findLatestSeatTicketUsage(@Param("userId") Long userId);

    // 구매일 기준 오래된 것부터 상태별 이용권 조회에다가 이용권 종류 추가
    Optional<TicketUsage> findFirstByUserIdAndStatusAndTicketTypeOrderByCreatedAtAsc(Long userId, TicketUsageStatus status, TicketType ticketType);
}
