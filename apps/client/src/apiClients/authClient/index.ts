import APIClient from "../index";
import type { IUserResponse } from "./dto";

class AuthClient {
  #baseClient: APIClient;
  #basePath: string;

  constructor() {
    this.#baseClient = new APIClient();
    this.#basePath = "auth";
  }

  async signUp(email: string, password: string, confirmPassword: string) {
    return this.#baseClient.post<IUserResponse>(`${this.#basePath}/sign-up`, {
      role: "GUEST",
      username: "default",
      email,
      password,
      confirmPassword,
    });
  }

  async signIn(email: string, password: string) {
    return this.#baseClient.post<IUserResponse>(`${this.#basePath}/sign-in`, {
      email,
      password,
    });
  }

  async validate() {
    return this.#baseClient.get<IUserResponse>(`${this.#basePath}/validate`);
  }

  async signOut() {
    return this.#baseClient.get(`${this.#basePath}/sign-out`);
  }
}

export default AuthClient;
