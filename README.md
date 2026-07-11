# ▲ Cruxa

> Социальная сеть и трекер активности для скалолазов.

[![.NET](https://img.shields.io/badge/.NET-10-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker)](https://docker.com/)
[![Flutter](https://img.shields.io/badge/Flutter-planned-02569B?logo=flutter)](https://flutter.dev/)

**Cruxa** — это Strava / Kaya Gyms для российских скалолазов: каталог скалодромов, трекер тренировок с единой шкалой сложности, аналитика и социальная сеть в одном продукте.

В России до сих пор нет единого инструмента, где можно найти любой скалодром, записать тренировку и отследить прогресс. Залы разбросаны по Яндекс Картам, сложность меряют кто во французской шкале, кто по V-scale, кто по цветам, а результаты тренировок хранят в заметках и Excel. Cruxa собирает всё в одном месте.

Я соло-разработчик и скалолаз — делаю продукт для себя и для сообщества. Проект участвует в хакатоне **Kodik Launchpad**.  

---

## 🧱 Возможности

| Фича | Описание |
|------|----------|
| **Каталог залов** | Скалодромы по всей России от Абакана до Ярославля, собранные парсером с climbingpro.ru. Карточка с ценами, часами работы, контактами, фото. |
| **Единая шкала сложности** | `GradeIndex` 0–1000. Любая система сложности трасс (французская, V-scale, цветовая) приводится к общему знаменателю  — можно мерить прогресс независимо от того, в какой зал пошёл. |
| **Дневник тренировок** | Draft → Publish: пришёл в зал, нажал «Начать тренировку», логируешь пролазы со стилем прохождения (Flash, Onsight, Redpoint…), потом одним постом публикуешь в ленту. Данные сохраняются на каждом шаге — потерял связь или сел телефон — ничего не пропадёт. |
| **Крускор** | Elo-подобный алгоритм, который считает интегральную силу скалолаза. Учитывает грейд трасс, стиль прохождения, давность тренировок, радар из навыков. |
| **Социальная лента** | Посты от подписок, лайки, комментарии, подписки/подписчики, настройка приватности. |
| **Аналитика** | Пирамида грейдов, радар навыков, календарь-хитмап, комбинированный график Крускор+грейд, пончик-диаграмма стилей. |
| **4 роли** | Climber — трекинг и соцсеть. Routesetter — управление трассами и статистика их прохождения. GymAdmin — управление залом. Admin — модерация системы. |

---

## 🛠 Tech Stack

| Слой | Технологии |
|------|-----------|
| **Backend** | .NET 10, ASP.NET Core, Entity Framework Core 10, MediatR, FluentValidation, Mapster, Serilog |
| **Database** | PostgreSQL 15 |
| **Auth** | ASP.NET Core Identity + JWT Bearer, Refresh Tokens |
| **Frontend** | React 19, TypeScript 6, Vite 8, MUI 9, TanStack Query 5, Zustand 5, Chart.js 4, Zod 4, React Hook Form, Framer Motion, Swiper, Axios, notistack, MSW |
| **Testing** | xUnit, Testcontainers, FluentAssertions, AutoBogus |

### Backend (C# .NET 10)

```
src/
├── Cruxa.Api           # ASP.NET Core Web API — контроллеры, middleware, DI
├── Cruxa.Application   # CQRS (Commands/Queries), FluentValidation, DTOs
├── Cruxa.Domain        # Rich Domain Model — AggregateRoot, Value Objects, Result<T>
├── Cruxa.Infrastructure# EF Core, JWT, репозитории, миграции
├── Cruxa.Parser        # CLI-парсер (climbingpro.ru → JSON → API import)
└── Cruxa.Seeder        # Наполнение БД тестовыми данными
tests/
└── Cruxa.Tests         # Unit + Integration тесты (Testcontainers, PostgreSQL)
```

- **Clean Architecture** — строгое разделение слоёв, Dependency Rule: Domain ничего не знает об инфраструктуре
- **CQRS + MediatR** — команды и запросы разделены, Pipeline Behaviors (Validation → Logging → Transaction)
- **DDD** — AggregateRoot, Result\<T\>, Guard Clauses, Value Objects (Grade, Email, GeoCoordinate)
- **Feature Slices** — код сгруппирован по бизнес-фичам (Users/, Gyms/, Routes/, Workouts/), а не по техническим слоям

### Frontend (React 19 + TypeScript)

```
frontend/src/
├── pages/          # Страницы (Landing, Climber Dashboard, Gym Detail, Route Detail, Post Detail и т.д.)
├── components/     # Переиспользуемые UI-компоненты
├── services/       # API-клиенты (Axios), запросы к бэку
├── stores/         # Zustand — клиентское состояние
├── hooks/          # Кастомные React-хуки
├── mocks/          # MSW-обработчики для разработки без бэка
├── types/          # TypeScript-типы и DTO
├── utils/          # Утилиты и хелперы
├── providers/      # React-провайдеры (QueryClient, Theme, Notification)
└── theme/          # MUI-тема (Material Design 3, тёмная)
```

- **Vite 8** — сборка
- **MUI 9** — компоненты (Material Design 3, тёмная тема)
- **TanStack Query 5** — серверное состояние
- **Zustand 5** — клиентское состояние
- **Chart.js 4** — графики и аналитика
- **Framer Motion** — анимации
- **Swiper** — карусели
- **MSW** — моки API на этапе разработки

---



## 🚀 Быстрый старт

### Docker (рекомендуется)

```bash
# 1. Скопируйте файл с переменными окружения
cp .env.example .env

# 2. Сборка и запуск всех сервисов
docker compose up --build -d

# Сервисы:
# - http://localhost:80   — фронтенд (через nginx)
# - http://localhost:5000 — API (напрямую)
# - http://localhost:5000/scalar/v1 — Scalar UI (API документация)
# - http://localhost:5433 — PostgreSQL
```

При первом запуске API автоматически применяет миграции EF Core и создаёт admin-пользователя (если настроен `AdminPasswordHash`).

### Локальный запуск (без Docker)

**Требования:** .NET 10 SDK, PostgreSQL 15, Node.js 20.

```bash
# 1. База данных
#    Создайте БД cruxa и настройте строку подключения:

# 2. API
cd backend
dotnet run --project src/Cruxa.Api

# 3. Фронтенд (в другом терминале)
cd frontend
npm install
npm run dev
```

Фронтенд будет доступен на `http://localhost:5173`, API на `http://localhost:5033`.

### Парсер данных

```bash
# Сбор данных по всем городам
dotnet run --project src/Cruxa.Parser -- scrape

# Загрузка собранных данных в API
dotnet run --project src/Cruxa.Parser -- seed --input data/gyms-moskva.json
```

Подробнее: [ADR-008: Parser Architecture](docs/adr/008-parser-architecture.md).

### Тестирование

```bash
# Запуск всех тестов
dotnet test

# Только unit-тесты
dotnet test --filter "Category=Unit"

# Только integration-тесты (требует Docker — Testcontainers поднимает PostgreSQL)
dotnet test --filter "FullyQualifiedName~Integration"
```

Проект содержит **326 тестов** (219 unit + 107 integration) — доменная логика, CQRS-хендлеры, интеграция через Testcontainers с реальной PostgreSQL.

### Переменные окружения

| Переменная | Обязательная | Где задаётся | Описание |
|-----------|-------------|-------------|----------|
| `DB_CONNECTION_STRING` | ✅ | `.env` | Строка подключения к PostgreSQL |
| `JWT_SECRET` | ✅ | `.env` | Секретный ключ JWT (32+ байт) |
| `CORS_ORIGINS` | ✅ | `.env` | Разрешённые CORS-источники |
| `ASPNETCORE_ENVIRONMENT` | ❌ | `.env` | `Development` (по умолчанию) или `Production` |
| `VITE_API_BASE_URL` | ✅ | `.env.production` | Базовый URL API для фронтенда |
| `VITE_USE_MOCK` | ❌ | `.env.development` | Включить MSW-моки (только для разработки) |

> 💡 **`.env` не хранится в репозитории.** Используйте `.env.example` как шаблон: `cp .env.example .env`.

---

## 📚 Документация

| Документ | О чём |
|----------|-------|
| [PRD](docs/PRD.md) | Концепция продукта, целевая аудитория, MVP |
| [Functional Requirements](docs/FunctionalRequirements.md) | Ролевая модель, модули, пользовательские сценарии |
| [Architecture & Tech Stack](docs/Architecture.md) | Стек, архитектурные решения, инфраструктура |
| [Database Schema](docs/Database.md) | Сущности, связи, нормализация грейдов |
| [UI/UX Design System](docs/Design.md) | Цветовая палитра, компоненты, типографика |
| [Roadmap](docs/Roadmap.md) | Статус фаз, треки, планы |
| [API Endpoints](docs/api-endpoints.md) | Полная спецификация REST API |
| [Architecture Decision Records](docs/adr/) | ADR: ключевые архитектурные решения |
| [Workflow & Agreements](docs/Workflow.md) | Стандарты, тестирование, ADR-lifecycle |

---

## 📌 Статус проекта

Проходит квалификацию хакатона **Kodik Launchpad** (июнь–июль 2026).

| Этап | Статус |
|------|--------|
| Phase 1 — Core API (74 endpoint'а, JWT, CQRS, DDD) | ✅ |
| Phase 2 — Парсер + база скалодромов (50+ городов) | ✅ |
| Phase 3 — Web-фронтенд (React 19, 15 страниц, 4 роли) | ✅ |
| Track A — Стабилизация и интеграция фронта с бэком | ✅ |
| Track B — Статистика и Крускор | ✅ |
| Track C — Социальные фичи (избранное, консенсус, заметки) | ✅ |
| Track D — Ролевые дашборды (Routesetter, GymAdmin, Admin) | ✅ |
| Phase 4 — Mobile (Flutter) | ⬜ |

---

Проект открыт для разработки и сотрудничества.
Все права на коммерческое использование сохранены за автором.
Контрибьюторы сохраняют права на свои изменения
и предоставляют владельцу проекта бессрочную,
безотзывную, неисключительную лицензию на их
использование в любой версии продукта.