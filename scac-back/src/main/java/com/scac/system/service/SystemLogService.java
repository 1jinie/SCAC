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

import com.scac.admin.dto.response.SystemLogRes;
import com.scac.admin.entity.AdminAccount;
import com.scac.admin.repository.AdminAccountRepository;
import com.scac.global.exception.ResourceNotFoundException;
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
    private final AdminAccountRepository adminAccountRepository;
    private final SystemLogRepository systemLogRepository;

    /**
     * 전체 로그 목록 조회 (최신순 엔티티 반환)
     */
    public List<SystemLog> getAllLogs() {
        return systemLogRepository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * 로그 레벨별 조회 (INFO, WARNING, ERROR, CRITICAL) (최신순 엔티티 반환)
     */
    public List<SystemLog> getLogsByLevel(String logLevel) {
        return systemLogRepository.findByLogLevelOrderByCreatedAtDesc(logLevel);
    }

    /**
     * 관리자용 시스템 로그 목록 조회 (DTO 변환 및 N+1 최적화)
     */
    public List<SystemLogRes> getAllSystemLogs(String logLevel) {
        List<SystemLog> logs = (logLevel != null && !logLevel.isBlank())
                ? systemLogRepository.findByLogLevelOrderByCreatedAtDesc(logLevel)
                : systemLogRepository.findAllByOrderByCreatedAtDesc();

        return mapToSystemLogResList(logs);
    }

    /**
     * 관리자용 단일 시스템 로그 상세 조회
     */
    public SystemLogRes getLogDetail(Long logId) {
        SystemLog log = systemLogRepository.findById(logId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 시스템 로그를 찾을 수 없습니다. ID: " + logId));

        String userPhone = null;
        if (log.getUserId() != null) {
            userPhone = userRepository.findById(log.getUserId())
                    .map(User::getPhoneNumber)
                    .orElse(null);
        }

        String adminLoginId = null;
        if (log.getAdminId() != null) {
            adminLoginId = adminAccountRepository.findById(log.getAdminId())
                    .map(AdminAccount::getLoginId)
                    .orElse(null);
        }

        return SystemLogRes.from(log, userPhone, adminLoginId);
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
     * 시스템 로그 DTO 변환 시 N+1 방지를 위한 공통 맵핑 메서드
     */
    private List<SystemLogRes> mapToSystemLogResList(List<SystemLog> logs) {
        Set<Long> userIds = logs.stream()
                .map(SystemLog::getUserId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Set<Long> adminIds = logs.stream()
                .map(SystemLog::getAdminId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Map<Long, String> userPhoneMap = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(User::getId, User::getPhoneNumber));

        Map<Long, String> adminLoginIdMap = adminAccountRepository.findAllById(adminIds).stream()
                .collect(Collectors.toMap(AdminAccount::getId, AdminAccount::getLoginId));

        return logs.stream()
                .map(log -> SystemLogRes.from(
                        log,
                        userPhoneMap.get(log.getUserId()),
                        adminLoginIdMap.get(log.getAdminId())
                ))
                .toList();
    }

    /**
     * N+1 조회를 방지하기 위한 좌석 로그 공통 변환 메서드
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