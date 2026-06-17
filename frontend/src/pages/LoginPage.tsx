import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        px: 2,
      }}
    >
      <Typography variant="h2" sx={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
        ▲ Крукса
      </Typography>
      <Typography variant="body1" sx={{ color: 'var(--text2)' }}>
        Страница входа — будет реализована в Фазе 3.3
      </Typography>
      <Button variant="outlined" onClick={() => navigate('/')}>
        На главную
      </Button>
    </Box>
  );
}
