import SeatItem from "./SeatItem";
import "./css/seat.css";

function SeatList({ seats, selected, mode, onClick }) {
  return (
    <div className="seat_wrapper">
      {seats.map((seat) => (
        <SeatItem
          key={`${seat.type}-${seat.id}`}
          seat={seat}
          isSelected={
            selected === seat.id &&
            (mode === "seat" ? seat.type === "seat" : seat.type === "room")
          }
          onClick={() => onClick(seat)}
          mode={mode}
        />
      ))}
    </div>
  );
}

export default SeatList;
