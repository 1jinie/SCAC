package com.scac.notification.repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.global.enums.NotificationStatus;
import com.scac.global.enums.NotificationType;
import com.scac.notification.entity.NotificationLog;

public interface NotificationLogRepository extends JpaRepository<NotificationLog, Long> {

  boolean existsByUserIdAndNotificationTypeAndCreatedAtAfter(
      Long userId, NotificationType notificationType, LocalDateTime createdAt);

  List<NotificationLog> findByStatusAndExternalMsgIdIsNotNullAndCreatedAtAfterOrderByCreatedAtAsc(
      NotificationStatus status, LocalDateTime createdAt);

  boolean existsByUserIdAndNotificationTypeAndStatusAndCreatedAtAfter(Long userId, NotificationType type,
      Collection<NotificationStatus> statuses, LocalDateTime since);
}
