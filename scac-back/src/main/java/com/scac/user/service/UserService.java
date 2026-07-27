package com.scac.user.service;

import com.scac.global.enums.UserStatus;
import com.scac.user.dto.GuestRegisterReq;
import com.scac.user.dto.PasswordUpdateReq;
import com.scac.user.dto.PasswordVerifyReq;
import com.scac.user.dto.UserSignUpReq;
import com.scac.user.entity.User;

import com.scac.user.repository.UserRepository;
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

    /**
     * 일반 회원가입
     */
    public User register(UserSignUpReq req) {

        if (userRepository.existsByPhoneNumber(req.phoneNumber())) {
            throw new IllegalArgumentException("이미 등록된 전화번호입니다.");
        }

        String encodedPassword =
                passwordEncoder.encode(req.password());

        User user =
                req.toEntity(encodedPassword);

        return userRepository.save(user);
    }

    /**
     * 비회원 등록
     */
    public User registerGuest(GuestRegisterReq req) {

        User existUser = userRepository.findByPhoneNumber(req.phoneNumber())
        .orElse(null);

        if (existUser != null) {

            if (Boolean.FALSE.equals(existUser.getIsMember())) {
                existUser.changePassword(passwordEncoder.encode(req.password()));
                return existUser;
            }

            throw new IllegalArgumentException("이미 등록된 전화번호입니다.");
        }

        String encodedPassword =
                passwordEncoder.encode(req.password());

        User newGuest =
                req.toEntity(encodedPassword);

        return userRepository.save(newGuest);
    }

    /**
     * 회원 단건 조회
     */
    @Transactional(readOnly = true)
    public User findUser(Long userId) {

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new IllegalArgumentException("존재하지 않는 회원입니다."));

        return user;
    }

    /**
     * 입실 비밀번호 검증
     */
    public User verifyPassword(PasswordVerifyReq req) {

        User user =
                userRepository.findByPhoneNumber(req.phoneNumber())
                        .orElseThrow(() ->
                                new IllegalArgumentException("등록되지 않은 전화번호입니다."));

        if (user.getUserStatus() == UserStatus.SUSPENDED) {
            throw new IllegalArgumentException(
                    "현재 이용 정지 상태입니다. 정지 종료일: "
                    + user.getPenaltyEndDate());
        }

        if (user.getUserStatus() == UserStatus.BANNED) {
                throw new IllegalArgumentException("탈퇴 또는 이용이 제한된 회원입니다.");
        }

        if (!passwordEncoder.matches(
                req.password(),
                user.getPassword())) {

            throw new IllegalArgumentException("입실 비밀번호가 일치하지 않습니다.");
        }

        return user;
    }

    /**
     * 입실 비밀번호 변경
     */
    public void changePassword(
            Long userId,
            PasswordUpdateReq req) {

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new IllegalArgumentException("존재하지 않는 회원입니다."));

        if(user.getUserStatus() == UserStatus.SUSPENDED){
            throw new IllegalArgumentException(
                "현재 이용 정지 상태입니다. 정지 종료일: "
                + user.getPenaltyEndDate());
        }

        if (user.getUserStatus() == UserStatus.BANNED) {
                 throw new IllegalArgumentException("탈퇴 또는 이용이 제한된 회원입니다.");
        }

        if (!passwordEncoder.matches(
                req.currentPassword(),
                user.getPassword())) {

            throw new IllegalArgumentException(
                    "현재 입실 비밀번호가 일치하지 않습니다.");
        }

        user.changePassword(
                passwordEncoder.encode(req.newPassword()));
    }

}