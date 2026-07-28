package com.scac.auth.jwt;

import com.scac.global.enums.UserRole;

public record UserPrincipal(

        Long userId,

        String phoneNumber,

        UserRole role

) {
    
}