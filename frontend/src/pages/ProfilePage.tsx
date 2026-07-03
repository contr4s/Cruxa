import { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ActivityCalendar, ProfileHeader, TopRoutes, ProfileEditFormModal } from '../components/profile';
import { CombinedChart, RadarChart, GradePyramid, AscentDonut } from '../components/profile/analytics';
import { StateDisplay } from '../components/ui/StateDisplay';
import { PageContainer } from '../components/layout/PageContainer';
import { responsiveGrid } from '../theme/commonStyles';
import { useUserProfile, useUserStats } from '../services/hooks/useUser';
import { useAuthStore } from '../stores/authStore';

export default function ProfilePage() {
  const theme = useTheme();
  useScrollReveal();
  const [editOpen, setEditOpen] = useState(false);

  const userId = useAuthStore((s) => s.userId) ?? '550e8400-e29b-41d4-a716-446655440001';
  const { data: user, isLoading: userLoading } = useUserProfile(userId);
  const { data: stats, isLoading: statsLoading } = useUserStats(userId);
  if (userLoading || statsLoading) {
    return (
      <PageContainer>
        <StateDisplay type="loading" message="Загрузка профиля…" />
      </PageContainer>
    );
  }

  if (!user || !stats) {
    return (
      <PageContainer>
        <StateDisplay type="error" message="Не удалось загрузить профиль" />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {/* Profile header + stats */}
      <Box className="scroll-reveal" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <ProfileHeader
          user={user}
          followersCount={stats.followersCount}
          followingCount={stats.followingCount}
          kruskorScore={stats.kruscore}
          totalWorkouts={stats.totalWorkouts}
          onEdit={() => setEditOpen(true)}
        />
      </Box>

      <ProfileEditFormModal
        open={editOpen}
        user={user}
        onClose={() => setEditOpen(false)}
      />

      {/* Top Routes + Activity Calendar (2 columns) */}
      <Box
        className="scroll-reveal scroll-reveal-delay-1"
        sx={responsiveGrid()}
      >
        <TopRoutes />
        <ActivityCalendar />
      </Box>

      {/* Divider — горизонтальная градиентная полоса */}
      <Box
        className="scroll-reveal scroll-reveal-delay-1"
        sx={{
          height: 2,
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, transparent 100%)`,
          borderRadius: '2px',
          width: '100%',
        }}
      />

      {/* Combined Chart */}
      <Box className="scroll-reveal scroll-reveal-delay-2">
        <CombinedChart />
      </Box>

      {/* Radar + Goals + Pyramid + Donut (2 columns) */}
      <Box
        className="scroll-reveal scroll-reveal-delay-3"
        sx={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr',
          gap: 2,
          '@media (max-width:768px)': { gridTemplateColumns: '1fr' },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <RadarChart />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <GradePyramid />
          <AscentDonut />
        </Box>
      </Box>
    </PageContainer>
  );
}
