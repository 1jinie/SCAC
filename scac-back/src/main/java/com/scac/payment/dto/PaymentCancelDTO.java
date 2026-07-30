package com.scac.payment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// 결제 취소 요청 받을경우 DTO
@Getter
@Setter
@NoArgsConstructor
public class PaymentCancelDTO {

    @NotBlank(message = "취소 사유는 필수입니다.")
    @Size(max = 200, message = "취소 사유는 최대 200자까지 입력 가능합니다.")
    private String cancelReason;

}
