package com.scac.notification.client;

public record SolapiSendResult(
  boolean accepted,
  String messageId,
  String resultCode,
  String resultMessage
) {
}
