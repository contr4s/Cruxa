import { Pagination as MuiPagination, type PaginationProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export function Pagination(props: PaginationProps) {
  const theme = useTheme();
  return (
    <MuiPagination
      {...props}
      sx={{
        '& .MuiPaginationItem-root': {
          color: theme.palette.text.secondary,
          borderColor: theme.palette.divider,
          fontSize: '0.85rem',
        },
        '& .MuiPaginationItem-root.Mui-selected': {
          color: theme.palette.primary.contrastText,
          backgroundColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
        },
        ...props.sx,
      }}
    />
  );
}
