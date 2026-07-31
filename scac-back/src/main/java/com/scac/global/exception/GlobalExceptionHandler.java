package com.scac.global.exception;

import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.scac.global.response.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

  private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  /*
   * 존재하지 않는 데이터를 조회시 사용하는 예외입니다. 404 NOT FOUND[cite: 37]
   */
  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(ResourceNotFoundException exception) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(exception.getMessage(), null));
  }

  /*
   * 엔티티나 서비스에서 생성·수정 값 등 잘못된 입력값을 검증할 때 사용하는 예외입니다. 400 BAD REQUEST[cite: 37]
   */
  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ApiResponse<Void>> handleIllegalArgument(IllegalArgumentException exception) {
    return ResponseEntity.badRequest().body(ApiResponse.error(exception.getMessage(), null));
  }

  /*
   * 존재하지 않는 URL 경로 요청 시 처리합니다. 404 NOT FOUND[cite: 37]
   */
  @ExceptionHandler(NoResourceFoundException.class)
  public ResponseEntity<ApiResponse<Void>> handleNoResource(NoResourceFoundException e) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("존재하지 않는 주소입니다.", null));
  }

  /*
   * @RequestBody DTO의 @Valid 검증 실패를 처리합니다. 400 BAD REQUEST[cite: 37]
   */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiResponse<Map<String, String>>> handleValidation(
    MethodArgumentNotValidException exception) {
    Map<String, String> errors = new LinkedHashMap<>();

    exception.getBindingResult().getFieldErrors()
      .forEach(error -> errors.putIfAbsent(error.getField(), error.getDefaultMessage()));

    return ResponseEntity.badRequest().body(ApiResponse.error("입력값을 확인해주세요.", errors));
  }

  /*
   * 현재 데이터 상태에서는 요청을 처리할 수 없을 때 사용하는 예외입니다. 400 BAD REQUEST[cite: 37]
   */
  @ExceptionHandler(IllegalStateException.class)
  public ResponseEntity<ApiResponse<Void>> handleIllegalStateException(IllegalStateException e) {
    return ResponseEntity.badRequest().body(ApiResponse.fail(e.getMessage()));
  }

  /*
   * 비즈니스 로직 수행 중 발생하는 예외를 처리합니다. 400 BAD REQUEST[cite: 37]
   */
  @ExceptionHandler(BusinessException.class)
  public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException exception) {
    return ResponseEntity.badRequest().body(ApiResponse.error(exception.getMessage(), null));
  }

  /*
   * 권한이 없는 접근 시 발생하는 예외를 처리합니다. 403 FORBIDDEN 👈 [추가됨]
   */
  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException exception) {
    return ResponseEntity.status(HttpStatus.FORBIDDEN)
      .body(ApiResponse.error("접근 권한이 없습니다.", null));
  }

  /*
   * 예외처리를 하지 않은 예상치 못한 에러 500 INTERNAL SERVER ERROR[cite: 37]
   */
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiResponse<Void>> handleException(Exception exception) {
    log.error("처리되지 않은 서버 예외가 발생했습니다.", exception);

    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .body(ApiResponse.error("서버 처리 중 오류가 발생했습니다.", null));
  }
}