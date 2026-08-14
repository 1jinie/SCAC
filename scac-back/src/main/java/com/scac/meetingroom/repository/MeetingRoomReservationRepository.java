package com.scac.meetingroom.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.scac.global.enums.ReservationStatus;
import com.scac.meetingroom.domain.MeetingRoomReservation;
import com.scac.meetingroom.dto.AdminReservationResponse;

public interface MeetingRoomReservationRepository extends JpaRepository<MeetingRoomReservation, Long> {
        boolean existsByRoomIdAndReservationDateAndStatusInAndStartHourLessThanAndEndHourGreaterThan(
                Long roomId, LocalDate reservationDate, List<ReservationStatus> statuses, Integer endHour,
                Integer startHour);

        // 예약된 시간 조회
        List<MeetingRoomReservation> findByRoomIdAndReservationDateAndStatusIn(Long roomId,
                LocalDate reservationDate, List<ReservationStatus> statuses);

        // 관리자용 예약 조회
        @Query("""
                    SELECT new com.scac.meetingroom.dto.AdminReservationResponse(
                            r.reservationId,
                            r.roomId,
                            mr.roomName,
                            r.userId,
                            u.phoneNumber,
                            r.reservationDate,
                            r.startHour,
                            r.endHour,
                            r.status,
                            r.createdAt
                    )
                    FROM MeetingRoomReservation r
                    JOIN MeetingRoom mr ON r.roomId = mr.roomId
                    JOIN User u ON r.userId = u.id
                    ORDER BY r.createdAt DESC
                """)
        List<AdminReservationResponse> findAdminReservationList();

        // 오늘 날짜 + 상태로 예약 조회
        List<MeetingRoomReservation> findByReservationDateAndStatus(LocalDate reservationDate,
                ReservationStatus status);

        // 해당 방에 특정 상태 예약 존재확인
        boolean existsByRoomIdAndStatus(Long roomId, ReservationStatus status);

        // 현재 사용자 예약 조회
        @Query("""
                SELECT r
                FROM MeetingRoomReservation r
                WHERE r.userId = :userId
                AND r.reservationDate = :reservationDate
                AND r.status = :status
                AND r.startHour <= :currentHour
                AND r.endHour > :currentHour
                ORDER BY r.startHour ASC
                """)
        Optional<MeetingRoomReservation> findCurrentReservation(@Param("userId") Long userId,
                @Param("reservationDate") LocalDate reservationDate,
                @Param("status") ReservationStatus status, @Param("currentHour") Integer currentHour);

        // 결제 만료 예약 조회
        List<MeetingRoomReservation> findByStatusAndCreatedAtBefore(ReservationStatus status,
                LocalDateTime createdAt);

}