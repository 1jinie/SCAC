package com.scac.admin.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.admin.entity.AdminMemo;

public interface AdminMemoRepository extends JpaRepository<AdminMemo, Long> {

    /**
     * 관리자별 메모 조회
     */
    List<AdminMemo> findByAdminId(Long adminId);

    /**
     * 기간별 메모 조회
     */
    List<AdminMemo> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * 관리자별 최신 메모 조회
     */
    List<AdminMemo> findByAdminIdOrderByCreatedAtDesc(Long adminId);

}
