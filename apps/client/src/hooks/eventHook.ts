import EventClient from "@/apiClients/eventClient/index";
import { type TEventCreate } from "@/apiClients/eventClient/dto";
import { mutateData, queryData } from "./dataHook";
import { useQueryClient } from "@tanstack/react-query";

const QUERY_KEY = "events";
const eventClient = new EventClient();

function useEvents(page: number = 1, limit: number = 9) {
  const query = queryData([QUERY_KEY, page, limit], () => 
    eventClient.getEvents({ page, limit })
  );

  return query;
}

function useEvent(eventId: string) {
  const query = queryData([QUERY_KEY, eventId], async () =>
    eventClient.findEventById(eventId)
  );

  return query;
}

function useCreateEvent() {
  const queryClient = useQueryClient();

  const mutation = mutateData(
    (newEvent: TEventCreate) => eventClient.createEvent(newEvent),
    () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    }
  );

  return mutation;
}

export { useEvent, useEvents, useCreateEvent };
