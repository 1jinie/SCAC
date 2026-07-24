// 문자열이나 숫자 포멧 관련 함수 필요하면 더 추가해서 쓰시면 될거같아요

// 숫자 천 단위로 , 찍는 형태
// import 하시고 formatPrice(ticket.ticketPrice) 이런식으로 쓰시면 됩니다
export const formatPrice = (value) => {
  if (value === null || value === undefined) return '';

  return Number(value).toLocaleString('ko-KR');
};

// 휴대폰 번호 000-0000-0000 형식
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '-';

  const numbers = String(phoneNumber).replace(/\D/g, '');

  if (numbers.length === 11) {
    return numbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }

  if (numbers.length === 10) {
    return numbers.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }

  return String(phoneNumber);
};
