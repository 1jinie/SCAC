package com.scac.auth.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.scac.admin.entity.AdminAccount;
import com.scac.admin.repository.AdminAccountRepository;
import com.scac.auth.dto.JwtTokenRes;
import com.scac.auth.dto.RefreshTokenReq;
import com.scac.auth.dto.request.AdminLoginReq;
import com.scac.auth.dto.response.AdminLoginRes;
import com.scac.auth.entity.AdminRefreshToken;
import com.scac.auth.jwt.JwtProvider;
import com.scac.auth.repository.AdminRefreshTokenRepository;
import com.scac.global.exception.ResourceNotFoundException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminAuthService {

	private final AdminAccountRepository adminAccountRepository;
	private final AdminRefreshTokenRepository adminRefreshTokenRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtProvider jwtProvider;

	/**
	 * 관리자 로그인
	 */
	public AdminLoginRes login(AdminLoginReq req) {

		AdminAccount admin = adminAccountRepository.findByLoginId(req.loginId())
				.orElseThrow(() ->
						new IllegalArgumentException("아이디 또는 비밀번호가 일치하지 않습니다."));

		if (!passwordEncoder.matches(req.password(), admin.getPassword())) {
			throw new IllegalArgumentException("아이디 또는 비밀번호가 일치하지 않습니다.");
		}

		String accessToken = jwtProvider.generateAccessToken(admin);
		String refreshToken = jwtProvider.generateRefreshToken(admin);

		saveRefreshToken(admin, refreshToken);

		// 마지막 로그인 시간 갱신
		admin.updateLastLogin();

		JwtTokenRes token = new JwtTokenRes(accessToken, refreshToken);

		return AdminLoginRes.from(token, admin);
	}

	/**
	 * 관리자용 Access Token 재발급
	 */
	public AdminLoginRes refresh(RefreshTokenReq req) {

		if (!jwtProvider.validateToken(req.refreshToken())) {
			throw new IllegalArgumentException("유효하지 않은 Refresh Token입니다.");
		}

		Long adminId = jwtProvider.getAdminId(req.refreshToken());

		AdminRefreshToken savedToken = adminRefreshTokenRepository.findByAdminId(adminId)
				.orElseThrow(() -> new ResourceNotFoundException("Refresh Token이 존재하지 않습니다."));

		if (!savedToken.getRefreshToken().equals(req.refreshToken())) {
			throw new IllegalArgumentException("Refresh Token이 일치하지 않습니다.");
		}

		AdminAccount admin = adminAccountRepository.findById(adminId)
				.orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 관리자입니다."));

		if (savedToken.getExpiredAt().isBefore(LocalDateTime.now())) {
			throw new IllegalArgumentException("Refresh Token이 만료되었습니다.");
		}

		String accessToken = jwtProvider.generateAccessToken(admin);
		String refreshToken = jwtProvider.generateRefreshToken(admin);

		saveRefreshToken(admin, refreshToken);

		// 마지막 로그인 시간 갱신 (토큰 재발급시에도 갱신하지 않아도 되지만 정책상 갱신)
		admin.updateLastLogin();

		JwtTokenRes token = new JwtTokenRes(accessToken, refreshToken);

		return AdminLoginRes.from(token, admin);
	}

	/**
	 * 로그아웃
	 */
	public void logout(String authorization) {
		if (authorization == null || !authorization.startsWith("Bearer ")) {
			throw new IllegalArgumentException("Authorization 헤더가 올바르지 않습니다.");
		}

		String accessToken = authorization.substring(7);

		Long adminId = jwtProvider.getAdminId(accessToken);

		adminRefreshTokenRepository.deleteByAdminId(adminId);
	}

	private void saveRefreshToken(AdminAccount admin, String refreshToken) {

		java.time.LocalDateTime expiredAt =
				java.time.LocalDateTime.now().plusSeconds(jwtProvider.getRefreshExpirationSeconds());

		adminRefreshTokenRepository.findByAdminId(admin.getId()).ifPresentOrElse(
				token -> token.update(refreshToken, expiredAt),
				() -> {
					AdminRefreshToken token = AdminRefreshToken.builder()
							.admin(admin)
							.refreshToken(refreshToken)
							.expiredAt(expiredAt)
							.build();
					adminRefreshTokenRepository.save(token);
				}
		);
	}

}
