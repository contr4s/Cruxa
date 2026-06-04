# Roadmap Разработки Cruxa

Пошаговый план разработки 

## 📍 Фаза 1: Core API (Backend C#) (✅ Завершена)

### 🔧 Выполненные задачи:

| № | Задача | Статус |
|---|--------|--------|
| 1.1 | Настройка солюшена C# .NET 10 Clean Architecture (5 проектов: Api, Application, Domain, Infrastructure, Tests) | ✅ |
| 1.2 | Подключение PostgreSQL 15 + Entity Framework Core 10 (Code-First, миграции) | ✅ |
| 1.3 | Разработка структуры БД: User, Gym, Route, Post, Ascent, GradingSystem, Comment, Like, Follow и Value Objects | ✅ |
| 1.4 | Базовые CRUD-эндпоинты (Auth, Users, Gyms, Routes, Posts, Ascents, GradingSystems) с CQRS/MediatR | ✅ |
| 1.5 | Аутентификация (JWT) + ролевая модель (Climber, Routesetter, GymAdmin, Admin) + политики авторизации | ✅ |
| 1.6 | Пагинация (OffsetPaginatedList) для всех list-эндпоинтов Gym, Route, Ascent | ✅ |
| 1.7 | Rich Domain Model (AggregateRoot, Value Objects, Guard Clauses, инкапсуляция) | ✅ |
| 1.8 | Soft-delete для Route (Deactivate/Reactivate) + Admin purge | ✅ |
| 1.9 | Социальные эндпоинты: комментарии, лайки, подписки | ✅ |
| 1.10 | Полноценный API: регистрация/логин, посты (draft → publish), пролазы (Ascents) со стилем и медиа | ✅ |
| 1.11 | Валидация (FluentValidation) + Pipeline Behaviours (Validation, Logging) | ✅ |
| 1.12 | Unit + Integration тесты (xUnit, Testcontainers, FluentAssertions, Bogus) | ✅ |
| 1.13 | Docker Compose (API + PostgreSQL), Health Checks, Serilog, Scalar/OpenAPI | ✅ |

### Оставлено на будущие фазы:
- Domain Events — не требуются до Фазы 5 (Social Feed / уведомления)
- Caching / Redis — будет в Phase 2 при необходимости
- API Rate Limiting — отложено

## 📍 Фаза 2: Подготовка данных и Парсер
1. Написать скрипт парсинга (C#).
2. Собрать базу скалодромов (Название, Город, Адрес, Гео-координаты, цены, часы работы).
3. Написание сидера (Seeder) БД на бекенде для загрузки спаршенных данных.

## 📍 Фаза 3: Web-платформа (React + TS)
1. Инициализация React (Vite + TS) и интеграция Material-UI (MUI).
2. Интерфейс администратора (GymAdmin): редактирование профиля зала, таблицы данных, модерация.
3. Интерфейс рутсеттера: массовое управление трассами, мониторинг отзывов, **генерирование PDF с QR-кодами** трасс.
4. Пользовательский раздел (Climbers): каталог скалодромов, детальный просмотр трасс, дашборд-аналитика прогресса.

## 📍 Фаза 4: Mobile MVP (Flutter)
1. Инициализация Flutter проекта (Material 3) и аутентификация.
2. Поиск скалодромов (Карта/Список) и просмотр базы трасс.
3. Карточка трассы с публичными отзывами и рейтингом.
4. **Активная тренировка (Draft Mode):** Запуск камеры для сканирования QR-кода, быстрое добавление пролаза (выбор стиля, приватные заметки, медиа).
5. **Завершение тренировки (Publish Workout):** Экран курации контента, выбор медиа и публикация.

## 📍 Фаза 5: Social Features & Polish 
1. Social Feed: агрегированная лента постов (тренировок).
2. Социальные взаимодействия: лайки и комментарии к постам, подписки.
3. Графики скалолазного прогресса в профиле.
4. Деплой платформы в продакшен (Сайт, App Store, Google Play).
