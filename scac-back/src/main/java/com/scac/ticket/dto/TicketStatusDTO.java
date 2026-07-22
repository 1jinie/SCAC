package com.scac.ticket.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TicketStatusDTO {

  @NotBlank(message = "판매여부 선택은 필수입니다.")
  private final Boolean isActive;
}
