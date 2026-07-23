package com.scac.room.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.scac.global.exception.ResourceNotFoundException;
import com.scac.room.domain.Room;
import com.scac.room.dto.RoomResponse;
import com.scac.room.repository.RoomRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;

    // 전체 스터디룸 조회
    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll()
                .stream()
                .map(RoomResponse::from)
                .toList();
    }

    // 특정 스터디룸 조회
    public RoomResponse getRoomById(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> 
                new ResourceNotFoundException("해당 스터디룸이 존재하지 않습니다")
            );
        return RoomResponse.from(room);
    }
}
