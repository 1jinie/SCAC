package com.scac.ticket.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TicketStatusDTO {

  @NotNull(message = "판매여부 선택은 필수입니다.")
  private final Boolean isActive;
}
