package com.scac.auth.dto;

public record LoginRes(

    String accessToken,
    String refreshToken

) {

    public static LoginRes from(JwtTokenRes token) {
        return new LoginRes(
                token.accessToken(),
                token.refreshToken()
        );
    }
}
