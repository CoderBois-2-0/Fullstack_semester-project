class APIClient {
  #baseURL: string;
  #basePath: string;

  constructor(basePath: string) {
    this.#baseURL = import.meta.env.VITE_API_URL;
    this.#basePath = basePath;
  }

  async get<T>(extendedPath?: string, query?: string): Promise<T | null> {
    const path = extendedPath ? this.#basePath + extendedPath : this.#basePath;

    const response = await fetch(
      `${this.#baseURL}/${path}${query ? `?${query}` : ""}`,
      {
        method: "get",
        headers: {
          Accept: "application/json",
        },
        credentials: "include",
      }
    );
    if (response.status !== 200) {
      return null;
    }
    const data = (await response.json()) as T;

    return data;
  }

  async post<T>(body: Object, extendedPath?: string): Promise<T | null> {
    const path = extendedPath ? this.#basePath + extendedPath : this.#basePath;
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

  async put<T>(body: Object, extendedPath?: string): Promise<T | null> {
    const path = extendedPath ? this.#basePath + extendedPath : this.#basePath;
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

  async delete<T>(extendedPath?: string): Promise<T | null> {
    const path = extendedPath ? this.#basePath + extendedPath : this.#basePath;

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
