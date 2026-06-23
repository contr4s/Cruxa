import type { ReactNode } from 'react';
import { Button, useTheme } from '@mui/material';
import type { ButtonProps } from '@mui/material';

interface GradientButtonProps extends Omit<ButtonProps, 'children'> {
  children: ReactNode;
  size?: 'sm' | 'lg';
}

/**
 * Кнопка с градиентной заливкой accent (teal → green).
 * Используется в лендинге: Hero, CallToAction, Navbar.
 */
export function GradientButton({ children, size = 'lg', sx, ...rest }: GradientButtonProps) {
  const theme = useTheme();

  const sizeStyles = {
    sm: { py: 0.6, px: 2, fontSize: '0.78rem' },
    lg: { py: 1.8, px: 4, fontSize: '0.95rem' },
  };

  const s = sizeStyles[size];

  return (
    <Button
      variant="contained"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        py: s.py,
        px: s.px,
        borderRadius: 3,
        fontSize: s.fontSize,
        fontWeight: 600,
        background: theme.custom.gradientAccent,
        color: '#fff',
        boxShadow: '0 4px 24px rgba(38,166,154,.3)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 32px rgba(38,166,154,.4)',
          background: theme.custom.gradientAccent,
        },
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Button>
  );
}
