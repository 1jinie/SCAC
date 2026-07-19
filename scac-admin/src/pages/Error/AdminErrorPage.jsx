import { useNavigate, useRouteError } from "react-router-dom";
import "./css/AdminErrorPage.css";

export default function AdminErrorPage({ status: statusProp }) {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error(error);

  const status = statusProp || error?.status || 500;
  const title =
    status === 404 ? "페이지를 찾을 수 없습니다" : "문제가 발생했습니다";

  const message =
    status === 404
      ? "요청하신 페이지가 존재하지 않거나 이동된 페이지입니다."
      : "요청을 처리하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";

  return (
    <div className="admin_error_page">
      <div className="admin_error_card">
        <div className="admin_error_code_wrap">
          <p className="admin_error_code">{status}</p>
        </div>

        <h1>{title}</h1>
        <p>{message}</p>

        <div className="admin_error_actions">
          <button
            type="button"
            className="admin_error_back_button"
            onClick={() => navigate(-1)}
          >
            이전 페이지
          </button>

          <button
            type="button"
            className="admin_error_home_button"
            onClick={() => navigate("/")}
          >
            관리자 홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
