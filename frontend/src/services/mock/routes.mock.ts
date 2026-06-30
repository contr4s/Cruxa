import type { RouteDto, RouteReviewDto, GradeConsensus } from '../../types/route';
import type { PaginatedList } from '../../types/common';
import { mockDelay } from './helpers';
import type { GetRoutesParams } from '../routes.service';

const MOCK_ROUTES: RouteDto[] = [
  // RockZone g1
  {
    id: 'r1', name: 'Красная стрела', grade: '6A', gradeIndex: 10, type: 'Lead', holdColor: 'Red', sector: 'Главная стена', gymId: 'g1', gymName: 'RockZone',
    setterId: 's1', setterName: 'Иван Рутов', setterAvatarUrl: undefined, setterGender: 'male', tags: ['overhang', 'crimp'], description: 'Техничная трасса с перехватами через нависание.', photoUrls: ['/mock/route1-1.jpg'],
    rating: 4.8, ascentsCount: 124, status: 'Active', createdAt: '2026-06-01T00:00:00Z', isFavorite: false,
  },
  {
    id: 'r2', name: 'Синий мув', grade: '6B+', gradeIndex: 13, type: 'Boulder', holdColor: 'Blue', sector: 'Боулдеринг', gymId: 'g1', gymName: 'RockZone',
    setterId: 's2', setterName: 'Анна Трассова', setterAvatarUrl: undefined, setterGender: 'female', tags: ['technical', 'sloper'], description: 'Динамичный мув через большой слоупер.', photoUrls: [],
    rating: 4.5, ascentsCount: 89, status: 'Active', createdAt: '2026-05-20T00:00:00Z', isFavorite: true,
  },
  {
    id: 'r3', name: 'Золотая середина', grade: '5C', gradeIndex: 7, type: 'TopRope', holdColor: 'Yellow', sector: 'Начинающие', gymId: 'g1', gymName: 'RockZone',
    setterId: 's1', setterName: 'Иван Рутов', setterAvatarUrl: undefined, tags: ['endurance', 'arete'], description: 'Классическая трассетка для работы на выносливость.', photoUrls: [],
    rating: 4.2, ascentsCount: 210, status: 'Active', createdAt: '2026-04-15T00:00:00Z', isFavorite: false,
  },
  {
    id: 'r4', name: 'Пурпурный пик', grade: '6C', gradeIndex: 14, type: 'Lead', holdColor: 'Purple', sector: 'Главная стена', gymId: 'g1', gymName: 'RockZone',
    setterId: 's3', setterName: 'Дмитрий Зацеп', setterAvatarUrl: undefined, setterGender: 'male', tags: ['power', 'pinch'], description: 'Сложная силовая трасса с пинчами.', photoUrls: ['/mock/route4-1.jpg'],
    rating: 4.3, ascentsCount: 45, status: 'Active', createdAt: '2026-06-10T00:00:00Z', isFavorite: false,
  },
  {
    id: 'r5', name: 'Лягушка', grade: '5B', gradeIndex: 5, type: 'Boulder', holdColor: 'Green', sector: 'Боулдеринг', gymId: 'g1', gymName: 'RockZone',
    setterId: 's2', setterName: 'Анна Трассова', setterAvatarUrl: undefined, tags: ['slab', 'pocket'], description: 'Простой боулдер с карманами.', photoUrls: [],
    rating: 4.0, ascentsCount: 178, status: 'Active', createdAt: '2026-03-01T00:00:00Z', isFavorite: false,
  },
  {
    id: 'r6', name: 'Мандарин', grade: '5C', gradeIndex: 7, type: 'TopRope', holdColor: 'Orange', sector: 'Начинающие', gymId: 'g1', gymName: 'RockZone',
    setterId: 's1', setterName: 'Иван Рутов', setterAvatarUrl: undefined, tags: ['warmup'], description: 'Разминочная трассетка.', photoUrls: [],
    rating: 3.8, ascentsCount: 230, status: 'Active', createdAt: '2026-02-15T00:00:00Z', isFavorite: false,
  },
  {
    id: 'r7', name: 'Ночной дозор', grade: '6A+', gradeIndex: 11, type: 'Lead', holdColor: 'Black', sector: 'Главная стена', gymId: 'g1', gymName: 'RockZone',
    setterId: 's3', setterName: 'Дмитрий Зацеп', setterAvatarUrl: undefined, tags: ['technical', 'crimp'], description: 'Тёмная трасса с мелкими зацепками.', photoUrls: [],
    rating: 4.6, ascentsCount: 67, status: 'Active', createdAt: '2026-05-25T00:00:00Z', isFavorite: false,
  },
  {
    id: 'r8', name: 'Арктика', grade: '5A', gradeIndex: 3, type: 'Boulder', holdColor: 'White', sector: 'Боулдеринг', gymId: 'g1', gymName: 'RockZone',
    setterId: 's2', setterName: 'Анна Трассова', setterAvatarUrl: undefined, tags: ['slab'], description: 'Белый боулдер для начинающих.', photoUrls: [],
    rating: 4.1, ascentsCount: 300, status: 'Active', createdAt: '2026-01-10T00:00:00Z', isFavorite: false,
  },
  {
    id: 'r9', name: 'Гранит', grade: '6B', gradeIndex: 12, type: 'Lead', holdColor: 'Gray', sector: 'Главная стена', gymId: 'g1', gymName: 'RockZone',
    setterId: 's1', setterName: 'Иван Рутов', setterAvatarUrl: undefined, tags: ['campus'], description: 'Кампус-трасса для тренировки силы рук.', photoUrls: [],
    rating: 4.4, ascentsCount: 76, status: 'Active', createdAt: '2026-05-01T00:00:00Z', isFavorite: false,
  },
  {
    id: 'r10', name: 'Розовый фламинго', grade: '5C+', gradeIndex: 8, type: 'TopRope', holdColor: 'Pink', sector: 'Начинающие', gymId: 'g1', gymName: 'RockZone',
    setterId: 's2', setterName: 'Анна Трассова', setterAvatarUrl: undefined, tags: ['dynamic'], description: 'Розовая динамичная трассетка.', photoUrls: [],
    rating: 4.5, ascentsCount: 145, status: 'Active', createdAt: '2026-04-20T00:00:00Z', isFavorite: false,
  },
  {
    id: 'r29', name: 'Бирюза', grade: '6A', gradeIndex: 10, type: 'Lead', holdColor: 'Blue', sector: 'Главная стена', gymId: 'g1', gymName: 'RockZone',
    setterId: 's1', setterName: 'Иван Рутов', setterAvatarUrl: undefined, tags: ['technical'], description: 'Техничная синяя трасса.', photoUrls: [],
    rating: 4.0, ascentsCount: 33, status: 'Active', createdAt: '2026-06-20T00:00:00Z', isFavorite: false,
  },
  {
    id: 'r30', name: 'Агат', grade: '5B', gradeIndex: 5, type: 'TopRope', holdColor: 'Gray', sector: 'Начинающие', gymId: 'g1', gymName: 'RockZone',
    setterId: 's2', setterName: 'Анна Трассова', setterAvatarUrl: undefined, tags: ['warmup'], description: 'Серая разминка.', photoUrls: [],
    rating: 3.9, ascentsCount: 55, status: 'Active', createdAt: '2026-06-18T00:00:00Z', isFavorite: false,
  },
  // BigWall g2
  {
    id: 'r11', name: 'Белый рывок', grade: '6A', gradeIndex: 10, type: 'Speed', holdColor: 'White', sector: 'Скорость', gymId: 'g2', gymName: 'BigWall',
    setterId: 's4', setterName: 'Мария Скорость', setterAvatarUrl: undefined, setterGender: 'female', tags: ['speed', 'dynamic'], description: 'Скоростная трасса по стандарту IFSC.', photoUrls: [],
    rating: 4.3, ascentsCount: 92, status: 'Active', createdAt: '2026-06-05T00:00:00Z', isFavorite: false,
  },
  {
    id: 'r12', name: 'Чёрная молния', grade: '7A', gradeIndex: 17, type: 'Lead', holdColor: 'Black', sector: 'Спорт', gymId: 'g2', gymName: 'BigWall',
    setterId: 's5', setterName: 'Алексей Сильный', setterAvatarUrl: undefined, setterGender: 'male', tags: ['overhang', 'power', 'crimp'], description: 'Флагманская трасса зала — длинный нависающий маршрут.', photoUrls: ['/mock/route12-1.jpg'],
    rating: 4.9, ascentsCount: 34, status: 'Active', createdAt: '2026-06-01T00:00:00Z', isFavorite: true,
  },
  {
    id: 'r13', name: 'Зелёный дракон', grade: '6C', gradeIndex: 14, type: 'Lead', holdColor: 'Green', sector: 'Спорт', gymId: 'g2', gymName: 'BigWall',
    setterId: 's4', setterName: 'Мария Скорость', setterAvatarUrl: undefined, setterGender: 'female', tags: ['endurance', 'arete'], description: 'Зелёный маршрут по диэдру.', photoUrls: [],
    rating: 4.4, ascentsCount: 56, status: 'Active', createdAt: '2026-05-15T00:00:00Z', isFavorite: false,
  },
  {
    id: 'r14', name: 'Сирень', grade: '5C', gradeIndex: 7, type: 'Boulder', holdColor: 'Purple', sector: 'Боулдер', gymId: 'g2', gymName: 'BigWall',
    setterId: 's5', setterName: 'Алексей Сильный', setterAvatarUrl: undefined, tags: ['slab'], description: 'Фиолетовый боулдер на технику.', photoUrls: [],
    rating: 4.0, ascentsCount: 120, status: 'Active', createdAt: '2026-04-01T00:00:00Z', isFavorite: false,
  },
  {
    id: 'r15', name: 'Изумруд', grade: '6B', gradeIndex: 12, type: 'Lead', holdColor: 'Green', sector: 'Спорт', gymId: 'g2', gymName: 'BigWall',
    setterId: 's4', setterName: 'Мария Скорость', setterAvatarUrl: undefined, setterGender: 'female', tags: ['endurance'], description: 'Выносливый зелёный маршрут.', photoUrls: [],
    rating: 4.2, ascentsCount: 88, status: 'Active', createdAt: '2026-05-10T00:00:00Z', isFavorite: false,
  },
  {
    id: 'r16', name: 'Коричневый сахар', grade: '6A', gradeIndex: 10, type: 'TopRope', holdColor: 'Brown', sector: 'Начинающие', gymId: 'g2', gymName: 'BigWall',
    setterId: 's5', setterName: 'Алексей Сильный', setterAvatarUrl: undefined, tags: ['warmup'], description: 'Разминка на коричневых зацепках.', photoUrls: [],
    rating: 3.9, ascentsCount: 200, status: 'Active', createdAt: '2026-03-20T00:00:00Z', isFavorite: false,
  },
  // Лимейт g3
  {
    id: 'r17', name: 'Пурпурный туман', grade: '6A', gradeIndex: 10, type: 'Boulder', holdColor: 'Purple', sector: 'Зал А', gymId: 'g3', gymName: 'Лимейт',
    setterId: 's6', setterName: 'Ольга Боулдер', setterAvatarUrl: undefined, setterGender: 'female', tags: ['technical', 'sloper'], description: 'Фиолетовый боулдер со слоуперами.', photoUrls: [],
    rating: 4.3, ascentsCount: 110, status: 'Active', createdAt: '2026-05-22T00:00:00Z', isFavorite: false,
  },
  {
    id: 'r18', name: 'Алый парус', grade: '5C', gradeIndex: 7, type: 'Boulder', holdColor: 'Red', sector: 'Зал Б', gymId: 'g3', gymName: 'Лимейт',
    setterId: 's6', setterName: 'Ольга Боулдер', setterAvatarUrl: undefined, tags: ['endurance', 'slab'], description: 'Красный боулдер на выносливость.', photoUrls: [],
    rating: 4.1, ascentsCount: 150, status: 'Active', createdAt: '2026-04-10T00:00:00Z', isFavorite: false,
  },
  {
    id: 'r19', name: 'Лагуна', grade: '6B', gradeIndex: 12, type: 'Boulder', holdColor: 'Blue', sector: 'Зал А', gymId: 'g3', gymName: 'Лимейт',
    setterId: 's7', setterName: 'Павел Лаза', setterAvatarUrl: undefined, setterGender: 'male', tags: ['slab', 'dynamic'], description: 'Синий динамичный боулдер.', photoUrls: ['/mock/route19-1.jpg'],
    rating: 4.5, ascentsCount: 80, status: 'Active', createdAt: '2026-05-05T00:00:00Z', isFavorite: false,
  },
  {
    id: 'r20', name: 'Цитрус', grade: '5A', gradeIndex: 3, type: 'Boulder', holdColor: 'Orange', sector: 'Зал Б', gymId: 'g3', gymName: 'Лимейт',
    setterId: 's7', setterName: 'Павел Лаза', setterAvatarUrl: undefined, tags: ['warmup'], description: 'Оранжевая разминка.', photoUrls: [],
    rating: 4.0, ascentsCount: 250, status: 'Active', createdAt: '2026-02-01T00:00:00Z', isFavorite: false,
  },
  {
    id: 'r21', name: 'Тень', grade: '6B+', gradeIndex: 13, type: 'Boulder', holdColor: 'Black', sector: 'Зал А', gymId: 'g3', gymName: 'Лимейт',
    setterId: 's6', setterName: 'Ольга Боулдер', setterAvatarUrl: undefined, tags: ['overhang', 'power'], description: 'Тёмный боулдер через крышу.', photoUrls: [],
    rating: 4.6, ascentsCount: 42, status: 'Active', createdAt: '2026-06-08T00:00:00Z', isFavorite: true,
  },
  {
    id: 'r22', name: 'Облако', grade: '5B', gradeIndex: 5, type: 'Boulder', holdColor: 'White', sector: 'Зал Б', gymId: 'g3', gymName: 'Лимейт',
    setterId: 's7', setterName: 'Павел Лаза', setterAvatarUrl: undefined, tags: ['slab', 'pocket'], description: 'Белый лёгкий боулдер.', photoUrls: [],
    rating: 3.8, ascentsCount: 180, status: 'Active', createdAt: '2026-03-15T00:00:00Z', isFavorite: false,
  },
  // НоваЦентр g4
  {
    id: 'r23', name: 'Новатор', grade: '6A', gradeIndex: 10, type: 'Lead', holdColor: 'Red', sector: 'Центральная стена', gymId: 'g4', gymName: 'НоваЦентр',
    setterId: 's8', setterName: 'Сергей Новый', setterAvatarUrl: undefined, setterGender: 'male', tags: ['overhang'], description: 'Красная новинка.', photoUrls: [],
    rating: 4.4, ascentsCount: 95, status: 'Active', createdAt: '2026-06-12T00:00:00Z', isFavorite: false,
  },
  {
    id: 'r24', name: 'Сапфир', grade: '6B', gradeIndex: 12, type: 'Boulder', holdColor: 'Blue', sector: 'Боулдеринг', gymId: 'g4', gymName: 'НоваЦентр',
    setterId: 's9', setterName: 'Наталья Центр', setterAvatarUrl: undefined, setterGender: 'female', tags: ['technical'], description: 'Синий техничный боулдер.', photoUrls: [],
    rating: 4.3, ascentsCount: 70, status: 'Active', createdAt: '2026-05-28T00:00:00Z', isFavorite: false,
  },
  {
    id: 'r25', name: 'Заря', grade: '5C', gradeIndex: 7, type: 'TopRope', holdColor: 'Yellow', sector: 'Автостраховка', gymId: 'g4', gymName: 'НоваЦентр',
    setterId: 's8', setterName: 'Сергей Новый', setterAvatarUrl: undefined, tags: ['warmup'], description: 'Жёлтая разминка.', photoUrls: [],
    rating: 4.1, ascentsCount: 160, status: 'Active', createdAt: '2026-04-05T00:00:00Z', isFavorite: false,
  },
  // Лодж g5
  {
    id: 'r26', name: 'Лофт-лайн', grade: '6B+', gradeIndex: 13, type: 'Boulder', holdColor: 'Gray', sector: 'Зал 1', gymId: 'g5', gymName: 'Лодж',
    setterId: 's10', setterName: 'Кирилл Лодж', setterAvatarUrl: undefined, setterGender: 'male', tags: ['power', 'crimp'], description: 'Серый силовой боулдер.', photoUrls: [],
    rating: 4.7, ascentsCount: 38, status: 'Active', createdAt: '2026-06-15T00:00:00Z', isFavorite: false,
  },
  {
    id: 'r27', name: 'Скорость света', grade: '5A', gradeIndex: 3, type: 'Boulder', holdColor: 'White', sector: 'Зал 2', gymId: 'g5', gymName: 'Лодж',
    setterId: 's10', setterName: 'Кирилл Лодж', setterAvatarUrl: undefined, tags: ['speed'], description: 'Белая скоростная линия.', photoUrls: [],
    rating: 4.2, ascentsCount: 90, status: 'Active', createdAt: '2026-05-30T00:00:00Z', isFavorite: false,
  },
  {
    id: 'r28', name: 'Террариум', grade: '6A', gradeIndex: 10, type: 'Boulder', holdColor: 'Green', sector: 'Зал 1', gymId: 'g5', gymName: 'Лодж',
    setterId: 's11', setterName: 'Евгений Лес', setterAvatarUrl: undefined, setterGender: 'male', tags: ['slab', 'endurance'], description: 'Зелёный боулдер на выносливость.', photoUrls: ['/mock/route28-1.jpg'],
    rating: 4.4, ascentsCount: 55, status: 'Active', createdAt: '2026-05-20T00:00:00Z', isFavorite: false,
  },
];

