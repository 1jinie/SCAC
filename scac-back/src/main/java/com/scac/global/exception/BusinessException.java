package com.scac.global.exception;

/* 
    비즈니스 규칙 위반 
    ex) 이미 입실 중, 외출 상태 아님, 사용할 수 없는 좌석 ...
*/ 

public class BusinessException extends RuntimeException{
    public BusinessException(String message){
        super(message);
    }
}
