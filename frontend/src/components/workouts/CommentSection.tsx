import { useState, useEffect, useRef } from 'react';
import { Box, Typography, InputBase, CircularProgress, Avatar, useTheme } from '@mui/material';
import { Forum, Send } from '@mui/icons-material';
import { addComment } from '../../services/posts.service';
import { useAuthStore } from '../../stores/authStore';
import type { CommentDto } from '../../types/post';
import { relativeTime } from '../posts/relativeTime';

const PAGE_SIZE = 3;

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
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || submitting) return;

    const text = commentText.trim();
    setCommentText('');
    setSubmitting(true);

    // Optimistic add
    const optimistic: CommentDto = {
      id: `opt-${crypto.randomUUID()}`,
      postId,
      userId: useAuthStore.getState().userId ?? '',
      displayName: useAuthStore.getState().displayName ?? 'Алексей',
      text,
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [...prev, optimistic]);
    setVisibleCount((prev) => prev + 1);
    onCommentAdded();

    try {
      await addComment(postId, text);
    } catch {
      // Revert on error
      setComments((prev) => prev.filter((c) => c.id !== optimistic.id));
    } finally {
      setSubmitting(false);
    }
  };

  const totalCount = comments.length;
  const visible = comments.slice(0, visibleCount);
  const hasMore = visibleCount < totalCount;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <CircularProgress size={20} sx={{ color: theme.palette.text.secondary }} />
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2.5, py: 2 }}>
      {totalCount === 0 ? (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Forum sx={{ fontSize: 24, color: theme.palette.text.secondary, mb: 1 }} />
          <Typography sx={{ fontSize: '0.82rem', color: theme.palette.text.secondary }}>
            💬 Комментариев пока нет. Будьте первым!
          </Typography>
        </Box>
      ) : (
        <>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: theme.palette.text.primary, mb: 1.5 }}>
            Комментарии ({totalCount})
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
            {visible.map((comment) => (
              <Box key={comment.id} sx={{ display: 'flex', gap: 1.5 }}>
                <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', bgcolor: theme.palette.primary.main }}>
                  {comment.displayName.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                    <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: theme.palette.text.primary }}>
                      {comment.displayName}
                    </Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: theme.palette.text.secondary }}>
                      {relativeTime(comment.createdAt)}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.82rem', color: theme.palette.text.secondary, lineHeight: 1.4 }}>
                    {comment.text}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
          {hasMore && (
            <Box
              onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              sx={{ cursor: 'pointer', textAlign: 'center', py: 0.75, color: theme.palette.primary.main, '&:hover': { opacity: 0.8 } }}
            >
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }}>
                Показать ещё {totalCount - visibleCount} ↓
              </Typography>
            </Box>
          )}
        </>
      )}

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
          mt: 2,
        }}
      >
        <InputBase
          inputRef={inputRef}
          placeholder="Написать комментарий..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          sx={{
            flex: 1,
            fontSize: '0.82rem',
            color: theme.palette.text.primary,
            '&::placeholder': { color: theme.palette.text.secondary, opacity: 0.6 },
          }}
        />
        <Box
          component="button"
          type="submit"
          disabled={!commentText.trim() || submitting}
          sx={{
            background: commentText.trim() ? theme.palette.primary.main : theme.custom.surface3,
            border: 'none',
            borderRadius: '50%',
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: commentText.trim() ? 'pointer' : 'default',
            color: '#fff',
            fontSize: '1rem',
            transition: 'background .15s',
            flexShrink: 0,
            '&:hover': commentText.trim() ? { background: '#2BBBAD' } : {},
            '&:disabled': { opacity: 0.5, cursor: 'default' },
          }}
        >
          <Send sx={{ fontSize: 16 }} />
        </Box>
      </Box>
    </Box>
  );
}
