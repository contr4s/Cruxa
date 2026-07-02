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
  Checkbox,
  useTheme,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import type { RouteDto } from '../../types/route';
import { RatingBadge } from '../ui/RatingBadge';
import { HOLD_COLORS } from '../../constants/routes';
import { StateDisplay } from '../ui/StateDisplay';
import { RouteSetterInfo } from './RouteSetterInfo';

interface RouteTableProps {
  routes: RouteDto[];
  showStatus?: boolean;
  showActions?: boolean;
  showSetter?: boolean;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
  onEdit?: (route: RouteDto) => void;
  onArchive?: (route: RouteDto) => void;
  onRestore?: (route: RouteDto) => void;
}

export function RouteTable({
  routes,
  showStatus = false,
  showActions = false,
  showSetter = true,
  selectable = false,
  selectedIds,
  onSelectionChange,
  onEdit,
  onArchive,
  onRestore,
}: RouteTableProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const allSelected = selectable && selectedIds && routes.length > 0 && routes.every((r) => selectedIds.has(r.id));
  const someSelected = selectable && selectedIds && routes.some((r) => selectedIds.has(r.id)) && !allSelected;

  const handleToggle = (id: string) => {
    if (!selectedIds || !onSelectionChange) return;
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange(next);
  };

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(routes.map((r) => r.id)));
    }
  };

  if (routes.length === 0) {
    return <StateDisplay type="empty" message="Нет трасс" description="Попробуйте изменить фильтры" />;
  }

  const headers: string[] = [];
  if (selectable) headers.push('QR');
  headers.push('', 'Название', 'Грейд', 'Тип', 'Рейтинг', 'Пролазы');
  if (showSetter) headers.push('Рутсеттер');
  if (showStatus) headers.push('Статус');
  if (showActions) headers.push('Действия');

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
            {headers.map((h, idx) => (
              <TableCell
                key={idx}
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: idx <= 1 ? { xs: 'none', md: 'table-cell' } : { xs: 'none', sm: 'table-cell' },
                }}
              >
                {selectable && idx === 0 ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Checkbox
                      size="small"
                      checked={allSelected ?? false}
                      indeterminate={someSelected}
                      onChange={handleSelectAll}
                      sx={{ p: 0 }}
                    />
                    {h}
                  </Box>
                ) : (
                  h
                )}
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
              selected={selectable && selectedIds?.has(route.id)}
              sx={{
                cursor: 'pointer',
                '& td': { borderBottom: `1px solid ${theme.palette.divider}` },
                '&:last-child td': { borderBottom: 'none' },
              }}
            >
              {selectable && (
                <TableCell sx={{ width: 32, p: '8px', display: { xs: 'none', md: 'table-cell' } }}>
                  <Checkbox
                    size="small"
                    checked={selectedIds?.has(route.id) ?? false}
                    onChange={() => handleToggle(route.id)}
                    onClick={(e) => e.stopPropagation()}
                    sx={{ p: 0 }}
                  />
                </TableCell>
              )}
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
                    {showStatus && (
                      <Chip
                        label={route.status === 'Active' ? 'Активна' : 'Архив'}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          background: route.status === 'Active' ? theme.palette.success.dark : theme.custom.surface3,
                          color: route.status === 'Active' ? theme.palette.success.contrastText : theme.palette.text.secondary,
                          display: { sm: 'none' },
                        }}
                      />
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, alignItems: 'center', mt: 0.25 }}>
                    <Box sx={{ display: { xs: 'inline-flex', sm: 'none' }, alignItems: 'center', gap: 0.25 }}>
                      {showSetter && <RouteSetterInfo route={route} size="sm" />}
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
              {showSetter && (
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                  <RouteSetterInfo route={route} />
                </TableCell>
              )}
              {showStatus && (
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                  <Chip
                    label={route.status === 'Active' ? 'Активна' : 'Архив'}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      background: route.status === 'Active' ? theme.palette.success.dark : theme.custom.surface3,
                      color: route.status === 'Active' ? theme.palette.success.contrastText : theme.palette.text.secondary,
                    }}
                  />
                </TableCell>
              )}
              {showActions && (
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {onEdit && (
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); onEdit(route); }}
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        <EditIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    )}
                    {route.status === 'Active' && onArchive && (
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); onArchive(route); }}
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    )}
                    {route.status === 'Archived' && onRestore && (
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); onRestore(route); }}
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        <RestoreIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
