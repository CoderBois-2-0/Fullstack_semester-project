import React from "react";

import EventClient from "@/apiClients/eventClient";
import { queryData } from "./dataHook";

const QUERY_KEY = "events";
const eventClient = new EventClient();

function useEvent(eventId: string) {
  const query = queryData([QUERY_KEY, eventId], () =>
    eventClient.findEventById(eventId),
  );

  return query;
}

function useEvents() {
  const query = queryData([QUERY_KEY], () => eventClient.getEvents());

  return query;
}

export { useEvent, useEvents };
