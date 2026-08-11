package com.scac.ticketusage.entity;

import java.time.LocalDateTime;

import com.scac.global.enums.TicketType;
import com.scac.global.enums.TicketUsageStatus;
import com.scac.global.exception.BusinessException;
import com.scac.meetingroom.domain.MeetingRoomReservation;
import com.scac.ticket.entity.Ticket;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "ticket_usage")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TicketUsage {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "usage_id")
  private Long usageId;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(name = "ticket_id")
  private Long ticketId;

  @Column(name = "reservation_id")
  private Long reservationId;

  @Enumerated(EnumType.STRING)
  @Column(name = "ticket_type", nullable = false, length = 50)
  private TicketType ticketType;

  @Column(name = "remaining_time")
  private Integer remainingTime;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false, length = 50)
  private TicketUsageStatus status;

  @Column(name = "start_at")
  private LocalDateTime startAt;

  @Column(name = "end_at")
  private LocalDateTime endAt;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  private TicketUsage(Long userId, Long ticketId, Long reservationId, TicketType ticketType, Integer remainingTime

  ) {
    this.userId = userId;
    this.ticketId = ticketId;
    this.reservationId = reservationId;
    this.ticketType = ticketType;
    this.remainingTime = remainingTime;

    this.status = TicketUsageStatus.READY;
  }

  public static TicketUsage createTicketUsage(Long userId, Ticket ticket) {
    if (userId == null) {
      throw new IllegalArgumentException("사용자 ID는 필수입니다.");
    }
    if (ticket == null) {
      throw new IllegalArgumentException("이용권 정보는 필수입니다.");
    }
    if (!ticket.isActive()) {
      throw new IllegalArgumentException("판매 중인 이용권이 아닙니다.");
    }

    return new TicketUsage(userId, ticket.getTicketId(), null, ticket.getTicketType(), ticket.getTicketTime()

    );
  }

  public static TicketUsage createReservationUsage(Long userId, MeetingRoomReservation reservation) {
    if (userId == null) {
      throw new IllegalArgumentException("사용자 ID는 필수입니다.");
    }
    if (reservation == null) {
      throw new IllegalArgumentException("예약 정보는 필수입니다.");
    }

    TicketUsage usage = new TicketUsage(userId, null, reservation.getReservationId(), TicketType.MEETING_ROOM,
        null);
    usage.setStartAt(reservation.getReservationDate().atStartOfDay().plusHours(reservation.getStartHour()));
    usage.setEndAt(reservation.getReservationDate().atStartOfDay().plusHours(reservation.getEndHour()));
    return usage;
  }

  // 시간권 시작
  public void start() {
    if (status == TicketUsageStatus.EXPIRED || status == TicketUsageStatus.CANCELED) {
      throw new IllegalStateException("사용할 수 없는 이용권입니다.");
    }

    if (status == TicketUsageStatus.USING) {
      return;
    }

    this.status = TicketUsageStatus.USING;
    if (startAt == null)
      this.startAt = LocalDateTime.now();
  }

  // 기간권 시작
  public void startPeriod(int validDays) {
    start();

    if (endAt == null)
      endAt = startAt.plusDays(validDays);
  }

  // 시간권 다시 준비상태로
  public void ready() {
    if (status == TicketUsageStatus.EXPIRED || status == TicketUsageStatus.CANCELED) {
      throw new BusinessException("변경할 수 없는 상태입니다");
    }

    this.status = TicketUsageStatus.READY;
  }

  public void deductTime(int usedMinutes) {
    if (ticketType != TicketType.TIME_PACK) {
      throw new IllegalStateException("시간권만 이용시간을 차감할 수 있습니다.");
    }
    if (usedMinutes <= 0) {
      throw new IllegalArgumentException("차감 시간은 0보다 커야 합니다.");
    }
    if (remainingTime == null || remainingTime < usedMinutes) {
      throw new IllegalArgumentException("남은 이용시간이 부족합니다.");
    }

    this.remainingTime -= usedMinutes;

    if (remainingTime == 0) {
      expire();
    }
  }

  public void expire() {
    this.status = TicketUsageStatus.EXPIRED;

    if (endAt == null) {
      this.endAt = LocalDateTime.now();
    }
  }

  // 이용권 취소
  public void cancel() {
    if (status != TicketUsageStatus.READY) {
      throw new IllegalStateException("사용하지 않은 상태에서만 취소할 수 있습니다.");
    }

    this.status = TicketUsageStatus.CANCELED;
  }

  // 사용가능한 이용권인지 체크
  public boolean isAvailable() {
    if (status == TicketUsageStatus.CANCELED || status == TicketUsageStatus.EXPIRED) {
      return false;
    }

    if (ticketType == TicketType.TIME_PACK) {
      return remainingTime != null && remainingTime > 0;
    }

    if (ticketType == TicketType.PERIOD_PACK) {
      return endAt == null || endAt.isAfter(LocalDateTime.now());
    }

    if (ticketType == TicketType.MEETING_ROOM) {
      return endAt != null && endAt.isAfter(LocalDateTime.now());
    }

    return false;
  }

  @PrePersist
  void setCreatedAt() {
    LocalDateTime now = LocalDateTime.now();
    this.createdAt = now;
    this.updatedAt = now;
  }

  @PreUpdate
  void setUpdatedAt() {
    this.updatedAt = LocalDateTime.now();
  }

  public void setStartAt(LocalDateTime startAt) {
    this.startAt = startAt;
  }

  public void setEndAt(LocalDateTime endAt) {
    this.endAt = endAt;
  }
}