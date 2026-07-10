import React, { useEffect, useState } from 'react';
import { formatClock } from '../utils/date.js';

export default function HeaderTime() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const updateTimer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(updateTimer);
  }, []);
  return (
    <div className="header_clock">
      <span>{formatClock(time)}</span>
    </div>
  );
}
