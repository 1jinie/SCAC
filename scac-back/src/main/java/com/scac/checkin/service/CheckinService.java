package com.scac.checkin.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.Authentication;
import com.scac.auth.jwt.UserPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scac.checkin.domain.Checkin;
import com.scac.checkin.dto.CheckinPrepareRequest;
import com.scac.checkin.dto.CheckinPrepareResponse;
import com.scac.checkin.dto.CheckinRequest;
import com.scac.checkin.dto.CheckinResponse;
import com.scac.checkin.repository.CheckinRepository;
import com.scac.global.enums.CheckinStatus;
import com.scac.global.enums.SeatStatus;
import com.scac.global.enums.TicketType;
import com.scac.global.enums.TicketUsageStatus;
import com.scac.global.exception.BusinessException;
import com.scac.global.exception.ResourceNotFoundException;
import com.scac.seat.domain.Seat;
import com.scac.seat.repository.SeatRepository;
import com.scac.ticket.entity.Ticket;
import com.scac.ticket.repository.TicketRepository;
import com.scac.ticketusage.entity.TicketUsage;
import com.scac.ticketusage.repository.TicketUsageRepository;
import com.scac.user.entity.User;
import com.scac.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CheckinService {
    private final UserRepository userRepository;
    private final SeatRepository seatRepository;
    private final TicketUsageRepository ticketUsageRepository;
    private final CheckinRepository checkinRepository;
    private final PasswordEncoder passwordEncoder;
    private final TicketRepository ticketRepository;

    // 사용자 검증 함수
    private User authenticateUser(String phoneNumber, String password) {
        // 사용자 조회
        User user = userRepository.findByPhoneNumber(phoneNumber)
            .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 사용자입니다"));

        // 비밀번호 검증
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BusinessException("비밀번호가 일치하지 않습니다");
        }

        return user;
    }

    // 비로그인 User 찾기
    @Transactional(readOnly = true)
    public CheckinPrepareResponse prepare(CheckinPrepareRequest request) {

        User user = authenticateUser(request.getPhoneNumber(), request.getPassword());

        return prepareByUser(user);
    }

    // 로그인(JWT) User 찾기
    @Transactional(readOnly = true)
    public CheckinPrepareResponse prepareMember(Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        User user = userRepository.findById(principal.id())
            .orElseThrow(() -> 
                new ResourceNotFoundException("없는 사용자입니다")
        );
        
        return prepareByUser(user);
    }

    // 입실 준비
    private CheckinPrepareResponse prepareByUser(User user){
        Checkin awayCheckin = checkinRepository.findByUserIdAndCheckinStatus(user.getId(), CheckinStatus.AWAY)
            .orElse(null);

        // 기존 입실 상태 확인
        if (checkinRepository.existsByUserIdAndCheckinStatus(user.getId(), CheckinStatus.USING)) {
            throw new BusinessException("이미 입실 중인 사용자입니다");
        }

        // 이용권 확인
        TicketUsage ticketUsage = ticketUsageRepository
            .findFirstByUserIdAndStatusInOrderByCreatedAtDesc(user.getId(),
                List.of(TicketUsageStatus.READY, TicketUsageStatus.USING))
            .orElseThrow(() -> new ResourceNotFoundException("사용 가능한 이용권이 없습니다"));

        // 이용권 사용가능 여부 확인
        if (!ticketUsage.isAvailable()) {
            throw new BusinessException("사용 가능한 이용권이 없습니다");
        }

        // 남은 시간 확인
        if (ticketUsage.getTicketType() == TicketType.TIME_PACK && ticketUsage.getRemainingTime() <= 0) {
            throw new BusinessException("남은 이용 시간이 없습니다");
        }
        ;

        return new CheckinPrepareResponse(ticketUsage.getUserId(), ticketUsage.getUsageId(),
            ticketUsage.getTicketType().name(), ticketUsage.getRemainingTime(), awayCheckin != null);
    }

    // 입실
    @Transactional
    public CheckinResponse checkin(CheckinRequest request) {

        // 좌석 확인
        Seat seat = seatRepository.findById(request.getSeatId())
            .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 좌석입니다"));
        if (seat.getStatus() != SeatStatus.AVB) {
            throw new BusinessException("사용할 수 없는 좌석입니다");
        }

        // 이용권 조회
        TicketUsage ticketUsage = ticketUsageRepository.findById(request.getUsageId())
            .orElseThrow(() -> new ResourceNotFoundException("이용권 정보가 없습니다"));

        // READY일 경우 시작 처리
        if (ticketUsage.getStatus() == TicketUsageStatus.READY) {
            Ticket ticket = ticketRepository.findById(ticketUsage.getTicketId())
                .orElseThrow(() -> new ResourceNotFoundException("이용권 상품 정보가 없습니다."));

            ticketUsage.start(ticket);
        }
        ;

        // 좌석 점유
        seat.assignUser(request.getUserId());

        // 입실 저장
        Checkin checkin = new Checkin(request.getUserId(), request.getSeatId(), request.getUsageId(),
            LocalDateTime.now(), CheckinStatus.USING);

        Checkin savedCheckin = checkinRepository.save(checkin);

        return CheckinResponse.from(savedCheckin);
    }

    // 외출
    @Transactional
    public CheckinResponse goAway(CheckinPrepareRequest request) {

        User user = authenticateUser(request.getPhoneNumber(), request.getPassword());

        Checkin checkin = checkinRepository.findByUserIdAndCheckinStatus(user.getId(), CheckinStatus.USING)
            .orElseThrow(() -> new ResourceNotFoundException("입실 정보가 없습니다"));

        checkin.goAway();

        return CheckinResponse.from(checkin);
    }

    // 외출 복귀
    @Transactional
    public CheckinResponse comeBack(CheckinPrepareRequest request) {

        User user = authenticateUser(request.getPhoneNumber(), request.getPassword());

        Checkin checkin = checkinRepository.findByUserIdAndCheckinStatus(user.getId(), CheckinStatus.AWAY)
            .orElseThrow(() -> new ResourceNotFoundException("외출 정보가 없습니다"));

        checkin.comeBack();

        return CheckinResponse.from(checkin);
    }

    // 퇴실
    @Transactional
    public CheckinResponse checkout(CheckinPrepareRequest request) {

        User user = authenticateUser(request.getPhoneNumber(), request.getPassword());

        // 입실 정보 조회
        Checkin checkin = checkinRepository
            .findByUserIdAndCheckinStatusIn(user.getId(), List.of(CheckinStatus.USING, CheckinStatus.AWAY))
            .orElseThrow(() -> new ResourceNotFoundException("입실 정보가 없습니다"));

        // 좌석 조회
        Seat seat = seatRepository.findById(checkin.getSeatId())
            .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 좌석입니다"));

        // 퇴실 처리
        checkin.checkout();

        // 좌석 반환
        seat.releaseUser();

        return CheckinResponse.from(checkin);
    }

}
