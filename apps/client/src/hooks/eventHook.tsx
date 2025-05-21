import React from "react";

import EventClient from "@/apiClients/eventClient";
import { queryData } from "./dataHook";

function useEvents() {
  const eventClient = new EventClient();

  const query = queryData(["events"], () => eventClient.getEvents());

  return query;
}

export default useEvents;
