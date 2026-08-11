package com.scac.notification.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.scac.global.enums.NotificationStatus;
import com.scac.global.enums.NotificationType;
import com.scac.global.enums.TicketType;
import com.scac.global.enums.TicketUsageStatus;
import com.scac.notification.service.NotificationService;
import com.scac.ticketusage.entity.TicketUsage;
import com.scac.ticketusage.repository.TicketUsageRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class NotificationScheduler {

  private final TicketUsageRepository ticketUsageRepository;
  private final NotificationService notificationService;

  // 설정값이 아예 없을때 사용할 기본값. false로 설정하면 알림 기능이 비활성화됨
  // 문자를 보낼 담당자만 .env가서 true로 바꾸세요
  @Value("${notification.enabled:false}")
  private boolean notificationEnabled;

  @Value("${notification.expiration.time-minutes:30}")
  private int timePackPreviewMinutes;

  @Value("${notification.expiration.period-hours:24}")
  private int periodPackPreviewHours;

  // 1분마다 이용권 만료 예정 알림 대상 확인
  @Scheduled(cron = "15 * * * * *")
  public void sendExpirationPreview() {

    if (!notificationEnabled) {

      return;
    }

    sendTimePackExpirationPreview();
    sendPeriodPackExpirationPreview();
  }

  // 1분마다 SOLAPI의 실제 발송 결과를 notification_log에 반영
  @Scheduled(cron = "45 * * * * *")
  public void syncNotificationStatus() {
    if (!notificationEnabled) {
      return;
    }

    notificationService.syncPendingStatuses();
  }

  // 시간권 만료 예정 알림 대상자에게 문자 발송
  private void sendTimePackExpirationPreview() {
    List<TicketUsage> targets = ticketUsageRepository
        .findByStatusAndTicketTypeAndRemainingTimeBetween(
            TicketUsageStatus.USING,
            TicketType.TIME_PACK,
            1,
            timePackPreviewMinutes);

    for (TicketUsage usage : targets) {

      if (alreadyNotified(usage)) {
        continue;
      }

      String content = String.format(
          "[SCAC] 현재 이용권 사용 시간이 %d분 이하로 남았습니다.",
          timePackPreviewMinutes);

      notificationService.sendToUser(
          usage.getUserId(),
          NotificationType.EXPIRATION_PREVIEW,
          "이용권 만료 안내",
          content);
    }
  }

  // 기간권 만료 예정 알림 대상자에게 문자 발송
  private void sendPeriodPackExpirationPreview() {
    LocalDateTime now = LocalDateTime.now();
    LocalDateTime previewLimit = now.plusHours(periodPackPreviewHours);

    List<TicketUsage> targets = ticketUsageRepository
        .findByStatusAndTicketTypeAndEndAtBetween(
            TicketUsageStatus.USING,
            TicketType.PERIOD_PACK,
            now,
            previewLimit);

    for (TicketUsage usage : targets) {
      if (alreadyNotified(usage)) {
        continue;
      }

      String content = String.format(
          "[SCAC] 현재 이용권이 %d시간 이내에 만료됩니다.",
          periodPackPreviewHours);

      notificationService.sendToUser(
          usage.getUserId(),
          NotificationType.EXPIRATION_PREVIEW,
          "이용권 만료 안내",
          content);
    }
  }

  // 이미 알림을 보낸 이용권인지 확인
  private boolean alreadyNotified(TicketUsage usage) {
    LocalDateTime since = usage.getStartAt() != null
        ? usage.getStartAt()
        : usage.getCreatedAt();

    return notificationService.wasSentRecently(
        usage.getUserId(),
        NotificationType.EXPIRATION_PREVIEW,
        List.of(
            NotificationStatus.PENDING,
            NotificationStatus.SUCCESS),
        since);
  }
}
