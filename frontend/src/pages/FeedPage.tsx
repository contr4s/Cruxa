import { useTheme } from '@mui/material';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import { StateDisplay } from '../components/ui/StateDisplay';
import { PageContainer } from '../components/layout/PageContainer';

export default function FeedPage() {
  const theme = useTheme();
  return (
    <PageContainer sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <StateDisplay
        type="empty"
        icon={<NewspaperIcon sx={{ fontSize: '2.5rem', color: theme.palette.primary.main }} />}
        message="Лента — скоро"
        description="Лента новостей скоро будет доступна"
      />
    </PageContainer>
  );
}
