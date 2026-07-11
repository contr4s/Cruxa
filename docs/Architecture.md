# Architecture & Tech Stack

## 🧱 Основной Стек
- **Backend Core:** C# .NET 10 (ASP.NET Core Web API)
- **Frontend (Web):** React 19, TypeScript 6, Material-UI (MUI 9)
- **Database:** PostgreSQL 15 (с перспективой PostGIS для гео-запросов)
- **ORM:** Entity Framework Core 10

## 🏗 Архитектура Системы

### 1. Backend Service (C# .NET 10)
- **Тип архитектуры:** Clean Architecture (6 проектов: Domain / Application / Infrastructure / Api / Parser / Seeder).
- **API:** RESTful API + OpenAPI (Scalar UI).
- **Аутентификация:** JWT на базе ASP.NET Core Identity. Refresh Tokens.
- **CQRS:** MediatR с Pipeline Behaviors (Validation → Logging → Transaction).
- **Domain:** Rich Domain Model — AggregateRoot, Value Objects, Result\<T\>, Guard Clauses.

### 2. Web Frontend (React 19 + TypeScript)
- **Сборка:** Vite 8.
- **UI:** MUI 9 (Material Design 3, тёмная тема).
- **Состояние:** TanStack React Query (серверное), Zustand (клиентское).
- **Формы:** React Hook Form + Zod.
- **Графики:** Chart.js + react-chartjs-2.
- **Анимации:** Framer Motion.
- **Карусели:** Swiper.
- **Уведомления:** notistack.
- **HTTP:** Axios.
- **Моки:** MSW (на этапе разработки).

### 3. Парсер Данных (`Cruxa.Parser`)
- **CLI Console App** на C# .NET 10, отдельный проект в солюшене.
- Источник данных: **maps.climbingpro.ru** (каталог скалодромов России, HTML-парсинг через HtmlAgilityPack).
- Координаты: извлекаются из `/data.json` (GeoJSON) с каждой страницы скалодрома.
- **18 полей сбора:** название, город, адрес, координаты, описание, телефон, email, соцсети, сайт, часы работы, цены, фото, площадь стен, макс. высота, год основания, метро, теги.
- Верифицирован вручную на 50+ реальных залах Москвы и Санкт-Петербурга.
- Команды: `scrape` (сбор → JSON), `seed` (JSON → REST API).
- Парсер независим от API: общается с ним через HTTP, проходит полный слой валидации.
- Подробнее: [ADR-008](adr/008-parser-architecture.md).

### ☁️ Инфраструктура и Хранение
- **Контейнеризация:** Docker + Docker Compose.
- **Reverse Proxy:** nginx.
- **Хостинг:** VPS (Timeweb / Yandex Cloud / DigitalOcean).
- **Хранилище медиа (аватарки, фото трасс):** не реализовано (в планах — MinIO / S3 / Yandex Object Storage).

---

## 📱 Planned: Mobile App (Flutter)

Мобильное приложение на Flutter с Material 3:
- State Management: BLoC или Riverpod.
- QR-сканер для быстрой отметки трассы на стене.
- Запись пролазов, публикация тренировок, лента, профиль.

Разработка мобильного клиента не начата (Phase 4).

---

## 🔮 Planned: Real-time, Search, Media

- **SignalR** — real-time уведомления (лайки, комментарии, подписки).
- **Elasticsearch / Full-text search** — поиск по залам, трассам, пользователям.
- **MinIO / S3** — загрузка и хранение медиа.
- **Redis** — кэширование статистики и ленты.
