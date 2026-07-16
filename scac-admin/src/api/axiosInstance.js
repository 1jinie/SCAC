import axios from 'axios';

// 나중에 .env 파일을 생성해 사용할 API_URL을 넣으면 됩니다.
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8888';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
=========================================
 JWT 인증(Spring Security + JWT) 적용 예정
=========================================

1. Request Interceptor
   - localStorage의 accessToken 조회
   - Authorization 헤더 자동 추가

2. Response Interceptor
   - 401, 403 응답 처리
   - 토큰 만료 시 로그아웃 및 로그인 페이지 이동

*/

export default axiosInstance;
