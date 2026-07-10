import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SelectButton({ nextPage, onClickAction }) {
  // 사용할 페이지에선
  // <SelectButton nextPage='넘어갈 페이지' onClickAction={handle* 함수}/>
  // 로 사용하시면 됩니다
  // ex. <SelectButton nextPage={`ticket`} /> => <Payment/>로 이동

  // API함수에 보낼 데이터가 있다면
  // const handle* = async () => {await API함수.사용할함수(데이터)}
  // 형식으로 사용할 페이지에서 함수를 만드시면 됩니다(아마도? 문제생기면 말씀주세요. 지현)
  const navigate = useNavigate();
  const handleNextPage = async () => {
    // 사용할 API 함수가 있다면 실행
    if (onClickAction) {
      try {
        await onClickAction();
        // API 함수 성공시 nextPage로 이동
        navigate(`${nextPage}`);
      } catch (err) {
        console.error('요청 실패:', err); //임시
      }
    } else {
      // 보낼 API가 없는 단순 이동 버튼일 경우 바로 nextPage로 이동
      navigate(`/${nextPage}`);
    }
  };
  return (
    <button className="select_complete" onClick={() => handleNextPage()}>
      선택완료
    </button>
  );
}
