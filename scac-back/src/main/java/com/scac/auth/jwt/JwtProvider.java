package com.scac.auth.jwt;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.scac.admin.entity.AdminAccount;
import com.scac.global.enums.UserRole;
import com.scac.user.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtProvider {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-expiration}")
    private long accessExpiration;

    public long getRefreshExpirationSeconds() {
    return refreshExpiration / 1000;
    }

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
    }

private Claims createClaims(User user) {

    return Jwts.claims()
            .add("userId", user.getId())
            .add("role", user.getRole().name())
            .add("phoneNumber", user.getPhoneNumber())
            .build();
}

public String generateAccessToken(User user) {

    Date now = new Date();

    Date expiry =
            new Date(now.getTime() + accessExpiration);

    return Jwts.builder()
            .claims(createClaims(user))
            .issuedAt(now)
            .expiration(expiry)
            .signWith(getSigningKey())
            .compact();
}

public String generateRefreshToken(User user) {

    Date now = new Date();

    Date expiry =
            new Date(now.getTime() + refreshExpiration);

    return Jwts.builder()
            .claims(createClaims(user))
            .issuedAt(now)
            .expiration(expiry)
            .signWith(getSigningKey())
            .compact();
}

private Claims createClaims(AdminAccount admin) {

    return Jwts.claims()
            .add("adminId", admin.getId())
            .add("loginId", admin.getLoginId())
            .add("role", admin.getRole().name())
            .build();
}

public String generateAccessToken(AdminAccount admin) {

    Date now = new Date();

    Date expiry =
            new Date(now.getTime() + accessExpiration);

    return Jwts.builder()
            .claims(createClaims(admin))
            .issuedAt(now)
            .expiration(expiry)
            .signWith(getSigningKey())
            .compact();
}

public String generateRefreshToken(AdminAccount admin) {

    Date now = new Date();

    Date expiry =
            new Date(now.getTime() + refreshExpiration);

    return Jwts.builder()
            .claims(createClaims(admin))
            .issuedAt(now)
            .expiration(expiry)
            .signWith(getSigningKey())
            .compact();
}

public boolean validateToken(String token) {

    try {

        Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token);

        return true;

    } catch (Exception e) {

        return false;
    }
}

public Claims getClaims(String token) {

    return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
}

public Long getUserId(String token) {

    return getClaims(token)
            .get("userId", Long.class);
}

public String getPhoneNumber(String token) {

    return getClaims(token)
            .get("phoneNumber", String.class);
}

public UserRole getRole(String token) {

    String role =
            getClaims(token)
                    .get("role", String.class);

    return UserRole.valueOf(role);
}

public Long getAdminId(String token) {

    return getClaims(token)
            .get("adminId", Long.class);
}

public String getLoginId(String token) {

    return getClaims(token)
            .get("loginId", String.class);
}

public String getPrincipalType(String token) {

    Claims claims = getClaims(token);

    if (claims.get("userId") != null) {
        return "user";
    } else if (claims.get("adminId") != null) {
        return "admin";
    }

    return null;
}

public String getRole(String token, String principalType) {

    Claims claims = getClaims(token);

    if (principalType.equals("user")) {
        return claims.get("role", String.class);
    } else if (principalType.equals("admin")) {
        return claims.get("role", String.class);
    }

    return null;
}

// JwtProvider.java 개선
public Claims getClaimsIgnoreExpiration(String token) {
    try {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    } catch (io.jsonwebtoken.ExpiredJwtException e) {
        return e.getClaims(); // 만료된 토큰이라도 Claims 추출
    }
}

}
