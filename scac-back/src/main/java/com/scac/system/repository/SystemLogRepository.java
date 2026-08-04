package com.scac.system.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.system.entity.SystemLog;

public interface SystemLogRepository extends JpaRepository<SystemLog, Long> {

    /**
     * 로그 타입별 조회
     */
    List<SystemLog> findByLogType(String logType);

    /**
     * 로그 레벨별 조회
     */
    List<SystemLog> findByLogLevel(String logLevel);

    /**
     * 사용자별 로그 조회
     */
    List<SystemLog> findByUserId(Long userId);

    /**
     * 관리자별 로그 조회
     */
    List<SystemLog> findByAdminId(Long adminId);

    /**
     * 대상 타입별 로그 조회
     */
    List<SystemLog> findByTargetTypeOrderByCreatedAtDesc(String targetType);

    /**
     * 대상타입 및 대상ID별 로그 조회
     */
    List<SystemLog> findByTargetTypeAndTargetIdOrderByCreatedAtDesc(String targetType, Long targetId);

    /**
     * 기간별 로그 조회
     */
    List<SystemLog> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * 액션별 기간 조회
     */
    List<SystemLog> findByActionAndCreatedAtBetween(
            String action,
            LocalDateTime startDate,
            LocalDateTime endDate
    );

}
