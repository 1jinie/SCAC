package com.scac.meetingroom.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scac.global.response.ApiResponse;
import com.scac.meetingroom.dto.MeetingRoomReservationRequest;
import com.scac.meetingroom.dto.MeetingRoomReservationResponse;
import com.scac.meetingroom.service.MeetingRoomReservationService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequiredArgsConstructor
@RequestMapping("api/meeting-rooms")
public class MeetingRoomReservationController {
    private final MeetingRoomReservationService reservationService;

    @PostMapping("/reservations")
    public ResponseEntity<ApiResponse<MeetingRoomReservationResponse>> reserve(@RequestBody MeetingRoomReservationRequest request) {        
        return ResponseEntity.ok(
            ApiResponse.success(
                "스터디룸 예약이 완료되었습니다",
                reservationService.reserve(request)
            )
        );
    }
    
}
