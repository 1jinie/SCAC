package com.scac.ticket.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scac.global.enums.TargetType;
import com.scac.global.exception.ResourceNotFoundException;
import com.scac.ticket.dto.TicketCreateDTO;
import com.scac.ticket.dto.TicketResDTO;
import com.scac.ticket.dto.TicketStatusDTO;
import com.scac.ticket.dto.TicketUpdateDTO;
import com.scac.ticket.entity.Ticket;
import com.scac.ticket.repository.TicketRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TicketService {

  private final TicketRepository ticketRepository;

  // 전체 이용권 조회
  public List<TicketResDTO> findAll() {
    return ticketRepository.findAll().stream().map(ticket -> TicketResDTO.from(ticket)).toList();
  }

  // 전체 좌석 이용권 조회
  public List<TicketResDTO> findSeatTicket() {
    return ticketRepository.findByTargetTypeIs(TargetType.SEAT).stream().map(TicketResDTO::from).toList();
  }

  // 전체 미팅룸 이용권 조회
  public List<TicketResDTO> findRoomTicket() {
    return ticketRepository.findByTargetTypeIs(TargetType.MEETING_ROOM).stream().map(TicketResDTO::from)
      .toList();
  }

  // DB 외에서 자유롭게 이용권 데이터 가져오는 용도
  public TicketResDTO findById(Long ticketId) {
    return TicketResDTO.from(findTicket(ticketId));
  }

  // DB의 데이터가 직접적으로 수정될때 데이터 가져오는 용도
  public Ticket findTicket(Long ticketId) {
    return ticketRepository.findById(ticketId)
      .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 이용권입니다."));
  }

  // TicketCreateDTO로 데이터 form을 받고 form을 Ticket으로 변환 후 DB에 저장
  // DB에 저장 후 DB에서 직접 꺼낸 데이터가 아닌 Response용 DTO에 데이터를 담아서 반환
  @Transactional
  public TicketResDTO create(TicketCreateDTO form) {
    Ticket ticket = Ticket.create(form.getTicketName(), form.getTicketType(), form.getTicketTime(),
      form.getTicketPrice(), form.getTargetType());
    return TicketResDTO.from(ticketRepository.save(ticket));
  }

  @Transactional
  public TicketResDTO update(Long ticketId, TicketUpdateDTO form) {
    Ticket ticket = findTicket(ticketId);
    ticket.update(form.getTicketName(), form.getTicketType(), form.getTicketTime(), form.getTicketPrice(),
      form.getTargetType(), form.getIsActive());
    return TicketResDTO.from(ticket);

  }

  @Transactional
  public TicketResDTO updateStatus(Long ticketId, TicketStatusDTO form) {
    Ticket ticket = findTicket(ticketId);
    ticket.updateStatus(form.getIsActive());
    return TicketResDTO.from(ticket);
  }

  @Transactional
  public void delete(Long ticketId) {
    Ticket ticket = findTicket(ticketId);
    ticketRepository.delete(ticket);
  }

}
