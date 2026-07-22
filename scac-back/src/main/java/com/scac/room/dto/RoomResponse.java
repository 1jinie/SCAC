package com.scac.room.dto;

import com.scac.room.domain.Room;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RoomResponse {
    private Long roomId;
    private String roomName;
    private int capacity;
    private String status;
    private int hourlyRate;
    private String description;

    public static RoomResponse from(Room room){
        return new RoomResponse(
            room.getRoomId(),
            room.getRoomName(),
            room.getCapacity(),
            room.getStatus().name(),
            room.getHourlyRate(),
            room.getDescription()
        );
    }
}
