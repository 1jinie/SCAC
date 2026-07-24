package com.scac.meetingroom.dto;

import com.scac.meetingroom.domain.MeetingRoom;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MeetingRoomResponse {
    private Long roomId;
    private String roomName;
    private int capacity;
    private String status;
    private int hourlyRate;
    private String description;

    public static MeetingRoomResponse from(MeetingRoom room){
        return new MeetingRoomResponse(
            room.getRoomId(),
            room.getRoomName(),
            room.getCapacity(),
            room.getStatus().name(),
            room.getHourlyRate(),
            room.getDescription()
        );
    }
}
