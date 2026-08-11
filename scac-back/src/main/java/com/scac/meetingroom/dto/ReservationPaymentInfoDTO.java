package com.scac.meetingroom.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

// 스터디룸 예약 결제용 DTO
@Getter
@AllArgsConstructor
public class ReservationPaymentInfoDTO {

  private Long reservationId;
  private Long roomId;
  private Long userId;

  private Integer amount;
}