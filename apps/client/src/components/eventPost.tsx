import React, { useState, useRef } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  TextField,
  Button,
  Box,
  Chip,
  Collapse,
  Divider,
  Paper,
  Fade,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  ThumbUp as ThumbUpIcon,
  ChatBubbleOutline as CommentIcon,
  Send as SendIcon,
  Event as EventIcon,
} from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";
import type { IClientPost } from "@/apiClients/postClient/dto";
import { useComments, useCreateComment } from "@/hooks/commentHook";
import QueryRenderer from "./queryRenderer";
import type {
  IClientComment,
  IComment,
  ICommentPostRequest,
} from "@/apiClients/commentClient/dto";

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  return `${Math.floor(diffInSeconds / 86400)}d`;
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Animation keyframes
const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const bounceIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

// Styled components for animations
const AnimatedComment = styled(Paper)(({ theme }) => ({
  animation: `${slideInUp} 0.4s ease-out`,
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.background.default,
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderRadius: "2px 2px 0 0",
    animation: `${bounceIn} 0.6s ease-out`,
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: "box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[4],
  },
}));

const CommentsContainer = (props: {
  comments: IComment[];
  showComments: boolean;
  commentInputRef: React.RefObject<HTMLInputElement | null>;
  handleCommentSubmit: (content: string) => void;
}) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = () => {
    props.handleCommentSubmit(newComment);

    setNewComment("");
  };

  const handleCommentKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Collapse in={props.showComments} timeout={300}>
      <Box sx={{ px: 2, pb: 2 }}>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ mb: 2, display: "flex", gap: 1, alignItems: "flex-end" }}>
          <TextField
            ref={props.commentInputRef}
            fullWidth
            multiline
            maxRows={3}
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleCommentKeyPress}
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "background.paper",
              },
            }}
          />
          <IconButton
            onClick={handleSubmit}
            disabled={!newComment.trim()}
            color="primary"
            sx={{
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>

        <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
          {props.comments.map((comment, index) => (
            <Fade
              in={true}
              timeout={300}
              style={{ transitionDelay: `${index * 100}ms` }}
              key={comment.comment.id}
            >
              <AnimatedComment elevation={0}>
                <Box
                  sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "secondary.main",
                      fontSize: "0.875rem",
                    }}
                  >
                    {getInitials(comment.user.username)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      sx={{ mb: 0.5 }}
                    >
                      {comment.user.username}
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      {comment.comment.content}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5, display: "block" }}
                    >
                      {formatTimeAgo(comment.comment.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </AnimatedComment>
            </Fade>
          ))}
        </Box>
      </Box>
    </Collapse>
  );
};

interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
}

interface EventPostProps {
  post: IClientPost;
  username: string;
  eventName?: string;
  onLike?: (postId: string) => void;
}

const EventPost: React.FC<EventPostProps> = ({
  post,
  username,
  eventName = "Event",
  onLike,
}) => {
  const commentQuery = useComments(post.id, 1, 12);
  const commentMutation = useCreateComment();

  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const commentInputRef = useRef<HTMLInputElement>(null);

  const handleCommentSubmit = (content: string) => {
    const trimmedContent = content.trim();
    if (trimmedContent) {
      const newComment: ICommentPostRequest = {
        content: trimmedContent,
        createdAt: new Date().toISOString(),
        postId: post.id,
      };

      commentMutation.mutate(newComment);

      if (!showComments) {
        setShowComments(true);
      }
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    onLike?.(post.id);
  };

  return (
    <StyledCard>
      <CardHeader
        avatar={
          <Avatar
            src=""
            sx={{
              bgcolor: "primary.main",
              width: 48,
              height: 48,
            }}
          >
            {getInitials(username)}
          </Avatar>
        }
        action={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="subtitle1" component="span" fontWeight={600}>
              {username}
            </Typography>
            <Chip
              icon={<EventIcon />}
              label={eventName}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontSize: "0.75rem", height: 24 }}
            />
          </Box>
        }
        subheader={
          <Typography variant="body2" color="text.secondary">
            {formatTimeAgo(post.createdAt)}
          </Typography>
        }
      />

      <CardContent sx={{ pt: 0 }}>
        <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
          {post.title}
        </Typography>
        <Typography
          variant="body1"
          color="text.primary"
          sx={{ whiteSpace: "pre-wrap" }}
        >
          {post.content}
        </Typography>
      </CardContent>

      <Divider />

      <CardActions sx={{ justifyContent: "space-between", px: 2 }}>
        <Button
          startIcon={<ThumbUpIcon />}
          onClick={handleLike}
          color={liked ? "primary" : "inherit"}
          sx={{
            textTransform: "none",
            fontWeight: liked ? 600 : 400,
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          Like {likeCount > 0 && `(${likeCount})`}
        </Button>

        {commentQuery.data ? (
          <Button
            startIcon={<CommentIcon />}
            onClick={() => {
              setShowComments(!showComments);
              if (!showComments) {
                setTimeout(() => commentInputRef.current?.focus(), 300);
              }
            }}
            sx={{
              textTransform: "none",
              transition: "all 0.2s ease",
            }}
          >
            Comment{" "}
            {commentQuery.data.length > 0 && `(${commentQuery.data.length})`}
          </Button>
        ) : null}
      </CardActions>

      <QueryRenderer
        query={commentQuery}
        renderFn={(comments) => (
          <CommentsContainer
            comments={comments}
            showComments={showComments}
            commentInputRef={commentInputRef}
            handleCommentSubmit={handleCommentSubmit}
          />
        )}
      />
    </StyledCard>
  );
};

export default EventPost;
