package com.scac.ticketusage.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.global.enums.TicketUsageStatus;
import com.scac.ticketusage.entity.TicketUsage;

public interface TicketUsageRepository extends JpaRepository<TicketUsage,Long>{
    Optional<TicketUsage> findFirstByUserIdAndStatusInOrderByCreatedAtDesc(Long userId, List<TicketUsageStatus> statuses);
    
    // 구매순으로 이용권 조회
    List<TicketUsage> findByUserIdAndRemainingTimeGreaterThanOrderByCreatedAtAsc(Long userId, Integer remainingTime);

    // 구매일 기준 오래된 것부터 상태별 이용권 조회
    Optional<TicketUsage> findFirstByUserIdAndStatusOrderByCreatedAtAsc(Long userId, TicketUsageStatus status);

    Optional<TicketUsage> findFirstByUserIdAndStatusInOrderByCreatedAtAsc(Long userid, List<TicketUsageStatus> statuses);
}
