package com.scac.auth.dto;

import com.scac.global.enums.UserRole;
import com.scac.user.entity.User;

public record LoginRes(

        String accessToken,
        String refreshToken,
        Long userId,
        String phoneNumber,
        UserRole role

) {

    public static LoginRes from(
            JwtTokenRes token,
            User user
    ) {
        return new LoginRes(
                token.accessToken(),
                token.refreshToken(),
                user.getId(),
                user.getPhoneNumber(),
                user.getRole()
        );
    }
}