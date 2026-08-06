package com.scac.ticketusage.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scac.global.enums.TicketUsageStatus;
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

  private final TicketService ticketService;
  private final TicketUsageRepository ticketUsageRepository;

  public TicketUsage findTicketUsage(Long ticketUsageId) {
    return ticketUsageRepository.findById(ticketUsageId)
      .orElseThrow(() -> new ResourceNotFoundException("사용자 이용권을 찾을 수 없습니다."));
  }

  /* 사용자의 활성(USING / READY) 이용권명 조회 */
  public String getActiveTicketName(Long userId) {
    List<TicketUsageStatus> activeStatuses = List.of(TicketUsageStatus.USING, TicketUsageStatus.READY);

    return ticketUsageRepository.findFirstByUserIdAndStatusInOrderByCreatedAtDesc(userId, activeStatuses)
      .map(ticketUsage -> {
        Ticket ticket = ticketService.findTicket(ticketUsage.getTicketId());
        return ticket.getTicketName();
      }).orElse(null);
  }

  @Transactional
  public TicketUsageResDTO issue(Long userId, Long ticketId) {
    Ticket ticket = ticketService.findTicket(ticketId);

    return TicketUsageResDTO.from(ticketUsageRepository.save(TicketUsage.create(userId, ticket)));
  }

  @Transactional
  public void cancel(Long ticketUsageId) {
    TicketUsage ticketUsage = findTicketUsage(ticketUsageId);
    ticketUsage.cancel();
  }

  // UserId로 사용가능한 SEAT 이용권 보유 여부 조회
  public boolean hasAvailableSeatTicketUsage(Long id) {
    return ticketUsageRepository.findLatestSeatTicketUsage(id).isPresent();
  }

}