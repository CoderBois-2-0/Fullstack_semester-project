import { useQueryClient } from "@tanstack/react-query";

import { mutateData, queryData } from "./dataHook";
import CommentClient from "@/apiClients/commentClient";
import type { ICommentPostRequest } from "@/apiClients/commentClient/dto";

const QUERY_KEY = "comments";
const commentClient = new CommentClient();

function useComments(postId: string, page: number, limit: number) {
  const query = queryData([QUERY_KEY, postId, page, limit], () =>
    commentClient.getComments(postId)
  );

  return query;
}

function useCreateComment() {
  const queryClient = useQueryClient();

  const mutation = mutateData(
    (newComment: ICommentPostRequest) =>
      commentClient.createComment(newComment),
    (data) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY, data.postId],
        });
      }
    }
  );

  return mutation;
}

export { useComments, useCreateComment };
