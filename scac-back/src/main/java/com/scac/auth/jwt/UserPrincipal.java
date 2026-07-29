package com.scac.auth.jwt;

public record UserPrincipal(

        Long id,

        String identifier,

        String role,

        String principalType

) {
    
}