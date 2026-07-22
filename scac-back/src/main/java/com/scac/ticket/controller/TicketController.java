package com.scac.ticket.controller;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

  @GetMapping
  public List<TicketResDTO> findAll() {
    return ticketService.findAll();
  }

  @PostMapping
  public ResponseEntity<TicketResDTO> create(@Valid @RequestBody TicketCreateDTO form){
    TicketResDTO ticket = ticketService.create(form);
    return ResponseEntity.created(URI.create("/api/tickets/"+ticket.getTicketId())).body(ticket);
  }

  @PutMapping("/{ticketId}")
public TicketResDTO update(
    @PathVariable Long ticketId,
    @Valid @RequestBody TicketUpdateDTO form
) {
  return ticketService.update(ticketId, form);
}

// 판매 여부 업데이트할때 씀
@PatchMapping("/{ticketId}/status")
public TicketResDTO updateStatus(
    @PathVariable Long ticketId,
    @Valid @RequestBody TicketStatusDTO form
) {
  return ticketService.updateStatus(ticketId, form);
}

 @DeleteMapping("/{ticketId}")
public ResponseEntity<Map<String,Object>> delete(
    @PathVariable Long ticketId
) {
  Map<String,Object> map = new HashMap<>();
  if(ticketId == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(map);
  ticketService.delete(ticketId);
  map.put("message", "이용권 삭제를 완료하였습니다.");
  
  return ResponseEntity.status(HttpStatus.OK).body(map); 
}



}
