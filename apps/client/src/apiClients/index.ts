class APIClient {
  #baseURL: string;

  constructor() {
    this.#baseURL = import.meta.env.VITE_API_URL;
  }

  async get(path: string) {
    const response = await fetch(`${this.#baseURL}/${path}`, {
      method: "get",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();

    return data;
  }

  async post(path: string, body: Object) {
    const bodyString = JSON.stringify(body);
    const response = await fetch(`${this.#baseURL}/${path}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: bodyString,
    });
    const data = await response.json();

    return data;
  }
}

export default APIClient;
