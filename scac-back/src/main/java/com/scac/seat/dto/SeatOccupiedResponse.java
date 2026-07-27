package com.scac.seat.dto;

import com.scac.seat.domain.Seat;

import lombok.Getter;

@Getter
public class SeatOccupiedResponse {
    private Long seatId;
    private String seatNumber;
    private String zoneType;
    private Long currentUserId;

    public SeatOccupiedResponse(
        Long seatId,
        String seatNumber,
        String zoneType,
        Long currentUserId
    ) {
        this.seatId = seatId;
        this.seatNumber = seatNumber;
        this.zoneType = zoneType;
        this.currentUserId = currentUserId;
    }

    public static SeatOccupiedResponse from(Seat seat) {
        return new SeatOccupiedResponse(
            seat.getSeatId(),
            seat.getSeatNumber(),
            seat.getZoneType(),
            seat.getCurrentUserId()
        );
    }
}
