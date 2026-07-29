package com.scac.global.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

/*
사용 예시

1. 데이터가 있는 성공 응답

@GetMapping
public ResponseEntity<ApiResponse<List<TicketResDTO>>> findAll() {
  List<TicketResDTO> tickets = ticketService.findAll();

  return ResponseEntity.ok(
      ApiResponse.success(
          "이용권 목록 조회를 완료했습니다.",
          tickets
      )
  );
}

반환 데이터
{
  "success": true,
  "message": "이용권 목록 조회를 완료했습니다.",
  "data": [
    {
      "ticketId": 1,
      "ticketName": "2시간 이용권"
    }
  ]
}


2. 단일 데이터 성공 응답

@GetMapping("/{ticketId}")
public ResponseEntity<ApiResponse<TicketResDTO>> findById(
    @PathVariable Long ticketId
) {
  TicketResDTO ticket = ticketService.findById(ticketId);

  return ResponseEntity.ok(
      ApiResponse.success(
          "이용권 조회를 완료했습니다.",
          ticket
      )
  );
}

반환 데이터
{
  "success": true,
  "message": "이용권 조회를 완료했습니다.",
  "data": {
    "ticketId": 1,
    "ticketName": "2시간 이용권"
  }
}


3. 데이터가 없는 성공 응답

@DeleteMapping("/{ticketId}")
public ResponseEntity<ApiResponse<Void>> delete(
    @PathVariable Long ticketId
) {
  ticketService.delete(ticketId);

  return ResponseEntity.ok(
      ApiResponse.success("이용권 삭제를 완료했습니다.")
  );
}

반환 데이터
{
  "success": true,
  "message": "이용권 삭제를 완료했습니다.",
  "data": null
}


4. 실패/검증오류 응답

GlobalExceptionHandler를 참고해 주세요.

*/
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ApiResponse<T> {

  private boolean isSuccess;
  private String message;
  private T data;

  public static <T> ApiResponse<T> success(String message, T data) {
    return new ApiResponse<>(true, message, data);
  }

  public static ApiResponse<Void> success(String message) {
    return new ApiResponse<>(true, message, null);
  }

  public static <T> ApiResponse<T> error(String message, T data) {
    return new ApiResponse<>(false, message, data);
  }

  public static <T> ApiResponse<T> fail(String message, T data

  ) {
    return new ApiResponse<>(false, message, null);
  }
}