import EventClient from "@/apiClients/eventClient";
import { queryData } from "./dataHook";
import { useQuery } from "@tanstack/react-query";

const QUERY_KEY = "events";
const eventClient = new EventClient();

function useEvent(eventId: string) {
  /*
  const query = queryData([QUERY_KEY, eventId], async () =>
    eventClient.findEventById(eventId),
    );*/

  const query = useQuery({
    queryKey: [QUERY_KEY, eventId],
    queryFn: () => eventClient.findEventById(eventId),
  });

  return query;
}

function useEvents() {
  const query = queryData([QUERY_KEY], () => eventClient.getEvents());

  return query;
}

export { useEvent, useEvents };
