package com.scac.checkin.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.checkin.domain.Checkin;

public interface CheckinRepository extends JpaRepository<Checkin, Long>{
    
}
