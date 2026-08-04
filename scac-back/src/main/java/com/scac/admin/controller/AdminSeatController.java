package com.scac.admin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scac.admin.dto.request.SeatStatusRequest;
import com.scac.global.log.annotation.AutoLog;
import com.scac.global.response.ApiResponse;
import com.scac.seat.dto.SeatOccupiedResponse;
import com.scac.seat.dto.SeatResponse;
import com.scac.seat.dto.SeatUserInfoRes;
import com.scac.seat.service.SeatService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/seats")
public class AdminSeatController {

    // 💡 별도의 AdminSeatService 대신 기존 완성된 SeatService를 직접 주입받아 활용!
    private final SeatService seatService;

    /**
     * 1. 전체 좌석 현황 조회
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<SeatResponse>>> getAllSeats() {
        return ResponseEntity.ok(
                ApiResponse.success("전체 좌석 조회를 완료했습니다.", seatService.getAllSeats())
        );
    }

    /**
     * 2. 점유 중인 좌석 목록 조회
     */
    @GetMapping("/occupied")
    public ResponseEntity<ApiResponse<List<SeatOccupiedResponse>>> getOccupiedSeats() {
        return ResponseEntity.ok(
                ApiResponse.success("사용 중인 좌석 조회를 완료했습니다.", seatService.getOccupiedSeats())
        );
    }

    /**
     * 3. 좌석 상태 수동 변경 (점검중/사용가능 등)
     */
    @PatchMapping("/{seatId}/status")
    @AutoLog(
        logType = "SEAT", 
        action = "UPDATE_STATUS", 
        targetType = "SEAT", 
        content = "관리자에 의한 좌석 상태 수동 변경"
    )
    public ResponseEntity<ApiResponse<Void>> updateSeatStatus(
            @PathVariable Long seatId,
            @Valid @RequestBody SeatStatusRequest request
    ) {
        seatService.updateStatus(seatId, request.getStatus()); // 기존 SeatService 로직 재사용[cite: 43]

        return ResponseEntity.ok(
                ApiResponse.success("좌석 상태 변경이 완료되었습니다.")
        );
    }

    /**
     * 4. 강제 퇴실 조치 (시간 차감 및 퇴실 처리 포함)
     */
    @PostMapping("/{seatId}/force-checkout")
    @AutoLog(
    logType = "SEAT", 
    action = "FORCE_CHECKOUT", 
    targetType = "SEAT", 
    content = "관리자에 의한 강제 퇴실 처리"
)
    public ResponseEntity<ApiResponse<Void>> forceCheckout(
            @PathVariable Long seatId
    ) {
        seatService.forceCheckout(seatId); // 기존 SeatService의 완벽한 강제퇴실 로직 재사용![cite: 43]

        return ResponseEntity.ok(
                ApiResponse.success("강제 퇴실 처리가 완료되었습니다.")
        );
    }

    /**
     * 5. 좌석 사용자 조회
     */
    @GetMapping("/{seatId}/user")
    public ResponseEntity<ApiResponse<SeatUserInfoRes>> getSeatUser(
        @PathVariable Long seatId
        ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        seatService.getCurrentUser(seatId)
                )
        );
    }
    
}