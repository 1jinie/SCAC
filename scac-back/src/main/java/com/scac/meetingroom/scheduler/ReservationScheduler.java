package com.scac.meetingroom.scheduler;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.scac.global.enums.ReservationStatus;
import com.scac.global.enums.SeatStatus;
import com.scac.global.enums.TicketUsageStatus;
import com.scac.meetingroom.domain.MeetingRoomReservation;
import com.scac.meetingroom.repository.MeetingRoomRepository;
import com.scac.meetingroom.repository.MeetingRoomReservationRepository;
import com.scac.ticketusage.repository.TicketUsageRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReservationScheduler {
    private final MeetingRoomRepository roomRepository;
    private final TicketUsageRepository ticketUsageRepository;
    private final MeetingRoomReservationRepository reservationRepository;

    // 1분마다 실행
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void updateReservationStatus() {
        LocalDate today = LocalDate.now();
        int currentHour = LocalTime.now().getHour();

        List<MeetingRoomReservation> allReservations = reservationRepository.findByStatusIn(List.of(ReservationStatus.CONFIRMED, ReservationStatus.IN_USE));
        List<MeetingRoomReservation> todayReservations = reservationRepository
            .findByReservationDate(today);

        // 날짜 지난 예약 만료 처리
        allReservations.forEach(r -> {
            if (today.isAfter(r.getReservationDate())) {
                r.updateReservationStatus(ReservationStatus.COMPLETED);
                roomRepository.findById(r.getRoomId()).ifPresent(room -> {
                    room.updateStatus(SeatStatus.AVB);
                });
                ticketUsageRepository.findByReservationId(r.getReservationId())
                    .ifPresent(ticketUsage -> {
                        if(ticketUsage.getStatus() != TicketUsageStatus.EXPIRED
                            && ticketUsage.getStatus() != TicketUsageStatus.CANCELED){
                            ticketUsage.expire();
                        }
                    });
            }
        });

        todayReservations.forEach(r -> {
            // 예약 종료
            if (currentHour >= r.getEndHour()) {
                r.updateReservationStatus(ReservationStatus.COMPLETED);
                roomRepository.findById(r.getRoomId()).ifPresent(room -> {
                    room.updateStatus(SeatStatus.AVB);
                });
                ticketUsageRepository.findByReservationId(r.getReservationId())
                    .ifPresent(ticketUsage -> {
                        if(ticketUsage.getStatus() != TicketUsageStatus.EXPIRED
                            && ticketUsage.getStatus() != TicketUsageStatus.CANCELED){
                            ticketUsage.expire();
                        }
                    });
            } else if (currentHour >= r.getStartHour()){
                // 예약 사용중
                r.updateReservationStatus(ReservationStatus.IN_USE);
                roomRepository.findById(r.getRoomId()).ifPresent(room -> room.updateStatus(SeatStatus.USR));
                ticketUsageRepository.findByReservationId(r.getReservationId())
                    .ifPresent(ticketUsage -> {
                        if(ticketUsage.getStatus() == TicketUsageStatus.READY){
                            ticketUsage.start();
                        }
                    });
            }
        });

        // PENDING_PAYMENT -> CANCELED : 결제 대기 상태에서 5분 이상 경과 시 예약 취소
        List<MeetingRoomReservation> expiredReservations = reservationRepository
            .findByStatusAndCreatedAtBefore(ReservationStatus.PENDING_PAYMENT,
                LocalDateTime.now().minusMinutes(5));

        expiredReservations.forEach(MeetingRoomReservation::expirePayment);

    }
}
