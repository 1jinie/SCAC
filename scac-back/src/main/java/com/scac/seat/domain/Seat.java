package com.scac.seat.domain;

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
@Table(name = "seat")
@Getter
@NoArgsConstructor
public class Seat{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seatId;

    private String seatNumber;

    private String zoneType;

    @Enumerated(EnumType.STRING)
    private SeatStatus status;

    private Long currentUserId;

    // 자리 상태 변경(사용자 할당)
    public void assignUser(Long userId){
        if(this.status == SeatStatus.USR){
            throw new BusinessException("이미 사용중인 좌석입니다.");
        }

        this.status = SeatStatus.USR;
        this.currentUserId = userId;
    }

    // 자리 상태 변경(사용자 회수)
    public void releaseUser(){
        this.status = SeatStatus.AVB;
        this.currentUserId = null;
    }
}