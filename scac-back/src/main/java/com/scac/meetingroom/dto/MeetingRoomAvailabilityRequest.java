package com.scac.meetingroom.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MeetingRoomAvailabilityRequest {
    private LocalDate reservationDate;
}
