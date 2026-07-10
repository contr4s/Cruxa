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

> 🔗 **Демо**: скоро  

---

## 🧱 Возможности

| Фича | Описание |
|------|----------|
| **Каталог залов** | 50+ скалодромов Москвы и СПб, собранные парсером с climbingpro.ru. Карточка с ценами, часами работы, контактами, фото. |
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
| **Testing** | xUnit, Testcontainers, FluentAssertions, Bogus |
| **Infra** | Docker, Docker Compose, nginx |
| **Planned** | Flutter (mobile), MinIO/S3 (media storage), SignalR (real-time) |

---

## 🏗 Архитектура

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

| Слой | Технологии |
|------|-----------|
| **Backend** | .NET 10, ASP.NET Core, Entity Framework Core 10, MediatR, FluentValidation, Mapster, Serilog |
| **Database** | PostgreSQL 15 |
| **Auth** | ASP.NET Core Identity + JWT Bearer, Refresh Tokens |
| **Frontend** | React 19, TypeScript 6, Vite 8, MUI 9, TanStack Query 5, Zustand 5, Chart.js 4, Zod 4, React Hook Form, Framer Motion, Swiper, Axios, notistack, MSW |
| **Testing** | xUnit, Testcontainers, FluentAssertions, Bogus |
| **Infra** | Docker, Docker Compose, nginx |
| **Planned** | Flutter (mobile), MinIO/S3 (media storage), SignalR (real-time) |

---

## 🚀 Быстрый старт

```bash
# Запуск API + PostgreSQL
docker compose up -d

# Или локально (нужна строка подключения к PostgreSQL)
dotnet run --project src/Cruxa.Api
```

API доступен по адресу `http://localhost:5000`.  
Scalar UI: `http://localhost:5000/scalar/v1`.  
OpenAPI-спецификация: [`docs/cruxa_api_v1.json`](docs/cruxa_api_v1.json).

### Парсер

```bash
# Сбор данных по Москве и СПб
dotnet run --project src/Cruxa.Parser -- scrape

# Загрузка собранных данных в API
dotnet run --project src/Cruxa.Parser -- seed --input data/gyms-moskva.json
```

Подробнее: [ADR-008: Parser Architecture](docs/adr/008-parser-architecture.md).

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
| Phase 2 — Парсер + база скалодромов (50+ залов) | ✅ |
| Phase 3 — Web-фронтенд (React 19, 9 страниц, 4 роли) | ✅ |
| Track B — Статистика и Крускор | ✅ |
| Track A/C/D/E — Интеграция фронта и бэка | 🔄 |
| Phase 4 — Mobile (Flutter) | ⬜ |

---

© All Rights Reserved. This source code is provided for viewing purposes only.

