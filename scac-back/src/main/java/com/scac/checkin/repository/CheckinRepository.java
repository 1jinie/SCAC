package com.scac.checkin.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.checkin.domain.Checkin;
import com.scac.global.enums.CheckinStatus;

public interface CheckinRepository extends JpaRepository<Checkin, Long>{
    boolean existsByUserIdAndCheckinStatusIn(
        Long userId,
        List<CheckinStatus> checkinStatuses
    );

    // 현재 입실 중인 기록 조회
    Optional<Checkin> findByUserIdAndCheckoutAtIsNull(Long userId);
}
