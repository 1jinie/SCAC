package com.scac.ticketusage.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scac.global.enums.TicketType;
import com.scac.global.exception.ResourceNotFoundException;
import com.scac.seat.domain.Seat;
import com.scac.seat.repository.SeatRepository;
import com.scac.ticket.entity.Ticket;
import com.scac.ticket.repository.TicketRepository;
import com.scac.ticketusage.domain.TicketUsage;
import com.scac.ticketusage.dto.TicketUsageRequest;
import com.scac.ticketusage.dto.TicketUsageResponse;
import com.scac.ticketusage.repository.TicketUsageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TicketUsageService {
    private final TicketUsageRepository ticketUsageRepository;
    private final SeatRepository seatRepository;
    private final TicketRepository ticketRepository;

    public TicketUsageResponse checkIn(TicketUsageRequest request){
        
        // 좌석 조회
        Seat seat = seatRepository.findById(request.getSeatId())
            .orElseThrow(() ->
                new ResourceNotFoundException("존재하지 않는 좌석입니다")
        );

        // 이용권 조회
        Ticket ticket = ticketRepository.findById(request.getTicketId())
            .orElseThrow(() ->
                new ResourceNotFoundException("존재하지 않는 이용권입니다")
        );

        // 좌석 상태 변경
        seat.assignUser(request.getUserId());

        // 만료 예정일 계산
        LocalDateTime endAt = calculateEndAt(ticket);

        // TicketUsage 생성
        TicketUsage ticketUsage = new TicketUsage(
            request.getUserId(),
            request.getTicketId(),
            request.getSeatId(),
            ticket.getTicketType(),
            ticket.getTicketTime() != null
                ? ticket.getTicketTime()
                : 0,
            endAt
        );

        ticketUsageRepository.save(ticketUsage);

        return TicketUsageResponse.from(ticketUsage);
    }

    private LocalDateTime calculateEndAt(Ticket ticket) {

        LocalDateTime now = LocalDateTime.now();

        if (ticket.getTicketType() == TicketType.TIME_PACK) {
            return now.plusMinutes(ticket.getTicketTime());
        }

        return now.plusDays(ticket.getValidDays());
    }
}
