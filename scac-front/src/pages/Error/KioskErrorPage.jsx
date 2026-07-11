import React from 'react';
import { Link, useNavigate, useRouteError } from 'react-router-dom';

export default function KioskErrorPage() {
  const error = useRouteError();
  const navi = useNavigate();

  console.error(error);
  return (
    <div>
      <h1>Error !</h1>
      <p>
        에!러!가!났!다
        <br />
        오!타!일!까!문!법!에!러!일!까
      </p>
      <section>
        <h3>{error.status || '에러코드가.. 없다! (Runtime Error)'}</h3>
        {/* 네트워크/서버 에러: status+statusText, 런타임에러: message */}
        <p>{error.statusText || error.message}</p>
        <br />
        <Link to={'/'}>Home으로 돌아가기</Link>
        <br />
        {/* 어디서 에러가 났는지 알려줍니다 */}
        <p>{error.stack}</p>
      </section>
    </div>
  );
}
