import { useState } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent,
  TextField, DialogActions, useTheme,
} from '@mui/material';
import { BadgeOutlined, Add } from '@mui/icons-material';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionHeader } from '../components/ui/SectionHeader';
import { StateDisplay } from '../components/ui/StateDisplay';
import { Pagination } from '../components/ui/Pagination';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useCreateGym } from '../services/hooks/useGyms';
import {
  useAdminStats,
  useRecentActivity,
  useTopGyms,
  useAdminGyms,
} from '../services/hooks/useAdminDashboard';
import type { AdminGymFilterState } from '../types/admin';
import { AdminGlobalStats } from '../components/admin/AdminGlobalStats';
import { ActivityFeed } from '../components/admin/ActivityFeed';
import { TopGymsList } from '../components/admin/TopGymsList';
import { AdminGymTable } from '../components/admin/AdminGymTable';
import { AdminGymFilters } from '../components/admin/AdminGymFilters';
import { useNavigate } from 'react-router-dom';

const DEFAULT_FILTERS: AdminGymFilterState = {
  city: 'all',
  status: 'all',
  sort: 'name',
};

export default function SuperAdminDashboardPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  useScrollReveal();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AdminGymFilterState>(DEFAULT_FILTERS);
  const [createOpen, setCreateOpen] = useState(false);

  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: recentActivity, isLoading: activityLoading } = useRecentActivity();
  const { data: topGyms, isLoading: topGymsLoading } = useTopGyms();
  const { data: gymsData, isLoading: gymsLoading } = useAdminGyms({ ...filters, page, pageSize: 10 });
  const { mutateAsync: createGymMutate, isPending: creatingGym } = useCreateGym();

  return (
    <PageContainer>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: theme.palette.text.primary }}>
              Панель администратора
            </Typography>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 1.25,
                py: 0.35,
                borderRadius: '12px',
                background: '#C62828',
                color: '#fff',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
              }}
            >
              Super Admin
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Button size="small" variant="outlined" startIcon={<Add />} onClick={() => setCreateOpen(true)} sx={{ fontSize: '0.82rem' }}>
              Создать зал
            </Button>
            <Typography sx={{ fontSize: '0.88rem', color: theme.palette.text.secondary }}>
              Москва, СПб
            </Typography>
            <Box
              component="button"
              onClick={() => alert('Экспорт данных — скоро')}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1.5,
                py: 0.6,
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`,
                background: 'transparent',
                color: theme.palette.text.secondary,
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                '&:hover': { borderColor: theme.palette.text.primary, color: theme.palette.text.primary },
              }}
            >
              Экспорт данных
            </Box>
          </Box>
        </Box>

        {/* Global stats */}
        {statsLoading || !stats ? (
          <StateDisplay type="loading" message="Загрузка статистики…" />
        ) : (
          <AdminGlobalStats stats={stats} />
        )}

        {/* Activity + Top gyms */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          {activityLoading ? (
            <StateDisplay type="loading" message="Загрузка активности…" size="sm" />
          ) : !recentActivity || recentActivity.length === 0 ? (
            <StateDisplay type="empty" message="Нет активности" description="За последнее время нет новых действий" size="sm" />
          ) : (
            <ActivityFeed items={recentActivity} />
          )}
          {topGymsLoading ? (
            <StateDisplay type="loading" message="Загрузка топа…" size="sm" />
          ) : !topGyms || topGyms.length === 0 ? (
            <StateDisplay type="empty" message="Нет данных" description="Топ залов пока не сформирован" size="sm" />
          ) : (
            <TopGymsList items={topGyms} />
          )}
        </Box>

        {/* All gyms */}
        <Box>
          <SectionHeader
            icon={<BadgeOutlined sx={{ fontSize: 20, color: theme.palette.primary.main }} />}
            title="Все скалодромы"
            action={
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {gymsData && (
                  <>
                    <Box sx={{ display: 'inline-flex', px: 1, py: 0.25, borderRadius: '12px', background: '#2E7D32', color: '#fff', fontSize: '0.72rem', fontWeight: 600 }}>
                      {gymsData.items.filter((g) => g.status === 'Active').length} активных
                    </Box>
                    <Box sx={{ display: 'inline-flex', px: 1, py: 0.25, borderRadius: '12px', background: '#424242', color: '#BDBDBD', fontSize: '0.72rem', fontWeight: 600 }}>
                      {gymsData.items.filter((g) => g.status !== 'Active').length} на модерации
                    </Box>
                  </>
                )}
              </Box>
            }
          />
          <AdminGymFilters
            filters={filters}
            onChange={(f) => { setFilters(f); setPage(1); }}
          />
          {gymsLoading ? (
            <StateDisplay type="loading" message="Загрузка залов…" />
          ) : !gymsData || gymsData.items.length === 0 ? (
            <StateDisplay type="empty" message="Нет залов по заданным фильтрам" />
          ) : (
            <>
              <AdminGymTable
                gyms={gymsData.items}
                onManage={(id) => navigate(`/gym-admin`)}
                onSort={(field) => {
                  setFilters((prev) => ({ ...prev, sort: prev.sort === field ? `-${field}` : field }));
                  setPage(1);
                }}
              />
              {gymsData.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Pagination page={page} count={gymsData.totalPages} onChange={(_, v) => setPage(v)} />
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>

      <CreateGymDialog open={createOpen} onClose={() => setCreateOpen(false)} onSave={createGymMutate} saving={creatingGym} />
    </PageContainer>
  );
}

function CreateGymDialog({ open, onClose, onSave, saving }: {
  open: boolean;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => Promise<unknown>;
  saving: boolean;
}) {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name.trim() || !city.trim() || !address.trim()) {
      setError('Заполните название, город и адрес');
      return;
    }
    setError('');
    await onSave({ name: name.trim(), city: city.trim(), address: address.trim(), description: description.trim() || null });
    setName(''); setCity(''); setAddress(''); setDescription('');
    onClose();
  };

  const fieldSx = { '& .MuiInputBase-root': { fontSize: '0.85rem' } };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { bgcolor: theme.palette.background.paper } } }}>
      <DialogTitle sx={{ fontWeight: 700 }}>Создать скалодром</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
        {error && <Typography sx={{ color: 'error.main', fontSize: '0.82rem' }}>{error}</Typography>}
        <TextField label="Название" size="small" value={name} onChange={e => setName(e.target.value)} sx={fieldSx} required />
        <TextField label="Город" size="small" value={city} onChange={e => setCity(e.target.value)} sx={fieldSx} required />
        <TextField label="Адрес" size="small" value={address} onChange={e => setAddress(e.target.value)} sx={fieldSx} required />
        <TextField label="Описание" size="small" multiline minRows={2} value={description} onChange={e => setDescription(e.target.value)} sx={fieldSx} />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={saving}>Отмена</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Создание…' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
