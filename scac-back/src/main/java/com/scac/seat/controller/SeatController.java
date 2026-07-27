package com.scac.seat.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scac.global.response.ApiResponse;
import com.scac.seat.dto.SeatOccupiedResponse;
import com.scac.seat.dto.SeatResponse;
import com.scac.seat.service.SeatService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/seats")
public class SeatController {
    private final SeatService seatService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SeatResponse>>> getAllSeats(){
        return ResponseEntity.ok(
            ApiResponse.success(
                "전체 좌석 조회를 완료했습니다.",
                seatService.getAllSeats()
            )
        );
    }

    @GetMapping("/{seatId}")
    public ResponseEntity<ApiResponse<SeatResponse>> getSeatById(@PathVariable("seatId") Long seatId) {
        return ResponseEntity.ok(
            ApiResponse.success(
                "좌석 조회를 완료했습니다.",
                seatService.getSeatById(seatId)
            )
        );
    }
    
    @GetMapping("/occupied")
    public ResponseEntity<ApiResponse<List<SeatOccupiedResponse>>> getOccupiedSeats() {
        return ResponseEntity.ok(
            ApiResponse.success(
                "현재 사용중인 좌석 조회를 완료했습니다",
                seatService.getOccupiedSeats()
            )
        );
    }
    
}
