import React, { useState, useRef, useEffect } from 'react';
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
  Slide,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  ThumbUp as ThumbUpIcon,
  ChatBubbleOutline as CommentIcon,
  Send as SendIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';

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
  backgroundColor: theme.palette.grey[50],
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderRadius: '2px 2px 0 0',
    animation: `${bounceIn} 0.6s ease-out`,
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
  },
}));

// Types
interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  eventId: string;
  userId: string;
}

interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface EventPostProps {
  post: Post;
  user: User;
  eventName?: string;
  onLike?: (postId: string) => void;
  onComment?: (postId: string, comment: string) => void;
  initialComments?: Comment[];
  currentUserId?: string;
}

const EventPost: React.FC<EventPostProps> = ({
  post,
  user,
  eventName = 'Event',
  onLike,
  onComment,
  initialComments = [],
  currentUserId,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const commentInputRef = useRef<HTMLInputElement>(null);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    onLike?.(post.id);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        content: newComment.trim(),
        author: 'Current User', // You can pass current user name as prop
        createdAt: new Date(),
      };
      
      setComments(prev => [...prev, comment]);
      setNewComment('');
      onComment?.(post.id, comment.content);
      
      // Auto-expand comments when adding a new one
      if (!showComments) {
        setShowComments(true);
      }
    }
  };

  const handleCommentKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleCommentSubmit();
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <StyledCard>
      <CardHeader
        avatar={
          <Avatar
            src={user.avatar}
            sx={{
              bgcolor: 'primary.main',
              width: 48,
              height: 48,
            }}
          >
            {!user.avatar && getInitials(user.name)}
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
              {user.name}
            </Typography>
            <Chip
              icon={<EventIcon />}
              label={eventName}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontSize: '0.75rem', height: 24 }}
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
        <Typography variant="body1" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>
          {post.content}
        </Typography>
      </CardContent>

      <Divider />

      <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
        <Button
          startIcon={<ThumbUpIcon />}
          onClick={handleLike}
          color={liked ? 'primary' : 'inherit'}
          sx={{
            textTransform: 'none',
            fontWeight: liked ? 600 : 400,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        >
          Like {likeCount > 0 && `(${likeCount})`}
        </Button>
        
        <Button
          startIcon={<CommentIcon />}
          onClick={() => {
            setShowComments(!showComments);
            if (!showComments) {
              setTimeout(() => commentInputRef.current?.focus(), 300);
            }
          }}
          sx={{
            textTransform: 'none',
            transition: 'all 0.2s ease',
          }}
        >
          Comment {comments.length > 0 && `(${comments.length})`}
        </Button>
      </CardActions>

      <Collapse in={showComments} timeout={300}>
        <Box sx={{ px: 2, pb: 2 }}>
          <Divider sx={{ mb: 2 }} />
          
          {/* Comment Input */}
          <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <TextField
              ref={commentInputRef}
              fullWidth
              multiline
              maxRows={3}
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={handleCommentKeyPress}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: 'grey.50',
                },
              }}
            />
            <IconButton
              onClick={handleCommentSubmit}
              disabled={!newComment.trim()}
              color="primary"
              sx={{
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>

          {/* Comments List */}
          <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
            {comments.map((comment, index) => (
              <Fade
                in={true}
                timeout={300}
                style={{ transitionDelay: `${index * 100}ms` }}
                key={comment.id}
              >
                <AnimatedComment elevation={0}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: '0.875rem' }}>
                      {getInitials(comment.author)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                        {comment.author}
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                        {comment.content}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {formatTimeAgo(comment.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                </AnimatedComment>
              </Fade>
            ))}
          </Box>
        </Box>
      </Collapse>
    </StyledCard>
  );
};

export default EventPost;