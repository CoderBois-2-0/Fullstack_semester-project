import TicketClient from "@/apiClients/ticketClient";
import { mutateData, queryData } from "./dataHook";
import type { ITicketPostRequest } from "@/apiClients/ticketClient/dto";

const TICKET_QUERY = "tickets";
const ticketClient = new TicketClient();

function useTicket(userId: string) {
  const ticketQuery = queryData([TICKET_QUERY, userId], () =>
    ticketClient.findUserTickets(userId)
  );

  return ticketQuery;
}

function useCreateTicket() {
  const ticketMutation = mutateData((newTicket: ITicketPostRequest) =>
    ticketClient.createTicketSession(newTicket)
  );

  return ticketMutation;
}

export { useTicket, useCreateTicket };
