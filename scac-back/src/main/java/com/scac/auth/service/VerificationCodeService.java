package com.scac.auth.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.scac.global.sms.SmsSender;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class VerificationCodeService {

    private static final int CODE_EXPIRATION_MINUTES = 3;
    private final SecureRandom random = new SecureRandom();
    private final SmsSender smsSender;

    // Key: phoneNumber, Value: VerificationInfo
    private final Map<String, VerificationInfo> verificationStore = new ConcurrentHashMap<>();

    private record VerificationInfo(String code, LocalDateTime expiresAt) {}

    /**
     * 인증번호 발송 (단순 본인 소유 확인용)
     */
    public String sendCode(String phoneNumber) {
        String cleanPhone = phoneNumber.replaceAll("-", "").trim();

        // 6자리 난수 생성 및 세션 저장
        String code = String.format("%06d", random.nextInt(1000000));
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(CODE_EXPIRATION_MINUTES);

        verificationStore.put(cleanPhone, new VerificationInfo(code, expiresAt));

        log.info("[SMS 인증번호 발송] 전화번호: {}, 생성된 코드: {}, 만료시간: {}", cleanPhone, code, expiresAt);

        // SMS 발송 처리 (Mock 또는 CoolSMS / Naver SENS)
        String smsMessage = "[SCAC] 인증번호는 [" + code + "] 입니다. (3분 이내 입력)";
        smsSender.sendSms(cleanPhone, smsMessage);

        return code;
    }

    /**
     * 인증번호 검증
     */
    public boolean verifyCode(String phoneNumber, String inputCode) {
        String cleanPhone = phoneNumber.replaceAll("-", "").trim();

        // 테스트용 고정 번호 "123456"은 개발/테스트 편의를 위해 항시 통과 허용
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
