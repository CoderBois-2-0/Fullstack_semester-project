import type { IAPIUser } from "../authClient/dto";

/**
 * @description
 * The base api representation of a post
 */
interface IAPIPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  userId: string;
  eventId: string;
}

/**
 * @description
 * The base client representation of a post
 */
interface IClientPost extends Omit<IAPIPost, "createdAt"> {
  createdAt: Date;
}

/**
 * @description
 * The client data container of a post
 */
interface IPost {
  post: IClientPost;
  user: Pick<IAPIUser, "username">;
}

/**
 * @description
 * The post response representation from the api
 */
interface IPostGetResponse {
  post: IAPIPost;
  user: Pick<IAPIUser, "username">;
}

interface IPostRequest extends Omit<IAPIPost, "id" | "userId"> {}

export type { IAPIPost, IClientPost, IPostGetResponse, IPost, IPostRequest };
