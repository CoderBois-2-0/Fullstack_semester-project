import APIClient from "@/apiClients";
import type {
  IComment,
  ICommentGetResponse,
  ICommentPostRequest,
  ICommentPostResponse,
} from "./dto";

class CommentClient {
  #baseClient: APIClient;

  constructor() {
    this.#baseClient = new APIClient("comments");
  }

  async getComments(postId: string): Promise<IComment[] | null> {
    const commentResponse = await this.#baseClient.get<ICommentGetResponse[]>(
      undefined,
      `post-id=${postId}`
    );
    if (!commentResponse) {
      return null;
    }

    return commentResponse.map((response) => this.#transform(response));
  }

  async createComment(
    newComment: ICommentPostRequest
  ): Promise<ICommentPostResponse | null> {
    const commentResponse = await this.#baseClient.post<ICommentPostResponse>(
      newComment
    );

    return commentResponse;
  }

  #transform(commentResponse: ICommentGetResponse): IComment {
    return {
      comment: {
        ...commentResponse.comment,
        createdAt: new Date(commentResponse.comment.createdAt),
      },
      user: commentResponse.user,
    };
  }
}

export default CommentClient;
