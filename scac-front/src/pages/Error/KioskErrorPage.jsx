import React, { useEffect } from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import SelectButton from '../../components/button/SelectButton';
import { useResetStore } from '../../hooks/useResetStore';
import './css/KioskErrorPage.css';

export default function KioskErrorPage({ status: statusProp }) {
  const error = useRouteError();
  const navi = useNavigate();
  const resetAll = useResetStore();

  console.error(error);

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('resetAll');
      resetAll();
      navi('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navi, resetAll]);

  const status = statusProp || error?.status || 500;
  const title =
    status === 404 ? '페이지를 찾을 수 없습니다' : '문제가 발생했습니다';

  const message =
    status === 404
      ? '요청하신 페이지가 존재하지 않거나 이동된 페이지입니다.'
      : '요청을 처리하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';

  return (
    <div className="overlay">
      <div className="modal">
        <div className="kiosk_error_page">
          <img
            src="/icons/common/caution.svg"
            alt="에러 발생"
            className="error_caoution_icon"
          />

          <div className="error_status_container">
            <div className="error_status_header kiosk_error_row">
              <span>status</span>
              <span className="code">[{status} Error!]</span>
            </div>

            <div className="error_status_text  kiosk_error_row">
              <span>{title}</span>
              <span>{message}</span>
            </div>
          </div>
          <p className="error_timer">10초 후 자동으로 종료됩니다</p>
          <SelectButton
            nextPage={'/'}
            text={'홈으로 돌아가기'}
            onClickAction={resetAll}
          />
        </div>
      </div>
    </div>
  );
}
