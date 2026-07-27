package com.scac.payment.dto;

import com.scac.global.enums.PaymentMethod;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDTO {

  @NotNull
  private Long ticketId;

  @NotNull
  private Long userId;

  @NotNull
  @Positive
  private Integer amount;

  @NotNull
  private PaymentMethod paymentMethod;
}

