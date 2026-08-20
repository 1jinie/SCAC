package com.scac.meetingroom.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.scac.global.enums.ReservationStatus;
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

    public MeetingRoomReservation(Long roomId, Long userId, Long paymentId, LocalDate reservationDate,
        Integer startHour, Integer endHour) {
        this.roomId = roomId;
        this.userId = userId;
        this.paymentId = paymentId;
        this.reservationDate = reservationDate;
        this.startHour = startHour;
        this.endHour = endHour;
        this.status = ReservationStatus.PENDING_PAYMENT;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void cancel() {
        if (this.status != ReservationStatus.CONFIRMED) {
            throw new BusinessException("취소할 수 없는 예약입니다");
        }
        this.status = ReservationStatus.CANCELED;
        this.updatedAt = LocalDateTime.now();
    }

    public void updateReservationStatus(ReservationStatus status) {
        this.status = status;
    }

    // 결제 완료 시 예약 상태를 CONFIRMED로 변경
    public void confirmPayment(Long paymentId) {
        if (status != ReservationStatus.PENDING_PAYMENT) {
            throw new IllegalStateException("결제 대기 중인 예약만 확정할 수 있습니다.");
        }

        if (paymentId == null) {
            throw new IllegalArgumentException("결제 ID는 필수입니다.");
        }

        this.paymentId = paymentId;
        this.status = ReservationStatus.CONFIRMED;
        this.updatedAt = LocalDateTime.now();
    }

    // 결제 만료 시 예약 상태를 CANCELED로 변경
    public void expirePayment() {
        if (this.status != ReservationStatus.PENDING_PAYMENT) {
            return;
        }

        this.status = ReservationStatus.CANCELED;
        this.updatedAt = LocalDateTime.now();
    }

    // 결제 전 임시 예약 취소
    public void cancelPendingPayment() {
        if (this.status == ReservationStatus.CANCELED) {
            return;
        }
        if (this.status != ReservationStatus.PENDING_PAYMENT) {
            throw new BusinessException("결제 대기 중인 예약만 취소할 수 있습니다.");
        }

        this.status = ReservationStatus.CANCELED;
        this.updatedAt = LocalDateTime.now();
    }
}
