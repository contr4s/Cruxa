import { useState } from 'react';
import { Box, Typography, IconButton, Collapse, useTheme } from '@mui/material';
import type { PostDto, CommentDto } from '../../types/post';
import { MediaCarousel } from '../ui/MediaCarousel';
import { CommentSection } from './CommentSection';

interface PostCardProps {
  post: PostDto;
  getComments: (postId: string) => Promise<CommentDto[]>;
  onLikeToggle: (postId: string, wasLiked: boolean) => void;
  onCommentAdded: (postId: string) => void;
}

import { ASCENT_COLORS } from '../../constants/ascent';
import { avatarInitial, colorDot, statsBar, dividerBorderTop } from '../../theme/commonStyles';

export function PostCard({ post, getComments, onLikeToggle, onCommentAdded }: PostCardProps) {
  const theme = useTheme();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [liked, setLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likesCount);
  const [animatingLike, setAnimatingLike] = useState(false);

  const handleLike = () => {
    setAnimatingLike(true);
    if (liked) {
      setLiked(false);
      setLikeCount((c) => c - 1);
    } else {
      setLiked(true);
      setLikeCount((c) => c + 1);
    }
    onLikeToggle(post.id, liked);
    setTimeout(() => setAnimatingLike(false), 300);
  };

  return (
    <Box
      sx={{
        background: theme.palette.background.paper,
        borderRadius: `${theme.shape.borderRadius}px`,
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
        <Box sx={avatarInitial(40)}>
          {post.userName[0] || '?'}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: theme.palette.text.primary }}>
            {post.userName}
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: theme.custom.text3 }}>
            {post.gymName && `${post.gymName} · `}{post.createdAt}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '0.7rem', color: theme.custom.text3, cursor: 'pointer' }}>
          ⋯
        </Typography>
      </Box>

      {/* Body */}
      {post.body && (
        <Box sx={{ px: 2, pb: post.body.length > 120 ? 0 : 1 }}>
          <Typography
            sx={{
              fontSize: '0.85rem',
              color: theme.palette.text.secondary,
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
            }}
          >
            {post.body.length > 120
              ? `${post.body.slice(0, 120)}... `
              : post.body}
            {post.body.length > 120 && (
              <Box
                component="span"
                sx={{ color: theme.palette.primary.main, cursor: 'pointer', fontWeight: 600 }}
                onClick={() => setCommentsOpen(!commentsOpen)}
              >
                {commentsOpen ? 'скрыть' : 'читать далее'}
              </Box>
            )}
          </Typography>
        </Box>
      )}

      {/* Media */}
      {post.mediaUrls.length > 0 && (
        <MediaCarousel images={post.mediaUrls} />
      )}

      {/* Ascents summary */}
      {post.ascents.length > 0 && (
        <Box sx={{ px: 2, py: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {post.ascents.map((ascent) => {
            const style = { label: ascent.style, color: ASCENT_COLORS[ascent.style] || ASCENT_COLORS.Attempt };
            return (
              <Box
                key={ascent.id}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  background: theme.custom.surface2,
                  borderRadius: '100px',
                  px: 1.25,
                  py: 0.35,
                }}
              >
                <Box sx={colorDot(8, style.color)} />
                <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: theme.palette.text.secondary }}>
                  {ascent.routeName}
                </Typography>
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: style.color }}>
                  {style.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Stats panel */}
      {post.stats && (
        <Box sx={statsBar(theme)}>
          <Typography sx={{ fontSize: '0.72rem', color: theme.palette.text.secondary }}>
            ⚡ {post.stats.totalKruskor} Kruskor
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: theme.palette.text.secondary }}>
            📊 {post.stats.avgGrade} avg
          </Typography>
          {post.stats.duration && (
            <Typography sx={{ fontSize: '0.72rem', color: theme.palette.text.secondary }}>
              ⏱ {post.stats.duration} мин
            </Typography>
          )}
          <Typography sx={{ fontSize: '0.72rem', color: theme.palette.text.secondary }}>
            🧗 {post.stats.totalRoutes} трасс
          </Typography>
        </Box>
      )}

      {/* Actions */}
      <Box sx={dividerBorderTop(theme, { display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1 })}>
        <IconButton
          onClick={handleLike}
          size="small"
          sx={{
            color: liked ? '#E53935' : theme.custom.text3,
            transition: 'transform .2s, color .2s',
            transform: animatingLike ? 'scale(1.35)' : 'scale(1)',
            '&:hover': { background: 'rgba(229, 57, 53, 0.1)' },
          }}
        >
          <Typography sx={{ fontSize: '1.1rem' }}>{liked ? '❤️' : '🤍'}</Typography>
        </IconButton>
        <Typography sx={{ fontSize: '0.78rem', color: theme.palette.text.secondary, fontWeight: 600 }}>
          {likeCount}
        </Typography>

        <IconButton
          onClick={() => setCommentsOpen(!commentsOpen)}
          size="small"
          sx={{ color: theme.custom.text3 }}
        >
          <Typography sx={{ fontSize: '1.1rem' }}>💬</Typography>
        </IconButton>
        <Typography sx={{ fontSize: '0.78rem', color: theme.palette.text.secondary, fontWeight: 600 }}>
          {post.commentsCount}
        </Typography>
      </Box>

      {/* Comments */}
      <Collapse in={commentsOpen}>
        <Box sx={dividerBorderTop(theme)}>
          <CommentSection
            postId={post.id}
            getComments={getComments}
            onCommentAdded={() => onCommentAdded(post.id)}
          />
        </Box>
      </Collapse>
    </Box>
  );
}
