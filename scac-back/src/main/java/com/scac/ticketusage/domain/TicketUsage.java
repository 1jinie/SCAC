package com.scac.ticketusage.domain;

import java.time.LocalDateTime;

import com.scac.global.enums.TicketType;
import com.scac.global.enums.TicketUsageStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ticket_usage")
@Getter
@NoArgsConstructor
public class TicketUsage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long usageId;
    private Long userId;
    private Long ticketId;
    private Long seatId;

    @Enumerated(EnumType.STRING)
    private TicketType ticketType;
    
    @Enumerated(EnumType.STRING)
    private TicketUsageStatus status;
    
    private int remainingTime;
    private LocalDateTime startAt;
    private LocalDateTime checkInAt;
    private LocalDateTime checkOutAt;
    private LocalDateTime outAt;
    private LocalDateTime endAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TicketUsage(
        Long userId,
        Long ticketId,
        Long seatId,
        TicketType ticketType,
        int remainingTime,
        LocalDateTime endAt
    ){
        this.userId = userId;
        this.ticketId = ticketId;
        this.seatId = seatId;
        this.ticketType = ticketType;

        this.status = TicketUsageStatus.USING;
        this.remainingTime = remainingTime;

        this.startAt = LocalDateTime.now();
        this.checkInAt = LocalDateTime.now();
        this.endAt = endAt;

        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // 입실
    public void checkIn(){
        this.status = TicketUsageStatus.USING;
        this.checkInAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // 외출
    public void goOut(){
        this.status = TicketUsageStatus.AWAY;
        this.outAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // 복귀
    public void comeBack(){
        this.status = TicketUsageStatus.USING;
        this.updatedAt = LocalDateTime.now();
    }

    // 퇴실
    public void checkOut(){
        this.checkOutAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
