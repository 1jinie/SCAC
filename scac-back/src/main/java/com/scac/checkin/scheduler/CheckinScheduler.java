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
import com.scac.global.exception.BusinessException;
import com.scac.seat.domain.Seat;
import com.scac.seat.repository.SeatRepository;
import com.scac.system.entity.SystemLog;
import com.scac.system.service.SystemLogService;
import com.scac.ticket.entity.Ticket;
import com.scac.ticket.repository.TicketRepository;
import com.scac.ticketusage.entity.TicketUsage;
import com.scac.ticketusage.repository.TicketUsageRepository;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CheckinScheduler {
    private final TicketRepository ticketRepository;
    private final CheckinRepository checkinRepository;
    private final TicketUsageRepository ticketUsageRepository;
    private final SeatRepository seatRepository;
    private final SystemLogService systemLogService;

    // 다음 이용권으로 전환
    private TicketUsage activateNextTicket(Long userId) {
        // 1순위 : READY 기간권
        TicketUsage next = ticketUsageRepository.findFirstByUserIdAndStatusAndTicketTypeOrderByCreatedAtAsc(
            userId, TicketUsageStatus.READY, TicketType.PERIOD_PACK).orElse(null);

        // 2순위 : READY 시간권
        if (next == null) {
            next = ticketUsageRepository.findFirstByUserIdAndStatusAndTicketTypeOrderByCreatedAtAsc(userId,
                TicketUsageStatus.READY, TicketType.TIME_PACK).orElse(null);
        }

        if (next == null)
            return null;

        // 시간권
        if (next.getTicketType() == TicketType.TIME_PACK) {
            next.start();
        }
        // 기간권
        else if (next.getTicketType() == TicketType.PERIOD_PACK) {
            Ticket ticket = ticketRepository.findById(next.getTicketId())
                .orElseThrow(() -> new BusinessException("해당 상품이 없습니다"));

            next.startPeriod(ticket.getValidDays());
        }

        return next;
    }

    // 1분마다 실행
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void deductRemainingTime() {
        List<Checkin> usingList = checkinRepository
            .findAllByCheckinStatusIn(List.of(CheckinStatus.USING, CheckinStatus.AWAY));

        for (Checkin checkin : usingList) {
            // 현재 사용중 이용권
            TicketUsage usage = ticketUsageRepository
                .findFirstByUserIdAndStatusAndTicketIdIsNotNullOrderByCreatedAtDesc(checkin.getUserId(),
                    TicketUsageStatus.USING)
                .orElse(null);

            // USING 이용권 없으면 READY 중 가장 오래된 이용권을 USING으로 변경
            if (usage == null) {
                usage = activateNextTicket(checkin.getUserId());

                if (usage == null) {
                    autoCheckout(checkin);
                    continue;
                }
            }

            // 시간권 분기
            if (usage.getTicketType() == TicketType.TIME_PACK) {
                if (usage.getRemainingTime() > 0) {
                    usage.deductTime(1);
                }

                if (usage.getRemainingTime() <= 0) {
                    usage.expire();

                    TicketUsage next = activateNextTicket(checkin.getUserId());

                    if (next != null) {
                        checkin.changeUsage(next.getUsageId());
                    } else {
                        autoCheckout(checkin);
                    }

                    continue;
                }
            }

            // 기간권 분기
            else if (usage.getTicketType() == TicketType.PERIOD_PACK) {
                if (usage.getEndAt() != null && LocalDateTime.now().isAfter(usage.getEndAt())) {
                    usage.expire();

                    TicketUsage next = activateNextTicket(checkin.getUserId());

                    if (next != null) {
                        checkin.changeUsage(next.getUsageId());
                    } else {
                        autoCheckout(checkin);
                    }

                    continue;
                }
            }
        }
    }

    // 자동 퇴실 메서드
    private void autoCheckout(Checkin checkin) {
        if (checkin.getSeatId() != null) {
            Seat seat = seatRepository.findById(checkin.getSeatId()).orElse(null);
            if (seat != null) {
                seat.releaseUser();

                SystemLog log = SystemLog.builder().logType("SEAT").logLevel("INFO")
                    .action("SEAT_AUTO_CHECK_OUT").userId(checkin.getUserId()).targetType("SEAT")
                    .targetId(seat.getSeatId()).referenceType("CHECK_INOUT")
                    .referenceId(checkin.getCheckinId()).content(seat.getSeatNumber() + " 좌석 자동 퇴실")
                    .detail(String.format("{\"seat_name\":\"%s\"}", seat.getSeatNumber())).build();

                systemLogService.createLog(log);
            }
        }

        checkin.checkout();
    }
}