package com.scac.meetingroom.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.scac.meetingroom.domain.MeetingRoom;

import jakarta.persistence.LockModeType;

public interface MeetingRoomRepository extends JpaRepository<MeetingRoom, Long> {

    // 예약중인 스터디룸 잠그기
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT r
        FROM MeetingRoom r
        WHERE r.roomId = :roomId
        """)
    Optional<MeetingRoom> findByIdForUpdate(@Param("roomId") Long roomId);
}
