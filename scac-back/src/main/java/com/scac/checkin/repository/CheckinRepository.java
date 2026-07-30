package com.scac.checkin.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.checkin.domain.Checkin;
import com.scac.global.enums.CheckinStatus;

public interface CheckinRepository extends JpaRepository<Checkin, Long>{
    boolean existsByUserIdAndCheckinStatus(
        Long userId,
        CheckinStatus checkinStatuses
    );

    // 현재 입실 중인 기록 조회(입실, 외출, 복귀)
    Optional<Checkin> findByUserIdAndCheckinStatus(Long userId, CheckinStatus checkinStatus);
    
    // 현재 입실 중인 기록 조회(퇴실)
    Optional<Checkin> findByUserIdAndCheckinStatusIn(Long userId, List<CheckinStatus> statuses);
}
