package com.scac.admin.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AdminRole {

    SUPER_ADMIN("최고 관리자"),
    STAFF("일반 관리자/스태프");

    private final String description;
}