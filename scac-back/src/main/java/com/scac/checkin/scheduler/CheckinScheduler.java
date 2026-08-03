package com.scac.checkin.scheduler;

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

import jakarta.transaction.Transactional;
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

            // 기간권은 차감x
            if(usage.getTicketType() != TicketType.TIME_PACK) continue;

            // READY면 아직 시작 안한 이용권
            if(usage.getStatus() == TicketUsageStatus.READY) continue;

            // 1분 차감
            usage.deductTime(1);

            // 시간 다되면 자동 퇴실
            if(usage.getRemainingTime() <= 0){
                checkin.checkout();

                Seat seat = seatRepository.findById(checkin.getSeatId()).orElse(null);

                if(seat != null){
                    seat.releaseUser();
                }

                usage.expire();
            }
        }
    }
}
