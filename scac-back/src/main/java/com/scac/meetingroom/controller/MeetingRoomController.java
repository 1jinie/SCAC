package com.scac.meetingroom.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scac.global.response.ApiResponse;
import com.scac.meetingroom.dto.MeetingRoomResponse;
import com.scac.meetingroom.service.MeetingRoomService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/rooms")
public class MeetingRoomController {
    private final MeetingRoomService roomService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MeetingRoomResponse>>> getAllRooms() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "전체 스터디룸 조회를 완료했습니다.",
                        roomService.getAllRooms()));
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<ApiResponse<MeetingRoomResponse>> getRoomById(@PathVariable("roomId") Long roomId) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "스터디룸 조회를 완료했습니다.",
                        roomService.getRoomById(roomId)));
    }

}
