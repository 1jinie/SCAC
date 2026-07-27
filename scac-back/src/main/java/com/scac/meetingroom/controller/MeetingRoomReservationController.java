package com.scac.meetingroom.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scac.global.response.ApiResponse;
import com.scac.meetingroom.dto.MeetingRoomReservationRequest;
import com.scac.meetingroom.dto.MeetingRoomReservationResponse;
import com.scac.meetingroom.service.MeetingRoomReservationService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/meeting-rooms")
public class MeetingRoomReservationController {
    private final MeetingRoomReservationService reservationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MeetingRoomReservationResponse>>> getAllReservations() {
        return ResponseEntity.ok(
            ApiResponse.success(
                "전체 예약을 조회했습니다",
                reservationService.getAllReservations()
            )
        );
    }
    

    @PostMapping("/reservations")
    public ResponseEntity<ApiResponse<MeetingRoomReservationResponse>> reserve(@RequestBody MeetingRoomReservationRequest request) {        
        return ResponseEntity.ok(
            ApiResponse.success(
                "스터디룸 예약이 완료되었습니다",
                reservationService.reserve(request)
            )
        );
    }

    @PatchMapping("/reservations/{reservationId}/cancel")
    public ResponseEntity<ApiResponse<MeetingRoomReservationResponse>> cancel(@PathVariable Long reservationId){
        return ResponseEntity.ok(
            ApiResponse.success(
                "스터디룸 예약 취소가 완료되었습니다",
                reservationService.cancel(reservationId)
            )
        );
    }
    
}
