import { http, HttpResponse } from 'msw';
import type { GymDto } from '../../types/gym';
import type { PaginatedList } from '../../types/common';
import { mockDelay } from '../helpers';

export const MOCK_GYMS: GymDto[] = [
  {
    id: 'g1', name: 'RockZone', city: 'Москва', address: 'Москва, ул. Красная Пресня, 12',
    lat: 55.7558, lon: 37.6173,
    description: 'Крупнейший скалодром Москвы с 2500 м² скалолазных поверхностей и высотой до 18 метров.',
    phone: '+7 (495) 123-45-67', email: 'info@rockzone.ru', website: 'https://rockzone.ru',
    vkUrl: 'https://vk.com/rockzone', instagramUrl: 'https://instagram.com/rockzone', youtubeUrl: 'https://youtube.com/rockzone',
    photoUrls: ['/mock/gym1-1.jpg', '/mock/gym1-2.jpg', '/mock/gym1-3.jpg'],
    area: 2500, maxHeight: 18, yearOpened: 2015,
    metroStations: ['Баррикадная', 'Краснопресненская'],
    tags: ['боулдеринг', 'топ-роуп', 'детская секция', 'сауна'],
    hours: { 'Пн-Пт': '07:00 – 23:00', 'Сб-Вс': '09:00 – 22:00' },
    prices: [
      { name: 'Разовое посещение', price: 1200 },
      { name: 'Абонемент 8 посещений', price: 7200 },
      { name: 'Безлимитный месяц', price: 15000 },
      { name: 'Детский абонемент', price: 5000 },
      { name: 'Пробное занятие', price: 600 },
      { name: 'Курс начинающих (8 занятий)', price: 8500 },
    ],
    rating: 4.5, routeCount: 145, activeRouteCount: 132, isFavorite: false,
  },
  {
    id: 'g2', name: 'BigWall', city: 'Москва', address: 'Москва, ул. Большая Дмитровка, 9',
    lat: 55.7654, lon: 37.6141,
    description: 'Экстремальный скалодром с уникальными мультимаршрутными стенами.',
    phone: '+7 (495) 987-65-43', email: 'contact@bigwall.ru', website: 'https://bigwall.ru',
    vkUrl: 'https://vk.com/bigwall', instagramUrl: 'https://instagram.com/bigwall', youtubeUrl: undefined,
    photoUrls: ['/mock/gym2-1.jpg', '/mock/gym2-2.jpg'],
    area: 1800, maxHeight: 22, yearOpened: 2012,
    metroStations: ['Охотный ряд', 'Театральная'],
    tags: ['спортивное лазание', 'скорость', 'мультимаршруты'],
    hours: { 'Пн-Пт': '08:00 – 24:00', 'Сб-Вс': '10:00 – 23:00' },
    prices: [
      { name: 'Разовое посещение', price: 1400 },
      { name: 'Абонемент 10 посещений', price: 10000 },
      { name: 'Безлимитный месяц', price: 18000 },
    ],
    rating: 4.7, routeCount: 98, activeRouteCount: 87, isFavorite: true,
  },
  {
    id: 'g3', name: 'Лимейт', city: 'Санкт-Петербург', address: 'Санкт-Петербург, пр. Большой Сампсониевский, 60',
    lat: 59.9343, lon: 30.3351,
    description: 'Легендарный петербургский скалодром с атмосферой и сообществом.',
    phone: '+7 (812) 333-22-11', email: 'hello@limeit.ru', website: 'https://limeit.ru',
    vkUrl: 'https://vk.com/limeit', instagramUrl: 'https://instagram.com/limeit', youtubeUrl: undefined,
    photoUrls: ['/mock/gym3-1.jpg'],
    area: 800, maxHeight: 12, yearOpened: 2018,
    metroStations: ['Площадь Ленина', 'Чернышевская'],
    tags: ['боулдеринг', 'начинающим', 'кофейня'],
    hours: { 'Пн-Чт': '10:00 – 23:00', 'Пт-Вс': '10:00 – 01:00' },
    prices: [
      { name: 'Разовое посещение', price: 900 },
      { name: 'Абонемент 8 посещений', price: 5600 },
      { name: 'Безлимитный месяц', price: 11000 },
    ],
    rating: 4.2, routeCount: 72, activeRouteCount: 68, isFavorite: false,
  },
  {
    id: 'g4', name: 'НоваЦентр', city: 'Москва', address: 'Москва, Ленинградский проспект, 36',
    lat: 55.7812, lon: 37.5678,
    description: 'Современный скалодром с автостраховкой и интерактивными трасами.',
    phone: '+7 (495) 555-77-88', email: 'info@novacenter.ru', website: 'https://novacenter.ru',
    vkUrl: undefined, instagramUrl: 'https://instagram.com/novacenter', youtubeUrl: undefined,
    photoUrls: ['/mock/gym4-1.jpg', '/mock/gym4-2.jpg'],
    area: 1500, maxHeight: 15, yearOpened: 2021,
    metroStations: ['Динамо', 'Аэропорт'],
    tags: ['автостраховка', 'топ-роуп', 'боулдеринг', 'йога'],
    hours: { 'Пн-Пт': '07:00 – 23:00', 'Сб-Вс': '09:00 – 22:00' },
    prices: [
      { name: 'Разовое посещение', price: 1100 },
      { name: 'Абонемент 10 посещений', price: 8500 },
      { name: 'Безлимитный месяц', price: 14000 },
    ],
    rating: 4.3, routeCount: 110, activeRouteCount: 95, isFavorite: false,
  },
  {
    id: 'g5', name: 'Лодж', city: 'Санкт-Петербург', address: 'Санкт-Петербург, наб. Обводного канала, 120',
    lat: 59.9168, lon: 30.3150,
    description: 'Боулдеринговый клуб с лофт-интерьером и регулярными соревнованиями.',
    phone: '+7 (812) 444-55-66', email: 'hi@lodj.climb', website: 'https://lodj.climb',
    vkUrl: 'https://vk.com/lodjclimb', instagramUrl: 'https://instagram.com/lodjclimb', youtubeUrl: undefined,
    photoUrls: ['/mock/gym5-1.jpg'],
    area: 600, maxHeight: 4, yearOpened: 2020,
    metroStations: ['Звенигородская', 'Лиговский проспект'],
    tags: ['боулдеринг', 'соревнования', 'лофт'],
    hours: { 'Ежедневно': '10:00 – 23:00' },
    prices: [
      { name: 'Разовое посещение', price: 800 },
      { name: 'Абонемент 8 посещений', price: 4800 },
      { name: 'Безлимитный месяц', price: 9500 },
    ],
    rating: 4.6, routeCount: 55, activeRouteCount: 50, isFavorite: true,
  },
];

