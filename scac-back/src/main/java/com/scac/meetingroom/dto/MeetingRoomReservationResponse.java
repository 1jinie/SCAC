package com.scac.meetingroom.dto;

import java.time.LocalDate;

import com.scac.global.enums.ReservationStatus;
import com.scac.meetingroom.domain.MeetingRoomReservation;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MeetingRoomReservationResponse {
    private Long reservationId;
    private Long roomId;
    private Long userId;
    private LocalDate reservationDate;
    private Integer startHour;
    private Integer endHour;
    private ReservationStatus status;

    public static MeetingRoomReservationResponse from(
            MeetingRoomReservation reservation){

        return new MeetingRoomReservationResponse(
                reservation.getReservationId(),
                reservation.getRoomId(),
                reservation.getUserId(),
                reservation.getReservationDate(),
                reservation.getStartHour(),
                reservation.getEndHour(),
                reservation.getStatus()
        );
    }
}
