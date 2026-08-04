package com.scac.system.dto;

import java.time.LocalDateTime;

import com.scac.system.entity.SystemLog;

public record SeatLogRes(
    Long logId,
    String action,
    String content,
    String phoneNumber,
    LocalDateTime createdAt
) {
    public static SeatLogRes from(SystemLog log, String phoneNumber){
        return new SeatLogRes(
            log.getId(), 
            log.getAction(), 
            log.getContent(), 
            phoneNumber, 
            log.getCreatedAt());
    }
}
