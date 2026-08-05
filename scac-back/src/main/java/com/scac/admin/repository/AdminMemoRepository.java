package com.scac.admin.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.admin.entity.AdminMemo;

public interface AdminMemoRepository extends JpaRepository<AdminMemo, Long> {

  List<AdminMemo> findAllByOrderByCreatedAtDesc();

}
