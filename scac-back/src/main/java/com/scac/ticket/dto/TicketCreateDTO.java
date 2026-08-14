package com.scac.ticket.dto;

import com.scac.global.enums.TargetType;
import com.scac.global.enums.TicketType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TicketCreateDTO {

    @NotBlank(message = "이용권명은 필수입니다.")
    private String ticketName;

    @NotNull(message = "이용권 유형은 필수입니다.")
    private TicketType ticketType;

    @NotNull(message = "가격은 필수입니다.")
    @PositiveOrZero(message = "가격은 0 이상이어야 합니다.")
    private Integer ticketPrice;

    @Positive(message = "이용 시간은 1 이상이어야 합니다.")
    private Integer ticketTime;

    @Positive(message = "유효기간은 1 이상이어야 합니다.")
    private Integer validDays;

    @NotNull(message = "이용 대상은 필수입니다.")
    private TargetType targetType;
}