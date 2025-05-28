import {
  type IEventGETResponse,
  type IEventPostResponse,
  type IEvent,
  type TEventCreate,
} from "./dto";
import APIClient from "@/apiClients/index";

class EventClient {
  #baseClient: APIClient;

  constructor() {
    this.#baseClient = new APIClient("events");
  }

  async getEvents(): Promise<IEvent[]> {
    const eventResponse = await this.#baseClient.get<{
      events: IEventGETResponse[];
    }>();
    if (!eventResponse) {
      return [];
    }

    return eventResponse.events.map((eventResponse) =>
      this.#transform(eventResponse)
    );
  }

  async findEventById(eventId: string): Promise<IEvent | null> {
    const eventResponse = await this.#baseClient.get<IEventGETResponse>(
      `/${eventId}`
    );
    if (!eventResponse) {
      return null;
    }

    return this.#transform(eventResponse);
  }

  async createEvent(newEvent: TEventCreate): Promise<IEvent | null> {
    const eventResponse = await this.#baseClient.post<IEventPostResponse>(
      newEvent
    );
    if (!eventResponse) {
      return null;
    }

    return this.#transform(eventResponse);
  }

  /**
   * Transforms an eventReponse to an event
   * @param eventResponse - The event reponse to transform to an event
   * @returns - An event based on the event response
   */
  #transform(eventResponse: IEventGETResponse): IEvent {
    return {
      ...eventResponse.event,
      startDate: new Date(eventResponse.event.startDate),
      endDate: new Date(eventResponse.event.endDate),
    };
  }
}

export default EventClient;