const MOCK_CONSENSUS: Record<string, GradeConsensus> = {
  r1: {
    routeId: 'r1',
    gradeDistribution: [
      { grade: '5C+', gradeIndex: 8, count: 2 },
      { grade: '6A', gradeIndex: 10, count: 15 },
      { grade: '6A+', gradeIndex: 11, count: 45 },
      { grade: '6B', gradeIndex: 12, count: 30 },
      { grade: '6B+', gradeIndex: 13, count: 8 },
      { grade: '6C', gradeIndex: 14, count: 2 },
    ],
    consensusGrade: '6A+',
    consensusGradeIndex: 11,
    totalVotes: 102,
    userVote: 11,
  },
  r2: {
    routeId: 'r2',
    gradeDistribution: [
      { grade: '6A', gradeIndex: 10, count: 5 },
      { grade: '6A+', gradeIndex: 11, count: 12 },
      { grade: '6B', gradeIndex: 12, count: 35 },
      { grade: '6B+', gradeIndex: 13, count: 28 },
      { grade: '6C', gradeIndex: 14, count: 10 },
      { grade: '6C+', gradeIndex: 15, count: 3 },
    ],
    consensusGrade: '6B+',
    consensusGradeIndex: 13,
    totalVotes: 93,
    userVote: 12,
  },
  r3: {
    routeId: 'r3',
    gradeDistribution: [
      { grade: '5B', gradeIndex: 5, count: 3 },
      { grade: '5C', gradeIndex: 7, count: 45 },
      { grade: '5C+', gradeIndex: 8, count: 18 },
      { grade: '6A', gradeIndex: 10, count: 4 },
    ],
    consensusGrade: '5C',
    consensusGradeIndex: 7,
    totalVotes: 70,
    userVote: 7,
  },
  r4: {
    routeId: 'r4',
    gradeDistribution: [
      { grade: '6A+', gradeIndex: 11, count: 5 },
      { grade: '6B', gradeIndex: 12, count: 18 },
      { grade: '6B+', gradeIndex: 13, count: 30 },
      { grade: '6C', gradeIndex: 14, count: 22 },
      { grade: '6C+', gradeIndex: 15, count: 5 },
      { grade: '7A', gradeIndex: 17, count: 2 },
    ],
    consensusGrade: '6B+',
    consensusGradeIndex: 13,
    totalVotes: 82,
    userVote: 14,
  },
  r5: {
    routeId: 'r5',
    gradeDistribution: [
      { grade: '4B', gradeIndex: 0, count: 1 },
      { grade: '5A', gradeIndex: 3, count: 20 },
      { grade: '5A+', gradeIndex: 4, count: 40 },
      { grade: '5B', gradeIndex: 5, count: 12 },
      { grade: '5C', gradeIndex: 7, count: 3 },
    ],
    consensusGrade: '5A+',
    consensusGradeIndex: 4,
    totalVotes: 76,
    userVote: 3,
  },
};

