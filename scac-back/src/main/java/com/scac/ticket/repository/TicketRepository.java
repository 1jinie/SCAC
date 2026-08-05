package com.scac.ticket.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.global.enums.TargetType;
import com.scac.ticket.entity.Ticket;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByTargetType(TargetType targetType);
}