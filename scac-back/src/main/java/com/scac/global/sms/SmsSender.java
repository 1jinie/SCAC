package com.scac.global.sms;

public interface SmsSender {
    /**
     * SMS 메시지 발송
     * @param toPhoneNumber 수신자 전화번호 (숫자만)
     * @param messageText 발송할 메시지 본문
     */
    void sendSms(String toPhoneNumber, String messageText);
}
