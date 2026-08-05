package com.scac.checkin.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.checkin.domain.Checkin;
import com.scac.global.enums.CheckinStatus;

public interface CheckinRepository extends JpaRepository<Checkin, Long>{
    boolean existsByUserIdAndCheckinStatus(
        Long userId,
        CheckinStatus checkinStatus
    );

    boolean existsByUserIdAndCheckinStatusIn(
        Long userId,
        List<CheckinStatus> statuses
    );

    // 사용자 기준 단일 상태 입실 기록 최신 1건 조회
    Optional<Checkin> findFirstByUserIdAndCheckinStatusOrderByCheckinAtDesc(Long userId, CheckinStatus checkinStatus);
    
    // 사용자 기준 다중 상태 입실 기록 최신 1건 조회
    Optional<Checkin> findFirstByUserIdAndCheckinStatusInOrderByCheckinAtDesc(Long userId, List<CheckinStatus> statuses);

    // 좌석 기준 최신 입실 기록 1건 조회 (Safety 적용)
    Optional<Checkin> findFirstBySeatIdAndCheckinStatusInOrderByCheckinAtDesc(Long seatId, List<CheckinStatus> statuses);

    // 특정 상태의 전체 입실 목록 조회
    List<Checkin> findAllByCheckinStatusIn(List<CheckinStatus> statuses);
}