import { describe, it, expect, vi } from "vitest";
import request from "./index";
import {
  EventHandler,
  eventSelectSchema,
  eventInsertSchema,
  eventUpdateSchema,
} from "@/db/handlers/eventHandler";

vi.mock(import("@/db/handlers/eventHandler"), () => {
  const EventHandler = vi.fn();
  EventHandler.prototype.getEvents = vi.fn();

  return {
    EventHandler,
    eventSelectSchema,
    eventInsertSchema,
    eventUpdateSchema,
  };
});

describe("Event router", () => {
  it("Should pass", async () => {
    const response = await request("/events");
    const data = await response.json();
    console.log(data);

    expect(response.status).toBe(200);
  });
});
