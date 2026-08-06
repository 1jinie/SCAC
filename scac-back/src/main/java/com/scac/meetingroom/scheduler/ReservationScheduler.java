package com.scac.meetingroom.scheduler;

import java.time.LocalDate;
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
    public void updateReservationStatus(){
        LocalDate today = LocalDate.now();
        int currentHour = LocalTime.now().getHour();

        // CONFIRMED -> IN_USE
        List<MeetingRoomReservation> startReservations = reservationRepository.findByReservationDateAndStartHourAndStatus(
            today, currentHour, ReservationStatus.CONFIRMED
        );

        startReservations.forEach(r -> {
            r.updateReservationStatus(ReservationStatus.IN_USE);
            roomRepository.findById(r.getRoomId()).ifPresent(room -> room.updateStatus(SeatStatus.USR));
        });

        // IN_USE -> COMPLETED
        List<MeetingRoomReservation> endReservations = reservationRepository.findByReservationDateAndEndHourAndStatus(
            today, currentHour, ReservationStatus.IN_USE
        );

        endReservations.forEach(r -> {
            r.updateReservationStatus(ReservationStatus.COMPLETED);

            boolean inUse = reservationRepository.existsByRoomIdAndStatus(r.getRoomId(), ReservationStatus.IN_USE);

            if(!inUse)
                roomRepository.findById(r.getRoomId()).ifPresent(room -> room.updateStatus(SeatStatus.AVB));
        });
    }
}