const MOCK_REVIEWS: Record<string, RouteReviewDto[]> = {
  r1: [
    { id: 'rev1', routeId: 'r1', userId: 'u1', displayName: 'Алексей К.', rating: 5, comment: 'Отличная трасса, очень техничная. Нависание заставило поработать над перехватами. Рекомендую всем, кто хочет прокачать динамику.', createdAt: '2026-06-10T12:00:00Z' },
    { id: 'rev2', routeId: 'r1', userId: 'u2', displayName: 'Мария С.', rating: 4, comment: 'Красная стрела — классика RockZone. Сложнее, чем кажется на первый взгляд.', createdAt: '2026-06-08T10:30:00Z' },
    { id: 'rev3', routeId: 'r1', userId: 'u3', displayName: 'Дмитрий З.', rating: 5, comment: 'Пролез за 3 попытки. Мелкие зацепки — это то, что я люблю.', createdAt: '2026-06-05T18:20:00Z' },
    { id: 'rev4', routeId: 'r1', userId: 'u4', displayName: 'Наталья Ц.', rating: 4, comment: 'Хорошая трасса, но грейд чуть занижен.', createdAt: '2026-06-01T09:00:00Z' },
    { id: 'rev5', routeId: 'r1', userId: 'u5', displayName: 'Сергей Н.', rating: 5, comment: 'Потрясающая линия! Сеттеру респект.', createdAt: '2026-05-28T14:45:00Z' },
    { id: 'rev6', routeId: 'r1', userId: 'u6', displayName: 'Ольга Б.', rating: 3, comment: 'Мне показалось слишком жёстким для 6А.', createdAt: '2026-05-25T11:10:00Z' },
    { id: 'rev7', routeId: 'r1', userId: 'u7', displayName: 'Павел Л.', rating: 4, comment: 'Динамика в середине — огонь.', createdAt: '2026-05-20T16:00:00Z' },
    { id: 'rev8', routeId: 'r1', userId: 'u8', displayName: 'Кирилл Л.', rating: 5, comment: 'Одна из лучших трасс зала.', createdAt: '2026-05-18T08:30:00Z' },
  ],
  r2: [
    { id: 'rev9', routeId: 'r2', userId: 'u1', displayName: 'Алексей К.', rating: 4, comment: 'Боулдер с крутым слоупером. Нужна сила хвата.', createdAt: '2026-06-12T13:00:00Z' },
    { id: 'rev10', routeId: 'r2', userId: 'u2', displayName: 'Мария С.', rating: 5, comment: 'Мой любимый синий мув!', createdAt: '2026-06-09T11:00:00Z' },
    { id: 'rev11', routeId: 'r2', userId: 'u3', displayName: 'Дмитрий З.', rating: 4, comment: 'Технично и силово одновременно.', createdAt: '2026-06-04T17:00:00Z' },
  ],
  r3: [
    { id: 'rev12', routeId: 'r3', userId: 'u4', displayName: 'Наталья Ц.', rating: 4, comment: 'Идеальная для работы на выносливость.', createdAt: '2026-05-15T10:00:00Z' },
  ],
  r4: [
    { id: 'rev13', routeId: 'r4', userId: 'u5', displayName: 'Сергей Н.', rating: 5, comment: 'Силовая бомба! Пинчи жгут.', createdAt: '2026-06-14T19:00:00Z' },
    { id: 'rev14', routeId: 'r4', userId: 'u6', displayName: 'Ольга Б.', rating: 4, comment: 'Крутая трасса, но грейд точно не 6С.', createdAt: '2026-06-11T15:00:00Z' },
  ],
  r5: [
    { id: 'rev15', routeId: 'r5', userId: 'u7', displayName: 'Павел Л.', rating: 4, comment: 'Лёгкий боулдер для разминки. Карманы удобные.', createdAt: '2026-05-10T09:00:00Z' },
    { id: 'rev16', routeId: 'r5', userId: 'u8', displayName: 'Кирилл Л.', rating: 5, comment: 'Отличный для начинающих.', createdAt: '2026-05-08T12:00:00Z' },
    { id: 'rev17', routeId: 'r5', userId: 'u1', displayName: 'Алексей К.', rating: 3, comment: 'Слишком просто для разминки.', createdAt: '2026-05-05T11:00:00Z' },
  ],
};

