package com.scac.checkin.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.scac.checkin.domain.Checkin;
import com.scac.checkin.repository.CheckinRepository;
import com.scac.global.enums.CheckinStatus;
import com.scac.global.enums.TicketType;
import com.scac.global.enums.TicketUsageStatus;
import com.scac.seat.domain.Seat;
import com.scac.seat.repository.SeatRepository;
import com.scac.ticketusage.entity.TicketUsage;
import com.scac.ticketusage.repository.TicketUsageRepository;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CheckinScheduler {
    private final CheckinRepository checkinRepository;
    private final TicketUsageRepository ticketUsageRepository;
    private final SeatRepository seatRepository;

    // 1분마다 실행
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void deductRemainingTime(){
        List<Checkin> usingList = checkinRepository.findAllByCheckinStatusIn(
            List.of(CheckinStatus.USING, CheckinStatus.AWAY)
        );

        for(Checkin checkin : usingList){
            TicketUsage usage = ticketUsageRepository.findById(checkin.getUsageId())
                .orElse(null);
            
            if(usage == null) continue;

            // READY 상태면 아직 사용 시작 안함
            if(usage.getStatus() == TicketUsageStatus.READY) continue;

            // 시간권 분기
            if(usage.getTicketType() == TicketType.TIME_PACK){
                if(usage.getRemainingTime() > 0){
                    usage.deductTime(1);
                }
                // 시간 다 되면 자동 퇴실
                if(usage.getRemainingTime() <= 0){
                    autoCheckout(checkin, usage);
                }
            } 
            // 기간권 분기
            else if(usage.getTicketType() == TicketType.PERIOD_PACK){
                if(usage.getEndAt() != null && LocalDateTime.now().isAfter(usage.getEndAt())){
                    autoCheckout(checkin, usage);
                }
            }
        }
    }

    // 자동 퇴실 메서드
    private void autoCheckout(Checkin checkin, TicketUsage usage){
        if (checkin.getSeatId() != null) {
            Seat seat = seatRepository.findById(checkin.getSeatId()).orElse(null);
            if(seat != null) seat.releaseUser();
        }

        checkin.checkout();
        usage.expire();
    }
}