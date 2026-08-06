package com.scac.ticketusage.repository;

import java.util.List;
import java.util.Optional;

import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.scac.global.enums.TicketUsageStatus;
import com.scac.ticketusage.entity.TicketUsage;

public interface TicketUsageRepository extends JpaRepository<TicketUsage, Long> {
    Optional<TicketUsage> findFirstByUserIdAndStatusInOrderByCreatedAtDesc(Long userId,
        List<TicketUsageStatus> statuses);

    @Query(value = """
        SELECT tu.* FROM ticket_usage tu JOIN ticket_table tt ON tu.ticket_id = tt.ticket_id
        WHERE tu.user_id = :userId AND tu.status IN ('USING', 'READY') AND tt.target_type = 'SEAT'
        ORDER BY tu.created_at DESC LIMIT 1
        """, nativeQuery = true)
    Optional<TicketUsage> findLatestSeatTicketUsage(@Param("userId") Long userId);
}
