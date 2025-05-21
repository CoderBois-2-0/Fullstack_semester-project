import APIClient from "./index";

class AuthClient {
  #baseClient: APIClient;
  #basePath: string;

  constructor() {
    this.#baseClient = new APIClient();
    this.#basePath = "/auth";
  }

  async signUp(email: string, password: string, confirmPassword: string) {
    return this.#baseClient.post(`${this.#basePath}/sign-up`, {
      role: "GUEST",
      username: "default",
      email,
      password,
      confirmPassword,
    });
  }
}

export default AuthClient;
