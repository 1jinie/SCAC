import { useCallback, useEffect } from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import KioskErrorState from '../../components/common/KioskErrorState';
import { useResetStore } from '../../hooks/useResetStore';

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
