package com.scac.meetingroom.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.global.enums.ReservationStatus;
import com.scac.meetingroom.domain.MeetingRoomReservation;

public interface MeetingRoomReservationRepository extends JpaRepository<MeetingRoomReservation, Long>{
    boolean existsByRoomIdAndReservationDateAndStatusInAndStartHourLessThanAndEndHourGreaterThan(
            Long roomId,
            LocalDate reservationDate,
            List<ReservationStatus> statuses,
            Integer endHour,
            Integer startHour
    );
}