package com.scac.ticketusage.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scac.global.exception.ResourceNotFoundException;
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

  public TicketUsage findTicketUsage(Long ticketUsageId) {
    return ticketUsageRepository.findById(ticketUsageId)
      .orElseThrow(() -> new ResourceNotFoundException("사용자 이용권을 찾을 수 없습니다."));
  }

  @Transactional
  public TicketUsageResDTO issue(Long userId, Long ticketId) {
    Ticket ticket = ticketService.findTicket(ticketId);
    System.out.println("issue userId = " + userId);
    System.out.println("issue ticketId = " + ticketId);

    return TicketUsageResDTO.from(ticketUsageRepository.save(TicketUsage.create(userId, ticket)));
  }

  @Transactional
  public void cancel(Long ticketUsageId) {
    TicketUsage ticketUsage = findTicketUsage(ticketUsageId);
    ticketUsage.cancel();
  }

}