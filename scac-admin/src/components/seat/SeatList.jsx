import SeatItem from "./SeatItem";

function SeatList({ seats, selected, mode, onClick }) {
  return (
    <div className="seat_wrapper">
      {seats.map((seat) => (
        <SeatItem
          key={seat.id}
          seat={seat}
          isSelected={selected === seat.id}
          onClick={() => onClick(seat)}
          mode={mode}
        />
      ))}
    </div>
  );
}

export default SeatList;
