package com.scac.global.log.annotation;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface AutoLog {
    String logType() default "SYSTEM";      // 예: USER, SEAT, RESERVATION, PAYMENT, SYSTEM
    String logLevel() default "INFO";       // 예: INFO, WARNING, ERROR, CRITICAL
    String action();                        // 예: PENALTY, FORCE_CHECKOUT, CANCEL, CREATE, UPDATE
    String targetType() default "";         // 예: USER, SEAT, MEETING_ROOM, PAYMENT
    String referenceType() default "";      // 예: TICKET_USAGE, PENALTY_HISTORY
    String content() default "";            // 로그 요약 설명
}