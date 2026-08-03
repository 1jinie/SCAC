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

        AdminAccount newAdmin = AdminAccount.builder()
                .loginId(req.getLoginId())
                .password(encodedPassword)
                .name(req.getName())
                .role(req.getRole())
                .build();

        AdminAccount savedAdmin = adminAccountRepository.save(newAdmin);
        return AdminAccountRes.from(savedAdmin);
    }

    /**
     * 2. 관리자 계정 목록 전체 조회
     */
    @Transactional(readOnly = true)
    public List<AdminAccountRes> getAllAdminAccounts() {
        return adminAccountRepository.findAll()
                .stream()
                .map(AdminAccountRes::from)
                .toList();
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

        if (req.getNewPassword() != null && !req.getNewPassword().isBlank()) {
            admin.changePassword(passwordEncoder.encode(req.getNewPassword()));
        }

        if (req.getRole() != null) {
            admin.changeRole(req.getRole());
        }
    }

    /**
     * 5. 관리자 계정 삭제
     */
    public void deleteAdminAccount(Long adminId) {
        if (!adminAccountRepository.existsById(adminId)) {
            throw new IllegalArgumentException("존재하지 않는 관리자 계정입니다.");
        }
        adminAccountRepository.deleteById(adminId);
    }
}