package com.scac.payment.dto;

import com.scac.global.enums.PaymentStatus;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PaymentStatusUpdateDTO {

    @NotNull
    private final PaymentStatus status;
}
