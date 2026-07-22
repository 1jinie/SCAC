package com.scac.seat.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scac.seat.dto.SeatResponse;
import com.scac.seat.service.SeatService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/seats")
public class SeatController {
    private final SeatService seatService;

    @GetMapping
    public List<SeatResponse> getAllSeats(){
        return seatService.getAllSeats();
    }
    
}
