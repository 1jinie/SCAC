package com.scac.meetingroom.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scac.global.enums.ReservationStatus;
import com.scac.global.exception.BusinessException;
import com.scac.global.exception.ResourceNotFoundException;
import com.scac.meetingroom.domain.MeetingRoom;
import com.scac.meetingroom.domain.MeetingRoomReservation;
import com.scac.meetingroom.dto.AdminReservationResponse;
import com.scac.meetingroom.dto.MeetingRoomAvailabilityResponse;
import com.scac.meetingroom.dto.MeetingRoomReservationRequest;
import com.scac.meetingroom.dto.MeetingRoomReservationResponse;
import com.scac.meetingroom.dto.ReservationPaymentInfoDTO;
import com.scac.meetingroom.repository.MeetingRoomRepository;
import com.scac.meetingroom.repository.MeetingRoomReservationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class MeetingRoomReservationService {
        private final MeetingRoomRepository meetingRoomRepository;
        private final MeetingRoomReservationRepository reservationRepository;

        // 예약 전체 조회
        public List<MeetingRoomReservationResponse> getAllReservations() {
                return reservationRepository.findAll().stream().map(MeetingRoomReservationResponse::from)
                        .toList();
        }

        // 예약 단건 조회
        public MeetingRoomReservationResponse getReservation(Long reservationId) {
                MeetingRoomReservation reservation = reservationRepository.findById(reservationId)
                        .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 예약입니다"));

                return MeetingRoomReservationResponse.from(reservation);
        }

        // 예약 단건 엔터티 조회(이용권 생성용)
        public MeetingRoomReservation getReservationEntity(Long reservationId) {
                MeetingRoomReservation reservation = reservationRepository.findById(reservationId)
                        .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 예약입니다"));

                return reservation;
        }

        // 예약 생성
        public MeetingRoomReservationResponse reserve(MeetingRoomReservationRequest request,
                Long currentUserId) {
                // 스터디룸 존재 확인
                meetingRoomRepository.findById(request.getRoomId())
                        .orElseThrow(() -> new ResourceNotFoundException("없는 스터디룸입니다"));

                // 이전 날짜 예약 불가
                if (request.getReservationDate().isBefore(LocalDate.now())) {
                        throw new BusinessException("이전 날짜는 예약할 수 없습니다");
                }

                // 오늘인 경우 지난 시간 예약 불가
                LocalDate today = LocalDate.now();
                int currentHour = LocalDateTime.now().getHour();

                if(request.getReservationDate().isEqual(today) && request.getStartHour() <= currentHour){
                        throw new BusinessException("이미 지난 시간은 예약할 수 없습니다");
                }

                // 예약시간 검증
                if (request.getStartHour() >= request.getEndHour()) {
                        throw new BusinessException("시작시간이 더 빨라야합니다");
                }
                List<ReservationStatus> occupyingStatuses = List.of(ReservationStatus.PENDING_PAYMENT,
                        ReservationStatus.CONFIRMED, ReservationStatus.IN_USE);

                // 중복 예약 확인
                boolean duplicated = reservationRepository
                        .existsByRoomIdAndReservationDateAndStatusInAndStartHourLessThanAndEndHourGreaterThan(
                                request.getRoomId(), request.getReservationDate(), occupyingStatuses,
                                request.getEndHour(), request.getStartHour());

                if (duplicated) {
                        throw new BusinessException("이미 예약되었거나 결제 중인 시간입니다.");
                }

                MeetingRoomReservation reservation = new MeetingRoomReservation(request.getRoomId(),
                        currentUserId, null, request.getReservationDate(), request.getStartHour(),
                        request.getEndHour());

                return MeetingRoomReservationResponse.from(reservationRepository.save(reservation));
        }

        // 예약 취소
        public MeetingRoomReservationResponse cancel(Long reservationId) {
                MeetingRoomReservation reservation = reservationRepository.findById(reservationId)
                        .orElseThrow(() -> new ResourceNotFoundException("예약 정보가 없습니다"));

                reservation.cancel();

                return MeetingRoomReservationResponse.from(reservation);
        }

        // 예약 가능 시간 조회
        public List<MeetingRoomAvailabilityResponse> getAvailability(Long roomId, LocalDate date) {
                // 스터디룸 존재 확인
                meetingRoomRepository.findById(roomId)
                        .orElseThrow(() -> new ResourceNotFoundException("없는 스터디룸입니다"));

                // 해당 날짜 예약 조회
                List<MeetingRoomReservation> reservations = reservationRepository
                        .findByRoomIdAndReservationDateAndStatusIn(roomId, date,
                                List.of(ReservationStatus.PENDING_PAYMENT, ReservationStatus.CONFIRMED,
                                        ReservationStatus.IN_USE));

                List<MeetingRoomAvailabilityResponse> result = new ArrayList<>();

                // 운영시간 08 ~ 24
                for (int hour = 8; hour < 24; hour++) {
                        boolean available = true;

                        for (MeetingRoomReservation reservation : reservations) {
                                // 예약시간이 겹치는 경우
                                if (hour >= reservation.getStartHour() && hour < reservation.getEndHour()) {
                                        available = false;
                                        break;
                                }
                        }

                        result.add(new MeetingRoomAvailabilityResponse(hour, hour + 1, available));
                }

                return result;
        }

        // 관리자용 예약 조회
        @Transactional(readOnly = true)
        public List<AdminReservationResponse> getAdminReservationList() {
                return reservationRepository.findAdminReservationList();
        }

        // 스터디룸 결제관련 정보 조회
        @Transactional(readOnly = true)
        public ReservationPaymentInfoDTO getPaymentInfo(Long reservationId) {

                MeetingRoomReservation reservation = reservationRepository.findById(reservationId)
                        .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 예약입니다."));

                MeetingRoom room = meetingRoomRepository.findById(reservation.getRoomId())
                        .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 스터디룸입니다."));

                int amount = (reservation.getEndHour() - reservation.getStartHour()) * room.getHourlyRate();

                return new ReservationPaymentInfoDTO(reservation.getReservationId(), reservation.getRoomId(),
                        reservation.getUserId(), reservation.getStatus(), amount);
        }

        // 스터디룸 결제 완료 시 예약 상태를 CONFIRMED로 변경
        @Transactional
        public void confirmReservation(Long reservationId, Long paymentId) {
                MeetingRoomReservation reservation = getReservationEntity(reservationId);
                reservation.confirmPayment(paymentId);
        }

        // 현재 사용자 예약 조회
        @Transactional(readOnly = true)
        public MeetingRoomReservationResponse findCurrentReservation(Long userId) {
                LocalDate today = LocalDate.now();
                int currentHour = LocalDateTime.now().getHour();

                System.out.println("===== 현재 예약 조회 =====");
                System.out.println("userId = " + userId);
                System.out.println("today = " + today);
                System.out.println("currentHour = " + currentHour);

                Optional<MeetingRoomReservation> result = reservationRepository.findCurrentReservation(userId,
                        today, ReservationStatus.IN_USE, currentHour);

                System.out.println("reservation = " + result);

                MeetingRoomReservation reservation = reservationRepository
                        .findCurrentReservation(userId, today, ReservationStatus.IN_USE, currentHour)
                        .orElseThrow(() -> new ResourceNotFoundException("현재 입실 가능한 스터디룸 예약이 없습니다"));

                return MeetingRoomReservationResponse.from(reservation);
        }

        // 현재 사용자 예약 단건 조회
        @Transactional(readOnly = true)
        public MeetingRoomReservationResponse getMyReservation(Long reservationId, Long currentUserId) {

                MeetingRoomReservation reservation = reservationRepository.findById(reservationId)
                        .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 예약입니다."));

                if (!reservation.getUserId().equals(currentUserId)) {
                        throw new AccessDeniedException("본인의 예약만 조회할 수 있습니다.");
                }

                return MeetingRoomReservationResponse.from(reservation);
        }
}
