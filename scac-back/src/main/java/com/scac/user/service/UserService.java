package com.scac.user.service;

import com.scac.global.exception.ResourceNotFoundException;
import com.scac.user.dto.*;
import com.scac.user.entity.User;
import com.scac.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 1. 일반 회원가입
     */
    @Transactional
    public UserRes signUp(UserSignUpReq req) {
        if (userRepository.existsByLoginId(req.loginId())) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }
        if (userRepository.existsByPhoneNumber(req.phoneNumber())) {
            throw new IllegalArgumentException("이미 등록된 전화번호입니다.");
        }

        // 비밀번호 및 입실 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(req.password());
        String encodedEntryPassword = passwordEncoder.encode(req.entryPassword());

        User user = req.toEntity(encodedPassword, encodedEntryPassword);
        User savedUser = userRepository.save(user);

        return UserRes.from(savedUser);
    }

    /**
     * 2. 비회원/게스트 간편 등록 (전화번호 기반)
     */
    @Transactional
    public UserRes registerGuest(GuestRegisterReq req) {
        // 기존 동일 전화번호의 게스트가 존재하는지 확인
        return userRepository.findByPhoneNumberAndIsMember(req.phoneNumber(), false)
                .map(existingGuest -> {
                    // 패널티 상태 체크 및 자동 해제
                    existingGuest.checkAndReleaseSuspension();
                    return UserRes.from(existingGuest);
                })
                .orElseGet(() -> {
                    String encodedEntryPassword = passwordEncoder.encode(req.entryPassword());
                    User guest = req.toEntity(encodedEntryPassword);
                    return UserRes.from(userRepository.save(guest));
                });
    }

    /**
     * 3. 회원 단건 조회 (패널티 상태 체크 및 자동 해제 로직 포함)
     */
    @Transactional
    public UserRes getUserProfile(Long userId) {
        User user = findUserAndCheckPenalty(userId);
        return UserRes.from(user);
    }

    /**
     * 4. 입실 비밀번호 검증 (키오스크 / 출입문 단말기용)
     */
    @Transactional
    public boolean verifyEntryPassword(EntryPasswordVerifyReq req) {
        User user = userRepository.findByPhoneNumber(req.phoneNumber())
                .orElseThrow(() -> new ResourceNotFoundException("등록되지 않은 전화번호입니다."));

        // 패널티 및 정지 자동 해제 검증
        if (user.checkAndReleaseSuspension()) {
            throw new IllegalArgumentException("현재 이용 정지 상태입니다. 정지 종료일: " + user.getPenaltyEndDate());
        }

        // 입실 비밀번호 일치 여부 검증
        if (!passwordEncoder.matches(req.entryPassword(), user.getEntryPassword())) {
            throw new IllegalArgumentException("입실 비밀번호가 일치하지 않습니다.");
        }

        return true;
    }

    /**
     * 5. 입실 비밀번호 변경 (마이페이지용)
     */
    @Transactional
    public void updateEntryPassword(Long userId, EntryPasswordUpdateReq req) {
        User user = findUserAndCheckPenalty(userId);

        if (!passwordEncoder.matches(req.currentEntryPassword(), user.getEntryPassword())) {
            throw new IllegalArgumentException("현재 입실 비밀번호가 일치하지 않습니다.");
        }

        String newEncodedEntryPassword = passwordEncoder.encode(req.newEntryPassword());
        
        // 엔티티 내부에서 비밀번호 변경 처리 (dirty checking)
        // User엔티티에 changeEntryPassword 메서드 구현 필요
        user.changeEntryPassword(newEncodedEntryPassword);
    }

    // ================= 공통 내부 검증 메서드 ================= //

    /**
     * 사용자 조회 및 정지(SUSPENDED) 상태/패널티 만료 검증
     */
    private User findUserAndCheckPenalty(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 회원입니다."));

        // 정지 기간이 지났으면 ACTIVE로 자동 변경, 정지 기간 중이면 예외 발생
        if (user.checkAndReleaseSuspension()) {
            throw new IllegalArgumentException("현재 이용 정지 상태입니다. 정지 종료일: " + user.getPenaltyEndDate());
        }

        return user;
    }
}