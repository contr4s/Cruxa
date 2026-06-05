# Cruxa 🧗

> The ultimate social network and activity tracker for climbers.

**Phase 1 (Core API)** — ✅ Built with C# .NET 10, Clean Architecture, CQRS/MediatR, PostgreSQL.
**Phase 2 (Parser & Data)** — ✅ Gym data scraper (climbingpro.ru), bulk import API, 50+ gyms collected.

[![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql)](https://www.postgresql.org/)

---

## 🚀 Быстрый старт

```bash
# Запуск с Docker Compose (API + PostgreSQL)
docker compose up -d

# Или локально (нужна строка подключения к PostgreSQL)
dotnet run --project src/Cruxa.Api
```

API доступен по адресу `http://localhost:5000`.  
Swagger UI: `http://localhost:5000/scalar/v1`.

---

## 🏗 Архитектура

```
src/
├── Cruxa.Api           # ASP.NET Core Web API (контроллеры, middleware, DI)
├── Cruxa.Application   # CQRS (Commands/Queries), валидация, DTOs
├── Cruxa.Domain        # Богатая доменная модель (AggregateRoot, Value Objects)
├── Cruxa.Infrastructure# EF Core, JWT, репозитории, миграции
└── Cruxa.Parser        # CLI-парсер для сбора данных скалодромов (climbingpro.ru)
tests/
└── Cruxa.Tests         # Unit + Integration тесты (Testcontainers)
```

- **Clean Architecture** — строгое разделение слоёв
- **CQRS + MediatR** — команды и запросы разделены
- **DDD** — Rich Domain Model с инкапсуляцией, Guard Clauses
- **Feature Slices** — каждая фича изолирована (Commands, Handlers, Queries, DTOs)

---

## 📋 API Endpoints

Всего **57 эндпоинтов**. Полная спецификация — [`docs/api-endpoints.md`](docs/api-endpoints.md).

| Категория | Кол-во | Примеры |
|-----------|--------|---------|
| Auth | 2 | регистрация, логин |
| Users | 6 | CRUD пользователей |
| Gyms | 7 | CRUD + bulk import скалодромов |
| GradingSystems | 6 | справочник систем грейдов |
| Routes | 8 | CRUD + деактивация/реактивация трасс |
| Route Reviews | 5 | отзывы к трассам |
| Tags | 1 | список тегов трасс |
| Posts | 8 | CRUD постов, публикация, лента |
| Ascents | 5 | CRUD пролазов |
| Comments | 3 | комментарии к постам |
| Likes | 2 | лайки |
| Followers | 5 | подписки, проверка подписки |
| **Итого** | **58** | |

---

## 🛠 Технологии

| Слой | Технология |
|------|-----------|
| **Runtime** | .NET 10, ASP.NET Core |
| **Database** | PostgreSQL 15, Entity Framework Core 10 |
| **Auth** | ASP.NET Core Identity + JWT Bearer |
| **CQRS** | MediatR |
| **Validation** | FluentValidation |
| **Mapping** | Mapster |
| **Logging** | Serilog |
| **API Docs** | Scalar / OpenAPI |
| **Testing** | xUnit, Testcontainers, FluentAssertions, Bogus |
| **Container** | Docker, Docker Compose |
| **Parser** | climbingpro.ru (HtmlAgilityPack), Microsoft.Extensions.Hosting |

---

## 🧹 Парсер данных (Phase 2 ✅)

`Cruxa.Parser` — отдельный CLI-инструмент для сбора базы скалодромов с [maps.climbingpro.ru](https://maps.climbingpro.ru/). Собирает **18 полей**: название, адрес, координаты, описание, контакты, часы работы, цены, фото, метро и др.

```bash
# Сбор данных по Москве и СПб
dotnet run --project src/Cruxa.Parser -- scrape

# Загрузка собранных данных в API
dotnet run --project src/Cruxa.Parser -- seed --input data/gyms-moskva.json
```

Верифицирован вручную на 50+ реальных залах.

Подробнее: [ADR-008: Parser Architecture](docs/adr/008-parser-architecture.md)

---

## 📚 Документация

| Документ | Описание |
|----------|----------|
| [PRD](docs/PRD.md) | Идея, фичи MVP, целевая аудитория |
| [Functional Requirements](docs/FunctionalRequirements.md) | Пользовательские сценарии, роли |
| [Architecture](docs/Architecture.md) | Стек технологий и архитектурные решения |
| [Database](docs/Database.md) | Сущности и организация данных |
| [Design](docs/Design.md) | UI/UX гайдлайны, Material Design |
| [Roadmap](docs/Roadmap.md) | Пошаговый план разработки |
| [Workflow](docs/Workflow.md) | Процессы, ADR, тестирование |
| [API Endpoints](docs/api-endpoints.md) | Полная спецификация REST API |
| [ADRs](docs/adr/) | Architecture Decision Records |

---

© All Rights Reserved. This source code is provided for viewing purposes only.

