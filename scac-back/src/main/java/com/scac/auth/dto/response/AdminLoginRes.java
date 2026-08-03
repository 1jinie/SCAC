package com.scac.auth.dto.response;

import com.scac.admin.entity.AdminAccount;
import com.scac.auth.dto.JwtTokenRes;
import com.scac.global.enums.AdminRole;

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
