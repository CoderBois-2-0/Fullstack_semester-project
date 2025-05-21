import APIClient from "./index";

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
    this.#basePath = "/events";
  }

  async getEvents(): Promise<IEvent[]> {
    const events = await this.#baseClient.get(this.#basePath);

    return events;
  }
}

export default EventClient;
export { type IEvent };
