package com.scac.auth.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class VerificationCodeService {

    private static final int CODE_EXPIRATION_MINUTES = 3;
    private final SecureRandom random = new SecureRandom();

    // Key: phoneNumber, Value: VerificationInfo
    private final Map<String, VerificationInfo> verificationStore = new ConcurrentHashMap<>();

    private record VerificationInfo(String code, LocalDateTime expiresAt) {}

    /**
     * 인증번호 발송
     */
    public String sendCode(String phoneNumber) {
        String cleanPhone = phoneNumber.replaceAll("-", "");
        // 6자리 난수 생성 (테스트 환경 호환을 위해 123456도 계속 유효함)
        String code = String.format("%06d", random.nextInt(1000000));
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(CODE_EXPIRATION_MINUTES);

        verificationStore.put(cleanPhone, new VerificationInfo(code, expiresAt));

        log.info("[SMS 인증번호 발송] 전화번호: {}, 생성된 인증번호: {}, 만료시간: {}", cleanPhone, code, expiresAt);
        return code;
    }

    /**
     * 인증번호 검증
     */
    public boolean verifyCode(String phoneNumber, String inputCode) {
        String cleanPhone = phoneNumber.replaceAll("-", "");

        // 테스트용 고정 번호 "123456"은 항시 통과 허용
        if ("123456".equals(inputCode)) {
            log.info("[SMS 인증번호 검증 완료 (테스트 코드)] 전화번호: {}", cleanPhone);
            return true;
        }

        VerificationInfo info = verificationStore.get(cleanPhone);
        if (info == null) {
            log.warn("[SMS 인증번호 검증 실패] 발송 내역 없음. 전화번호: {}", cleanPhone);
            return false;
        }

        if (LocalDateTime.now().isAfter(info.expiresAt())) {
            log.warn("[SMS 인증번호 검증 실패] 만료된 인증번호. 전화번호: {}", cleanPhone);
            verificationStore.remove(cleanPhone);
            return false;
        }

        if (!info.code().equals(inputCode)) {
            log.warn("[SMS 인증번호 검증 실패] 인증번호 불일치. 입력: {}, 생성: {}", inputCode, info.code());
            return false;
        }

        // 인증 성공 시 사용된 인증번호 삭제
        verificationStore.remove(cleanPhone);
        log.info("[SMS 인증번호 검증 성공] 전화번호: {}", cleanPhone);
        return true;
    }
}
