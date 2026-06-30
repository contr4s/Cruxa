import { useState, useCallback } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { AscentRow } from './AscentRow';
import type { PostAscentDto } from '../../types/post';

interface PostAscentListProps {
  ascents: PostAscentDto[];
  maxVisible?: number;
  direction?: 'row' | 'column';
}
export function PostAscentList({ ascents, maxVisible = Infinity, direction = 'column' }: PostAscentListProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? ascents : ascents.slice(0, maxVisible);
  const hasMore = ascents.length > maxVisible;

  const handleExpand = useCallback(() => {
    setExpanded(true);
  }, []);

  const handleCollapse = useCallback(() => {
    setExpanded(false);
  }, []);

  return (
    <Box sx={{ pt: 1.5, display: 'flex', flexDirection: direction, flexWrap: direction === 'row' ? 'wrap' : undefined, gap: direction === 'row' ? 0.75 : 0 }}>
      {visible.map((ascent) => (
        <AscentRow
          key={ascent.id}
          routeId={ascent.routeId}
          routeName={ascent.routeName}
          grade={ascent.grade}
          style={ascent.style}
          holdColor={ascent.holdColor}
          compact={direction === 'row'}
        />
      ))}
      {hasMore && !expanded && (
        <Box
          onClick={handleExpand}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', px: 2.5, py: 0.75, color: theme.palette.primary.main, '&:hover': { opacity: 0.8 } }}
        >
          <ExpandMore sx={{ fontSize: 18 }} />
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }}>+ ещё {ascents.length - maxVisible}</Typography>
        </Box>
      )}
      {hasMore && expanded && (
        <Box
          onClick={handleCollapse}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', px: 2.5, py: 0.75, color: theme.palette.text.secondary, '&:hover': { opacity: 0.8 } }}
        >
          <ExpandLess sx={{ fontSize: 18 }} />
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }}>▴ Свернуть</Typography>
        </Box>
      )}
    </Box>
  );
}
