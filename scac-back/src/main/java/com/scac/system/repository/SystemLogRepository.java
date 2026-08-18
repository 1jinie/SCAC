package com.scac.system.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.scac.system.entity.SystemLog;

public interface SystemLogRepository extends JpaRepository<SystemLog, Long> {

        List<SystemLog> findByLogType(String logType);

        List<SystemLog> findByLogLevel(String logLevel);

        List<SystemLog> findByUserId(Long userId);

        List<SystemLog> findByAdminId(Long adminId);

        List<SystemLog> findByTargetTypeOrderByCreatedAtDesc(String targetType);

        List<SystemLog> findByTargetTypeAndTargetIdOrderByCreatedAtDesc(String targetType, Long targetId);

        List<SystemLog> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

        List<SystemLog> findByActionAndCreatedAtBetween(String action, LocalDateTime startDate,
                LocalDateTime endDate);

        /**
         * [추가] 금일 에러/심각 로그 수 DB 레벨 집계 (대시보드 성능 최적화)
         */
        @Query("SELECT COUNT(l) FROM SystemLog l " + "WHERE UPPER(l.logLevel) IN ('ERROR', 'CRITICAL') "
                + "AND l.createdAt BETWEEN :startDate AND :endDate")
        long countTodayErrors(@Param("startDate") LocalDateTime startDate,
                @Param("endDate") LocalDateTime endDate);
}