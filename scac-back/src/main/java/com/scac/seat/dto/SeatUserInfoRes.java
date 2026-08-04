package com.scac.seat.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SeatUserInfoRes {
    private String phoneNumber;
    private String ticketName;
    private String ticketType;
    private Integer remainingTime;
    private Long remainingDays;

    public SeatUserInfoRes(
        String phoneNumber,
        String ticketName,
        String ticketType,
        Integer remainingTime,
        Long remainingDays
    ){
        this.phoneNumber = phoneNumber;
        this.ticketName = ticketName;
        this.ticketType = ticketType;
        this.remainingTime = remainingTime;
        this.remainingDays = remainingDays;
    }
}
