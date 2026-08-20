package com.scac.admin.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.admin.entity.AdminAccount;
import com.scac.global.enums.AdminRole;

public interface AdminAccountRepository extends JpaRepository<AdminAccount, Long> {

    /**
     * 로그인 ID 조회
     */
    Optional<AdminAccount> findByLoginId(String loginId);

    /**
     * 로그인 ID 중복 검사
     */
    boolean existsByLoginId(String loginId);

    /**
     * 권한별 관리자 조회
     */
    java.util.List<AdminAccount> findByRole(AdminRole role);

    // 관리자 권한 별 수 조회
    long countByRole(AdminRole role);
}