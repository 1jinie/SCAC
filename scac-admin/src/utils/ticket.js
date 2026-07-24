export const formatTicketTime = (ticketType, ticketTime) => {
  switch (ticketType) {
    case 'TIME_PACK':
      return `${ticketTime / 60}`;
    case 'PERIOD_PACK':
      return `${ticketTime / (24 * 60)}`;
    default:
      return ticketTime;
  }
};
