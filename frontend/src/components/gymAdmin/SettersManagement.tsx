import { Box, Typography, Avatar, Button, useTheme } from '@mui/material';
import { PersonRemove, PersonAdd } from '@mui/icons-material';
import { Card } from '../../theme/cardStyles';
import type { SetterManagementItem } from '../../types/gymAdmin';

interface SettersManagementProps {
  setters: SetterManagementItem[];
  onUnlink?: (setterId: string) => void;
  onLink?: () => void;
}

export function SettersManagement({ setters, onUnlink, onLink }: SettersManagementProps) {
  const theme = useTheme();

  if (setters.length === 0) {
    return (
      <Box sx={{ ...Card(theme), display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.secondary }}>
          Нет привязанных рутсеттеров
        </Typography>
        {onLink && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<PersonAdd sx={{ fontSize: 16 }} />}
            onClick={onLink}
            sx={{
              fontSize: '0.82rem',
              fontWeight: 600,
              textTransform: 'none',
              alignSelf: 'flex-start',
            }}
          >
            Привязать рутсеттера
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {setters.map((setter) => (
        <Box
          key={setter.id}
          sx={{
            ...Card(theme),
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
          }}
        >
          <Avatar
            src={setter.avatarUrl}
            sx={{ width: 36, height: 36, fontSize: '0.8rem', bgcolor: theme.palette.primary.main, flexShrink: 0 }}
          >
            {setter.name[0]}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: theme.palette.text.primary }}>
              {setter.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary }}>
                Активных трасс: {setter.activeRoutes}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary }}>
                Средний рейтинг: {setter.averageRating.toFixed(1)}
              </Typography>
            </Box>
          </Box>
          {onUnlink && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<PersonRemove sx={{ fontSize: 14 }} />}
              onClick={() => onUnlink(setter.id)}
              sx={{
                fontSize: '0.72rem',
                fontWeight: 600,
                textTransform: 'none',
                borderColor: theme.palette.divider,
                color: theme.palette.text.secondary,
                flexShrink: 0,
                '&:hover': { borderColor: theme.palette.error.main, color: theme.palette.error.main },
              }}
            >
              Отвязать
            </Button>
          )}
        </Box>
      ))}
      {onLink && (
        <Button
          size="small"
          variant="outlined"
          startIcon={<PersonAdd sx={{ fontSize: 16 }} />}
          onClick={onLink}
          sx={{
            fontSize: '0.82rem',
            fontWeight: 600,
            textTransform: 'none',
            alignSelf: 'flex-start',
            mt: 0.5,
          }}
        >
          Привязать рутсеттера
        </Button>
      )}
    </Box>
  );
}
