package com.scac.meetingroom.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.scac.global.enums.ReservationStatus;
import com.scac.global.exception.BusinessException;
import com.scac.global.exception.ResourceNotFoundException;
import com.scac.meetingroom.domain.MeetingRoomReservation;
import com.scac.meetingroom.dto.MeetingRoomReservationRequest;
import com.scac.meetingroom.dto.MeetingRoomReservationResponse;
import com.scac.meetingroom.repository.MeetingRoomRepository;
import com.scac.meetingroom.repository.MeetingRoomReservationRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class MeetingRoomReservationService {
    private final MeetingRoomRepository meetingRoomRepository;
    private final MeetingRoomReservationRepository reservationRepository;

    // 예약 전체 조회
    public List<MeetingRoomReservationResponse> getAllReservations(){
        return reservationRepository.findAll()
            .stream().map(MeetingRoomReservationResponse::from).toList();
    }

    // 예약 단건 조회
    public MeetingRoomReservationResponse getReservation(Long reservationId){
        MeetingRoomReservation reservation = reservationRepository.findById(reservationId)
            .orElseThrow(() -> 
                new ResourceNotFoundException("존재하지 않는 예약입니다")
        );
        
        return MeetingRoomReservationResponse.from(reservation);
    }

    // 예약 생성
    public MeetingRoomReservationResponse reserve(
        MeetingRoomReservationRequest request
    ){
        // 스터디룸 존재 확인
        meetingRoomRepository.findById(request.getRoomId())
            .orElseThrow(() -> 
                new ResourceNotFoundException("없는 스터디룸입니다")    
        );

        // 이전 날짜 예약 불가
        if(request.getReservationDate().isBefore(LocalDate.now())){
            throw new BusinessException("이전 날짜는 예약할 수 없습니다");
        }

        // 예약시간 검증
        if(request.getStartHour() >= request.getEndHour()){
            throw new BusinessException("시작시간이 더 빨라야합니다");
        }

        // 중복 예약 확인
        if(reservationRepository.existsByRoomIdAndReservationDateAndStatusInAndStartHourLessThanAndEndHourGreaterThan(
            request.getRoomId(), 
            request.getReservationDate(),
            List.of(ReservationStatus.CONFIRMED, ReservationStatus.IN_USE),
            request.getEndHour(),
            request.getStartHour()
        )){
                throw new BusinessException("이미 예약된 시간입니다");
        }

        MeetingRoomReservation reservation = 
            new MeetingRoomReservation(
                request.getRoomId(),
                request.getUserId(),
                request.getPaymentId(),
                request.getReservationDate(),
                request.getStartHour(),
                request.getEndHour()
            );
        
        reservationRepository.save(reservation);

        return MeetingRoomReservationResponse.from(reservation);
    }

    // 예약 취소
    public MeetingRoomReservationResponse cancel(Long reservationId){
        MeetingRoomReservation reservation =
            reservationRepository.findById(reservationId)
                .orElseThrow(() ->
                    new ResourceNotFoundException("예약 정보가 없습니다")
                );
        
        reservation.cancel();

        return MeetingRoomReservationResponse.from(reservation);
    }
}
