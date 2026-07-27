package com.scac.meetingroom.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.scac.global.enums.ReservationStatus;

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
@Table(name = "meeting_room_reservation")
@Getter
@NoArgsConstructor
public class MeetingRoomReservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reservationId;

    private Long roomId;
    private Long userId;
    private Long paymentId;
    private LocalDate reservationDate;
    private Integer startHour;
    private Integer endHour;
    
    @Enumerated(EnumType.STRING)
    private ReservationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public MeetingRoomReservation(
        Long roomId,
        Long userId,
        Long paymentId,
        LocalDate reservationDate,
        Integer startHour,
        Integer endHour
    ){
        this.roomId = roomId;
        this.userId = userId;
        this.paymentId = paymentId;
        this.reservationDate = reservationDate;
        this.startHour = startHour;
        this.endHour = endHour;
        this.status = ReservationStatus.CONFIRMED;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
