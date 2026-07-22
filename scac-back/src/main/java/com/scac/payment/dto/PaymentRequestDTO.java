package com.scac.payment.dto;

import com.scac.payment.entity.PaymentMethod;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentRequestDTO {
    @NotNull
    private final Long usageId;

    @NotNull
    private final Long userId;

    @NotNull
    @Positive
    private final Integer amount;

    @NotNull
    private final PaymentMethod paymentMethod;

    @Size(max = 100)
    private final String approvalNum;

    @Size(max = 100)
    private final String paymentKey;

}