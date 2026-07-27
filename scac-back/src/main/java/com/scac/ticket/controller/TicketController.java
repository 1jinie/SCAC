package com.scac.ticket.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scac.global.response.ApiResponse;
import com.scac.ticket.dto.TicketCreateDTO;
import com.scac.ticket.dto.TicketResDTO;
import com.scac.ticket.dto.TicketStatusDTO;
import com.scac.ticket.dto.TicketUpdateDTO;
import com.scac.ticket.service.TicketService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tickets")
public class TicketController {

  private final TicketService ticketService;

  // SEAT 이용권 조회
  @GetMapping
  public ResponseEntity<ApiResponse<List<TicketResDTO>>> findAll() {
    List<TicketResDTO> tickets = ticketService.findSeatTicket();

    return ResponseEntity.ok(
        ApiResponse.success(
            "이용권 목록 조회를 완료했습니다.",
            tickets
        )
    );
  }

  @GetMapping("/{ticketId}")
public ResponseEntity<ApiResponse<TicketResDTO>> findById(
    @PathVariable("ticketId") Long ticketId
) {
  TicketResDTO ticket = ticketService.findById(ticketId);

  return ResponseEntity.ok(
      ApiResponse.success(
          "이용권 조회를 완료했습니다.",
          ticket
      )
  );
}

  @PostMapping
  public ResponseEntity<ApiResponse<TicketResDTO>> create(
      @Valid @RequestBody TicketCreateDTO form
  ) {
    TicketResDTO ticket = ticketService.create(form);

    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(ApiResponse.success(
            "이용권 생성을 완료했습니다.",
            ticket
        ));
  }

  @PutMapping("/{ticketId}")
  public ResponseEntity<ApiResponse<TicketResDTO>> update(
      @PathVariable("ticketId") Long ticketId,
      @Valid @RequestBody TicketUpdateDTO form
  ) {
    TicketResDTO ticket = ticketService.update(ticketId, form);

    return ResponseEntity.ok(
        ApiResponse.success(
            "이용권 수정을 완료했습니다.",
            ticket
        )
    );
  }

  // 이용권의 판매 여부를 변경합니다.
  @PatchMapping("/{ticketId}/status")
  public ResponseEntity<ApiResponse<TicketResDTO>> updateStatus(
      @PathVariable("ticketId") Long ticketId,
      @Valid @RequestBody TicketStatusDTO form
  ) {
    TicketResDTO ticket = ticketService.updateStatus(ticketId, form);

    return ResponseEntity.ok(
        ApiResponse.success(
            "이용권 판매 상태 변경을 완료했습니다.",
            ticket
        )
    );
  }

  @DeleteMapping("/{ticketId}")
  public ResponseEntity<ApiResponse<Void>> delete(
      @PathVariable("ticketId") Long ticketId
  ) {
    ticketService.delete(ticketId);

    return ResponseEntity.ok(
        ApiResponse.success(
            "이용권 삭제를 완료했습니다."
        )
    );
  }
}