package com.scac.checkin.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.scac.checkin.domain.Checkin;
import com.scac.checkin.dto.CheckinRequest;
import com.scac.checkin.dto.CheckinResponse;
import com.scac.checkin.repository.CheckinRepository;
import com.scac.global.enums.CheckinStatus;
import com.scac.global.enums.TicketType;
import com.scac.global.enums.TicketUsageStatus;
import com.scac.global.exception.BusinessException;
import com.scac.global.exception.ResourceNotFoundException;
import com.scac.seat.domain.Seat;
import com.scac.seat.repository.SeatRepository;
import com.scac.ticketusage.entity.TicketUsage;
import com.scac.ticketusage.repository.TicketUsageRepository;
import com.scac.user.entity.User;
import com.scac.user.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CheckinService {
    private final UserRepository userRepository;
    private final SeatRepository seatRepository;
    private final TicketUsageRepository ticketUsageRepository;
    private final CheckinRepository checkinRepository;
    private final PasswordEncoder passwordEncoder;

    // 입실 과정
    @Transactional
    public CheckinResponse checkin(CheckinRequest request) {

        // 사용자 존재 확인
        User user = userRepository.findByPhoneNumber(request.getPhoneNumber())
            .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 사용자입니다"));
        // 비밀번호 확인
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException("비밀번호가 일치하지 않습니다");
        }

        // 기존 입실 상태 확인
        if (checkinRepository.existsByUserIdAndCheckinStatusIn(user.getId(),
            List.of(CheckinStatus.USING, CheckinStatus.AWAY))) {
            throw new BusinessException("이미 입실 중인 사용자입니다");
        }

        // 이용권 확인
        TicketUsage ticketUsage = ticketUsageRepository
            .findFirstByUserIdAndStatusInOrderByCreatedAtDesc(user.getId(),
                List.of(TicketUsageStatus.READY, TicketUsageStatus.USING))
            .orElseThrow(() -> new ResourceNotFoundException("사용 가능한 이용권이 없습니다"));
        if (!ticketUsage.isAvailable()) {
            throw new BusinessException("사용 가능한 이용권이 없습니다");
        }

        // READY일 경우 시작 처리
        if (ticketUsage.getStatus() == TicketUsageStatus.READY) {
            ticketUsage.start();
        }
        ;

        // 남은 시간 확인
        if (ticketUsage.getTicketType() == TicketType.TIME_PACK && ticketUsage.getRemainingTime() <= 0) {
            throw new BusinessException("남은 이용 시간이 없습니다");
        }
        ;

        // 좌석 확인
        Seat seat = seatRepository.findById(request.getSeatId())
            .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 좌석입니다"));

        // 좌석 사용 가능 여부 확인
        seat.assignUser(user.getId());

        // 입실 저장
        Checkin checkin = new Checkin(user.getId(), request.getSeatId(), ticketUsage.getUsageId(),
            LocalDateTime.now(), CheckinStatus.USING);

        Checkin savedCheckin = checkinRepository.save(checkin);

        return CheckinResponse.from(savedCheckin);
    }

    // 외출 과정
    @Transactional
    public CheckinResponse goAway(Long checkinId) {
        Checkin checkin = checkinRepository.findById(checkinId)
            .orElseThrow(() -> new ResourceNotFoundException("입실 정보가 없습니다"));

        checkin.goAway();

        return CheckinResponse.from(checkin);
    }

    // 외출 복귀 과정
    @Transactional
    public CheckinResponse comeBack(Long checkinId) {
        Checkin checkin = checkinRepository.findById(checkinId)
            .orElseThrow(() -> new ResourceNotFoundException("외출 정보가 없습니다"));

        checkin.comeBack();

        return CheckinResponse.from(checkin);
    }

    // 퇴실 과정
    @Transactional
    public CheckinResponse checkout(Long checkinId) {
        // 입실 정보 조회
        Checkin checkin = checkinRepository.findById(checkinId)
            .orElseThrow(() -> new ResourceNotFoundException("입실 정보가 없습니다"));

        // 이용권 조회
        TicketUsage ticketUsage = ticketUsageRepository.findById(checkin.getUsageId())
            .orElseThrow(() -> new ResourceNotFoundException("이용권 정보가 없습니다"));

        // 좌석 조회
        Seat seat = seatRepository.findById(checkin.getSeatId())
            .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 좌석입니다"));

        // 사용 시간 계산
        LocalDateTime now = LocalDateTime.now();

        if (ticketUsage.getTicketType() == TicketType.TIME_PACK) {
            long usedMinutes = java.time.Duration.between(checkin.getCheckinAt(), now).toMinutes();

            if (usedMinutes > 0) {
                ticketUsage.deductTime((int) usedMinutes);
            }
        }

        // 퇴실 처리
        checkin.checkout();

        // 좌석 반환
        seat.releaseUser();

        return CheckinResponse.from(checkin);
    }
}
