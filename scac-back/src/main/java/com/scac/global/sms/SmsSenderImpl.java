package com.scac.global.sms;

import org.springframework.stereotype.Component;

import com.scac.notification.client.SolapiMessageClient;
import com.scac.notification.client.SolapiSendResult;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class SmsSenderImpl implements SmsSender {

    private final SolapiMessageClient solapiMessageClient;

    @Override
    public void sendSms(String toPhoneNumber, String messageText) {
        String cleanToPhone = toPhoneNumber != null ? toPhoneNumber.replaceAll("[^0-9]", "") : "";

        if (!solapiMessageClient.isConfigured()) {
            log.info("==================================================");
            log.info("[MOCK SMS 발송 (SOLAPI 미설정)] 수신자: {}, 내용: [{}]", cleanToPhone, messageText);
            log.info("==================================================");
            return;
        }

        SolapiSendResult result = solapiMessageClient.sendSms(cleanToPhone, messageText);
        if (result.accepted()) {
            log.info("[SOLAPI SMS 발송 성공] 수신자: {}, messageId: {}", cleanToPhone, result.messageId());
        } else {
            log.warn("[SOLAPI SMS 발송 실패] 수신자: {}, 코드: {}, 사유: {}", cleanToPhone, result.resultCode(), result.resultMessage());
            log.info("[FALLBACK MOCK SMS] 수신자: {}, 내용: [{}]", cleanToPhone, messageText);
        }
    }
}
