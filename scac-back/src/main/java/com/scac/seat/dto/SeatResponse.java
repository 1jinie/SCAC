package com.scac.seat.dto;

import com.scac.seat.domain.Seat;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SeatResponse {
    private Long seatId;
    private String seatNumber;
    private String zoneType;
    private String status;
    private Long currentUserId;

    public static SeatResponse from(Seat seat){
        return new SeatResponse(
            seat.getSeatId(), 
            seat.getSeatNumber(), 
            seat.getZoneType(), 
            seat.getStatus().name(), 
            seat.getCurrentUserId());
    }
}
