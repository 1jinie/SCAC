package com.scac.checkin.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.checkin.domain.Checkin;
import com.scac.global.enums.CheckinStatus;

public interface CheckinRepository extends JpaRepository<Checkin, Long>{
    boolean existsByUserIdAndCheckinStatusIn(
        Long userId,
        List<CheckinStatus> checkinStatuses
    );
}
