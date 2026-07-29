package com.scac.memo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.memo.entity.AdminMemo;

public interface AdminMemoRepository extends JpaRepository<AdminMemo, Long> {

  List<AdminMemo> findAllByOrderByCreatedAtDesc();

}
