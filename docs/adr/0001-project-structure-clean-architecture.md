---
name: project-structure-clean-architecture
description: Choosing 4-project Clean Architecture layout over 3-project Core approach
metadata:
  type: reference
---

# ADR: Adoption of Clean Architecture (Domain/Application/Infrastructure/Api)

## Контекст

Проект Cruxa требует надежной, тестируемой и поддерживаемой бэкенд-архитектуры для социальной платформы скалолазов. Требуются:

- Четкое разделение ответственности между бизнес-логикой и инфраструктурой
- Возможность независимого тестирования слоев
- Поддержка нескольких точек входа (Web API, возможно в будущем gRPC/background workers)
- Соблюдение принципа зависимости inward (внешние слои depend on внутренние, но не наоборот)

Текущая структура в репозитории (`Cruxa.Api`, `Cruxa.Core`, `Cruxa.Infrastructure`) содержит пустую папку `Core`, которая предполагает объединение Domain и Application слоев.

## Рассмотренные варианты

### Вариант 1: 3-проектная структура (Api/Core/Infrastructure)

- **Core** содержит и Entities, и Use Cases
- Более простая на первый взгляд, меньше проектов
- **Недостаток**: Core inevitably начинает зависит от инфраструктурных пакетов (EF Core, AutoMapper и т.д.), нарушая чистоту архитектуры
- Сложнее тестировать бизнес-логику без подтягивания инфраструктурных зависимостей
- Не соответствует современным рекомендациям Clean Architecture/Onion/EA

### Вариант 2: 4-проектная структура (Domain/Application/Infrastructure/Api)

- **Domain**: чистые сущности, Value Objects, Domain Services (нулекие внешние зависимости)
- **Application**: Use Cases, DTOs, Validators, Mapping Profiles (зависит только от Domain + cross-cutting libs)
- **Infrastructure**: EF Core, Repositories, External Services (зависит от Domain и Application)
- **Api**: Controllers, Middleware, DI Composition (зависит от Application и Infrastructure)
- **Преимущества**:
  - Четкие границы, соблюдение Dependency Rule
  - Domain легко тестировать (нет внешних пакетов)
  - Application логика изолирована от деталей persistence
  - Масштабируемость: можно добавить новые entry points без изменений Domain/Application
  - Соответствует рекомендациям Microsoft, community best practices (2024-2025)

## Принятое решение

**Выбран Вариант 2 — 4-проектная Clean Architecture.**

Создаем следующие проекты:

1. `Cruxa.Domain` — нет внешних NuGet пакетов
2. `Cruxa.Application` — зависимости: `AutoMapper`, `FluentValidation` (опционально `MediatR`)
3. `Cruxa.Infrastructure` — зависимости: `Microsoft.EntityFrameworkCore`, `Npgsql.EntityFrameworkCore.PostgreSQL`, `Microsoft.EntityFrameworkCore.Tools`
4. `Cruxa.Api` — зависимости: `Microsoft.AspNetCore.Authentication.JwtBearer`, `Swashbuckle.AspNetCore`, `Microsoft.AspNetCore.Mvc.Versioning`
5. `Cruxa.Tests` — зависимости: `xunit`, `Moq`, `FluentAssertions`, `Testcontainers`, `Microsoft.AspNetCore.Mvc.Testing`

## Обоснование

- **Соблюдение принципов DDD и Clean Architecture**: inner circles (Domain/Application) остаются чистыми от инфраструктурных concerns.
- **Тестируемость**: Domain-тесты не требуют никаких mocking сложных инфраструктурных сервисов; Application-тесты мокают repositories; Infrastructure-тесты используют реальную БД через Testcontainers.
- **Поддержка и расширение**: Четкие границы облегчают on-boarding новых разработчиков и внесение изменений.
- **Интеграция с современным стеком**: EF Core 8, PostgreSQL, Npgsql, JWT, AutoMapper, FluentValidation — все интегрируются естественно в эту структуру.
- **AlIGNMENT с Roadmap**: В Phase 1 нам нужно быстро итерировать и писать тесты; чистая архитектура обеспечивает rapid development without technical debt accumulation.

## Последствия

- Требуется начальный overhead по созданию нескольких проектов и настройке ссылок между ними.
- Команда должна придерживаться правил: Domain не должен знакографировать ни с одним внешним пакетом, Application не должен зависеть от Infrastructure/Api.
- Необходимо использовать Dependency Injection и repository abstractions (interfaces in Application/Domain, implementations in Infrastructure).

## Ссылки

- [Microsoft guidance on clean architecture](https://learn.microsoft.com/en-us/dotnet/architecture/)
- [EF Core with Clean Architecture patterns](https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures/)
- Database.md, FunctionalRequirements.md (определяют Entities)