function generateConsensus(routeId: string): GradeConsensus {
  const route = MOCK_ROUTES.find((r) => r.id === routeId);
  const idx = route?.gradeIndex ?? 10;
  const grades = ['4A','4A+','4B','4B+','5A','5A+','5B','5B+','5C','5C+','6A','6A+','6B','6B+','6C','6C+','7A','7A+','7B'];
  const dist: { grade: string; gradeIndex: number; count: number }[] = [];
  for (let i = Math.max(0, idx - 3); i <= Math.min(grades.length - 1, idx + 3); i++) {
    const distance = Math.abs(i - idx);
    const count = distance === 0 ? 40 + Math.floor(Math.random() * 30) : distance === 1 ? 20 + Math.floor(Math.random() * 20) : distance === 2 ? 8 + Math.floor(Math.random() * 12) : 2 + Math.floor(Math.random() * 8);
    dist.push({ grade: grades[i], gradeIndex: i, count });
  }
  return {
    routeId,
    gradeDistribution: dist,
    consensusGrade: grades[idx],
    consensusGradeIndex: idx,
    totalVotes: dist.reduce((s, d) => s + d.count, 0),
    userVote: Math.random() > 0.5 ? idx : idx + (Math.random() > 0.5 ? -1 : 1),
  };
}

