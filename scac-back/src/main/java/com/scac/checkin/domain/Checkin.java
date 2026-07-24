package com.scac.checkin.domain;

import java.time.LocalDateTime;

import com.scac.global.enums.CheckinStatus;

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
@Table(name = "check_inout")
@Getter
@NoArgsConstructor
public class Checkin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long checkinId;

    private Long userId;
    private Long usageId;
    private Long seatId;
    private LocalDateTime checkinAt;
    private LocalDateTime awayStartAt;
    private LocalDateTime checkoutAt;

    @Enumerated(EnumType.STRING)
    private CheckinStatus checkinStatus;
    private LocalDateTime createdAt;

    public Checkin(
        Long userId, Long seatId, Long usageId, LocalDateTime checkinAt, CheckinStatus checkinStatus){
            this.userId = userId;
            this.seatId = seatId;
            this.usageId = usageId;
            this.checkinAt = checkinAt;
            this.checkinStatus = checkinStatus;
    }
}
