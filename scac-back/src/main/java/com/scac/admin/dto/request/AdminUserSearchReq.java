package com.scac.admin.dto.request;

import com.scac.global.enums.UserRole;
import com.scac.global.enums.UserStatus;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AdminUserSearchReq {

    private String phoneNumber;
    private UserStatus userStatus;
    private UserRole role;
    private Boolean isMember;
}