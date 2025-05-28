import { useQueryClient } from "@tanstack/react-query";

import PostClient from "@/apiClients/postClient/index";
import { mutateData, queryData } from "./dataHook";
import type { IPostRequest } from "@/apiClients/postClient/dto";

const QUERY_KEY = "posts";
const postClient = new PostClient();

function usePosts() {
  const query = queryData([QUERY_KEY], () => postClient.getPosts());

  return query;
}

function usePost(postId: string) {
  const query = queryData([QUERY_KEY, postId], async () =>
    postClient.findPostById(postId)
  );

  return query;
}

function useCreatePost() {
  const queryClient = useQueryClient();

  const mutation = mutateData(
    (newPost: IPostRequest) => postClient.createPost(newPost),
    () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    }
  );

  return mutation;
}

export { usePosts, usePost, useCreatePost };
