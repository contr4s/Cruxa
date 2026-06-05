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
- Caching / Redis — отложено до необходимости
- API Rate Limiting — отложено
- Unit-тесты парсера — верификация проведена вручную на реальных данных

## 📍 Фаза 2: Подготовка данных и Парсер (✅ Завершена)

### 🎯 Цель
Решить проблему холодного старта — собрать начальную базу скалодромов Москвы и СПб с помощью парсера climbingpro.ru.

### 🔧 План реализации

| № | Задача | Статус |
|---|--------|--------|
| 2.1 | Создание `Cruxa.Parser` (Console App CLI) + Scrape-команда для climbingpro.ru | ✅ |
| 2.2 | `BulkImportGymsCommand` + handler в Application слое (валидация, дедупликация, batch insert) | ✅ |
| 2.3 | API endpoint `POST /api/gyms/import` (Admin-only) | ✅ |
| 2.4 | Seed-команда в Parser (JSON → API через JWT) | ✅ |
| 2.5 | Верификация парсера на реальных данных (50+ залов Москвы и СПб, ручная проверка всех полей) | ✅ |
| 2.6 | Первичный прогон (scrape Москвы + СПб → seed → верификация) | ✅ |
| 2.7 | Документация (ADR, README, Architecture, api-endpoints) | ✅ |

### 📋 Детальное описание

**Парсер:** Отдельный CLI-проект `Cruxa.Parser` (C# .NET 10), который:
- Парсит **maps.climbingpro.ru** (HtmlAgilityPack) — каталог скалодромов России
- Собирает данные по Москве и Санкт-Петербургу
- Извлекает координаты из `/data.json` (GeoJSON) каждой страницы скалодрома
- Сохраняет результат в JSON (`data/gyms-{city}.json`)
- Содержит seed-команду для загрузки JSON через REST API

**API Import:** Новый эндпоинт `POST /api/gyms/import` (только для Admin):
- Принимает массив скалодромов (`BulkImportGymsCommand`)
- Валидирует каждый скалодром
- Дедуплицирует по Name+City
- Сохраняет с флагом `IsParsed = true`
- Возвращает статистику (Imported / Skipped / Errors)

**Что собираем (18 полей):** Название, город, адрес, координаты (lat/lon), описание, телефон, email, соцсети (VK/YouTube/Instagram), сайт, часы работы, цены, фото, площадь стен (м²), макс. высота (м), год основания, станции метро, теги.
**Источник:** [maps.climbingpro.ru](https://maps.climbingpro.ru/) — HTML-парсинг (HtmlAgilityPack) + GeoJSON для координат.
**Верификация:** Ручная проверена на 50+ реальных залах Москвы и Санкт-Петербурга.

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
