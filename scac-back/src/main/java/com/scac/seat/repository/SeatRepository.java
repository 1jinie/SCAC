package com.scac.seat.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.seat.domain.Seat;

public interface SeatRepository extends JpaRepository<Seat, Long>{
    List<Seat> findByCurrentUserIdIsNotNull();
}