import { useNavigate, useRouteError } from 'react-router-dom';
import './css/AdminErrorPage.css';

export default function AdminErrorPage({ status: statusProp }) {
  const error = useRouteError();
  const navi = useNavigate();

  console.error(error);
  return (
    <div>
      <h1>Error !</h1>

      <br />
      <br />
      <section>
        <h3>{error.status || '에러코드가.. 없다! (Runtime Error)'}</h3>
        {/* 네트워크/서버 에러: status+statusText, 런타임에러: message */}
        <p>{error.statusText || error.message}</p>
        <div>
          <button type="button" onClick={() => navi(-1)}>
            이전 페이지
          </button>
          <button type="button" onClick={() => navi('/')}>
            홈으로
          </button>
        </div>
        {/* 어디서 에러가 났는지 알려줍니다 */}
        <p>{error.stack}</p>
      </section>
    </div>
  );
}
