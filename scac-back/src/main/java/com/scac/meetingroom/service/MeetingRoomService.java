package com.scac.meetingroom.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.scac.global.exception.ResourceNotFoundException;
import com.scac.meetingroom.domain.MeetingRoom;
import com.scac.meetingroom.dto.MeetingRoomResponse;
import com.scac.meetingroom.repository.MeetingRoomRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MeetingRoomService {
    private final MeetingRoomRepository roomRepository;

    // 전체 스터디룸 조회
    public List<MeetingRoomResponse> getAllRooms() {
        return roomRepository.findAll()
                .stream()
                .map(MeetingRoomResponse::from)
                .toList();
    }

    // 특정 스터디룸 조회
    public MeetingRoomResponse getRoomById(Long roomId) {
        MeetingRoom room = roomRepository.findById(roomId)
                .orElseThrow(() -> 
                new ResourceNotFoundException("해당 스터디룸이 존재하지 않습니다")
            );
        return MeetingRoomResponse.from(room);
    }
}
