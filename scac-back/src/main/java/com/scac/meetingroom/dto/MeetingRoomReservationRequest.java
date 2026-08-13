package com.scac.meetingroom.dto;

import java.time.LocalDate;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MeetingRoomReservationRequest {
    private Long roomId;
    private LocalDate reservationDate;
    private Integer startHour;
    private Integer endHour;
}
