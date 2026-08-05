package com.scac.seat.service;

import com.scac.checkin.domain.Checkin;
import com.scac.checkin.repository.CheckinRepository;
import com.scac.global.enums.CheckinStatus;
import com.scac.global.enums.SeatStatus;
import com.scac.global.enums.TicketType;
import com.scac.global.exception.ResourceNotFoundException;
import com.scac.seat.domain.Seat;
import com.scac.seat.dto.SeatOccupiedResponse;
import com.scac.seat.dto.SeatResponse;
import com.scac.seat.dto.SeatUserInfoRes;
import com.scac.seat.repository.SeatRepository;
import com.scac.system.entity.SystemLog;
import com.scac.system.service.SystemLogService;
import com.scac.ticket.entity.Ticket;
import com.scac.ticket.repository.TicketRepository;
import com.scac.ticketusage.entity.TicketUsage;
import com.scac.ticketusage.repository.TicketUsageRepository;
import com.scac.user.entity.User;
import com.scac.user.repository.UserRepository;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SeatService {
    private final SystemLogService systemLogService;
    private final CheckinRepository checkinRepository;
    private final SeatRepository seatRepository;
    private final TicketUsageRepository ticketUsageRepository;
    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;
    
    // 전체 좌석 조회
    public List<SeatResponse> getAllSeats() {
        return seatRepository.findAll().stream()
                .map(SeatResponse::from)
                .toList();
    }

    // 특정 좌석 조회
    public SeatResponse getSeatById(Long seatId) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 좌석이 존재하지 않습니다."));
        return SeatResponse.from(seat);
    }

    // 사용중인 좌석 조회
    public List<SeatOccupiedResponse> getOccupiedSeats(){
        return seatRepository.findByCurrentUserIdIsNotNull()
                .stream()
                .map(SeatOccupiedResponse::from)
                .toList();
    }

    // 좌석 상태 변경(관리자)
    @Transactional
    public void updateStatus(Long seatId, SeatStatus status){
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 좌석입니다."));

        // 이용 중인 좌석을 점검 중으로 바꿀 경우 할당 해제 처리 등의 안전장치 추가 가능
        if (status == SeatStatus.BRK && seat.getCurrentUserId() != null) {
            seat.releaseUser();
        }

        seat.changeStatus(status);
    }

    // 강제 퇴실 조치(관리자)
    @Transactional
    public void forceCheckout(Long seatId) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new ResourceNotFoundException("없는 좌석입니다."));

        // 단건 조회의 예외 방지를 위해 최신 1건 가져오기
        Checkin checkin = checkinRepository.findBySeatIdAndCheckinStatusIn(
                seatId, List.of(CheckinStatus.USING, CheckinStatus.AWAY)
        ).orElseThrow(() -> new ResourceNotFoundException("입실 정보가 없습니다."));

        checkin.checkout();
        seat.releaseUser();

        // 관리자 컨트롤러에서 @AutoLog를 사용하지 않는다면 이 수동 로그 생성을 유지합니다.
        SystemLog log = SystemLog.builder()
                .logType("SEAT")
                .logLevel("WARNING")
                .action("SEAT_FORCE_CHECK_OUT")
                .userId(checkin.getUserId())
                .targetType("SEAT")
                .targetId(seat.getSeatId())
                .referenceType("CHECK_INOUT")
                .referenceId(checkin.getCheckinId())
                .content(seat.getSeatNumber() + " 좌석 강제 퇴실 처리")
                .detail("{\"reason\":\"관리자 강제 퇴실\"}")
                .build();

        systemLogService.createLog(log);
    }

    // 현재 좌석 사용자 조회(관리자)
    public SeatUserInfoRes getCurrentUser(Long seatId){
        Checkin checkin = checkinRepository.findBySeatIdAndCheckinStatusIn(
                seatId, List.of(CheckinStatus.USING, CheckinStatus.AWAY)
        ).orElseThrow(() -> new ResourceNotFoundException("현재 이용자가 없습니다."));

        TicketUsage usage = ticketUsageRepository.findById(checkin.getUsageId())
                .orElseThrow(() -> new ResourceNotFoundException("이용권 정보가 없습니다."));

        User user = userRepository.findById(usage.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("사용자가 없습니다."));

        Ticket ticket = ticketRepository.findById(usage.getTicketId())
                .orElseThrow(() -> new ResourceNotFoundException("이용권이 없습니다."));

        Long remainingDays = null;

        // Enum 비교 및 Null Safety 처리
        if (ticket.getTicketType() == TicketType.PERIOD_PACK && Objects.nonNull(usage.getEndAt())) {
            remainingDays = ChronoUnit.DAYS.between(LocalDate.now(), usage.getEndAt().toLocalDate());
        }

        return new SeatUserInfoRes(
                user.getPhoneNumber(),
                ticket.getTicketName(),
                ticket.getTicketType().name(),
                usage.getRemainingTime(),
                remainingDays
        );
    }
}