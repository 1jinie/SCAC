package com.scac.meetingroom.scheduler;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.scac.global.enums.ReservationStatus;
import com.scac.global.enums.SeatStatus;
import com.scac.meetingroom.domain.MeetingRoomReservation;
import com.scac.meetingroom.repository.MeetingRoomRepository;
import com.scac.meetingroom.repository.MeetingRoomReservationRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReservationScheduler {
    private final MeetingRoomRepository roomRepository;
    private final MeetingRoomReservationRepository reservationRepository;

    // 1분마다 실행
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void updateReservationStatus() {
        LocalDate today = LocalDate.now();
        int currentHour = LocalTime.now().getHour();

        // CONFIRMED -> IN_USE : 현재 시간이 startHour ~ endHour 사이면 사용중 변경
        List<MeetingRoomReservation> confirmedReservations = reservationRepository.findByReservationDateAndStatus(
                today, ReservationStatus.CONFIRMED);

        confirmedReservations.forEach(r -> {
            if (currentHour >= r.getStartHour() && currentHour < r.getEndHour()) {
                r.updateReservationStatus(ReservationStatus.IN_USE);
                roomRepository.findById(r.getRoomId()).ifPresent(room -> {
                    room.updateStatus(SeatStatus.USR);
                });
            }
        });

        // IN_USE -> COMPLETED : 현재 시간이 endHour 이상이면 예약 종료
        List<MeetingRoomReservation> usingReservations = reservationRepository.findByReservationDateAndStatus(
                today, ReservationStatus.IN_USE);

        usingReservations.forEach(r -> {
            if (currentHour >= r.getEndHour()) {
                r.updateReservationStatus(ReservationStatus.COMPLETED);

                roomRepository.findById(r.getRoomId()).ifPresent(room -> room.updateStatus(SeatStatus.AVB));
            }
        });

        // PENDING_PAYMENT -> CANCELED : 결제 대기 상태에서 30분 이상 경과 시 예약 취소
        List<MeetingRoomReservation> expiredReservations = reservationRepository.findByStatusAndCreatedAtBefore(
                ReservationStatus.PENDING_PAYMENT,
                LocalDateTime.now().minusMinutes(30));

        expiredReservations.forEach(
                MeetingRoomReservation::expirePayment);

    }
}
