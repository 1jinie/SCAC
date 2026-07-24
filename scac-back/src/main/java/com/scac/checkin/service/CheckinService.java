package com.scac.checkin.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.scac.checkin.domain.Checkin;
import com.scac.checkin.dto.CheckinRequest;
import com.scac.checkin.dto.CheckinResponse;
import com.scac.checkin.repository.CheckinRepository;
import com.scac.global.enums.CheckinStatus;
import com.scac.global.exception.ResourceNotFoundException;
import com.scac.seat.domain.Seat;
import com.scac.seat.repository.SeatRepository;
import com.scac.user.entity.User;
import com.scac.user.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CheckinService {
    private final UserRepository userRepository;
    private final SeatRepository seatRepository;
    // private final TicketUsageRepository ticketUsageRepository;
    private final CheckinRepository checkinRepository;

    // 입실 과정
    @Transactional
    public CheckinResponse checkIn(CheckinRequest request){
        // 사용자 확인
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() ->
                new ResourceNotFoundException("존재하지 않는 사용자입니다")
        );

        // 이용권 확인

        // 좌석 확인
        Seat seat = seatRepository.findById(request.getSeatId())
            .orElseThrow(() ->
                new ResourceNotFoundException("존재하지 않는 좌석입니다")
        );

        // 좌석 사용 가능 여부 확인
        seat.assignUser(request.getUserId());

        // 입실 저장
        Checkin checkin = new Checkin(
            request.getUserId(), 
            request.getSeatId(), 
            request.getUsageId(), 
            LocalDateTime.now(), 
            CheckinStatus.USING
        );

        Checkin savedCheckin = checkinRepository.save(checkin);

        return CheckinResponse.from(savedCheckin);
    }

    // 외출 과정
    @Transactional
    public CheckinResponse goAway(Long checkinId){
        Checkin checkin = checkinRepository.findById(checkinId)
            .orElseThrow(() ->
                new ResourceNotFoundException("입실 정보가 없습니다")
        );
        
        checkin.goAway();

        return CheckinResponse.from(checkin);
    }

    // 외출 복귀 과정
    @Transactional
    public CheckinResponse comeBack(Long checkinId){
        Checkin checkin = checkinRepository.findById(checkinId)
            .orElseThrow(() ->
                new ResourceNotFoundException("외출 정보가 없습니다")
        );

        checkin.comeBack();

        return CheckinResponse.from(checkin);
    }
}
