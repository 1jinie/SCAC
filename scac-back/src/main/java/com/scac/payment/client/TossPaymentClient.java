package com.scac.payment.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import com.scac.payment.dto.TossPaymentResponse;

@Component
public class TossPaymentClient {

    private final RestClient restClient;

    public TossPaymentClient(
            RestClient.Builder restClientBuilder,
            @Value("${toss.secret-key}") String secretKey) {
        this.restClient = restClientBuilder
                .baseUrl("https://api.tosspayments.com")
                .defaultHeaders(headers -> headers.setBasicAuth(secretKey, ""))
                .build();
    }

    public TossPaymentResponse confirm(
            String paymentKey,
            String orderId,
            Integer amount) {
        TossConfirmRequest request = new TossConfirmRequest(paymentKey, orderId, amount);

        try {
            TossPaymentResponse response = restClient.post()
                    .uri("/v1/payments/confirm")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(TossPaymentResponse.class);

            if (response == null) {
                throw new IllegalStateException(
                        "토스페이먼츠 승인 응답이 없습니다.");
            }

            return response;
        } catch (RestClientResponseException e) {
            throw new IllegalStateException(
                    "토스페이먼츠 결제 승인에 실패했습니다: "
                            + e.getResponseBodyAsString(),
                    e);
        }
    }

    private record TossConfirmRequest(
            String paymentKey,
            String orderId,
            Integer amount) {
    }

    private record TossCancelRequest(
            String cancelReason) {
    }

    public TossPaymentResponse cancel(
            String paymentKey,
            String cancelReason) {
        TossCancelRequest request = new TossCancelRequest(cancelReason);

        try {
            TossPaymentResponse response = restClient.post()
                    .uri(
                            uriBuilder -> uriBuilder
                                    .path("/v1/payments/{paymentKey}/cancel")
                                    .build(paymentKey))
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(TossPaymentResponse.class);

            if (response == null) {
                throw new IllegalStateException(
                        "토스페이먼츠 취소 응답이 없습니다.");
            }

            return response;
        } catch (RestClientResponseException e) {
            throw new IllegalStateException(
                    "토스페이먼츠 결제 취소에 실패했습니다: "
                            + e.getResponseBodyAsString(),
                    e);
        }
    }

}