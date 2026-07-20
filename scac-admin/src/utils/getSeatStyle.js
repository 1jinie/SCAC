export function getSeatStyle(seat) {
  const style = {
    left: `${seat.x}px`,
    top: `${seat.y}px`,
  };

  if (seat.type === "room") {
    style.width = `${seat.width}px`;
    style.height = `${seat.height}px`;
  }

  return style;
}
