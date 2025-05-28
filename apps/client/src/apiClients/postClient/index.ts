import APIClient from "@/apiClients/index";
import type { IPostResponse, IPost, IPostRequest } from "./dto";

class PostClient {
  #baseClient: APIClient;

  constructor() {
    this.#baseClient = new APIClient("posts");
  }

  async getPosts(): Promise<IPost[]> {
    const postResponses = await this.#baseClient.get<{
      posts: IPostResponse[];
    }>();
    if (!postResponses) {
      throw Error("");
    }

    return postResponses.posts.map((postResponse) =>
      this.#transform(postResponse)
    );
  }

  async findPostById(postId: string): Promise<IPost | null> {
    const postResponse = await this.#baseClient.get<IPostResponse>(
      `/${postId}`
    );
    if (!postResponse) {
      return postResponse;
    }

    return this.#transform(postResponse);
  }

  async createPost(newPost: IPostRequest): Promise<IPost | null> {
    const postResponse = await this.#baseClient.post<IPostResponse>(newPost);
    if (!postResponse) {
      throw Error();
    }

    return this.#transform(postResponse);
  }

  async updatePost(postId: string, updatedPost: IPost): Promise<IPost | null> {
    const postResponse = await this.#baseClient.put<IPostResponse>(
      updatedPost,
      `/${postId}`
    );
    if (!postResponse) {
      return postResponse;
    }

    return this.#transform(postResponse);
  }

  async deletePost(postId: string): Promise<IPost | null> {
    const postResponse = await this.#baseClient.delete<IPostResponse>(
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
  #transform(postResponse: IPostResponse): IPost {
    const createdAt = new Date(postResponse.createdAt);

    return { ...postResponse, createdAt };
  }
}

export default PostClient;
