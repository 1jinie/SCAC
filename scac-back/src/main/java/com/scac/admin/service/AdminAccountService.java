package com.scac.admin.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scac.admin.dto.request.AdminAccountCreateReq;
import com.scac.admin.dto.request.AdminAccountUpdateReq;
import com.scac.admin.dto.response.AdminAccountRes;
import com.scac.admin.entity.AdminAccount;
import com.scac.admin.repository.AdminAccountRepository;
import com.scac.global.enums.AdminRole;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminAccountService {

    private final AdminAccountRepository adminAccountRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 1. 관리자 계정 추가 생성
     */
    public AdminAccountRes createAdminAccount(AdminAccountCreateReq req) {
        if (adminAccountRepository.existsByLoginId(req.getLoginId())) {
            throw new IllegalArgumentException("이미 사용 중인 로그인 ID입니다.");
        }

        String encodedPassword = passwordEncoder.encode(req.getPassword());

        AdminAccount newAdmin = AdminAccount.builder().loginId(req.getLoginId()).password(encodedPassword)
            .name(req.getName()).role(AdminRole.STAFF).build();

        AdminAccount savedAdmin = adminAccountRepository.save(newAdmin);
        return AdminAccountRes.from(savedAdmin);
    }

    /**
     * 2. 관리자 계정 목록 전체 조회
     */
    @Transactional(readOnly = true)
    public List<AdminAccountRes> getAllAdminAccounts() {
        return adminAccountRepository.findAll().stream().map(AdminAccountRes::from).toList();
    }

    /**
     * 3. 특정 관리자 계정 상세 조회
     */
    @Transactional(readOnly = true)
    public AdminAccountRes getAdminAccount(Long adminId) {
        AdminAccount admin = adminAccountRepository.findById(adminId)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 관리자 계정입니다."));
        return AdminAccountRes.from(admin);
    }

    /**
     * 4. 관리자 계정 권한 및 비밀번호 변경
     */
    public void updateAdminAccount(Long adminId, AdminAccountUpdateReq req) {
        AdminAccount admin = adminAccountRepository.findById(adminId)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 관리자 계정입니다."));
        // 비밀번호 변경
        if (req.getNewPassword() != null && !req.getNewPassword().isBlank()) {
            admin.changePassword(passwordEncoder.encode(req.getNewPassword()));
        }
        // 권한 변경
        if (req.getRole() != null && req.getRole() != admin.getRole()) {
            // SUPER_ADMIN이 하나밖에 없다면 해당 SUPER_ADMIN의 STAFF로 권한 변경 못하게 보호
            if (admin.getRole() == AdminRole.SUPER_ADMIN && req.getRole() == AdminRole.STAFF) {
                long superAdminCount = adminAccountRepository.countByRole(AdminRole.SUPER_ADMIN);
                if (superAdminCount <= 1) {
                    throw new IllegalArgumentException("최소 한 명의 SUPER ADMIN은 유지되어야 합니다.");
                }
            }
            admin.changeRole(req.getRole());
        }
    }

    /**
     * 5. 관리자 계정 삭제
     */
    public void deleteAdminAccount(Long adminId) {
        AdminAccount admin = adminAccountRepository.findById(adminId)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 관리자 계정입니다."));
        if (admin.getRole() == AdminRole.SUPER_ADMIN) {
            throw new IllegalArgumentException("SUPER ADMIN 계정은 삭제할 수 없습니다. 권한을 STAFF로 변경한 후 삭제해 주세요.");
        }
        adminAccountRepository.delete(admin);
    }
}