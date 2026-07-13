// 문자열이나 숫자 포멧 관련 함수 필요하면 더 추가해서 쓰시면 될거같아요

// 숫자 천 단위로 , 찍는 형태
// import 하시고 formatPrice(ticket.ticketPrice) 이런식으로 쓰시면 됩니다
export const formatPrice = (value) => {
  if (value === null || value === undefined) return '';

  return Number(value).toLocaleString('ko-KR');
};
