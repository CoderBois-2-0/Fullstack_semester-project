import APIClient from "./index";

interface IEventResponse {
  event: {
    id: string;
    name: string;
    price: number;
    location: string;
    startDate: string;
    endDate: string;
    creatorId: string;
  };
  ticketCount?: number;
}

interface IEvent {
  id: string;
  name: string;
  price: number;
  location: string;
  startDate: Date;
  endDate: Date;
  creatorId: string;
}

class EventClient {
  #baseClient: APIClient;
  #basePath: string;

  constructor() {
    this.#baseClient = new APIClient();
    this.#basePath = "events";
  }

  async getEvents(): Promise<IEvent[]> {
    const events = (await this.#baseClient.get(this.#basePath)) as {
      events: IEventResponse[];
    };

    return events.events.map((eventResponse) => this.#transform(eventResponse));
  }

  async findEventById(eventId: string) {
    const eventResponse = (await this.#baseClient.get(
      `${this.#basePath}/${eventId}`,
    )) as { event: IEventResponse };

    return this.#transform(eventResponse.event);
  }

  /**
   * Transforms an eventReponse to an event
   * @param eventResponse - The event reponse to transform to an event
   * @returns - An event based on the event response
   */
  #transform(eventResponse: IEventResponse): IEvent {
    return {
      ...eventResponse.event,
      startDate: new Date(eventResponse.event.startDate),
      endDate: new Date(eventResponse.event.endDate),
    };
  }
}

export default EventClient;
export { type IEventResponse, type IEvent };
