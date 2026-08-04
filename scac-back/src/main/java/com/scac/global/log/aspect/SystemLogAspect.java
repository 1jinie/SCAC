package com.scac.global.log.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.scac.auth.jwt.UserPrincipal; // 💡 프로젝트의 UserPrincipal 사용
import com.scac.global.log.annotation.AutoLog;
import com.scac.system.entity.SystemLog;
import com.scac.system.service.SystemLogService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class SystemLogAspect {

    private final SystemLogService systemLogService;

    @Around("@annotation(autoLog)")
    public Object logExecution(ProceedingJoinPoint joinPoint, AutoLog autoLog) throws Throwable {
        Object result = null;
        Throwable exception = null;

        try {
            result = joinPoint.proceed();
        } catch (Throwable t) {
            exception = t;
            throw t;
        } finally {
            try {
                saveSystemLog(autoLog, exception);
            } catch (Exception e) {
                log.error("SystemLog 자동 기록 실패: {}", e.getMessage(), e);
            }
        }

        return result;
    }

    private void saveSystemLog(AutoLog autoLog, Throwable exception) {
        HttpServletRequest request = getHttpServletRequest();
        String ipAddress = getClientIp(request);

        Long userId = null;
        Long adminId = null;

        // 💡 SecurityContext에서 UserPrincipal 추출
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        if (auth != null && auth.getPrincipal() instanceof UserPrincipal principal) {
            if ("admin".equalsIgnoreCase(principal.principalType())) {
                adminId = principal.id();
            } else if ("user".equalsIgnoreCase(principal.principalType())) {
                userId = principal.id();
            }
        }

        String logLevel = (exception != null) ? "ERROR" : autoLog.logLevel();
        String detail = (exception != null) ? exception.getMessage() : null;

        SystemLog systemLog = SystemLog.builder()
                .logType(autoLog.logType())
                .logLevel(logLevel)
                .action(autoLog.action())
                .userId(userId)
                .adminId(adminId)
                .ipAddress(ipAddress)
                .targetType(autoLog.targetType().isBlank() ? null : autoLog.targetType())
                .referenceType(autoLog.referenceType().isBlank() ? null : autoLog.referenceType())
                .content(autoLog.content())
                .detail(detail)
                .build();

        systemLogService.createLog(systemLog);
    }

    private HttpServletRequest getHttpServletRequest() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attributes != null ? attributes.getRequest() : null;
    }

    private String getClientIp(HttpServletRequest request) {
        if (request == null) return null;
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}