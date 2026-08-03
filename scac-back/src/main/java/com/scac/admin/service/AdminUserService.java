package com.scac.admin.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scac.admin.dto.request.AdminUserSearchReq;
import com.scac.admin.dto.request.UserPenaltyReq;
import com.scac.admin.dto.response.AdminUserRes;
import com.scac.global.enums.UserStatus;
import com.scac.user.entity.User;
import com.scac.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminUserService {

    private final UserRepository userRepository;

    /**
     * 전체 회원 목록 및 조건 조회
     */
    @Transactional(readOnly = true)
    public List<AdminUserRes> getUsers(AdminUserSearchReq searchReq) {
        // 전화번호 검색 조건이 있는 경우
        if (searchReq.getPhoneNumber() != null && !searchReq.getPhoneNumber().isBlank()) {
            String cleanPhone = searchReq.getPhoneNumber().replaceAll("-", "").trim();
            return userRepository.findByPhoneNumber(cleanPhone)
                    .stream()
                    .map(AdminUserRes::from)
                    .toList();
        }

        // 회원 상태 검색 조건이 있는 경우
        if (searchReq.getUserStatus() != null) {
            return userRepository.findByUserStatus(searchReq.getUserStatus())
                    .stream()
                    .map(AdminUserRes::from)
                    .toList();
        }

        // 전체 회원 목록 반환
        return userRepository.findAll()
                .stream()
                .map(AdminUserRes::from)
                .toList();
    }

    /**
     * 회원 상세 조회
     */
    @Transactional(readOnly = true)
    public AdminUserRes getUserDetail(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        return AdminUserRes.from(user);
    }

    /**
     * 회원 제재 / 정지 / 정지 해제 처리
     */
    public void applyUserPenalty(Long userId, UserPenaltyReq req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

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