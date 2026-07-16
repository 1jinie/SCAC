import { useMemo, useRef } from 'react';

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

const toDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export default function ReservationDateSlider({ selectedDate, onDateChange }) {
  const sliderRef = useRef(null);

  const dates = useMemo(() => {
    const today = new Date();

    return Array.from({ length: 14 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);

      return {
        value: toDateString(date),
        month: date.getMonth() + 1,
        day: date.getDate(),
        weekday: WEEKDAY_LABELS[date.getDay()],
        isToday: index === 0,
      };
    });
  }, []);

  const handleScroll = (direction) => {
    sliderRef.current?.scrollBy({
      left: direction === 'next' ? 420 : -420,
      behavior: 'smooth',
    });
  };

  return (
    <div className="admin_date_slider_wrap">
      <button
        type="button"
        className="admin_date_slider_arrow"
        onClick={() => handleScroll('previous')}
        aria-label="이전 날짜 보기"
      >
        ‹
      </button>

      <div ref={sliderRef} className="admin_date_slider">
        {dates.map((date) => (
          <button
            key={date.value}
            type="button"
            className={`admin_date_item ${
              selectedDate === date.value ? 'is_active' : ''
            }`}
            onClick={() => onDateChange(date.value)}
          >
            <span className="admin_date_weekday">
              {date.isToday ? '오늘' : date.weekday}
            </span>

            <strong>
              {date.month}/{date.day}
            </strong>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="admin_date_slider_arrow"
        onClick={() => handleScroll('next')}
        aria-label="다음 날짜 보기"
      >
        ›
      </button>
    </div>
  );
}
