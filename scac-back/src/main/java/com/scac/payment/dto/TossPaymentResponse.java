package com.scac.payment.dto;

import java.time.OffsetDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class TossPaymentResponse {

  private String paymentKey;
  private String orderId;
  private String orderName;
  private String method;
  private Integer totalAmount;
  private String status;
  private OffsetDateTime requestedAt;
  private OffsetDateTime approvedAt;
  private Card card;

  public String getApproveNo() {
    return card != null ? card.getApproveNo() : null;
  }

  @Getter
  @NoArgsConstructor
  @JsonIgnoreProperties(ignoreUnknown = true)
  public static class Card {

    private String approveNo;
    private String issuerCode;
    private String acquirerCode;
    private String number;
    private Integer installmentPlanMonths;
    private String cardType;
    private String ownerType;
  }
}