package com.scac.ticketusage.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.ticketusage.domain.TicketUsage;

public interface TicketUsageRepository extends JpaRepository<TicketUsage, Long>{
    
}
