package com.scac.ticket.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TicketStatusDTO {

  @NotNull(message = "판매여부 선택은 필수입니다.")
  private Boolean isActive;
}
