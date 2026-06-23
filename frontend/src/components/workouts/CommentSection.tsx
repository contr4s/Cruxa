import { useState, useEffect } from 'react';
import { Box, Typography, InputBase, CircularProgress, useTheme } from '@mui/material';
import type { CommentDto } from '../../types/post';
import { flexCenter } from '../../theme/commonStyles';

interface CommentSectionProps {
  postId: string;
  getComments: (postId: string) => Promise<CommentDto[]>;
  onCommentAdded: () => void;
}

export function CommentSection({ postId, getComments, onCommentAdded }: CommentSectionProps) {
  const theme = useTheme();
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    let cancelled = false;
    getComments(postId).then((data) => {
      if (!cancelled) {
        setComments(data);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [postId, getComments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    console.log(`[mock] addComment(postId=${postId}, text=${commentText})`);
    setCommentText('');
    onCommentAdded();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <CircularProgress size={20} sx={{ color: theme.custom.text3 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: theme.palette.text.primary, mb: 1.5 }}>
        Комментарии
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
        {comments.length === 0 && (
          <Typography sx={{ fontSize: '0.78rem', color: theme.custom.text3, textAlign: 'center', py: 2 }}>
            Пока нет комментариев
          </Typography>
        )}
        {comments.map((comment) => (
          <Box key={comment.id} sx={{ display: 'flex', gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: theme.custom.surface3,
                ...flexCenter(),
                color: theme.palette.text.secondary,
                fontWeight: 700,
                fontSize: '0.72rem',
                flexShrink: 0,
              }}
            >
              {comment.userName[0] || '?'}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: theme.palette.text.primary }}>
                  {comment.userName}
                </Typography>
                <Typography sx={{ fontSize: '0.65rem', color: theme.custom.text3 }}>
                  {comment.createdAt}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '0.82rem', color: theme.palette.text.secondary, lineHeight: 1.4 }}>
                {comment.text}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          gap: 1,
          background: theme.custom.surface2,
          borderRadius: '100px',
          border: `1px solid ${theme.palette.divider}`,
          p: '4px 4px 4px 12px',
        }}
      >
        <InputBase
          placeholder="Написать комментарий..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          sx={{
            flex: 1,
            fontSize: '0.82rem',
            color: theme.palette.text.primary,
            '&::placeholder': { color: theme.custom.text3, opacity: 1 },
          }}
        />
        <Box
          component="button"
          type="submit"
          sx={{
            background: theme.palette.primary.main,
            border: 'none',
            borderRadius: '50%',
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff',
            fontSize: '1rem',
            transition: 'background .15s',
            flexShrink: 0,
            '&:hover': { background: '#2BBBAD' },
            '&:disabled': { opacity: 0.5, cursor: 'default' },
          }}
          disabled={!commentText.trim()}
        >
          ➤
        </Box>
      </Box>
    </Box>
  );
}
