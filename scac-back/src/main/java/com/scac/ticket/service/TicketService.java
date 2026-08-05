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
    return ticketRepository.findAll().stream().map(TicketResDTO::from).toList();
  }

  // 전체 좌석 이용권 조회
  public List<TicketResDTO> findSeatTicket() {
    return ticketRepository.findByTargetType(TargetType.SEAT).stream().map(TicketResDTO::from).toList();
  }

  // 전체 미팅룸 이용권 조회
  public List<TicketResDTO> findRoomTicket() {
    return ticketRepository.findByTargetType(TargetType.MEETING_ROOM).stream().map(TicketResDTO::from).toList();
  }

  // TargetType별 이용권 조회
  public List<TicketResDTO> findTicketsByTarget(TargetType targetType) {
    if (targetType == null) {
      return findAll();
    }
    return ticketRepository.findByTargetType(targetType).stream().map(TicketResDTO::from).toList();
  }

  public TicketResDTO findById(Long ticketId) {
    return TicketResDTO.from(findTicket(ticketId));
  }

  public Ticket findTicket(Long ticketId) {
    return ticketRepository.findById(ticketId)
      .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 이용권입니다."));
  }

  @Transactional
  public TicketResDTO create(TicketCreateDTO form) {
    Ticket ticket = Ticket.create(form.getTicketName(), form.getTicketType(), form.getTicketTime(),
      form.getValidDays(), form.getTicketPrice(), form.getTargetType());
    return TicketResDTO.from(ticketRepository.save(ticket));
  }

  @Transactional
  public TicketResDTO update(Long ticketId, TicketUpdateDTO form) {
    Ticket ticket = findTicket(ticketId);
    ticket.update(form.getTicketName(), form.getTicketType(), form.getTicketTime(), form.getValidDays(),
      form.getTicketPrice(), form.getTargetType(), form.getIsActive());
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