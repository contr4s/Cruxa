import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { StateDisplay } from '../components/ui/StateDisplay';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <StateDisplay
      type="empty"
      message="Страница не найдена"
      description="Такой страницы нет. Возможно, она была удалена или ссылка неверна."
      size="lg"
      icon={
        <span style={{ fontSize: '3rem' }}>🔍</span>
      }
      action={
        <Button variant="contained" onClick={() => navigate('/')}>
          На главную
        </Button>
      }
    />
  );
}
