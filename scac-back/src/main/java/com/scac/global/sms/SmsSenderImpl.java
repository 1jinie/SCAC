package com.scac.global.sms;

import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HashMap;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class SmsSenderImpl implements SmsSender {

    @Value("${app.sms.provider:mock}")
    private String provider;

    @Value("${app.sms.api-key:}")
    private String apiKey;

    @Value("${app.sms.api-secret:}")
    private String apiSecret;

    @Value("${app.sms.from-number:01000000000}")
    private String fromNumber;

    @Value("${app.sms.sens-service-id:}")
    private String sensServiceId;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public void sendSms(String toPhoneNumber, String messageText) {
        String cleanToPhone = toPhoneNumber.replaceAll("-", "");
        String cleanFromPhone = fromNumber != null ? fromNumber.replaceAll("-", "") : "01000000000";
        String currentProvider = (provider != null ? provider : "mock").toLowerCase();

        switch (currentProvider) {
            case "coolsms" -> sendCoolSms(cleanToPhone, cleanFromPhone, messageText);
            case "sens", "naver" -> sendNaverSens(cleanToPhone, cleanFromPhone, messageText);
            default -> sendMock(cleanToPhone, messageText);
        }
    }

    /**
     * Mock (개발 / 테스트 환경) SMS 발송
     */
    private void sendMock(String to, String message) {
        log.info("==================================================");
        log.info("[MOCK SMS 발송] 수신자: {}, 내용: [{}]", to, message);
        log.info("==================================================");
    }

    /**
     * CoolSMS v4 REST API 연동
     */
    private void sendCoolSms(String to, String from, String message) {
        if (apiKey == null || apiKey.isBlank() || apiSecret == null || apiSecret.isBlank()) {
            log.warn("[CoolSMS] API Key / Secret 미설정. Mock 모드로 전환하여 발송 로그만 출력합니다.");
            sendMock(to, message);
            return;
        }

        try {
            String url = "https://api.coolsms.co.kr/messages/v4/send";
            String date = Instant.now().toString();
            String salt = UUID.randomUUID().toString().replaceAll("-", "");
            String signature = generateHmacSignature(date + salt, apiSecret);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "HMAC-SHA256 apiKey=" + apiKey + ", date=" + date + ", salt=" + salt + ", signature=" + signature);

            Map<String, Object> messageObj = new HashMap<>();
            messageObj.put("to", to);
            messageObj.put("from", from);
            messageObj.put("text", message);

            Map<String, Object> body = new HashMap<>();
            body.put("message", messageObj);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            restTemplate.postForEntity(url, entity, String.class);

            log.info("[CoolSMS] SMS 발송 성공 -> 수신자: {}", to);
        } catch (Exception e) {
            log.error("[CoolSMS] SMS 발송 실패: {}", e.getMessage(), e);
            throw new RuntimeException("CoolSMS 발송 실패: " + e.getMessage());
        }
    }

    /**
     * Naver Cloud SENS SMS API 연동
     */
    private void sendNaverSens(String to, String from, String message) {
        if (apiKey == null || apiKey.isBlank() || apiSecret == null || apiSecret.isBlank() || sensServiceId == null || sensServiceId.isBlank()) {
            log.warn("[Naver SENS] Service ID / API Key / Secret 미설정. Mock 모드로 전환합니다.");
            sendMock(to, message);
            return;
        }

        try {
            String timestamp = String.valueOf(System.currentTimeMillis());
            String url = "https://sens.apigw.ntruss.com/sms/v2/services/" + sensServiceId + "/messages";
            String signature = generateNaverSensSignature(timestamp, sensServiceId, apiKey, apiSecret);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-ncp-apigw-timestamp", timestamp);
            headers.set("x-ncp-iam-access-key", apiKey);
            headers.set("x-ncp-apigw-signature-v2", signature);

            Map<String, Object> msg = Map.of("to", to, "content", message);
            Map<String, Object> body = Map.of(
                "type", "SMS",
                "contentType", "COMM",
                "from", from,
                "content", message,
                "messages", List.of(msg)
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            restTemplate.postForEntity(url, entity, String.class);

            log.info("[Naver SENS] SMS 발송 성공 -> 수신자: {}", to);
        } catch (Exception e) {
            log.error("[Naver SENS] SMS 발송 실패: {}", e.getMessage(), e);
            throw new RuntimeException("Naver SENS 발송 실패: " + e.getMessage());
        }
    }

    private String generateHmacSignature(String data, String secret) throws NoSuchAlgorithmException, InvalidKeyException {
        Mac sha256HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256HMAC.init(secretKey);
        byte[] rawHmac = sha256HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return HexFormat.of().formatHex(rawHmac);
    }

    private String generateNaverSensSignature(String timestamp, String serviceId, String accessKey, String secretKey) throws NoSuchAlgorithmException, InvalidKeyException {
        String space = " ";
        String newLine = "\n";
        String method = "POST";
        String url = "/sms/v2/services/" + serviceId + "/messages";

        String message = new StringBuilder()
            .append(method)
            .append(space)
            .append(url)
            .append(newLine)
            .append(timestamp)
            .append(newLine)
            .append(accessKey)
            .toString();

        SecretKeySpec signingKey = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(signingKey);
        byte[] rawHmac = mac.doFinal(message.getBytes(StandardCharsets.UTF_8));
        return java.util.Base64.getEncoder().encodeToString(rawHmac);
    }
}
