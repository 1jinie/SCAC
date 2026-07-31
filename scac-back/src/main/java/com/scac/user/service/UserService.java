package com.scac.user.service;

import com.scac.global.enums.UserStatus;
import com.scac.user.dto.GuestRegisterReq;
import com.scac.user.dto.PasswordUpdateReq;
import com.scac.user.dto.PasswordVerifyReq;
import com.scac.user.dto.UserRes;
import com.scac.user.dto.UserSignUpReq;
import com.scac.user.entity.User;
import com.scac.user.repository.UserRepository;
// import com.scac.ticket.repository.UserTicketRepository; // 💡 이용권 리포지토리 예시
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    //private final UserTicketRepository userTicketRepository; 이용권 조회를 위해 주입

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
        // 전화번호가 정제된 DTO 기반으로 Entity 생성
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

        // 💡 실제 이용권 엔티티/리포지토리 연동 시 활성화된 이용권명 조회
        // String activeTicketName = userTicketRepository.findActiveTicketNameByUserId(userId).orElse(null);
        String activeTicketName = null; // 이용권 엔티티 연동 후 적용 예정

        return UserRes.from(user, activeTicketName);
    }


    public User verifyPassword(PasswordVerifyReq req) {
        User user = userRepository.findByPhoneNumber(req.phoneNumber())
                .orElseThrow(() -> new IllegalArgumentException("등록되지 않은 전화번호입니다."));

        // 정지 기간 자동 해제 검증
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
}