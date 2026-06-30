import { Box, useMediaQuery, useTheme } from '@mui/material';
import { PostMediaCarousel } from './PostMediaCarousel';
import { PostAscentList } from './PostAscentList';
import { ChartsCarousel } from '../charts/ChartsCarousel';
import { computePyramid, computeDistribution, computeCategories } from '../../utils/ascentStats';
import type { PostDto } from '../../types/post';

interface PostMediaSectionProps {
  ascents: PostDto['ascents'];
  mediaUrls: string[];
  tab: number;
  onTabChange: (tab: number) => void;
  onPhotoClick?: () => void;
}

export function PostMediaSection({ ascents, mediaUrls, tab, onTabChange, onPhotoClick }: PostMediaSectionProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const pyramid = computePyramid(ascents);
  const distribution = computeDistribution(ascents);
  const categories = computeCategories(ascents);
  const hasMedia = mediaUrls.length > 0;
  if (!hasMedia && tab == 0)
    tab = 1;

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 0 }}>
      <Box
        sx={{ width: { xs: '100%', md: 400 }, maxWidth: '100%', flexShrink: 0, cursor: onPhotoClick ? 'pointer' : undefined }}
        onClick={tab === 0 ? onPhotoClick : undefined}
      >
        {tab === 0 ? (
          <PostMediaCarousel images={mediaUrls} />
        ) : tab === 2 ? (
          <PostAscentList ascents={ascents} maxVisible={5} direction={'row'} />
        ) : (
          <ChartsCarousel
            pyramid={pyramid}
            distribution={distribution}
            categories={categories}
          />
        )}
      </Box>
      {!isMobile && <PostAscentList ascents={ascents} maxVisible={tab === 0 ? 16 : 10} direction={isMobile ? 'row' : 'column'} />}
    </Box>
  );
}
