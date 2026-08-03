package com.scac.system.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scac.system.entity.SystemLog;
import com.scac.system.repository.SystemLogRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SystemLogService {

    private final SystemLogRepository systemLogRepository;

    /**
     * 전체 로그 목록 조회 (최신순)
     */
    public List<SystemLog> getAllLogs() {
        return systemLogRepository.findAll();
    }

    /**
     * 로그 레벨별 조회 (INFO, WARNING, ERROR, CRITICAL)
     */
    public List<SystemLog> getLogsByLevel(String logLevel) {
        return systemLogRepository.findByLogLevel(logLevel);
    }

    /**
     * 당일 발생한 심각/에러 로그 수 집계 (대시보드용)
     */
    public long getTodayErrorCount() {
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        LocalDateTime endOfToday = LocalDate.now().atTime(LocalTime.MAX);

        List<SystemLog> todayLogs = systemLogRepository.findByCreatedAtBetween(startOfToday, endOfToday);
        return todayLogs.stream()
                .filter(log -> "ERROR".equalsIgnoreCase(log.getLogLevel()) || "CRITICAL".equalsIgnoreCase(log.getLogLevel()))
                .count();
    }

    /**
     * 로그 생성 (다른 도메인에서 시스템 이벤트 발생 시 호출)
     */
    @Transactional
    public SystemLog createLog(SystemLog log) {
        return systemLogRepository.save(log);
    }
}