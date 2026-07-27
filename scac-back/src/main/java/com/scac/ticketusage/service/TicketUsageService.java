package com.scac.ticketusage.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scac.ticket.entity.Ticket;
import com.scac.ticket.service.TicketService;
import com.scac.ticketusage.dto.TicketUsageResDTO;
import com.scac.ticketusage.entity.TicketUsage;
import com.scac.ticketusage.repository.TicketUsageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TicketUsageService {

// private final TicketUsageMapper ticketUsageMapper;
  private final TicketService ticketService;
  private final TicketUsageRepository ticketUsageRepository;

  @Transactional
  public TicketUsageResDTO issue(Long userId, Long ticketId) {
    Ticket ticket = ticketService.findTicket(ticketId);

    
    return TicketUsageResDTO.from(
      ticketUsageRepository.save(TicketUsage.create(userId, ticket)));
  }
}