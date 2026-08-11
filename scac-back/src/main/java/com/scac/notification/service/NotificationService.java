package com.scac.notification.service;

import java.time.LocalDateTime;
import java.util.Collection;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scac.global.enums.NotificationStatus;
import com.scac.global.enums.NotificationType;
import com.scac.global.exception.ResourceNotFoundException;
import com.scac.notification.client.SolapiMessageClient;
import com.scac.notification.client.SolapiSendResult;
import com.scac.notification.entity.NotificationLog;
import com.scac.notification.repository.NotificationLogRepository;
import com.scac.user.entity.User;
import com.scac.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

  private final NotificationLogRepository notificationLogRepository;
  private final UserRepository userRepository;
  private final SolapiMessageClient solapiMessageClient;

  // 사용자에게 알림 발송
  @Transactional
  public NotificationLog sendToUser(Long userId, NotificationType type, String title, String content) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException("알림 수신 사용자를 찾을 수 없습니다."));

    NotificationLog log = NotificationLog.pending(
        user.getId(),
        user.getPhoneNumber(),
        type,
        title,
        content);

    notificationLogRepository.save(log);

    SolapiSendResult result = solapiMessageClient.sendSms(user.getPhoneNumber(), content);

    if (result.accepted()) {
      log.accept(result.messageId(), result.resultCode());
    } else {
      if (result.messageId() != null || result.resultCode() != null) {
        log.accept(result.messageId(), result.resultCode());
      }
      log.fail(result.resultCode(), result.resultMessage());
    }

    return log;
  }

  // 최근 알림 발송 여부 확인
  @Transactional(readOnly = true)
  public boolean wasSentRecently(Long userId, NotificationType type, Collection<NotificationStatus> statuses,
      LocalDateTime since) {
    return notificationLogRepository
        .existsByUserIdAndNotificationTypeAndStatusInAndCreatedAtAfter(userId, type, statuses, since);
  }

  // SOLAPI 발송 상태 동기화
  @Transactional
  public void syncPendingStatuses() {
    LocalDateTime cutoff = LocalDateTime.now().minusDays(1);

    notificationLogRepository
        .findByStatusAndExternalMsgIdIsNotNullAndCreatedAtAfterOrderByCreatedAtAsc(
            NotificationStatus.PENDING, cutoff)
        .forEach(this::syncStatus);
  }

  // SOLAPI 발송 상태 동기화
  private void syncStatus(NotificationLog log) {
    SolapiMessageClient.SolapiMessageStatus remote = solapiMessageClient.findMessageStatus(log.getExternalMsgId());

    if (remote == null || remote.resultCode() == null) {
      return;
    }

    if ("4000".equals(remote.resultCode())) {
      log.succeed(remote.resultCode(), LocalDateTime.now());
      return;
    }

    // 2000: SOLAPI 접수/대기, 3000: 통신사 처리 중 → 아직 PENDING 유지
    if ("2000".equals(remote.resultCode()) || "3000".equals(remote.resultCode())) {
      return;
    }

    // 그 외 종료/실패 코드는 FAILED 처리
    log.fail(remote.resultCode(), "SOLAPI 발송 실패 (statusCode=" + remote.resultCode() + ")");
  }
}
