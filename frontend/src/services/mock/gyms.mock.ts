import type { GymDto } from '../../types/gym';
import type { PaginatedList } from '../../types/common';
import { mockDelay } from './helpers';

interface GetGymsParams {
  city?: string;
  status?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export const MOCK_GYMS: GymDto[] = [
  {
    id: 'g1',
    name: 'RockZone',
    city: 'Москва',
    address: 'Москва, ул. Красная Пресня, 12',
    lat: 55.7558,
    lon: 37.6173,
    description: 'Крупнейший скалодром Москвы с 2500 м² скалолазных поверхностей и высотой до 18 метров. Просторные зоны боулдеринга, детская секция и тренажёрный зал.',
    phone: '+7 (495) 123-45-67',
    email: 'info@rockzone.ru',
    website: 'https://rockzone.ru',
    vkUrl: 'https://vk.com/rockzone',
    instagramUrl: 'https://instagram.com/rockzone',
    youtubeUrl: 'https://youtube.com/rockzone',
    photoUrls: ['/mock/gym1-1.jpg', '/mock/gym1-2.jpg', '/mock/gym1-3.jpg'],
    area: 2500,
    maxHeight: 18,
    yearOpened: 2015,
    metroStations: ['Баррикадная', 'Краснопресненская'],
    tags: ['боулдеринг', 'топ-роуп', 'детская секция', 'сауна'],
    hours: {
      'Пн-Пт': '07:00 – 23:00',
      'Сб-Вс': '09:00 – 22:00',
    },
    prices: [
      { name: 'Разовое посещение', price: 1200 },
      { name: 'Абонемент 8 посещений', price: 7200 },
      { name: 'Безлимитный месяц', price: 15000 },
      { name: 'Детский абонемент', price: 5000 },
      { name: 'Пробное занятие', price: 600 },
      { name: 'Курс начинающих (8 занятий)', price: 8500 },
    ],
    rating: 4.5,
    routeCount: 145,
    activeRouteCount: 132,
    isFavorite: false,
    distance: '1.2 км',
  },
  {
    id: 'g2',
    name: 'BigWall',
    city: 'Москва',
    address: 'Москва, ул. Большая Дмитровка, 9',
    lat: 55.7654,
    lon: 37.6141,
    description: 'Экстремальный скалодром с уникальными мультимаршрутными стенами. Специализация на спортивном и скоростном скалолазании. Трассы от 6A до 8B+.',
    phone: '+7 (495) 987-65-43',
    email: 'contact@bigwall.ru',
    website: 'https://bigwall.ru',
    vkUrl: 'https://vk.com/bigwall',
    instagramUrl: 'https://instagram.com/bigwall',
    youtubeUrl: undefined,
    photoUrls: ['/mock/gym2-1.jpg', '/mock/gym2-2.jpg'],
    area: 1800,
    maxHeight: 22,
    yearOpened: 2012,
    metroStations: ['Охотный ряд', 'Театральная'],
    tags: ['спортивное лазание', 'скорость', 'мультимаршруты'],
    hours: {
      'Пн-Пт': '08:00 – 24:00',
      'Сб-Вс': '10:00 – 23:00',
    },
    prices: [
      { name: 'Разовое посещение', price: 1400 },
      { name: 'Абонемент 10 посещений', price: 10000 },
      { name: 'Безлимитный месяц', price: 18000 },
    ],
    rating: 4.7,
    routeCount: 98,
    activeRouteCount: 87,
    isFavorite: true,
    distance: '2.8 км',
  },
  {
    id: 'g3',
    name: 'Лимейт',
    city: 'Санкт-Петербург',
    address: 'Санкт-Петербург, пр. Большой Сампсониевский, 60',
    lat: 59.9343,
    lon: 30.3351,
    description: 'Легендарный петербургский скалодром с атмосферой и сообществом. Уютный боулдеринг-зал и зона для тренировок начинающих.',
    phone: '+7 (812) 333-22-11',
    email: 'hello@limeit.ru',
    website: 'https://limeit.ru',
    vkUrl: 'https://vk.com/limeit',
    instagramUrl: 'https://instagram.com/limeit',
    youtubeUrl: undefined,
    photoUrls: ['/mock/gym3-1.jpg'],
    area: 800,
    maxHeight: 12,
    yearOpened: 2018,
    metroStations: ['Площадь Ленина', 'Чернышевская'],
    tags: ['боулдеринг', 'начинающим', 'кофейня'],
    hours: {
      'Пн-Чт': '10:00 – 23:00',
      'Пт-Вс': '10:00 – 01:00',
    },
    prices: [
      { name: 'Разовое посещение', price: 900 },
      { name: 'Абонемент 8 посещений', price: 5600 },
      { name: 'Безлимитный месяц', price: 11000 },
    ],
    rating: 4.2,
    routeCount: 72,
    activeRouteCount: 68,
    isFavorite: false,
    distance: '3.5 км',
  },
  {
    id: 'g4',
    name: 'НоваЦентр',
    city: 'Москва',
    address: 'Москва, Ленинградский проспект, 36',
    lat: 55.7812,
    lon: 37.5678,
    description: 'Современный скалодром с автостраховкой и интерактивными трасами. Подходит для всех уровней подготовки.',
    phone: '+7 (495) 555-77-88',
    email: 'info@novacenter.ru',
    website: 'https://novacenter.ru',
    vkUrl: undefined,
    instagramUrl: 'https://instagram.com/novacenter',
    youtubeUrl: undefined,
    photoUrls: ['/mock/gym4-1.jpg', '/mock/gym4-2.jpg'],
    area: 1500,
    maxHeight: 15,
    yearOpened: 2021,
    metroStations: ['Динамо', 'Аэропорт'],
    tags: ['автостраховка', 'топ-роуп', 'боулдеринг', 'йога'],
    hours: {
      'Пн-Пт': '07:00 – 23:00',
      'Сб-Вс': '09:00 – 22:00',
    },
    prices: [
      { name: 'Разовое посещение', price: 1100 },
      { name: 'Абонемент 10 посещений', price: 8500 },
      { name: 'Безлимитный месяц', price: 14000 },
    ],
    rating: 4.3,
    routeCount: 110,
    activeRouteCount: 95,
    isFavorite: false,
    distance: '4.1 км',
  },
  {
    id: 'g5',
    name: 'Лодж',
    city: 'Санкт-Петербург',
    address: 'Санкт-Петербург, наб. Обводного канала, 120',
    lat: 59.9168,
    lon: 30.3150,
    description: 'Боулдеринговый клуб с лофт-интерьером и регулярными соревнованиями. Сильное рутсеттерское сообщество.',
    phone: '+7 (812) 444-55-66',
    email: 'hi@lodj.climb',
    website: 'https://lodj.climb',
    vkUrl: 'https://vk.com/lodjclimb',
    instagramUrl: 'https://instagram.com/lodjclimb',
    youtubeUrl: undefined,
    photoUrls: ['/mock/gym5-1.jpg'],
    area: 600,
    maxHeight: 4,
    yearOpened: 2020,
    metroStations: ['Звенигородская', 'Лиговский проспект'],
    tags: ['боулдеринг', 'соревнования', 'лофт'],
    hours: {
      'Ежедневно': '10:00 – 23:00',
    },
    prices: [
      { name: 'Разовое посещение', price: 800 },
      { name: 'Абонемент 8 посещений', price: 4800 },
      { name: 'Безлимитный месяц', price: 9500 },
    ],
    rating: 4.6,
    routeCount: 55,
    activeRouteCount: 50,
    isFavorite: true,
    distance: '0.9 км',
  },
];

export async function mockGetGyms(params?: GetGymsParams): Promise<PaginatedList<GymDto>> {
  await mockDelay(400);

  let items = [...MOCK_GYMS];

  if (params?.city && params.city !== 'all') {
    items = items.filter((g) => g.city === params.city);
  }

  if (params?.status === 'active') {
    items = items.filter((g) => g.activeRouteCount > 0);
  } else if (params?.status === 'archived') {
    items = items.filter((g) => g.activeRouteCount === 0);
  }

  if (params?.sort === 'rating') {
    items.sort((a, b) => b.rating - a.rating);
  } else if (params?.sort === 'name') {
    items.sort((a, b) => a.name.localeCompare(b.name));
  } else if (params?.sort === 'distance') {
    items.sort((a, b) => a.rating - b.rating); // fallback для мока
  }

  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;
  const totalCount = items.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const paginated = items.slice((page - 1) * pageSize, page * pageSize);

  return {
    items: paginated,
    page,
    pageSize,
    totalCount,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
}

export async function mockGetGymById(id: string): Promise<GymDto | null> {
  await mockDelay(300);
  return MOCK_GYMS.find((g) => g.id === id) ?? null;
}

let _mockGymNextId = 100;

export async function mockCreateGym(data: Record<string, unknown>): Promise<GymDto> {
  await mockDelay(300);
  const id = `g${_mockGymNextId++}`;
  const gym: GymDto = {
    id,
    name: (data.name as string) || 'Новый зал',
    city: (data.city as string) || '',
    address: (data.address as string) || '',
    description: (data.description as string) || '',
    phone: (data.phone as string) || '',
    email: (data.email as string) || '',
    website: (data.website as string) || '',
    vkUrl: (data.vkUrl as string) || '',
    instagramUrl: (data.instagramUrl as string) || '',
    youtubeUrl: (data.youtubeUrl as string) || '',
    photoUrls: (data.photoUrls as string[]) || [],
    area: (data.area as number) || undefined,
    maxHeight: (data.maxHeight as number) || undefined,
    yearOpened: (data.yearOpened as number) || undefined,
    metroStations: (data.metroStations as string[]) || [],
    tags: (data.tags as string[]) || [],
    hours: {},
    prices: [],
    rating: 0,
    routeCount: 0,
    activeRouteCount: 0,
    isFavorite: false,
    distance: undefined,
  };
  MOCK_GYMS.push(gym);
  return gym;
}

export async function mockToggleGymFavorite(id: string): Promise<void> {
  await mockDelay(150);
  const gym = MOCK_GYMS.find((g) => g.id === id);
  if (gym) {
    gym.isFavorite = !gym.isFavorite;
  }
}

export async function mockUpdateGym(id: string, data: Record<string, unknown>): Promise<GymDto | null> {
  await mockDelay(400);
  const gym = MOCK_GYMS.find((g) => g.id === id);
  if (!gym) return null;
  Object.assign(gym, data);
  // convert hours from WorkingHoursEntry[] back to GymHours for read display
  if (Array.isArray(data.hours)) {
    const map: Record<string, string> = {};
    for (const entry of data.hours as { days: string; from: string; to: string }[]) {
      if (entry.days) map[entry.days] = `${entry.from} – ${entry.to}`;
    }
    gym.hours = map;
  }
  return { ...gym };
}
