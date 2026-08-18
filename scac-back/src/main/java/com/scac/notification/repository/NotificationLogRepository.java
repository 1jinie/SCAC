package com.scac.notification.repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.global.enums.NotificationStatus;
import com.scac.global.enums.NotificationType;
import com.scac.notification.entity.NotificationLog;

public interface NotificationLogRepository extends JpaRepository<NotificationLog, Long> {

        boolean existsByUserIdAndNotificationTypeAndCreatedAtAfter(Long userId,
                NotificationType notificationType, LocalDateTime createdAt);

        List<NotificationLog> findByStatusAndExternalMsgIdIsNotNullAndCreatedAtAfterOrderByCreatedAtAsc(
                NotificationStatus status, LocalDateTime createdAt);

        // 특정 사용자의 알림 로그 중 특정 상태(여러가지) 및 생성일 이후의 알림 로그 존재 여부 확인
        boolean existsByUserIdAndNotificationTypeAndStatusInAndCreatedAtAfter(Long userId,
                NotificationType type, Collection<NotificationStatus> statuses, LocalDateTime since);

        // 특정 사용자의 알림 로그 중 특정 상태(단일) 및 생성일 이후의 알림 로그 존재 여부 확인
        boolean existsByUserIdAndNotificationTypeAndStatusAndCreatedAtAfter(Long userId,
                NotificationType notificationType, NotificationStatus status, LocalDateTime createdAt);

        // 특정 사용자, 알림 유형, 상태, 생성일 이후의 알림 로그 수 조회
        long countByUserIdAndNotificationTypeAndStatusAndCreatedAtAfter(Long userId,
                NotificationType notificationType, NotificationStatus status, LocalDateTime createdAt);

}
