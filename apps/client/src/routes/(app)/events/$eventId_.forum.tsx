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
  Divider,
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

  // Sort posts by creation date - newest first
  const sortedPosts = [...props.posts].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <>
      {sortedPosts.map((post) => (
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
        <Card 
          sx={{ 
            transition: 'box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: (theme) => theme.shadows[4],
            },
          }}
        >
          <CardHeader 
            title={
              <Typography variant="subtitle1" fontWeight={600}>
                Share something about this event
              </Typography>
            }
            subheader={
              <Typography variant="body2" color="text.secondary">
                What's on your mind?
              </Typography>
            }
          />

          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                placeholder="Post title..."
                value={postData.title}
                onChange={(event) =>
                  setPostData({ ...postData, title: event.target.value })
                }
                variant="outlined"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                  },
                }}
              />

              <TextField
                value={postData.content}
                onChange={(event) =>
                  setPostData({ ...postData, content: event.target.value })
                }
                multiline
                placeholder="Share your thoughts about this event..."
                fullWidth
                rows={3}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                  },
                }}
              />
            </Box>
          </CardContent>

          <Divider />

          <CardActions sx={{ justifyContent: "space-between", px: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {postData.title.length > 0 || postData.content.length > 0 
                ? `${postData.title.length + postData.content.length} characters` 
                : 'Start typing to create your post'}
            </Typography>
            
            <Button
              variant="contained"
              onClick={createPost}
              disabled={postMutation.isPending || (!postData.title.trim() && !postData.content.trim())}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              {postMutation.isPending ? 'Creating...' : 'Create Post'}
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