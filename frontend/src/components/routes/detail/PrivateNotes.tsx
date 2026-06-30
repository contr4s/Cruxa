import { useState } from 'react';
import { TextField, Collapse, useTheme } from '@mui/material';
import { EditNote } from '@mui/icons-material';

interface PrivateNotesProps {
  initialValue?: string;
  onChange?: (value: string) => void;
}

export function PrivateNotes({ initialValue = '', onChange }: PrivateNotesProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleChange = (v: string) => {
    setValue(v);
    onChange?.(v);
  };

  return (
    <details
      open={open}
      onClick={(e) => { e.preventDefault(); setOpen(!open); }}
      style={{
        cursor: 'pointer',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '10px',
        padding: '8px 12px',
        background: theme.palette.background.paper,
      }}
    >
      <summary
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.82rem',
          fontWeight: 600,
          color: theme.palette.text.secondary,
          cursor: 'pointer',
          listStyle: 'none',
        }}
      >
        <EditNote sx={{ fontSize: 16 }} />
        Личные заметки
      </summary>
      <Collapse in={open}>
        <TextField
          fullWidth
          multiline
          minRows={2}
          maxRows={4}
          placeholder="Ваши заметки об этой трассе..."
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          sx={{
            mt: 0.5,
            '& .MuiInputBase-root': {
              background: theme.custom.surface2,
              borderRadius: '6px',
              alignItems: 'flex-start',
              py: 0.5,
              px: 1,
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '& .MuiInputBase-input': {
              fontSize: '0.78rem',
              color: theme.palette.text.primary,
              p: '4px 0',
            },
          }}
        />
      </Collapse>
    </details>
  );
}
