package com.scac.notification.entity;

import java.time.LocalDateTime;

import com.scac.global.enums.NotificationStatus;
import com.scac.global.enums.NotificationType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "notification_log")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NotificationLog {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "notification_id")
  private Long notificationId;

  @Column(name = "user_id")
  private Long userId;

  @Column(name = "phone_number", nullable = false, length = 30)
  private String phoneNumber;

  @Enumerated(EnumType.STRING)
  @Column(name = "notification_type", nullable = false, length = 50)
  private NotificationType notificationType;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false, length = 20)
  private NotificationStatus status;

  @Column(name = "title", length = 100)
  private String title;

  @Column(name = "content", columnDefinition = "TEXT")
  private String content;

  @Column(name = "retry_count", nullable = false)
  private Integer retryCount;

  @Column(name = "result_code", length = 50)
  private String resultCode;

  @Column(name = "external_msg_id", length = 100)
  private String externalMsgId;

  @Column(name = "error_message", length = 255)
  private String errorMessage;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "sent_at")
  private LocalDateTime sentAt;

  private NotificationLog(Long userId, String phoneNumber, NotificationType notificationType,
    String title, String content) {
    this.userId = userId;
    this.phoneNumber = phoneNumber;
    this.notificationType = notificationType;
    this.status = NotificationStatus.PENDING;
    this.title = title;
    this.content = content;
    this.retryCount = 0;
  }

  public static NotificationLog pending(Long userId, String phoneNumber,
    NotificationType notificationType, String title, String content) {
    return new NotificationLog(userId, phoneNumber, notificationType, title, content);
  }

  public void accept(String externalMsgId, String resultCode) {
    this.externalMsgId = externalMsgId;
    this.resultCode = resultCode;
    this.errorMessage = null;
  }

  public void succeed(String resultCode, LocalDateTime sentAt) {
    this.status = NotificationStatus.SUCCESS;
    this.resultCode = resultCode;
    this.sentAt = sentAt != null ? sentAt : LocalDateTime.now();
    this.errorMessage = null;
  }

  public void fail(String resultCode, String errorMessage) {
    this.status = NotificationStatus.FAILED;
    this.resultCode = resultCode;
    this.errorMessage = trimError(errorMessage);
  }

  public void increaseRetryCount() {
    this.retryCount += 1;
  }

  @PrePersist
  void setDefaults() {
    if (this.status == null) {
      this.status = NotificationStatus.PENDING;
    }
    if (this.retryCount == null) {
      this.retryCount = 0;
    }
    if (this.createdAt == null) {
      this.createdAt = LocalDateTime.now();
    }
  }

  private String trimError(String message) {
    if (message == null) {
      return null;
    }
    return message.length() <= 255 ? message : message.substring(0, 255);
  }
}
