package com.scac.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenReq(

    @NotBlank(message = "Refresh Token은 필수입니다.")
    String refreshToken

) {}