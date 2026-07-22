package com.scac.room.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.room.domain.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {
    
}
