package com.scac.meetingroom.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.scac.global.enums.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminReservationResponse {
    private Long reservationId;

    private Long roomId;
    private String roomNumber;

    private Long userId;
    private String phoneNumber;

    private LocalDate reservationDate;

    private Integer startHour;
    private Integer endHour;

    private ReservationStatus status;

    private LocalDateTime createdAt;

    public String getStartTime(){
        return String.format("%02d:00", startHour);
    }
    public String getEndTime(){
        return String.format("%02d:00", endHour);
    }
}
