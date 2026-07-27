package com.scac.global.exception;

import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.scac.global.response.ApiResponse;

// 스프링 터미널 로그를 확인해주세요
@RestControllerAdvice
public class GlobalExceptionHandler {

  private static final Logger log =
      LoggerFactory.getLogger(GlobalExceptionHandler.class);

  /*
  존재하지 않는 데이터를 조회시 사용하는 예외입니다. 404 NOT FOUND

  사용예시
  .orElseThrow(() ->
    new ResourceNotFoundException("존재하지 않는 결제 내역입니다.")
  반환 데이터
  {
  "success": false,
  "message": "존재하지 않는 결제 내역입니다.",
  "data": null
  }
 
  */ 
  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(
      ResourceNotFoundException exception
  ) {
    return ResponseEntity
        .status(HttpStatus.NOT_FOUND)
        .body(ApiResponse.error(exception.getMessage(), null));
  }

  /*
  엔티티나 서비스에서 생성·수정 값 등 잘못된 입력값을 검증할 때 사용하는 예외입니다. 400 BAD REQUEST

  사용예시
  throw new IllegalArgumentException(
    "이용권 가격은 0 이상이어야 합니다."
  );
  반환 데이터 
  {
  "success": false,
  "message": "이용권 가격은 0 이상이어야 합니다.",
  "data": null
}
  */
  @ExceptionHandler(IllegalArgumentException.class)
public ResponseEntity<ApiResponse<Void>> handleIllegalArgument(
    IllegalArgumentException exception
) {
  return ResponseEntity
      .badRequest()
      .body(ApiResponse.error(exception.getMessage(), null));
}

/*
   @RequestBody DTO의 @Valid 검증 실패를 처리합니다. 400 BAD REQUEST

  사용예시
  DTO에선
  @NotBlank(message = "이용권 이름은 필수입니다.")
  private String ticketName;
  @NotNull(message = "이용권 가격은 필수입니다.")
  @PositiveOrZero(message = "이용권 가격은 0 이상이어야 합니다.")
  private Integer ticketPrice;

  Controller에선 
  public ResponseEntity<ApiResponse<TicketResDTO>> create(
    @Valid @RequestBody TicketCreateDTO form)

  반환 데이터
  {
    "success": false,
    "message": "입력값을 확인해주세요.",
    "data": {
      "ticketName": "이용권 이름은 필수입니다.",
      "ticketPrice": "이용권 가격은 0 이상이어야 합니다."
    }
  }
*/

@ExceptionHandler(NoResourceFoundException.class)
public ResponseEntity<ApiResponse<Void>> handleNoResource(
        NoResourceFoundException e
){
    return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(ApiResponse.error("존재하지 않는 주소입니다.", null));
}

@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<ApiResponse<Map<String, String>>> handleValidation(
    MethodArgumentNotValidException exception
) {
  Map<String, String> errors = new LinkedHashMap<>();

  exception.getBindingResult()
      .getFieldErrors()
      .forEach(error ->
          errors.putIfAbsent(
              error.getField(),
              error.getDefaultMessage()
          )
      );

  return ResponseEntity
      .badRequest()
      .body(ApiResponse.error(
          "입력값을 확인해주세요.",
          errors
      ));
}



// 예외처리를 아직 하지 않은 예상못한 에러 500 INTERNAL SERVER ERROR 콘솔창을 확인해주세요
@ExceptionHandler(Exception.class)
  public ResponseEntity<ApiResponse<Void>> handleException(
      Exception exception
  ) {
    log.error("처리되지 않은 서버 예외가 발생했습니다.", exception);

    return ResponseEntity
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(ApiResponse.error(
            "서버 처리 중 오류가 발생했습니다.",
            null
        ));
  }

/*
  비즈니스 로직 수행 중 발생하는 예외를 처리합니다. 400 BAD REQUEST
  
  사용예시
  좌석 입실 시 이미 사용 중인 좌석이면 발생
  
  throw new BusinessException(
      "이미 사용 중인 좌석입니다."
  );
  
  반환 데이터
  {
    "success": false,
    "message": "이미 사용 중인 좌석입니다.",
    "data": null
  }
*/  
@ExceptionHandler(BusinessException.class)
  public ResponseEntity<ApiResponse<Void>> handleBusinessException(
      BusinessException exception
  ) {
    return ResponseEntity
            .badRequest()
            .body(
                ApiResponse.error(
                    exception.getMessage(), 
                    null
                )
            );
  }
}