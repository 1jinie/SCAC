package com.scac.admin.dto.response;

import java.time.LocalDateTime;

import com.scac.admin.entity.AdminAccount;
import com.scac.global.enums.AdminRole;

public record AdminAccountRes(
    Long adminId,
    String loginId,
    String name,
    AdminRole role,
    LocalDateTime lastLoginAt
) {
    public static AdminAccountRes from(AdminAccount admin) {
        return new AdminAccountRes(
            admin.getId(),
            admin.getLoginId(),
            admin.getName(),
            admin.getRole(),
            admin.getLastLoginAt()
        );
    }
}