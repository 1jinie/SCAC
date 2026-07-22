package com.scac.seat.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.scac.seat.domain.Seat;
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

    // 특정 좌석 조회
    public SeatResponse getSeatById(Long seatId) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new IllegalArgumentException("좌석이 존재하지 않습니다."));
        return SeatResponse.from(seat);
    }
}