function generateReviews(routeId: string): RouteReviewDto[] {
  const names = ['Алексей К.','Мария С.','Дмитрий З.','Наталья Ц.','Сергей Н.','Ольга Б.','Павел Л.','Кирилл Л.','Евгений Л.','Анна К.'];
  const comments = ['Классная трасса, очень понравилась!','Технично и интересно.','Хороший маршрут, рекомендую.','Неожиданно сложно, но круто.','Отличная динамика!','Зацепки удобные, мувы логичные.','Сложновато для моего уровня.','Понравилось! Руки приятно устали.','Немного не хватило выносливости.','Супер, обязательно повторю.'];
  const reviews: RouteReviewDto[] = [];
  const count = 2 + Math.floor(Math.random() * 5);
  for (let i = 0; i < count; i++) {
    const idx = (i + parseInt(routeId.replace('r', ''))) % names.length;
    const daysAgo = 1 + Math.floor(Math.random() * 60);
    const date = new Date(Date.now() - daysAgo * 86400000);
    reviews.push({
      id: `${routeId}_rev${i}`,
      routeId,
      userId: `u${idx + 1}`,
      displayName: names[idx],
      rating: 3 + Math.floor(Math.random() * 3),
      comment: comments[(idx + i * 3) % comments.length],
      createdAt: date.toISOString(),
    });
  }
  return reviews;
}

