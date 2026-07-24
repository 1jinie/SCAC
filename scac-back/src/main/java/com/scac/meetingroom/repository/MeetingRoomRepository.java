package com.scac.meetingroom.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.meetingroom.domain.MeetingRoom;

public interface MeetingRoomRepository extends JpaRepository<MeetingRoom, Long> {
    
}
