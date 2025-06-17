import {
  type IEventGETResponse,
  type IEventPostResponse,
  type IEvent,
  type TEventCreate,
  type IEventQueryParams,
  type IPaginatedEventResponse,
  type IPaginatedEvents,
} from "./dto";
import APIClient from "@/apiClients/index";

class EventClient {
  #baseClient: APIClient;

  constructor() {
    this.#baseClient = new APIClient("events");
  }

  async getEvents(params?: IEventQueryParams): Promise<IPaginatedEvents> {
  if (params) { // ← Changed from (params?.page || params?.limit)
    // Pagination path - expects full pagination response
    const { page = 1, limit = 12 } = params;
    
    const eventResponse = await this.#baseClient.get<IPaginatedEventResponse>(
      `?page=${page}&limit=${limit}`
    );
    
    if (!eventResponse) {
      return {
        data: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }

    console.log(eventResponse)
    return {
      data: eventResponse.events.map((eventResponse) =>
        this.#transform(eventResponse)
      ),
      totalCount: eventResponse.totalCount,
      totalPages: eventResponse.totalPages,
      currentPage: eventResponse.currentPage,
      hasNextPage: eventResponse.hasNextPage,
      hasPreviousPage: eventResponse.hasPreviousPage,
    };
  } else {
    // Non-pagination path - expects simple { events: [...] } response
    const eventResponse = await this.#baseClient.get<{
      events: IEventGETResponse[];
    }>();
    
    if (!eventResponse) {
      return {
        data: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }

    const events = eventResponse.events.map((eventResponse) =>
      this.#transform(eventResponse)
    );

    return {
      data: events,
      totalCount: events.length,
      totalPages: 1,
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }
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
