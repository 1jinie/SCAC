package com.scac.meetingroom.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MeetingRoomAvailabilityResponse {
    private Integer startHour;
    private Integer endHour;
    private boolean available;
}
