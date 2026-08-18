package com.scac.system.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.scac.system.dto.SeatLogRes;
import com.scac.system.entity.SystemLog;
import com.scac.system.repository.SystemLogRepository;
import com.scac.user.entity.User;
import com.scac.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SystemLogService {

    private final UserRepository userRepository;
    private final SystemLogRepository systemLogRepository;

    /**
     * 전체 로그 목록 조회 (최신순)
     */
    public List<SystemLog> getAllLogs() {
        return systemLogRepository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * 로그 레벨별 조회 (INFO, WARNING, ERROR, CRITICAL) (최신순)
     */
    public List<SystemLog> getLogsByLevel(String logLevel) {
        return systemLogRepository.findByLogLevelOrderByCreatedAtDesc(logLevel);
    }

    /**
     * 전체 좌석 로그 조회 (N+1 최적화)
     */
    public List<SeatLogRes> getLogsByTarget(String targetType) {
        List<SystemLog> logs = systemLogRepository.findByTargetTypeOrderByCreatedAtDesc(targetType);
        return mapToSeatLogResList(logs);
    }

    /**
     * 특정 좌석 로그 조회 (N+1 최적화)
     */
    public List<SeatLogRes> getLogsByTarget(String targetType, Long targetId) {
        List<SystemLog> logs = systemLogRepository.findByTargetTypeAndTargetIdOrderByCreatedAtDesc(targetType,
            targetId);
        return mapToSeatLogResList(logs);
    }

    /**
     * N+1 조회를 방지하기 위한 공통 변환 메서드
     */
    private List<SeatLogRes> mapToSeatLogResList(List<SystemLog> logs) {
        Set<Long> userIds = logs.stream().map(SystemLog::getUserId).filter(Objects::nonNull)
            .collect(Collectors.toSet());

        Map<Long, String> userPhoneMap = userRepository.findAllById(userIds).stream()
            .collect(Collectors.toMap(User::getId, User::getPhoneNumber));

        return logs.stream().map(log -> SeatLogRes.from(log, userPhoneMap.getOrDefault(log.getUserId(), "-")))
            .toList();
    }

    /**
     * 당일 발생한 심각/에러 로그 수 집계 (DB 카운트 쿼리 적용)
     */
    public long getTodayErrorCount() {
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        LocalDateTime endOfToday = LocalDate.now().atTime(LocalTime.MAX);

        return systemLogRepository.countTodayErrors(startOfToday, endOfToday);
    }

    /**
     * 로그 생성 (다른 도메인에서 시스템 이벤트 발생 시 독립 트랜잭션으로 저장)
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public SystemLog createLog(SystemLog log) {
        return systemLogRepository.save(log);
    }
}