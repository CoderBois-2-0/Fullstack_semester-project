/**
 * @description
 * The post response representation from the api
 */
interface IPostResponse {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  eventId: string;
  userId: string;
}

/**
 * @description
 * The client representation of a post
 */
interface IPost extends Omit<IPostResponse, "createdAt"> {
  createdAt: Date;
}

interface IPostRequest extends Omit<IPostResponse, "id" | "userId"> {}

export type { IPostResponse, IPost, IPostRequest };
