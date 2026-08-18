package com.scac.admin.dto.response;

import java.time.LocalDateTime;
import com.scac.system.entity.SystemLog;

public record SystemLogRes(
    Long logId,
    String logType,
    String logLevel,
    String action,
    Long userId,
    String phoneNumber,
    Long adminId,
    String adminLoginId,
    String ipAddress,
    String targetType,
    Long targetId,
    String referenceType,
    Long referenceId,
    String content,
    String detail,
    LocalDateTime createdAt
) {
    public static SystemLogRes from(SystemLog log, String phoneNumber, String adminLoginId) {
        return new SystemLogRes(
            log.getId(),
            log.getLogType(),
            log.getLogLevel(),
            log.getAction(),
            log.getUserId(),
            phoneNumber,
            log.getAdminId(),
            adminLoginId,
            log.getIpAddress(),
            log.getTargetType(),
            log.getTargetId(),
            log.getReferenceType(),
            log.getReferenceId(),
            log.getContent(),
            log.getDetail(),
            log.getCreatedAt()
        );
    }
}