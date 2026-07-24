package com.scac.checkin.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.checkin.domain.Checkin;
import com.scac.global.enums.CheckinStatus;

public interface CheckinRepository extends JpaRepository<Checkin, Long>{
    Optional<Checkin> findByUserIdAndCheckinStatusNot(
        Long userId,
        CheckinStatus checkinStatus
    );
}
