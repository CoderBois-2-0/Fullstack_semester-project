import { type IEventGETResponse, type IEventPostResponse, type IEvent, type TEventCreate } from "./dto";
import APIClient from "@/apiClients/index";


class EventClient {
  #baseClient: APIClient;
  #basePath: string;

  constructor() {
    this.#baseClient = new APIClient();
    this.#basePath = "events";
  }

  async getEvents(): Promise<IEvent[]> {
    const eventResponse = (await this.#baseClient.get<{ events: IEventGETResponse[]}>(this.#basePath));

    return eventResponse.events.map((eventResponse) => this.#transform(eventResponse));
  }

  async findEventById(eventId: string): Promise<IEvent | undefined> {
    const eventResponse = (await this.#baseClient.get<IEventGETResponse>(
      `${this.#basePath}/${eventId}`,
    ));

    return this.#transform(eventResponse);
  }

  async createEvent(newEvent: TEventCreate): Promise<IEvent> {
    const eventResponse = await this.#baseClient.post<IEventPostResponse>(this.#basePath, newEvent);

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
