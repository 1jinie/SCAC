package com.scac.payment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PaymentConfirmDTO {

  @NotBlank
  private String paymentKey;

  @NotBlank
  private String orderId;

  @NotNull
  @Positive
  private Integer amount;

}