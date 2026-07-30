package com.scac.seat.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scac.checkin.domain.Checkin;
import com.scac.checkin.repository.CheckinRepository;
import com.scac.global.enums.CheckinStatus;
import com.scac.global.enums.SeatStatus;
import com.scac.global.enums.TicketType;
import com.scac.global.exception.ResourceNotFoundException;
import com.scac.seat.domain.Seat;
import com.scac.seat.dto.SeatOccupiedResponse;
import com.scac.seat.dto.SeatResponse;
import com.scac.seat.repository.SeatRepository;
import com.scac.ticketusage.entity.TicketUsage;
import com.scac.ticketusage.repository.TicketUsageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SeatService {
    private final CheckinRepository checkinRepository;
    private final SeatRepository seatRepository;
    private final TicketUsageRepository ticketUsageRepository;
    
    // 전체 좌석 조회
    public List<SeatResponse> getAllSeats() {
        return seatRepository.findAll().stream()
                .map(SeatResponse::from)
                .toList();
    }

    // 특정 좌석 조회
    public SeatResponse getSeatById(Long seatId) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> 
                new ResourceNotFoundException("해당 좌석이 존재하지 않습니다")
            );
        return SeatResponse.from(seat);
    }

    // 사용중인 좌석 조회
    public List<SeatOccupiedResponse> getOccupiedSeats(){
        return seatRepository.findByCurrentUserIdIsNotNull()
            .stream().map(SeatOccupiedResponse::from).toList();
    }

    // 좌석 상태 변경(관리자)
    @Transactional
    public void updateStatus(Long seatId, SeatStatus status){
        Seat seat = seatRepository.findById(seatId)
            .orElseThrow(() ->
                new ResourceNotFoundException("존재하지 않는 좌석입니다")
        );

        seat.changeStatus(status);
    }

    // 강제 퇴실 조치(관리자)
    @Transactional
    public void forceCheckout(Long seatId) {
        // 좌석 조회
        Seat seat = seatRepository.findById(seatId)
            .orElseThrow(() -> 
                new ResourceNotFoundException("없는 좌석입니다")
        );

        // 해당 좌석 사용중인 입실 정보 조회
        Checkin checkin = checkinRepository.findBySeatIdAndCheckinStatusIn(seatId, List.of(CheckinStatus.USING, CheckinStatus.AWAY))
            .orElseThrow(() ->
                new ResourceNotFoundException("입실 정보가 없습니다")
        );

        // 이용권 조회
        TicketUsage ticketUsage = ticketUsageRepository.findById(checkin.getUsageId())
            .orElseThrow(() ->
                new ResourceNotFoundException("이용권 정보가 없습니다")
        );

        // 시간권이면 사용시간 차감
        if(ticketUsage.getTicketType() == TicketType.TIME_PACK){
            LocalDateTime now = LocalDateTime.now();

            long usedMinutes = java.time.Duration.between(checkin.getCheckinAt(), now).toMinutes();

            if(usedMinutes > 0){
                ticketUsage.deductTime((int) usedMinutes);
            }
        }

        checkin.checkout();

        seat.releaseUser();
    }
}
