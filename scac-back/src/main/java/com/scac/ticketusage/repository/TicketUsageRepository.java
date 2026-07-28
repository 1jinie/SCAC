package com.scac.ticketusage.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.global.enums.TicketUsageStatus;
import com.scac.ticketusage.entity.TicketUsage;

public interface TicketUsageRepository extends JpaRepository<TicketUsage,Long>{
    Optional<TicketUsage> findFirstByUserIdAndStatusInOrderByCreatedAtDesc(Long userId, List<TicketUsageStatus> statuses);
}
