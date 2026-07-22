package com.scac.seat.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.scac.seat.dto.SeatResponse;
import com.scac.seat.repository.SeatRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SeatService {
    private final SeatRepository seatRepository;
    
    // 전체 좌석 조회
    public List<SeatResponse> getAllSeats() {
        return seatRepository.findAll().stream()
                .map(SeatResponse::from)
                .toList();
    }
}
