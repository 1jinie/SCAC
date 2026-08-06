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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.scac.global.enums.TargetType;
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

    // 이용권 목록 조회 (targetType 파라미터 미지정 시 SEAT 기본 조회)
    @GetMapping
    public ResponseEntity<ApiResponse<List<TicketResDTO>>> findAll(
        @RequestParam(name = "targetType", required = false, defaultValue = "SEAT") TargetType targetType) {
        List<TicketResDTO> tickets = ticketService.findTicketsByTarget(targetType);
        return ResponseEntity.ok(ApiResponse.success("이용권 목록 조회를 완료했습니다.", tickets));
    }

    // 미팅룸 전용 이용권 목록 조회
    @GetMapping("/room")
    public ResponseEntity<ApiResponse<List<TicketResDTO>>> findRoomTickets() {
        List<TicketResDTO> tickets = ticketService.findRoomTicket();
        return ResponseEntity.ok(ApiResponse.success("미팅룸 이용권 목록 조회를 완료했습니다.", tickets));
    }

    @GetMapping("/{ticketId}")
    public ResponseEntity<ApiResponse<TicketResDTO>> findById(@PathVariable("ticketId") Long ticketId) {
        TicketResDTO ticket = ticketService.findById(ticketId);

        return ResponseEntity.ok(ApiResponse.success("이용권 조회를 완료했습니다.", ticket));
    }

}