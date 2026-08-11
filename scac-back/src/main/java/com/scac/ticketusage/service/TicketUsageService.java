package com.scac.ticketusage.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scac.checkin.repository.CheckinRepository;
import com.scac.global.enums.CheckinStatus;
import com.scac.global.enums.TicketType;
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
  private final CheckinRepository checkinRepository;

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

    // 기간권 구매
    if(ticket.getTicketType() == TicketType.PERIOD_PACK){
      // 현재 사용중 이용권 찾기
      TicketUsage current = ticketUsageRepository.findFirstByUserIdAndStatusOrderByCreatedAtAsc(userId, TicketUsageStatus.USING).orElse(null);

      // 새 이용권 생성
      TicketUsage usage = TicketUsage.create(userId, ticket);

      if(current != null){
        // 기존 이용권이 기간권인 경우
        if(current.getTicketType() == TicketType.PERIOD_PACK){
          // 새 기간권 READY
          usage.ready();

          // 기존 기간권 만료 시점부터 시작
          usage.setStartAt(current.getEndAt());
          usage.setEndAt(usage.getStartAt().plusDays(ticket.getValidDays()));
        } else{
          // 기존 이용권이 시간권이면 시간권 READY, 기간권 바로 사용
          current.ready();

          usage.startPeriod(ticket.getValidDays());

          // 현재 입실 중이면 check_inout의 usage_id 변경
          checkinRepository.findFirstByUserIdAndCheckinStatusInOrderByCheckinAtDesc(
            userId, 
            List.of(CheckinStatus.USING, CheckinStatus.AWAY)).ifPresent(checkin -> 
              checkin.changeUsage(usage.getUsageId()));
        }
      } else{
        // 현재 USING 이용권 없으면 새 기간권 바로 사용
        usage.startPeriod(ticket.getValidDays());
      }
      
      // 기간권 사용시 check_inout 테이블의 usage_id 전환
      TicketUsage savedUsage = ticketUsageRepository.save(usage);

      if(savedUsage.getStatus() == TicketUsageStatus.USING){
        checkinRepository.findFirstByUserIdAndCheckinStatusInOrderByCheckinAtDesc(
          userId,
          List.of(CheckinStatus.USING, CheckinStatus.AWAY)).ifPresent(checkin ->
            checkin.changeUsage(savedUsage.getUsageId())
          );
      }

      return TicketUsageResDTO.from(savedUsage);
    }

    // 시간권 구매
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