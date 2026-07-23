package com.scac.global.exception;
/*
서버에 요청한 데이터가 존재하지 않을 때 사용하는 예외입니다
*/
public class ResourceNotFoundException extends RuntimeException {

  public ResourceNotFoundException(String message) {
    super(message);
  }
}