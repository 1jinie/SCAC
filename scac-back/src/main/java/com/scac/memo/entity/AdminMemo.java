package com.scac.memo.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "admin_memo")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AdminMemo {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "memo_id")
  private Long memoId;

  // 관리자 계정 연결 후 수정
  @Column(name = "admin_id")
  private Long adminId;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String content;

  @CreationTimestamp
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  private AdminMemo(Long adminId, String content) {
    this.adminId = adminId;
    this.content = content;
  }

  public static AdminMemo create(Long adminId, String content) {
    return new AdminMemo(adminId, content);
  }

  public void update(String content) {
    this.content = content;
  }
}