package com.scac.global.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.scac.user.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserPenaltyScheduler {

    private final UserService userService;

    /**
     * 매시 정각마다 정지 기간이 만료된 회원의 제재를 자동 해제
     * Cron 표현식: 초 분 시 일 월 요일
     * "0 0 * * * *" -> 매시 0분 0초 (1시간 간격)
     */
    @Scheduled(cron = "0 0 * * * *")
    public void autoReleaseUserPenalties() {
        log.info("[Scheduler] 제재 만료 회원 자동 해제 스케줄러 시작");
        
        try {
            int releasedCount = userService.releaseExpiredPenalties();
            log.info("[Scheduler] 총 {}명의 회원 제재가 성공적으로 자동 해제되었습니다.", releasedCount);
        } catch (Exception e) {
            log.error("[Scheduler] 회원 제재 자동 해제 중 오류 발생: {}", e.getMessage(), e);
        }
    }
}