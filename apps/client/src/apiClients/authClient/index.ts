import APIClient from "../index";
import type { IUserResponse } from "./dto";

class AuthClient {
  #baseClient: APIClient;

  constructor() {
    this.#baseClient = new APIClient("auth");
  }

  async signUp(email: string, password: string, confirmPassword: string) {
    return this.#baseClient.post<IUserResponse>(
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
    return this.#baseClient.post<IUserResponse>(
      {
        email,
        password,
      },
      "/sign-in"
    );
  }

  async validate() {
    return this.#baseClient.get<IUserResponse>("/validate");
  }

  async signOut() {
    return this.#baseClient.get("/sign-out");
  }
}

export default AuthClient;