function paginate<T>(items: T[], page: number, pageSize: number): PaginatedList<T> {
  const totalCount = items.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  return {
    items: items.slice((page - 1) * pageSize, page * pageSize),
    page, pageSize, totalCount, totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
}

export const gymHandlers = [
  http.get('/api/gyms', async ({ request }) => {
    await mockDelay(400);
    const url = new URL(request.url);
    const city = url.searchParams.get('city');
    url.searchParams.get('status');
    const sort = url.searchParams.get('sort');
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;

    let items = [...MOCK_GYMS];
    if (city && city !== 'all') items = items.filter((g) => g.city === city);
    if (sort === 'rating') items.sort((a, b) => b.rating - a.rating);
    else if (sort === 'name') items.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'distance') items.sort((a, b) => (a.lat && b.lat ? Math.hypot(a.lat - 55.75, a.lon! - 37.61) - Math.hypot(b.lat - 55.75, b.lon! - 37.61) : 0));

    return HttpResponse.json<PaginatedList<GymDto>>(paginate(items, page, pageSize));
  }),

  http.get('/api/gyms/:id', async ({ params }) => {
    await mockDelay(300);
    const gym = MOCK_GYMS.find((g) => g.id === params.id);
    if (!gym) return HttpResponse.json(null, { status: 404 });
    return HttpResponse.json<GymDto>(gym);
  }),

  http.post('/api/gyms/:id/favorite', async ({ params }) => {
    await mockDelay(150);
    const gym = MOCK_GYMS.find((g) => g.id === params.id);
    if (gym) gym.isFavorite = !gym.isFavorite;
    return HttpResponse.json(undefined, { status: 200 });
  }),

  http.post('/api/gyms', async ({ request }) => {
    await mockDelay(300);
    const body = (await request.json()) as Partial<GymDto>;
    const newGym: GymDto = {
      id: `g${MOCK_GYMS.length + 100}`,
      name: body.name ?? '',
      city: body.city ?? '',
      address: body.address ?? '',
      description: body.description,
      photoUrls: [],
      hours: {},
      prices: [],
      rating: 0,
      routeCount: 0,
      activeRouteCount: 0,
      isFavorite: false,
      metroStations: [],
      tags: [],
    };
    MOCK_GYMS.push(newGym);
    return HttpResponse.json<GymDto>(newGym, { status: 201 });
  }),

  http.put('/api/gyms/:id', async ({ params, request }) => {
    await mockDelay(300);
    const body = (await request.json()) as Partial<GymDto>;
    const idx = MOCK_GYMS.findIndex((g) => g.id === params.id);
    if (idx === -1) return HttpResponse.json(null, { status: 404 });
    MOCK_GYMS[idx] = { ...MOCK_GYMS[idx], ...body };
    return HttpResponse.json<GymDto>(MOCK_GYMS[idx]);
  }),
];
