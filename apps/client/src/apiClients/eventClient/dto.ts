/**
 * @description
 * The base representation of an event in an api response
 */
interface IEventResponse {
  id: string;
  name: string;
  price: number;
  location: string;
  startDate: string;
  endDate: string;
  creatorId: string;
}

/**
 * @description
 * An intermediary type for transfering properties which do not change from the event response interface,
 * to the client event interface
 */
type TEventResponse = {
  [K in keyof Omit<IEventResponse, 'startDate' | 'endDate'>]: IEventResponse[K];
}

interface IEventGETResponse {
  event: IEventResponse;
  ticketCount?: number;
}

interface IEventPostResponse {
  event: IEventResponse;
}

/**
 * @description
 * The client representation of an event
 */
interface IEvent extends TEventResponse {
  startDate: Date;
  endDate: Date;
}

/**
 * @description
 * Specifies how an event should look when sent to the api for creation
 */
type TEventCreate = Omit<IEvent, 'id' | 'creatorId'>;

export { type IEventGETResponse, type IEventPostResponse, type IEvent, type TEventCreate };