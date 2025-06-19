import APIClient from "../index";
import type { IAPIUser } from "./dto";

class AuthClient {
  #baseClient: APIClient;

  constructor() {
    this.#baseClient = new APIClient("auth");
  }

  async signUp(email: string, password: string, confirmPassword: string) {
    return this.#baseClient.post<IAPIUser>(
      {
        role: "GUEST",
        username: "default",
        email,
        password,
        confirmPassword,
      },
      "/sign-up"
    );
  }

  async signIn(email: string, password: string) {
    return this.#baseClient.post<IAPIUser>(
      {
        email,
        password,
      },
      "/sign-in"
    );
  }

  async validate() {
    return this.#baseClient.get<IAPIUser>("/validate");
  }

  async signOut() {
    return this.#baseClient.get("/sign-out");
  }
}

export default AuthClient;