export function mockGetRouteById(id: string): RouteDto | null {
  return MOCK_ROUTES.find((r) => r.id === id) || null;
}

export function mockGetRouteConsensus(routeId: string): GradeConsensus | null {
  return MOCK_CONSENSUS[routeId] || generateConsensus(routeId);
}

export function mockGetRouteReviews(routeId: string): RouteReviewDto[] {
  return MOCK_REVIEWS[routeId] || generateReviews(routeId);
}

export async function mockGetRoutesByGym(gymId: string, params?: GetRoutesParams): Promise<PaginatedList<RouteDto>> {
  await mockDelay(400);

  let items = MOCK_ROUTES.filter((r) => r.gymId === gymId);

  if (params?.type && params.type !== 'all') {
    items = items.filter((r) => r.type === params.type);
  }
  if (params?.holdColor && params.holdColor !== 'all') {
    items = items.filter((r) => r.holdColor === params.holdColor);
  }
  if (params?.minGradeIndex !== undefined) {
    items = items.filter((r) => r.gradeIndex >= (params.minGradeIndex ?? 0));
  }
  if (params?.maxGradeIndex !== undefined) {
    items = items.filter((r) => r.gradeIndex <= (params.maxGradeIndex ?? 99));
  }
  if (params?.setterId && params.setterId !== 'all') {
    items = items.filter((r) => r.setterId === params.setterId);
  }

  if (params?.sort) {
    if (params.sort === 'grade_asc') {
      items.sort((a, b) => a.gradeIndex - b.gradeIndex);
    } else if (params.sort === 'grade_desc') {
      items.sort((a, b) => b.gradeIndex - a.gradeIndex);
    } else if (params.sort === 'rating') {
      items.sort((a, b) => b.rating - a.rating);
    } else if (params.sort === 'ascents') {
      items.sort((a, b) => b.ascentsCount - a.ascentsCount);
    } else if (params.sort === 'newest') {
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }

  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
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
