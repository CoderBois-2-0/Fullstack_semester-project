import { env } from "cloudflare:test";
import app from "@/routers/index";

function request(path: RequestInfo | URL, requestInit?: RequestInit) {
  return app.request(path, requestInit, env);
}

export default request;
