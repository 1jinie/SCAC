export const formatDate = (fullDate) => {
  const date = new Date(fullDate);

  return {
    day: date.toLocaleDateString('ko-KR', {
      weekday: 'short',
    }),
    date: `${date.getDate()}일`,
  };
};
