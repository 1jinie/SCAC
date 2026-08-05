package com.scac.system.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
    name = "system_log",
    indexes = {
        @Index(name = "idx_type_created", columnList = "log_type,created_at"),
        @Index(name = "idx_level_created", columnList = "log_level,created_at"),
        @Index(name = "idx_admin_created", columnList = "admin_id,created_at"),
        @Index(name = "idx_user_created", columnList = "user_id,created_at"),
        @Index(name = "idx_target", columnList = "target_type,target_id")
    }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SystemLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long id;

    @Column(name = "log_type", nullable = false, length = 50)
    private String logType;

    @Column(name = "log_level", nullable = false, length = 20)
    private String logLevel;

    @Column(nullable = false, length = 100)
    private String action;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "admin_id")
    private Long adminId;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "target_type", length = 50)
    private String targetType;

    @Column(name = "target_id")
    private Long targetId;

    @Column(name = "reference_type", length = 50)
    private String referenceType;

    @Column(name = "reference_id")
    private Long referenceId;

    @Column(length = 255)
    private String content;

    @Column(columnDefinition = "TEXT")
    private String detail;

    @CreationTimestamp
    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;

    @Builder
    public SystemLog(
            String logType,
            String logLevel,
            String action,
            Long userId,
            Long adminId,
            String ipAddress,
            String targetType,
            Long targetId,
            String referenceType,
            Long referenceId,
            String content,
            String detail
    ) {
        this.logType = logType;
        this.logLevel = logLevel;
        this.action = action;
        this.userId = userId;
        this.adminId = adminId;
        this.ipAddress = ipAddress;
        this.targetType = targetType;
        this.targetId = targetId;
        this.referenceType = referenceType;
        this.referenceId = referenceId;
        this.content = content;
        this.detail = detail;
    }
}