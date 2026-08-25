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
import com.scac.system.entity.SystemLog;
import com.scac.system.service.SystemLogService;
import com.scac.ticket.entity.Ticket;
import com.scac.ticket.service.TicketService;
import com.scac.ticketusage.entity.TicketUsage;
import com.scac.ticketusage.repository.TicketUsageRepository;
import com.scac.user.entity.User;
import com.scac.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CheckinService {
    private final TicketService ticketService;
    private final UserRepository userRepository;
    private final SeatRepository seatRepository;
    private final TicketUsageRepository ticketUsageRepository;
    private final CheckinRepository checkinRepository;
    private final PasswordEncoder passwordEncoder;
    private final SystemLogService systemLogService;

    // 사용자 검증 함수
    private User authenticateUser(String phoneNumber, String password) {
        User user = userRepository.findByPhoneNumber(phoneNumber)
            .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 사용자입니다."));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BusinessException("비밀번호가 일치하지 않습니다.");
        }

        return user;
    }

    // 비로그인 User 찾기
    public CheckinPrepareResponse prepare(CheckinPrepareRequest request) {
        User user = authenticateUser(request.getPhoneNumber(), request.getPassword());
        return prepareByUser(user);
    }

    // 로그인(JWT) User 찾기
    public CheckinPrepareResponse prepareMember(Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        User user = userRepository.findById(principal.id())
            .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 사용자입니다."));
        
        return prepareByUser(user);
    }

    // 입실 준비
    private CheckinPrepareResponse prepareByUser(User user){
        Checkin awayCheckin = checkinRepository
            .findFirstByUserIdAndCheckinStatusOrderByCheckinAtDesc(user.getId(), CheckinStatus.AWAY)
            .orElse(null);

        if (checkinRepository.existsByUserIdAndCheckinStatus(user.getId(), CheckinStatus.USING)) {
            throw new BusinessException("이미 입실 중인 사용자입니다.");
        }

        TicketUsage ticketUsage = null;
        // 외출 복귀면 기존 이용권 사용
        if(awayCheckin != null){
            ticketUsage = ticketUsageRepository.findById(awayCheckin.getUsageId())
                .filter(TicketUsage::isAvailable)
                .orElse(null);
        }

        // 이용권 확인(1순위 : USING 기간권)
        if(ticketUsage == null) {
            ticketUsage = ticketUsageRepository.findFirstByUserIdAndStatusAndTicketTypeOrderByCreatedAtAsc(
                user.getId(), 
                TicketUsageStatus.USING, 
                TicketType.PERIOD_PACK).orElse(null);
            }        
        
        // 이용권 확인(2순위 : READY 기간권)
        if(ticketUsage == null){
            ticketUsage = ticketUsageRepository
            .findFirstByUserIdAndStatusAndTicketTypeOrderByCreatedAtAsc(
                user.getId(), 
                TicketUsageStatus.READY, 
                TicketType.PERIOD_PACK).orElse(null);
        }

        // 이용권 확인(3순위 : 시간권)
        if(ticketUsage == null){
            ticketUsage = ticketUsageRepository
                .findFirstByUserIdAndStatusAndTicketTypeOrderByCreatedAtAsc(
                    user.getId(), 
                    TicketUsageStatus.READY, 
                    TicketType.TIME_PACK).orElse(null);   
        }

        if(ticketUsage == null){
            throw new ResourceNotFoundException("사용 가능한 이용권이 없습니다.");
        }

        System.out.println(
            "usageId=" + ticketUsage.getUsageId()
            + ", userId=" + ticketUsage.getUserId()
            + ", ticketType=" + ticketUsage.getTicketType()
            + ", status=" + ticketUsage.getStatus()
            + ", remainingTime=" + ticketUsage.getRemainingTime()
            + ", endAt=" + ticketUsage.getEndAt()
        );

        if (!ticketUsage.isAvailable()) {
            throw new BusinessException("사용 가능한 이용권이 없습니다.");
        }

        if (ticketUsage.getTicketType() == TicketType.TIME_PACK && ticketUsage.getRemainingTime() <= 0) {
            throw new BusinessException("남은 이용 시간이 없습니다.");
        }

        return new CheckinPrepareResponse(
            user.getId(), 
            ticketUsage.getUsageId(),
            ticketUsage.getTicketType().name(), 
            ticketUsage.getRemainingTime(), 
            awayCheckin != null
        );
    }

    // 입실
    @Transactional
    public CheckinResponse checkin(CheckinRequest request) {
        // 이미 입실 또는 외출 중인지 방어 검증
        if (checkinRepository.existsByUserIdAndCheckinStatusIn(request.getUserId(), List.of(CheckinStatus.USING, CheckinStatus.AWAY))) {
            throw new BusinessException("이미 이용 중이거나 외출 중인 사용자입니다.");
        }

        // 좌석 확인
        Seat seat = seatRepository.findById(request.getSeatId())
            .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 좌석입니다."));
            
        if (seat.getStatus() != SeatStatus.AVB) {
            throw new BusinessException("사용할 수 없는 좌석입니다.");
        }

        // 이용권 조회
        TicketUsage ticketUsage = ticketUsageRepository.findById(request.getUsageId())
            .orElseThrow(() -> new ResourceNotFoundException("이용권 정보가 없습니다."));

        // 기간권 우선 재검증
        TicketUsage periodTicket = ticketUsageRepository
            .findFirstByUserIdAndStatusAndTicketTypeOrderByCreatedAtAsc(
                request.getUserId(), 
                TicketUsageStatus.USING, 
                TicketType.PERIOD_PACK).orElse(null);
        if(periodTicket != null){
            ticketUsage = periodTicket;
        }

        // READY일 경우 시작 처리
        if (ticketUsage.getStatus() == TicketUsageStatus.READY) {
            if(ticketUsage.getTicketType() == TicketType.TIME_PACK){
                ticketUsage.start();
            } else if(ticketUsage.getTicketType() == TicketType.PERIOD_PACK){
                Ticket ticket = ticketService.findTicket(ticketUsage.getTicketId());

                ticketUsage.startPeriod(ticket.getValidDays());
            }
        }

        // 좌석 점유
        seat.assignUser(request.getUserId());

        // 입실 저장
        Checkin checkin = new Checkin(request.getUserId(), request.getSeatId(), ticketUsage.getUsageId(),
            LocalDateTime.now(), CheckinStatus.USING);

        Checkin savedCheckin = checkinRepository.save(checkin);

        SystemLog log = SystemLog.builder()
            .logType("SEAT")
            .logLevel("INFO")
            .action("SEAT_CHECK_IN")
            .userId(request.getUserId())
            .targetType("SEAT")
            .targetId(seat.getSeatId())
            .referenceType("CHECK_INOUT")
            .referenceId(savedCheckin.getCheckinId())
            .content(seat.getSeatNumber() + " 좌석 입실 완료")
            .detail(String.format("{\"seat_name\":\"%s\"}", seat.getSeatNumber())).build();

        systemLogService.createLog(log);

        return CheckinResponse.from(savedCheckin);
    }

    // 외출
    @Transactional
    public CheckinResponse goAway(CheckinPrepareRequest request) {
        User user = authenticateUser(request.getPhoneNumber(), request.getPassword());

        Checkin checkin = checkinRepository
            .findFirstByUserIdAndCheckinStatusOrderByCheckinAtDesc(user.getId(), CheckinStatus.USING)
            .orElseThrow(() -> new ResourceNotFoundException("입실 정보가 없습니다."));

        checkin.goAway();

        return CheckinResponse.from(checkin);
    }

    // 회원 외출
    @Transactional
    public CheckinResponse memberGoAway(Authentication authentication){
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        User user = userRepository.findById(principal.id())
            .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 사용자"));
        
        Checkin checkin = checkinRepository.findFirstByUserIdAndCheckinStatusOrderByCheckinAtDesc(
            user.getId(), 
            CheckinStatus.USING    
        ).orElseThrow(() -> new ResourceNotFoundException("입실 정보가 없습니다"));

        checkin.goAway();

        return CheckinResponse.from(checkin);
    }

    // 외출 복귀
    @Transactional
    public CheckinResponse comeBack(CheckinPrepareRequest request) {
        User user = authenticateUser(request.getPhoneNumber(), request.getPassword());

        Checkin checkin = checkinRepository
            .findFirstByUserIdAndCheckinStatusOrderByCheckinAtDesc(user.getId(), CheckinStatus.AWAY)
            .orElseThrow(() -> new ResourceNotFoundException("외출 정보가 없습니다."));

        checkin.comeBack();

        return CheckinResponse.from(checkin);
    }

    // 회원 복귀
    @Transactional
    public CheckinResponse memberComeBack(Authentication authentication){
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        User user = userRepository.findById(principal.id())
            .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 사용자"));
        
        Checkin checkin = checkinRepository.findFirstByUserIdAndCheckinStatusOrderByCheckinAtDesc(
            user.getId(), 
            CheckinStatus.AWAY   
        ).orElseThrow(() -> new ResourceNotFoundException("외출 정보가 없습니다"));

        checkin.comeBack();

        return CheckinResponse.from(checkin);
    }

    // 퇴실
    @Transactional
    public CheckinResponse checkout(CheckinPrepareRequest request) {
        User user = authenticateUser(request.getPhoneNumber(), request.getPassword());

        // 입실/외출 정보 조회
        Checkin checkin = checkinRepository
            .findFirstByUserIdAndCheckinStatusInOrderByCheckinAtDesc(user.getId(), List.of(CheckinStatus.USING, CheckinStatus.AWAY))
            .orElseThrow(() -> new ResourceNotFoundException("입실 정보가 없습니다."));

        Long currentSeatId = checkin.getSeatId();

        // 좌석 조회 및 반환 (퇴실 시 checkin.getSeatId()가 null로 처리되므로 먼저 좌석 조회)
        if (currentSeatId != null) {
            Seat seat = seatRepository.findById(currentSeatId)
                .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 좌석입니다."));
            seat.releaseUser();

            SystemLog log = SystemLog.builder()
                .logType("SEAT")
                .logLevel("INFO")
                .action("SEAT_CHECK_OUT")
                .userId(user.getId())
                .targetType("SEAT")
                .targetId(seat.getSeatId())
                .referenceType("CHECK_INOUT")
                .referenceId(checkin.getCheckinId())
                .content(seat.getSeatNumber() + " 좌석 퇴실 완료")
                .detail(String.format("{\"seat_name\":\"%s\"}", seat.getSeatNumber()))
                .build();
            
            systemLogService.createLog(log);
        }
        
        // 사용중이던 이용권 READY 변경
        TicketUsage ticketUsage = ticketUsageRepository.findById(checkin.getUsageId())
        .orElseThrow(() -> new ResourceNotFoundException("이용권 정보가 없습니다"));
        
        if(ticketUsage.getTicketType() == TicketType.TIME_PACK)
            ticketUsage.ready();
        
        // 퇴실 처리
        checkin.checkout();
        
        return CheckinResponse.from(checkin);
    }
    
    // 회원 퇴실
    @Transactional
    public CheckinResponse memberCheckout(Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        User user = userRepository.findById(principal.id())
            .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 사용자"));

        // 입실/외출 정보 조회
        Checkin checkin = checkinRepository
            .findFirstByUserIdAndCheckinStatusInOrderByCheckinAtDesc(user.getId(), List.of(CheckinStatus.USING, CheckinStatus.AWAY))
            .orElseThrow(() -> new ResourceNotFoundException("입실 정보가 없습니다."));

        Long currentSeatId = checkin.getSeatId();

        // 좌석 조회 및 반환 (퇴실 시 checkin.getSeatId()가 null로 처리되므로 먼저 좌석 조회)
        if (currentSeatId != null) {
            Seat seat = seatRepository.findById(currentSeatId)
                .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 좌석입니다."));
            seat.releaseUser();

            SystemLog log = SystemLog.builder()
                .logType("SEAT")
                .logLevel("INFO")
                .action("SEAT_CHECK_OUT")
                .userId(user.getId())
                .targetType("SEAT")
                .targetId(seat.getSeatId())
                .referenceType("CHECK_INOUT")
                .referenceId(checkin.getCheckinId())
                .content(seat.getSeatNumber() + " 좌석 퇴실 완료")
                .detail(String.format("{\"seat_name\":\"%s\"}", seat.getSeatNumber()))
                .build();
            
            systemLogService.createLog(log);
        }
        
        // 사용중이던 이용권 READY 변경
        TicketUsage ticketUsage = ticketUsageRepository.findById(checkin.getUsageId())
        .orElseThrow(() -> new ResourceNotFoundException("이용권 정보가 없습니다"));
        
        if(ticketUsage.getTicketType() == TicketType.TIME_PACK)
            ticketUsage.ready();
        
        // 퇴실 처리
        checkin.checkout();
        
        return CheckinResponse.from(checkin);
    }
}