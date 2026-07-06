import type { ReactNode, FormEvent } from 'react';
import { Box, Typography, Button, Link, Alert, CircularProgress, Paper, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { BackgroundPattern } from './BackgroundPattern';

interface AuthFormLayoutProps {
  subtitle: string;
  children: ReactNode;
  submitLabel: string;
  isLoading: boolean;
  error?: string | null;
  validationError?: string | null;
  onSubmit: (e: FormEvent) => void;
  footerText: string;
  footerLinkLabel: string;
  footerLinkTo: string;
}

/**
 * Единый лейаут для страниц логина и регистрации.
 * Центрированный Paper с логотипом, формой и футером.
 */
export function AuthFormLayout({
  subtitle,
  children,
  submitLabel,
  isLoading,
  error,
  validationError,
  onSubmit,
  footerText,
  footerLinkLabel,
  footerLinkTo,
}: AuthFormLayoutProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        background: theme.palette.background.default,
        position: 'relative',
      }}
    >
      <BackgroundPattern intensity={0.6} />
      <Paper
        component="form"
        onSubmit={onSubmit}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          background: `${theme.palette.background.paper}E0`,
          backdropFilter: 'blur(8px)',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 1 }}>
          <Typography
            variant="h2"
            sx={{ fontSize: '2rem', fontWeight: 800, color: theme.palette.primary.main, mb: 0.5 }}
          >
            <img src="/logo.png" alt="" style={{ height: 34, verticalAlign: 'middle', marginRight: 8 }} />
            Крукса
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            {subtitle}
          </Typography>
        </Box>

        {(error || validationError) && (
          <Alert severity="error" sx={{ fontSize: '0.85rem' }}>
            {validationError || error}
          </Alert>
        )}

        {children}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}
          sx={{ py: 1.2, fontWeight: 700, fontSize: '0.9rem' }}
        >
          {isLoading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : submitLabel}
        </Button>

        <Typography variant="body2" sx={{ textAlign: 'center', color: theme.custom.text3 }}>
          {footerText}{' '}
          <Link component={RouterLink} to={footerLinkTo} sx={{ color: theme.palette.primary.main, cursor: 'pointer' }}>
            {footerLinkLabel}
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
