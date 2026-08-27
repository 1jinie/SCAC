import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useResetStore } from './useResetStore';

// 기본 3분 (180,000ms)
const INACTIVITY_TIMEOUT_MS = 3 * 60 * 1000;
const USER_EVENTS = ['click', 'touchstart', 'pointerdown', 'keydown'];

/**
 * 키오스크 사용자 무입력 감지 및 자동 초기화 커스텀 훅
 * - 지정된 시간(기본 3분) 동안 입력이 없으면 모든 상태(스토어/세션)를 초기화하고 홈 화면('/')으로 복귀합니다.
 * - 홈 화면에 머물고 있는 경우에는 타이머가 동작하지 않습니다.
 */
export const useIdleTimer = (timeoutMs = INACTIVITY_TIMEOUT_MS) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetAll } = useResetStore();

  useEffect(() => {
    // 홈 화면('/')에 머물러 있는 경우 타이머 미동작
    if (location.pathname === '/') {
      return;
    }

    let timer;

    const handleTimeout = () => {
      resetAll();
      navigate('/', { replace: true });
    };

    const resetTimer = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(handleTimeout, timeoutMs);
    };

    // 페이지 진입/경로 변경 시 타이머 시작
    resetTimer();

    USER_EVENTS.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      USER_EVENTS.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [location.pathname, navigate, resetAll, timeoutMs]);
};
