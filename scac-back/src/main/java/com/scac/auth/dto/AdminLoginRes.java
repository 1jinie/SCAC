package com.scac.auth.dto;

import com.scac.admin.entity.AdminAccount;
import com.scac.admin.entity.AdminRole;

public record AdminLoginRes(
        String accessToken,
        String refreshToken,
        Long adminId,
        String loginId,
        AdminRole role
)
{
    public static AdminLoginRes from(JwtTokenRes token, AdminAccount admin) {
        return new AdminLoginRes(
                token.accessToken(),
                token.refreshToken(),
                admin.getId(),
                admin.getLoginId(),
                admin.getRole()
        );
    }
}
