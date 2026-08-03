package com.scac.admin.dto.request;

import com.scac.global.enums.AdminRole;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AdminAccountUpdateReq {

    private String newPassword;
    private AdminRole role;
}