package com.scac.ticket.repository;

import java.util.Collection;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.global.enums.TargetType;
import com.scac.ticket.entity.Ticket;



public interface TicketRepository extends JpaRepository<Ticket,Long>{

  Collection<Ticket> findByTargetTypeIs(TargetType type);

}
