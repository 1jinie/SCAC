import { useCallback, useEffect } from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import KioskErrorState from '../../components/common/KioskErrorState';
import { useResetStore } from '../../hooks/useResetStore';

/**
 * 키오스크 라우터 전용 오류 페이지
 *
 * 사용 방법
 * - React Router의 errorElement에 등록하여 사용합니다.
 * - useRouteError()로 라우터 오류와 HTTP 상태 코드를 가져옵니다.
 * - status prop을 전달하면 라우터 오류 상태보다 우선 적용됩니다.
 * - 404와 그 외 오류에 따라 안내 문구를 구분합니다.
 * - 오류 발생 10초 후 모든 키오스크 상태를 초기화하고 홈으로 이동합니다.
 * - 홈 이동 시 replace 옵션을 사용해 오류 페이지 재진입을 방지합니다.
 *
 * API 조회 실패처럼 현재 페이지에서 다시 시도할 수 있는 오류는
 * 이 페이지로 이동하지 않고 KioskErrorState를 직접 사용합니다.
 *
 * 라우터 등록 예시
 * {
 *   path: '/',
 *   element: <KioskLayout />,
 *   errorElement: <KioskErrorPage />,
 * }
 *
 * 상태 코드를 직접 전달하는 예시
 * <KioskErrorPage status={404} />
 */
/*
 * KioskErrorPage
 * → 잘못된 주소, 렌더링 오류 등 라우터 전체 오류
 *
 * KioskErrorState
 * → API 조회 실패, 로그인 정보 없음 등 페이지 내부 오류 UI
 */
export default function KioskErrorPage({ status: statusProp }) {
  const routeError = useRouteError();
  const navi = useNavigate();
  const resetAll = useResetStore();

  const status = statusProp ?? routeError?.status ?? 500;

  const title =
    status === 404 ? '페이지를 찾을 수 없습니다.' : '문제가 발생했습니다.';

  const message =
    status === 404
      ? '요청하신 페이지가 존재하지 않거나 이동된 페이지입니다.'
      : '요청을 처리하는 중 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.';

  const handleHome = useCallback(() => {
    resetAll();
    navi('/', { replace: true });
  }, [navi, resetAll]);

  useEffect(() => {
    console.error('라우터 오류:', routeError);
  }, [routeError]);

  useEffect(() => {
    const timer = window.setTimeout(handleHome, 10000);
    return () => window.clearTimeout(timer);
  }, [handleHome]);

  return (
    <KioskErrorState
      variant="page"
      status={status}
      title={title}
      message={message}
      timerText="10초 후 처음 화면으로 이동합니다."
      onHome={handleHome}
    />
  );
}
