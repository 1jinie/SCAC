package com.scac.ticket.entity;

import java.time.LocalDateTime;

import com.scac.global.enums.TargetType;
import com.scac.global.enums.TicketType;

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
@Table(name = "ticket_table")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Ticket {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "ticket_id")
  private Long ticketId;

  @Column(name = "ticket_name", nullable = false, length = 100)
  private String ticketName;

  @Enumerated(EnumType.STRING)
  @Column(name = "ticket_type", nullable = false, length = 100)
  private TicketType ticketType;

  @Column(name = "ticket_time")
  private Integer ticketTime;

  @Column(name = "valid_days")
  private Integer validDays;

  @Column(name = "ticket_price", nullable = false)
  private Integer ticketPrice;

  @Column(name = "is_active", nullable = false)
  private boolean active;

  @Enumerated(EnumType.STRING)
  @Column(name = "target_type", nullable = false, length = 100)
  private TargetType targetType;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  private Ticket(String ticketName, TicketType ticketType, Integer ticketTime, Integer validDays,
    Integer ticketPrice, TargetType targetType, boolean active) {
    validate(ticketName, ticketType, ticketTime, validDays, ticketPrice, targetType, active);
    this.ticketName = ticketName;
    this.ticketType = ticketType;
    this.ticketTime = ticketType == TicketType.TIME_PACK ? ticketTime : null;
    this.validDays = ticketType == TicketType.PERIOD_PACK ? validDays : null;
    this.ticketPrice = ticketPrice;
    this.targetType = targetType;
    this.active = active;
  }

  public static Ticket create(String ticketName, TicketType ticketType, Integer ticketTime, Integer validDays,
    Integer ticketPrice, TargetType targetType) {
    return new Ticket(ticketName, ticketType, ticketTime, validDays, ticketPrice, targetType, true);
  }

  public void update(String ticketName, TicketType ticketType, Integer ticketTime, Integer validDays,
    Integer ticketPrice,

    TargetType targetType, boolean active) {
    validate(ticketName, ticketType, ticketTime, validDays, ticketPrice, targetType, active);
    this.ticketName = ticketName;
    this.ticketType = ticketType;
    this.ticketTime = ticketType == TicketType.TIME_PACK ? ticketTime : null;

    this.validDays = ticketType == TicketType.PERIOD_PACK ? validDays : null;
    this.ticketPrice = ticketPrice;
    this.targetType = targetType;
    this.active = active;
  }

  public void activate() {
    this.active = true;
  }

  public void deactivate() {
    this.active = false;
  }

  public void updateStatus(boolean active) {
    this.active = active;
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

  private static void validate(String ticketName, TicketType ticketType, Integer ticketTime,
    Integer validDays, Integer ticketPrice, TargetType targetType, boolean active) {
    if (ticketName == null || ticketName.isBlank()) {
      throw new IllegalArgumentException("이용권 이름은 필수입니다.");
    }
    if (ticketType == null) {
      throw new IllegalArgumentException("이용권 유형은 필수입니다.");
    }
    if (ticketPrice == null || ticketPrice < 0) {
      throw new IllegalArgumentException("이용권 가격은 0 이상이어야 합니다.");
    }
    if (targetType == null) {
      throw new IllegalArgumentException("이용권 대상 유형은 필수입니다.");
    }
    if (ticketType == TicketType.TIME_PACK && (ticketTime == null || ticketTime <= 0)) {
      throw new IllegalArgumentException("시간권의 이용 시간은 필수이며 0보다 커야 합니다.");
    }

    if (ticketType == TicketType.PERIOD_PACK && (validDays == null || validDays <= 0)) {
      throw new IllegalArgumentException("기간권의 유효기간은 필수이며 0보다 커야 합니다.");
    }

  }
}