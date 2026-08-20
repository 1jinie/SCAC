package com.scac.meetingroom.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scac.auth.jwt.UserPrincipal;
import com.scac.global.response.ApiResponse;
import com.scac.meetingroom.dto.AdminReservationResponse;
import com.scac.meetingroom.dto.MeetingRoomAvailabilityResponse;
import com.scac.meetingroom.dto.MeetingRoomReservationRequest;
import com.scac.meetingroom.dto.MeetingRoomReservationResponse;
import com.scac.meetingroom.service.MeetingRoomReservationService;
import com.scac.payment.service.PaymentService;

import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/meeting-rooms")
public class MeetingRoomReservationController {
        private final MeetingRoomReservationService reservationService;
        private final PaymentService paymentService;

        // 전체 예약 조회
        @GetMapping
        public ResponseEntity<ApiResponse<List<MeetingRoomReservationResponse>>> getAllReservations() {
                return ResponseEntity
                        .ok(ApiResponse.success("전체 예약을 조회했습니다", reservationService.getAllReservations()));
        }

        // 스터디룸 예약
        @PostMapping("/reservations")
        public ResponseEntity<ApiResponse<MeetingRoomReservationResponse>> reserve(
                @RequestBody MeetingRoomReservationRequest request,
                @AuthenticationPrincipal UserPrincipal currentUser) {

                MeetingRoomReservationResponse reservation = reservationService.reserve(request,
                        currentUser.id());

                return ResponseEntity.ok(ApiResponse.success("스터디룸 임시 예약이 생성되었습니다.", reservation));
        }

        // 예약 취소
        @PatchMapping("/reservations/{reservationId}/cancel")
        public ResponseEntity<ApiResponse<MeetingRoomReservationResponse>> cancel(
                @PathVariable(name = "reservationId") Long reservationId) {
                // 예약 취소 시 결제도 함께 취소
                paymentService.cancelByReservation(reservationId);
                MeetingRoomReservationResponse reservation = reservationService.getReservation(reservationId);
                return ResponseEntity.ok(ApiResponse.success("스터디룸 예약 및 결제 취소가 완료되었습니다.", reservation));
        }

        // 예약 가능 시간 조회
        @GetMapping("/{roomId}/availability")
        public ResponseEntity<ApiResponse<List<MeetingRoomAvailabilityResponse>>> getAvailability(
                @PathVariable(name = "roomId") Long roomId, @RequestParam(name = "date") LocalDate date) {
                return ResponseEntity.ok(ApiResponse.success("예약 가능 시간을 조회했습니다",
                        reservationService.getAvailability(roomId, date)));
        }

        // 현재 사용자 예약 조회
        @GetMapping("/current")
        public ResponseEntity<ApiResponse<MeetingRoomReservationResponse>> getCurrentReservation(
                Authentication authentication) {
                UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

                return ResponseEntity.ok(ApiResponse.success("현재 예약 조회 성공",
                        reservationService.findCurrentReservation(principal.id())));
        }

        // 관리자 예약 조회
        @GetMapping("/admin/reservations")
        public ResponseEntity<ApiResponse<List<AdminReservationResponse>>> getAdminReservations() {
                return ResponseEntity.ok(ApiResponse.success(reservationService.getAdminReservationList()));
        }

        // 예약 단건 조회
        @GetMapping("/reservations/{reservationId}")
        public ResponseEntity<ApiResponse<MeetingRoomReservationResponse>> getReservation(
                @PathVariable(name = "reservationId") Long reservationId,
                @AuthenticationPrincipal UserPrincipal currentUser) {

                MeetingRoomReservationResponse reservation = reservationService
                        .getMyReservation(reservationId, currentUser.id());

                return ResponseEntity.ok(ApiResponse.success("스터디룸 예약을 조회했습니다.", reservation));
        }

        // 결제 전 임시 예약 취소
        @PatchMapping("/reservations/{reservationId}/cancel-pending")
        public ResponseEntity<ApiResponse<MeetingRoomReservationResponse>> cancelPending(
                @PathVariable(name = "reservationId") Long reservationId,
                @AuthenticationPrincipal UserPrincipal currentUser) {

                MeetingRoomReservationResponse reservation = reservationService.cancelPending(reservationId,
                        currentUser.id());

                return ResponseEntity.ok(ApiResponse.success("결제 대기 중인 스터디룸 예약을 취소했습니다.", reservation));
        }
}
