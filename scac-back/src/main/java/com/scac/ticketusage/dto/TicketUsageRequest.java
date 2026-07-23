package com.scac.ticketusage.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class TicketUsageRequest {
    @NotNull(message = "사용자 ID는 필수입니다")
    private Long userId;
    
    @NotNull(message = "좌석 ID는 필수입니다")
    private Long seatId;

    @NotNull(message = "이용권 ID는 필수입니다")
    private Long ticketId;
}
