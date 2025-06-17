import APIClient from "@/apiClients/index";
import type {
  ITicket,
  ITicketGetResponse,
  ITicketPostRequest,
  ITicketPostResponse,
  ITicketPutRequest,
  ITicketPutResponse,
} from "./dto";

class TicketClient {
  #baseClient: APIClient;

  constructor() {
    this.#baseClient = new APIClient("tickets");
  }

  async findUserTickets(userId: string): Promise<ITicket[] | null> {
    const ticketResponse = await this.#baseClient.get<ITicketGetResponse[]>(
      undefined,
      `user-id=${userId}`
    );

    return ticketResponse;
  }

  /**
   * @description
   * Will create a new pending ticket and a stribe checkout session
   * @returns The stribe checkout session url
   */
  async createTicketSession(
    newTicket: ITicketPostRequest
  ): Promise<string | null> {
    const ticketResponse = await this.#baseClient.post<ITicketPostResponse>(
      newTicket
    );
    if (!ticketResponse) {
      return null;
    }

    return ticketResponse.ticketSession;
  }

  async updateTicket(updatedTicket: ITicketPutRequest) {
    const ticketResponse = await this.#baseClient.put<ITicketPutResponse>(
      updatedTicket
    );

    return ticketResponse;
  }
}

export default TicketClient;
