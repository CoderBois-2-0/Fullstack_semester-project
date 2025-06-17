/**
 * @description
 * The base Ticket shape on the server
 */
interface IAPITicket {
  id: string;
  quantity: number;
  stateKind: "PENDING" | "COMPLETED" | "CANCELLED";
  eventId: string;
  userId: string;
}

/**
 * @description
 * The client representation of a ticket
 */
interface ITicket extends IAPITicket {}

interface ITicketGetResponse extends IAPITicket {}

interface ITicketPostRequest extends Pick<IAPITicket, "quantity" | "eventId"> {}

interface ITicketPostResponse extends IAPITicket {
  ticketSession: string;
}

interface ITicketPutRequest extends Pick<IAPITicket, "stateKind"> {}

interface ITicketPutResponse extends IAPITicket {}

export {
  type ITicket,
  type ITicketGetResponse,
  type ITicketPostRequest,
  type ITicketPostResponse,
  type ITicketPutRequest,
  type ITicketPutResponse,
};
