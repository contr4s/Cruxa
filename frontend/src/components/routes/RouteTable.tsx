import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  useTheme,
} from '@mui/material';
import type { RouteDto } from '../../types/route';
import { RatingBadge } from '../ui/RatingBadge';
import { HOLD_COLORS } from '../../constants/routes';
import { StateDisplay } from '../ui/StateDisplay';
import { RouteSetterInfo } from './RouteSetterInfo';

interface RouteTableProps {
  routes: RouteDto[];
}

export function RouteTable({ routes }: RouteTableProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  if (routes.length === 0) {
    return <StateDisplay type="empty" message="Нет трасс" description="Попробуйте изменить фильтры" />;
  }

  return (
    <TableContainer
      sx={{
        borderRadius: `${theme.shape.borderRadius}px`,
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
      }}
    >
      <Table size="small" sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ background: theme.custom.surface2 }}>
            {['', 'Название', 'Грейд', 'Тип', 'Рейтинг', 'Пролазы', 'Рутсеттер', 'Дата'].map((h) => (
              <TableCell
                key={h}
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: h ? { xs: 'none', sm: 'table-cell' } : { xs: 'none', md: 'table-cell' },
                }}
              >
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {routes.map((route) => (
            <TableRow
              key={route.id}
              hover
              onClick={() => navigate(`/route/${route.id}`, { state: { backgroundLocation: location } })}
              sx={{
                cursor: 'pointer',
                '& td': { borderBottom: `1px solid ${theme.palette.divider}` },
                '&:last-child td': { borderBottom: 'none' },
              }}
            >
              <TableCell sx={{ width: 32, p: '8px', display: { xs: 'none', md: 'table-cell' } }}>
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: HOLD_COLORS[route.holdColor] ?? route.holdColor,
                    border: `1px solid ${theme.palette.divider}`,
                    flexShrink: 0,
                  }}
                />
              </TableCell>
              <TableCell sx={{ py: { xs: 1.5, sm: 1 } }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: HOLD_COLORS[route.holdColor] ?? route.holdColor,
                        border: `1px solid ${theme.palette.divider}`,
                        flexShrink: 0,
                        display: { md: 'none' },
                      }}
                    />
                    <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: theme.palette.text.primary }}>
                      {route.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: theme.palette.text.secondary, display: { sm: 'none' } }}>
                      {route.grade}
                    </Typography>
                    <Chip
                      label={route.type}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        background: theme.custom.surface3,
                        color: theme.palette.text.primary,
                        display: { sm: 'none' },
                      }}
                    />
                    <Box sx={{ display: { xs: 'inline-flex', sm: 'none' }, alignItems: 'center', gap: 0.25 }}>
                      <RatingBadge rating={route.rating} size="sm" />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, alignItems: 'center', mt: 0.25 }}>
                    <Box sx={{ display: { xs: 'inline-flex', sm: 'none' }, alignItems: 'center', gap: 0.25 }}>
                      <RouteSetterInfo route={route} size="sm" />
                    </Box>
                  </Box>
                </Box>
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: theme.palette.text.secondary }}>
                  {route.grade}
                </Typography>
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                <Chip
                  label={route.type}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    background: theme.custom.surface3,
                    color: theme.palette.text.primary,
                  }}
                />
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                  <RatingBadge rating={route.rating} size="sm" />
                </Box>
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                <Typography sx={{ fontSize: '0.82rem', color: theme.palette.text.secondary }}>
                  {route.ascentsCount}
                </Typography>
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }} colSpan={2}>
                <RouteSetterInfo route={route} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
