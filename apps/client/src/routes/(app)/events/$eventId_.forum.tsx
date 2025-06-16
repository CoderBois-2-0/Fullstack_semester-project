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
} from "@mui/material";
import { useCreatePost, usePosts } from "@/hooks/postHook";
import QueryRenderer from "@/components/queryRenderer";
import EventPost from "@/components/eventPost";
import type { IPost, IPostRequest } from "@/apiClients/postClient/dto";
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

function PostsQuery(props: { posts: IPost[]; eventId: string }) {
  const handleLike = (postId: string) => {
    console.log("Liked:", postId);
    // TODO: Implement your like API call
  };

  const handleComment = (comment: string) => {
    console.log("Comment:", comment);
    // TODO: Implement your comment API call
  };

  // TODO: You'll need to get user data for each post
  // For now using placeholder data - replace with your user fetching logic
  const getUserForPost = (userId: string) => {
    return {
      id: userId,
      name: "User", // Replace with actual user name from your user API
    };
  };

  return (
    <>
      {props.posts.map((post) => (
        <EventPost
          key={post.id}
          post={{
            id: post.id,
            title: post.title,
            content: post.content,
            createdAt: new Date(post.createdAt),
            eventId: post.eventId,
            userId: post.userId,
          }}
          user={getUserForPost(post.userId)}
          eventName="Event" // TODO: Pass actual event name if needed
          onLike={handleLike}
          onComment={handleComment}
          initialComments={[]} // TODO: Fetch comments for each post
        />
      ))}
    </>
  );
}

function RouteComponent() {
  const { eventId } = Route.useParams();
  const postQuery = usePosts(eventId);
  const postMutation = useCreatePost();

  const [postData, setPostData] = useState({
    title: "",
    content: "",
  });

  function createPost(e: React.FormEvent) {
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
              onClick={createPost}
              disabled={postMutation.isPending}
            >
              Create post
            </Button>
          </CardActions>
        </Card>

        <QueryRenderer
          query={postQuery}
          renderFn={(data) => <PostsQuery posts={data} eventId={eventId} />}
        />
      </Box>
    </Box>
  );
}