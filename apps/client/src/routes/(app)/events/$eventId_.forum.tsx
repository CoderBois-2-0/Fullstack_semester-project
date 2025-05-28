import React, { useState } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  Button,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
  Typography,
} from "@mui/material";
import { useCreatePost, usePosts } from "@/hooks/postHook";
import QueryRenderer from "@/components/queryRenderer";
import type { IPost, IPostRequest, I } from "@/apiClients/postClient/dto";

export const Route = createFileRoute("/(app)/events/$eventId_/forum")({
  loader: async ({ context }) => {
    const isAuthenticated = await context.authStore.isAuthenticated();
    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: RouteComponent,
});

function PostsQuery(props: { posts: IPost[] }) {
  return (
    <>
      {props.posts.map((post) => (
        <Card key={post.id}>
          <CardHeader title={post.title} />

          <CardContent>
            <Typography variant="body1">{post.content}</Typography>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

function RouteComponent() {
  const { eventId } = Route.useParams();

  const postQuery = usePosts();
  const postMutation = useCreatePost();

  const [postData, setPostData] = useState({
    title: "",
    content: "",
  });

  function creatPost(e: React.FormEvent) {
    e.preventDefault();

    const newPost: IPostRequest = {
      ...postData,
      eventId,
      createdAt: new Date().toISOString(),
    };

    postMutation.mutate(newPost, {
      onSuccess: () => {
        setPostData({ title: "", content: "" });
      },
    });
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        paddingTop: 3,
      }}
    >
      <Box width="50%" display="flex" flexDirection="column" gap={3}>
        <Card>
          <CardHeader title="No chargers at your seat or just enjoying the event?" />

          <CardContent
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <TextField
              placeholder="Title"
              value={postData.title}
              onChange={(event) =>
                setPostData({ ...postData, title: event.target.value })
              }
            />

            <TextField
              value={postData.content}
              onChange={(event) =>
                setPostData({ ...postData, content: event.target.value })
              }
              multiline
              placeholder="Whats on your heart?"
              fullWidth
              rows={3}
            />
          </CardContent>

          <CardActions sx={{ justifyContent: "end" }}>
            <Button
              variant="contained"
              onClick={creatPost}
              loading={postMutation.isPending}
            >
              Create post
            </Button>
          </CardActions>
        </Card>

        <QueryRenderer
          query={postQuery}
          renderFn={(data) => <PostsQuery posts={data} />}
        />
      </Box>
    </Box>
  );
}
