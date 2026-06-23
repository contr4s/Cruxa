import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Box, Typography, Button } from '@mui/material';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: 2,
            py: 8,
            px: 2,
          }}
        >
          <Typography sx={{ fontSize: '2.5rem', lineHeight: 1 }}>⚠️</Typography>
          <Typography
            sx={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'text.secondary',
            }}
          >
            Что-то пошло не так
          </Typography>
          <Typography
            sx={{
              fontSize: '0.82rem',
              color: 'text.secondary',
              maxWidth: 400,
              opacity: 0.7,
            }}
          >
            {this.state.error?.message || 'Произошла непредвиденная ошибка'}
          </Typography>
          <Button
            onClick={this.handleRetry}
            variant="contained"
            sx={{ mt: 1 }}
          >
            Попробовать снова
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
