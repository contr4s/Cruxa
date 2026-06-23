import { useTheme } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import { StateDisplay } from '../components/ui/StateDisplay';
import { PageContainer } from '../components/layout/PageContainer';

export default function GymsPage() {
  const theme = useTheme();
  return (
    <PageContainer sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <StateDisplay
        type="empty"
        icon={<MapIcon sx={{ fontSize: '2.5rem', color: theme.palette.primary.main }} />}
        message="Скалодромы — скоро"
        description="Раздел находится в разработке"
      />
    </PageContainer>
  );
}
