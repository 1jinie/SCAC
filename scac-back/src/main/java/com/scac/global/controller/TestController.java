package com.scac.global.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

  @GetMapping
  public Map<String, String> connectionTest() {
    return Map.of(
        "status", "success",
        "message", "SCAC 백엔드 연결 성공!"
    );
  }
}