package com.scac.admin.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scac.global.log.annotation.AutoLog;
import com.scac.global.response.ApiResponse;
import com.scac.ticket.dto.TicketCreateDTO;
import com.scac.ticket.dto.TicketResDTO;
import com.scac.ticket.dto.TicketStatusDTO;
import com.scac.ticket.dto.TicketUpdateDTO;
import com.scac.ticket.service.TicketService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/tickets")
@RequiredArgsConstructor
public class AdminTicketController {
  private final TicketService ticketService;

  // 관리자 이용권 생성
  @AutoLog(logType = "TICKET", action = "CREATE", targetType = "TICKET", content = "신규 이용권 상품 생성")
  @PostMapping
  public ResponseEntity<ApiResponse<TicketResDTO>> create(@Valid @RequestBody TicketCreateDTO form) {
    TicketResDTO ticket = ticketService.create(form);

    return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("이용권 생성을 완료했습니다.", ticket));
  }

  // 관리자 이용권 수정
  @AutoLog(logType = "TICKET", action = "UPDATE", targetType = "TICKET", content = "이용권 상품 정보 수정")
  @PutMapping("/{ticketId}")
  public ResponseEntity<ApiResponse<TicketResDTO>> update(@PathVariable("ticketId") Long ticketId,
    @Valid @RequestBody TicketUpdateDTO form) {
    TicketResDTO ticket = ticketService.update(ticketId, form);

    return ResponseEntity.ok(ApiResponse.success("이용권 수정을 완료했습니다.", ticket));
  }

  // 관리자 이용권 판매 상태 변경
  @AutoLog(logType = "TICKET", action = "UPDATE_STATUS", targetType = "TICKET", content = "이용권 판매 상태 변경")
  @PatchMapping("/{ticketId}/status")
  public ResponseEntity<ApiResponse<TicketResDTO>> updateStatus(@PathVariable("ticketId") Long ticketId,
    @Valid @RequestBody TicketStatusDTO form) {
    TicketResDTO ticket = ticketService.updateStatus(ticketId, form);

    return ResponseEntity.ok(ApiResponse.success("이용권 판매 상태 변경을 완료했습니다.", ticket));
  }

  // 관리자 이용권 삭제
  @AutoLog(logType = "TICKET", action = "DELETE", targetType = "TICKET", content = "이용권 상품 삭제")
  @DeleteMapping("/{ticketId}")
  public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("ticketId") Long ticketId) {
    ticketService.delete(ticketId);

    return ResponseEntity.ok(ApiResponse.success("이용권 삭제를 완료했습니다."));
  }

}
