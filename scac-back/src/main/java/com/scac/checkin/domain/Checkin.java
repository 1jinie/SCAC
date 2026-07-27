package com.scac.checkin.domain;

import java.time.LocalDateTime;

import com.scac.global.enums.CheckinStatus;
import com.scac.global.exception.BusinessException;

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
    private LocalDateTime awayEndAt;
    private LocalDateTime checkoutAt;

    @Enumerated(EnumType.STRING)
    private CheckinStatus checkinStatus;

    // 입실
    public Checkin(
        Long userId, Long seatId, Long usageId, LocalDateTime checkinAt, CheckinStatus checkinStatus){
            this.userId = userId;
            this.seatId = seatId;
            this.usageId = usageId;
            this.checkinAt = checkinAt;
            this.checkinStatus = checkinStatus;
    }

    // 외출
    public void goAway(){
        if(this.checkinStatus != CheckinStatus.USING){
            throw new BusinessException("현재 입실 상태가 아닙니다");
        }

        this.checkinStatus = CheckinStatus.AWAY;
        this.awayStartAt = LocalDateTime.now();
    }

    // 외출 복귀
    public void comeBack(){
        if(this.checkinStatus != CheckinStatus.AWAY){
            throw new BusinessException("현재 외출 상태가 아닙니다");
        }

        this.checkinStatus = CheckinStatus.USING;
        this.awayEndAt = LocalDateTime.now();
    }

    // 퇴실
    public void checkout(){
        if(this.checkinStatus == CheckinStatus.CHECKOUT){
            throw new BusinessException("이미 퇴실 상태입니다");
        }

        this.checkinStatus = CheckinStatus.CHECKOUT;
        this.checkoutAt = LocalDateTime.now();
    }
}
