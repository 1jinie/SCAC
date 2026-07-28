package com.scac.auth.dto;

public record JwtTokenRes(

    String accessToken,
    String refreshToken

) {}