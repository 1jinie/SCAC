package com.scac.ticket.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.ticket.entity.Ticket;

public interface TicketRepository extends JpaRepository<Ticket,Long>{

}
