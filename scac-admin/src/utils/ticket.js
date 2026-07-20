export const formatTicketTime = (ticketType, ticketTime) => {
  switch (ticketType) {
    case "TIME":
      return `${ticketTime / 60}`;
    case "PERIOD":
      return `${ticketTime / (24 * 60)}`;
    default:
      return ticketTime;
  }
};
