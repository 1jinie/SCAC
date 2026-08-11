package com.scac.notification.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.solapi.sdk.SolapiClient;
import com.solapi.sdk.message.dto.request.MessageListRequest;
import com.solapi.sdk.message.dto.request.SendRequestConfig;
import com.solapi.sdk.message.dto.response.MultipleDetailMessageSentResponse;
import com.solapi.sdk.message.exception.SolapiMessageNotReceivedException;
import com.solapi.sdk.message.model.Message;
import com.solapi.sdk.message.service.DefaultMessageService;

@Component
public class SolapiMessageClient {

  private final String apiKey;
  private final String apiSecret;
  private final String senderNumber;

  public SolapiMessageClient(
    @Value("${solapi.api-key:}") String apiKey,
    @Value("${solapi.api-secret:}") String apiSecret,
    @Value("${solapi.sender-number:}") String senderNumber) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.senderNumber = senderNumber;
  }

  public SolapiSendResult sendSms(String phoneNumber, String content) {
    if (!isConfigured()) {
      return new SolapiSendResult(false, null, null, "SOLAPI 설정이 완료되지 않았습니다.");
    }

    Message message = new Message();
    message.setFrom(normalizePhoneNumber(senderNumber));
    message.setTo(normalizePhoneNumber(phoneNumber));
    message.setText(content);

    SendRequestConfig config = new SendRequestConfig();
    config.setShowMessageList(true);
    config.setAllowDuplicates(false);

    try {
      MultipleDetailMessageSentResponse response = messageService().send(message, config);

      if (response.getMessageList() == null || response.getMessageList().isEmpty()) {
        return new SolapiSendResult(false, null, null, "SOLAPI 응답에 메시지 정보가 없습니다.");
      }

      var result = response.getMessageList().get(0);
      boolean accepted = "2000".equals(result.getStatusCode());

      return new SolapiSendResult(
        accepted,
        result.getMessageId(),
        result.getStatusCode(),
        result.getStatusMessage());
    } catch (SolapiMessageNotReceivedException e) {
      var failedMessages = e.getFailedMessageList();

      if (failedMessages != null && !failedMessages.isEmpty()) {
        var failed = failedMessages.get(0);
        return new SolapiSendResult(
          false,
          failed.getMessageId(),
          failed.getStatusCode(),
          failed.getStatusMessage());
      }

      return new SolapiSendResult(false, null, null, e.getMessage());
    } catch (Exception e) {
      return new SolapiSendResult(false, null, null, e.getMessage());
    }
  }

  public SolapiMessageStatus findMessageStatus(String messageId) {
    if (!isConfigured()) {
      return null;
    }

    try {
      MessageListRequest request = new MessageListRequest();
      request.setMessageId(messageId);

      Message message = messageService().getMessageList(request)
        .getMessageList()
        .get(messageId);

      if (message == null) {
        return null;
      }

      return new SolapiMessageStatus(message.getStatusCode());
    } catch (Exception e) {
      return null;
    }
  }

  private DefaultMessageService messageService() {
    return SolapiClient.INSTANCE.createInstance(apiKey, apiSecret);
  }

  private boolean isConfigured() {
    return apiKey != null && !apiKey.isBlank()
      && apiSecret != null && !apiSecret.isBlank()
      && senderNumber != null && !senderNumber.isBlank();
  }

  private String normalizePhoneNumber(String phoneNumber) {
    if (phoneNumber == null) {
      return null;
    }
    return phoneNumber.replaceAll("[^0-9]", "");
  }

  public record SolapiMessageStatus(String resultCode) {
  }
}
