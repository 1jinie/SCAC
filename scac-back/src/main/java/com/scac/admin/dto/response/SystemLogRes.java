package com.scac.admin.dto.response;

import java.time.LocalDateTime;

public record SystemLogRes(
    Long logId,
    String logType,
    String logLevel,
    String action,
    Long userId,
    Long adminId,
    String targetType,
    Long targetId,
    String content,
    String detail,
    LocalDateTime createdAt
) {
}