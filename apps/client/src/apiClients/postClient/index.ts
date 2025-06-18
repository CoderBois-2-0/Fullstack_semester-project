import APIClient from "@/apiClients/index";
import type { IPostGetResponse, IPost, IPostRequest } from "./dto";

class PostClient {
  #baseClient: APIClient;

  constructor() {
    this.#baseClient = new APIClient("posts");
  }

  /**
   * @description
   * Fetches posts associated with a specific event
   * @param eventId - The event associated with the posts
   * @returns
   */
  async getPosts(
    eventId: string,
    page: number,
    limit: number
  ): Promise<IPost[]> {
    const postResponses = await this.#baseClient.get<{
      posts: IPostGetResponse[];
    }>(undefined, `event-id=${eventId}&page=${page}&limit=${limit}`);
    if (!postResponses) {
      throw Error("");
    }

    return postResponses.posts.map((postResponse) =>
      this.#transform(postResponse)
    );
  }

  async findPostById(postId: string): Promise<IPost | null> {
    const postResponse = await this.#baseClient.get<IPostGetResponse>(
      `/${postId}`
    );
    if (!postResponse) {
      return postResponse;
    }

    return this.#transform(postResponse);
  }

  async createPost(newPost: IPostRequest): Promise<IPost | null> {
    const postResponse = await this.#baseClient.post<IPostGetResponse>(newPost);
    if (!postResponse) {
      throw Error();
    }

    return this.#transform(postResponse);
  }

  async updatePost(postId: string, updatedPost: IPost): Promise<IPost | null> {
    const postResponse = await this.#baseClient.put<IPostGetResponse>(
      updatedPost,
      `/${postId}`
    );
    if (!postResponse) {
      return postResponse;
    }

    return this.#transform(postResponse);
  }

  async deletePost(postId: string): Promise<IPost | null> {
    const postResponse = await this.#baseClient.delete<IPostGetResponse>(
      `/${postId}`
    );
    if (!postResponse) {
      return postResponse;
    }

    return this.#transform(postResponse);
  }

  /**
   * @description
   * Transform a post api response into a client post
   */
  #transform(postResponse: IPostGetResponse): IPost {
    const createdAt = new Date(postResponse.post.createdAt);

    return {
      post: { ...postResponse.post, createdAt },
      user: postResponse.user,
    };
  }
}

export default PostClient;
