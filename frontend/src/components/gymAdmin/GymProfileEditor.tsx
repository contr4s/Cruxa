import { useState, useCallback } from 'react';
import {
  Box, Typography, TextField, Button, IconButton, useTheme,
} from '@mui/material';
import { Add, Delete, Save, Close } from '@mui/icons-material';
import { Card } from '../../theme/cardStyles';
import type { GymDto, GymPrice, WorkingHoursEntry, UpdateGymPayload } from '../../types/gym';

interface GymProfileEditorProps {
  gym: GymDto;
  editing?: boolean;
  onSave?: (data: UpdateGymPayload) => void;
  onCancel?: () => void;
  saving?: boolean;
}

export function GymProfileEditor({ gym, editing = false, onSave, onCancel, saving }: GymProfileEditorProps) {

  if (!editing) {
    return <ReadOnlyView gym={gym} />;
  }
  return <EditForm key={gym.id} gym={gym} onSave={onSave} onCancel={onCancel} saving={saving} />;
}

/* ---------- Read-only ---------- */
function ReadOnlyView({ gym }: { gym: GymDto }) {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
      <Box sx={{ ...Card(theme), display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: theme.palette.text.primary }}>
          Основная информация
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          <InfoRow label="Название" value={gym.name} />
          <InfoRow label="Город" value={gym.city} />
          <InfoRow label="Адрес" value={gym.address} />
          <InfoRow label="Описание" value={gym.description || '—'} />
          <InfoRow label="Телефон" value={gym.phone || '—'} />
          <InfoRow label="Email" value={gym.email || '—'} />
          <InfoRow label="Сайт" value={gym.website || '—'} />
        </Box>
      </Box>
      <Box sx={{ ...Card(theme), display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: theme.palette.text.primary }}>
          Часы и цены
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          {Object.entries(gym.hours).map(([day, hours]) => (
            <InfoRow key={day} label={day} value={hours} />
          ))}
          {gym.prices.map((price) => (
            <InfoRow key={price.name} label={price.name} value={`${price.price} ₽`} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  return (
    <Box>
      <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: theme.palette.text.secondary, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.primary, mt: 0.25 }}>
        {value}
      </Typography>
    </Box>
  );
}

/* ---------- Edit Form ---------- */
function EditForm({ gym, onSave, onCancel, saving }: {
  gym: GymDto;
  onSave?: (data: UpdateGymPayload) => void;
  onCancel?: () => void;
  saving?: boolean;
}) {
  const theme = useTheme();

  const [name, setName] = useState(gym.name);
  const [city, setCity] = useState(gym.city);
  const [address, setAddress] = useState(gym.address);
  const [description, setDescription] = useState(gym.description ?? '');
  const [phone, setPhone] = useState(gym.phone ?? '');
  const [email, setEmail] = useState(gym.email ?? '');
  const [website, setWebsite] = useState(gym.website ?? '');
  const [vkUrl, setVkUrl] = useState(gym.vkUrl ?? '');
  const [instagramUrl, setInstagramUrl] = useState(gym.instagramUrl ?? '');
  const [youtubeUrl, setYoutubeUrl] = useState(gym.youtubeUrl ?? '');
  const [latitude, setLatitude] = useState(gym.lat?.toString() ?? '');
  const [longitude, setLongitude] = useState(gym.lon?.toString() ?? '');
  const [area, setArea] = useState(gym.area?.toString() ?? '');
  const [maxHeight, setMaxHeight] = useState(gym.maxHeight?.toString() ?? '');
  const [yearOpened, setYearOpened] = useState(gym.yearOpened?.toString() ?? '');
  const [metroStations, setMetroStations] = useState(gym.metroStations.join(', '));
  const [tags, setTags] = useState(gym.tags.join(', '));
  const [photoUrls, setPhotoUrls] = useState<string[]>(gym.photoUrls);

  // hours as WorkingHoursEntry[]
  const [hours, setHours] = useState<WorkingHoursEntry[]>(
    Object.entries(gym.hours).map(([days, fromTo]) => {
      const [from, to] = fromTo.split(' – ').map(s => s.trim());
      return { days, from: from || '', to: to || '' };
    })
  );
  const [prices, setPrices] = useState<GymPrice[]>(gym.prices);

  const addHour = useCallback(() => setHours(h => [...h, { days: '', from: '', to: '' }]), []);
  const removeHour = useCallback((i: number) => setHours(h => h.filter((_, idx) => idx !== i)), []);
  const updateHour = useCallback((i: number, field: keyof WorkingHoursEntry, val: string) => {
    setHours(h => h.map((e, idx) => idx === i ? { ...e, [field]: val } : e));
  }, []);

  const addPrice = useCallback(() => setPrices(p => [...p, { name: '', price: 0 }]), []);
  const removePrice = useCallback((i: number) => setPrices(p => p.filter((_, idx) => idx !== i)), []);
  const updatePrice = useCallback((i: number, field: keyof GymPrice, val: string | number) => {
    setPrices(p => p.map((e, idx) => idx === i ? { ...e, [field]: val } : e));
  }, []);

  const addPhoto = useCallback(() => setPhotoUrls(u => [...u, '']), []);
  const removePhoto = useCallback((i: number) => setPhotoUrls(u => u.filter((_, idx) => idx !== i)), []);
  const updatePhoto = useCallback((i: number, val: string) => {
    setPhotoUrls(u => u.map((e, idx) => idx === i ? val : e));
  }, []);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback((): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Обязательное поле';
    if (!city.trim()) e.city = 'Обязательное поле';
    if (!address.trim()) e.address = 'Обязательное поле';
    if (yearOpened && (isNaN(Number(yearOpened)) || Number(yearOpened) < 1900 || Number(yearOpened) > 2030)) {
      e.yearOpened = 'Год от 1900 до 2030';
    }
    if (area && (isNaN(Number(area)) || Number(area) <= 0)) e.area = 'Положительное число';
    if (maxHeight && (isNaN(Number(maxHeight)) || Number(maxHeight) <= 0)) e.maxHeight = 'Положительное число';
    if (latitude && (isNaN(Number(latitude)) || Number(latitude) < -90 || Number(latitude) > 90)) e.latitude = 'От -90 до 90';
    if (longitude && (isNaN(Number(longitude)) || Number(longitude) < -180 || Number(longitude) > 180)) e.longitude = 'От -180 до 180';
    if (phone && !/^[\d\s+\-()]*$/.test(phone)) e.phone = 'Некорректный формат';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Некорректный email';
    if (website && !/^https?:\/\/.+/.test(website)) e.website = 'Должен начинаться с http:// или https://';
    if (vkUrl && !/^https?:\/\/(vk\.com|www\.vk\.com)\//.test(vkUrl)) e.vkUrl = 'Введите VK URL';
    if (instagramUrl && !/^https?:\/\/(instagram\.com|www\.instagram\.com)\//.test(instagramUrl)) e.instagramUrl = 'Введите Instagram URL';
    hours.forEach((h, i) => {
      if (h.days && (!h.from || !h.to)) e[`hours_${i}`] = 'Заполните время';
    });
    prices.forEach((p, i) => {
      if (p.name && (!p.price || p.price <= 0)) e[`price_${i}`] = 'Цена должна быть > 0';
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [name, city, address, yearOpened, area, maxHeight, latitude, longitude, phone, email, website, vkUrl, instagramUrl, hours, prices]);

  const handleSubmit = () => {
    if (!validate()) return;
    onSave?.({
      name: name || undefined,
      city: city || undefined,
      address: address || undefined,
      description: description || null,
      phone: phone || null,
      email: email || null,
      website: website || null,
      vkUrl: vkUrl || null,
      instagramUrl: instagramUrl || null,
      youtubeUrl: youtubeUrl || null,
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      area: area ? Number(area) : null,
      maxHeight: maxHeight ? Number(maxHeight) : null,
      yearOpened: yearOpened ? Number(yearOpened) : null,
      metroStations: metroStations ? metroStations.split(',').map(s => s.trim()).filter(Boolean) : [],
      tags: tags ? tags.split(',').map(s => s.trim()).filter(Boolean) : [],
      photoUrls: photoUrls.filter(Boolean),
      hours: hours.filter(h => h.days),
      prices: prices.filter(p => p.name),
    });
  };

  const fieldSx = { '& .MuiInputBase-root': { fontSize: '0.85rem' }, '& .MuiInputLabel-root': { fontSize: '0.82rem' } };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" size="small" startIcon={<Save />} onClick={handleSubmit} disabled={saving}>
          {saving ? 'Сохранение…' : 'Сохранить'}
        </Button>
        <Button variant="outlined" size="small" startIcon={<Close />} onClick={onCancel} disabled={saving}>
          Отмена
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
        {/* Left — Основная информация */}
        <Box sx={{ ...Card(theme), display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: theme.palette.text.primary }}>
            Основная информация
          </Typography>
          <TextField label="Название" size="small" value={name} onChange={e => setName(e.target.value)} sx={fieldSx} required error={!!errors.name} helperText={errors.name} />
          <TextField label="Город" size="small" value={city} onChange={e => setCity(e.target.value)} sx={fieldSx} required error={!!errors.city} helperText={errors.city} />
          <TextField label="Адрес" size="small" value={address} onChange={e => setAddress(e.target.value)} sx={fieldSx} required error={!!errors.address} helperText={errors.address} />
          <TextField label="Описание" size="small" multiline minRows={3} value={description} onChange={e => setDescription(e.target.value)} sx={fieldSx} />
          <TextField label="Метро (через запятую)" size="small" value={metroStations} onChange={e => setMetroStations(e.target.value)} sx={fieldSx} />
          <TextField label="Теги (через запятую)" size="small" value={tags} onChange={e => setTags(e.target.value)} sx={fieldSx} />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <TextField label="Площадь (м²)" size="small" type="number" value={area} onChange={e => setArea(e.target.value)} sx={fieldSx} error={!!errors.area} helperText={errors.area} />
            <TextField label="Макс. высота (м)" size="small" type="number" value={maxHeight} onChange={e => setMaxHeight(e.target.value)} sx={fieldSx} error={!!errors.maxHeight} helperText={errors.maxHeight} />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <TextField label="Год открытия" size="small" type="number" value={yearOpened} onChange={e => setYearOpened(e.target.value)} sx={fieldSx} error={!!errors.yearOpened} helperText={errors.yearOpened} />
            <Box />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <TextField label="Широта" size="small" type="number" value={latitude} onChange={e => setLatitude(e.target.value)} sx={fieldSx} inputProps={{ step: 0.0001 }} error={!!errors.latitude} helperText={errors.latitude} />
            <TextField label="Долгота" size="small" type="number" value={longitude} onChange={e => setLongitude(e.target.value)} sx={fieldSx} inputProps={{ step: 0.0001 }} error={!!errors.longitude} helperText={errors.longitude} />
          </Box>
        </Box>

        {/* Right — Контакты, часы, цены */}
        <Box sx={{ ...Card(theme), display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: theme.palette.text.primary }}>
            Контакты
          </Typography>
          <TextField label="Телефон" size="small" value={phone} onChange={e => setPhone(e.target.value)} sx={fieldSx} error={!!errors.phone} helperText={errors.phone} />
          <TextField label="Email" size="small" value={email} onChange={e => setEmail(e.target.value)} sx={fieldSx} error={!!errors.email} helperText={errors.email} />
          <TextField label="Сайт" size="small" value={website} onChange={e => setWebsite(e.target.value)} sx={fieldSx} error={!!errors.website} helperText={errors.website} />
          <TextField label="VK" size="small" value={vkUrl} onChange={e => setVkUrl(e.target.value)} sx={fieldSx} error={!!errors.vkUrl} helperText={errors.vkUrl} />
          <TextField label="Instagram" size="small" value={instagramUrl} onChange={e => setInstagramUrl(e.target.value)} sx={fieldSx} error={!!errors.instagramUrl} helperText={errors.instagramUrl} />
          <TextField label="YouTube" size="small" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} sx={fieldSx} />

          <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: theme.palette.text.primary, mt: 1 }}>
            Часы работы
          </Typography>
          {hours.map((h, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              <TextField size="small" placeholder="Пн-Пт" value={h.days} onChange={e => updateHour(i, 'days', e.target.value)} sx={{ minWidth: 90, ...fieldSx }} error={!!errors[`hours_${i}`]} helperText={errors[`hours_${i}`]} />
              <TextField size="small" placeholder="08:00" value={h.from} onChange={e => updateHour(i, 'from', e.target.value)} sx={{ maxWidth: 80, ...fieldSx }} />
              <Typography sx={{ color: theme.palette.text.secondary }}>–</Typography>
              <TextField size="small" placeholder="23:00" value={h.to} onChange={e => updateHour(i, 'to', e.target.value)} sx={{ maxWidth: 80, ...fieldSx }} />
              <IconButton size="small" onClick={() => removeHour(i)} color="error"><Delete fontSize="small" /></IconButton>
            </Box>
          ))}
          <Button size="small" startIcon={<Add />} onClick={addHour} sx={{ alignSelf: 'flex-start', fontSize: '0.82rem' }}>
            Добавить день
          </Button>

          <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: theme.palette.text.primary, mt: 1 }}>
            Цены
          </Typography>
          {prices.map((p, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              <TextField size="small" placeholder="Название" value={p.name} onChange={e => updatePrice(i, 'name', e.target.value)} sx={{ flex: 1, ...fieldSx }} error={!!errors[`price_${i}`]} helperText={errors[`price_${i}`]} />
              <TextField size="small" placeholder="Цена" type="number" value={p.price || ''} onChange={e => updatePrice(i, 'price', Number(e.target.value))} sx={{ maxWidth: 100, ...fieldSx }} />
              <Typography sx={{ color: theme.palette.text.secondary }}>₽</Typography>
              <IconButton size="small" onClick={() => removePrice(i)} color="error"><Delete fontSize="small" /></IconButton>
            </Box>
          ))}
          <Button size="small" startIcon={<Add />} onClick={addPrice} sx={{ alignSelf: 'flex-start', fontSize: '0.82rem' }}>
            Добавить цену
          </Button>

          <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: theme.palette.text.primary, mt: 1 }}>
            Фото (URL)
          </Typography>
          {photoUrls.map((url, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              <TextField size="small" placeholder="https://…" value={url} onChange={e => updatePhoto(i, e.target.value)} sx={{ flex: 1, ...fieldSx }} />
              <IconButton size="small" onClick={() => removePhoto(i)} color="error"><Delete fontSize="small" /></IconButton>
            </Box>
          ))}
          <Button size="small" startIcon={<Add />} onClick={addPhoto} sx={{ alignSelf: 'flex-start', fontSize: '0.82rem' }}>
            Добавить фото
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
