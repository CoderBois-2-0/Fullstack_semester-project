class APIClient {
  #baseURL: string;

  constructor() {
    this.#baseURL = import.meta.env.VITE_API_URL;
  }

  async get<T>(path: string): Promise<T | null> {
    const response = await fetch(`${this.#baseURL}/${path}`, {
      method: "get",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });
    if (response.status !== 200) {
      return null;
    }
    const data = await response.json();

    return data;
  }

  async post<T>(path: string, body: Object): Promise<T | null> {
    const bodyString = JSON.stringify(body);
    const response = await fetch(`${this.#baseURL}/${path}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: bodyString,
    });
    if (response.status !== 200) {
      return null;
    }

    const data = (await response.json()) as T;

    return data;
  }

  async put<T>(path: string, body: Object): Promise<T | null> {
    const bodyString = JSON.stringify(body);
    const response = await fetch(`${this.#baseURL}/${path}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: bodyString,
    });
    if (response.status !== 200) {
      return null;
    }

    const data = (await response.json()) as T;

    return data;
  }

  async delete<T>(path: string): Promise<T | null> {
    const response = await fetch(`${this.#baseURL}/${path}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.status !== 200) {
      return null;
    }

    const data = (await response.json()) as T;

    return data;
  }
}

export default APIClient;
