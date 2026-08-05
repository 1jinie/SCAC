package com.scac.user.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scac.admin.dto.request.AdminUserSearchReq;
import com.scac.admin.dto.request.UserPenaltyReq;
import com.scac.admin.dto.response.AdminUserRes;
import com.scac.global.enums.UserStatus;
import com.scac.system.entity.SystemLog;
import com.scac.system.service.SystemLogService;
import com.scac.ticketusage.service.TicketUsageService;
import com.scac.user.dto.GuestRegisterReq;
import com.scac.user.dto.PasswordUpdateReq;
import com.scac.user.dto.PasswordVerifyReq;
import com.scac.user.dto.UserRes;
import com.scac.user.dto.UserSignUpReq;
import com.scac.user.entity.User;
import com.scac.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SystemLogService systemLogService;
    private final TicketUsageService ticketUsageService;

    @Transactional(readOnly = true)
    public boolean existsByPhoneNumber(String phoneNumber) {
        return userRepository.existsByPhoneNumber(sanitizePhoneNumber(phoneNumber));
    }

    public User register(UserSignUpReq req) {
        String cleanPhone = sanitizePhoneNumber(req.phoneNumber());
        if (userRepository.existsByPhoneNumber(cleanPhone)) {
            throw new IllegalArgumentException("이미 등록된 전화번호입니다.");
        }

        String encodedPassword = passwordEncoder.encode(req.password());
        UserSignUpReq cleanReq = new UserSignUpReq(cleanPhone, req.password());
        User user = cleanReq.toEntity(encodedPassword);

        return userRepository.save(user);
    }

    public User registerGuest(GuestRegisterReq req) {
        String cleanPhone = sanitizePhoneNumber(req.phoneNumber());
        User existUser = userRepository.findByPhoneNumber(cleanPhone).orElse(null);

        if (existUser != null) {
            if (Boolean.FALSE.equals(existUser.getIsMember())) {
                existUser.changePassword(passwordEncoder.encode(req.password()));
                return existUser;
            }
            throw new IllegalArgumentException("이미 일반 회원으로 등록된 전화번호입니다.");
        }

        String encodedPassword = passwordEncoder.encode(req.password());
        GuestRegisterReq cleanReq = new GuestRegisterReq(cleanPhone, req.password());
        User newGuest = cleanReq.toEntity(encodedPassword);

        return userRepository.save(newGuest);
    }

    private String sanitizePhoneNumber(String rawPhone) {
        return rawPhone != null ? rawPhone.replaceAll("-", "").trim() : "";
    }

    @Transactional(readOnly = true)
    public User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
    }

    @Transactional(readOnly = true)
    public UserRes getUserProfile(Long userId) {
        User user = findUser(userId);

        // TicketUsageService를 통한 활성 이용권명 조회 연동
        String activeTicketName = ticketUsageService.getActiveTicketName(userId);

        return UserRes.from(user, activeTicketName);
    }

    public User verifyPassword(PasswordVerifyReq req) {
        User user = userRepository.findByPhoneNumber(req.phoneNumber())
                .orElseThrow(() -> new IllegalArgumentException("등록되지 않은 전화번호입니다."));

        user.checkAndReleaseSuspension();

        if (user.getUserStatus() == UserStatus.SUSPENDED) {
            throw new IllegalArgumentException(
                    "현재 이용 정지 상태입니다. 정지 종료일: " + user.getPenaltyEndDate());
        }

        if (user.getUserStatus() == UserStatus.BANNED) {
            throw new IllegalArgumentException("탈퇴 또는 이용이 제한된 회원입니다.");
        }

        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new IllegalArgumentException("입실 비밀번호가 일치하지 않습니다.");
        }

        return user;
    }

    public void changePassword(Long userId, PasswordUpdateReq req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        user.checkAndReleaseSuspension();

        if (user.getUserStatus() == UserStatus.SUSPENDED) {
            throw new IllegalArgumentException(
                    "현재 이용 정지 상태입니다. 정지 종료일: " + user.getPenaltyEndDate());
        }

        if (user.getUserStatus() == UserStatus.BANNED) {
            throw new IllegalArgumentException("탈퇴 또는 이용이 제한된 회원입니다.");
        }

        if (!passwordEncoder.matches(req.currentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("현재 입실 비밀번호가 일치하지 않습니다.");
        }

        user.changePassword(passwordEncoder.encode(req.newPassword()));
    }

    /**
     * [스케줄러] 정지 기간(penaltyEndDate)이 지난 회원을 자동으로 ACTIVE 상태로 전환
     */
    @Transactional
    public int releaseExpiredPenalties() {
        LocalDate today = LocalDate.now();
        List<User> expiredUsers = userRepository.findExpiredSuspendedUsers(UserStatus.SUSPENDED, today);

        if (expiredUsers.isEmpty()) {
            return 0;
        }

        for (User user : expiredUsers) {
            user.checkAndReleaseSuspension();

            try {
                SystemLog autoReleaseLog = SystemLog.builder()
                        .logType("USER")
                        .logLevel("INFO")
                        .action("AUTO_RELEASE_PENALTY")
                        .userId(user.getId())
                        .targetType("USER")
                        .targetId(user.getId())
                        .content("스케줄러에 의한 회원 제재 자동 해제 처리")
                        .detail("정지 만료 시각 경과로 ACTIVE 상태 자동 전환")
                        .build();

                systemLogService.createLog(autoReleaseLog);
            } catch (Exception e) {
                log.error("회원 ID: {} 제재 자동 해제 로그 기록 실패: {}", user.getId(), e.getMessage());
            }
        }

        return expiredUsers.size();
    }

    /**
     * [관리자] 전체 회원 목록 및 조건 조회
     */
    @Transactional(readOnly = true)
    public List<AdminUserRes> getUsersForAdmin(AdminUserSearchReq searchReq) {
        if (searchReq.getPhoneNumber() != null && !searchReq.getPhoneNumber().isBlank()) {
            String cleanPhone = sanitizePhoneNumber(searchReq.getPhoneNumber());
            return userRepository.findByPhoneNumber(cleanPhone)
                    .stream()
                    .map(AdminUserRes::from)
                    .toList();
        }

        if (searchReq.getUserStatus() != null) {
            return userRepository.findByUserStatus(searchReq.getUserStatus())
                    .stream()
                    .map(AdminUserRes::from)
                    .toList();
        }

        return userRepository.findAll()
                .stream()
                .map(AdminUserRes::from)
                .toList();
    }

    /**
     * [관리자] 회원 상세 조회
     */
    @Transactional(readOnly = true)
    public AdminUserRes getUserDetailForAdmin(Long userId) {
        User user = findUser(userId);
        return AdminUserRes.from(user);
    }

    /**
     * [관리자] 회원 제재 / 정지 / 정지 해제 처리
     */
    public void applyUserPenalty(Long userId, UserPenaltyReq req) {
        User user = findUser(userId);

        if (req.getUserStatus() == UserStatus.BANNED) {
            user.ban();
        } else if (req.getUserStatus() == UserStatus.SUSPENDED) {
            if (req.getPenaltyEndDate() == null) {
                throw new IllegalArgumentException("정지 상태 설정 시 정지 종료일은 필수입니다.");
            }
            user.applyPenalty(req.getPenaltyEndDate());
        } else if (req.getUserStatus() == UserStatus.ACTIVE) {
            user.activate();
        }
    }
}