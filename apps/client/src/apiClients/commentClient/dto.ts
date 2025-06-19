import type { IAPIUser } from "../authClient/dto";

/**
 * @description
 * The base representation of a comment on the server
 */
interface IAPIComment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  postId: string;
}

/**
 * @description
 * The base client representation of a comment
 */
interface IClientComment extends Omit<IAPIComment, "createdAt"> {
  createdAt: Date;
}

/**
 * @description
 * The user associated with the comment, only contains nessesary info
 */
type TCommentUser = Pick<IAPIUser, "username">;

/**
 * @description
 * The comment representation used by the client, contains extra info like the cretors username
 */
interface IComment {
  comment: IClientComment;
  user: TCommentUser;
}

/**
 * @description
 * The representation of a get response from the client path
 */
interface ICommentGetResponse {
  comment: IAPIComment;
  user: TCommentUser;
}

interface ICommentPostRequest
  extends Pick<IAPIComment, "content" | "createdAt" | "postId"> {}

interface ICommentPostResponse extends IAPIComment {}

export type {
  IAPIComment,
  IClientComment,
  ICommentGetResponse,
  ICommentPostRequest,
  ICommentPostResponse,
  IComment,
};
