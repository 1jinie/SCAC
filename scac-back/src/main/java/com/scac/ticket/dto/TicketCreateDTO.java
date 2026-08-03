package com.scac.ticket.dto;

import com.scac.global.enums.TargetType;
import com.scac.global.enums.TicketType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TicketCreateDTO {

    @NotBlank(message = "이용권명은 필수입니다.")
    private final String ticketName;

    @NotNull(message = "이용권 유형은 필수입니다.")
    private final TicketType ticketType;

    @NotNull(message = "가격은 필수입니다.")
    @PositiveOrZero(message = "가격은 0 이상이어야 합니다.")
    private final Integer ticketPrice;

    @Positive(message = "이용 시간은 1 이상이어야 합니다.")
    private final Integer ticketTime;

    @Positive(message = "유효기간은 1 이상이어야 합니다.")
    private final Integer validDays;

    @NotNull(message = "이용 대상은 필수입니다.")
    private final TargetType targetType;
}