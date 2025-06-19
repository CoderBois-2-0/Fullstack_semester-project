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

/**
 * @description
 * Parameters for paginated event queries
 */
interface IEventQueryParams {
  page: number;
  limit: number;
}

/**
 * @description
 * Paginated response structure for events
 */
interface IPaginatedEventResponse {
  events: IEventGETResponse[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * @description
 * Client-side paginated event response
 */
interface IPaginatedEvents {
  filter(arg0: (event: any) => boolean): unknown;
  data: IEvent[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export { type IEventGETResponse, type IEventPostResponse, type IEvent, type TEventCreate, type IEventQueryParams, type IPaginatedEventResponse, type IPaginatedEvents };