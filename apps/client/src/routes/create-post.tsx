import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
} from "@mui/material";

const CreatePostPage: React.FC = () => {
  const [postData, setPostData] = useState({
    title: "",
    content: "",
  });

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Post submitted with:", postData);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "background.default",
          py: 8,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 2,
              backgroundColor: "background.paper",
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              align="center"
              fontWeight="bold"
              color="primary"
              mb={4}
            >
              Create Post
            </Typography>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  label="Post Title"
                  fullWidth
                  variant="outlined"
                  value={postData.title}
                  onChange={handleInputChange("title")}
                  required
                  autoFocus
                />

                <TextField
                  label="Post Content"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={8}
                  value={postData.content}
                  onChange={handleInputChange("content")}
                  required
                  placeholder="Write your post content here..."
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    py: 1.5,
                    fontWeight: "bold",
                    mt: 2,
                  }}
                >
                  Create Post
                </Button>
              </Stack>
            </form>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default CreatePostPage;

export const Route = createFileRoute("/create-post")({
  component: CreatePostPage,
});