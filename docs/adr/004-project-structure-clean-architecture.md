# ADR 004: Project Structure — Clean Architecture

## Статус
Active

## Дата
2026-05-29

## Контекст
Проект Cruxa требует надежной, тестируемой и поддерживаемой бэкенд-архитектуры. Требуются:
- Четкое разделение ответственности между бизнес-логикой и инфраструктурой
- Возможность независимого тестирования слоев
- Поддержка нескольких точек входа (Web API, background workers)
- Соблюдение принципа зависимости inward (внешние слои depend on внутренние)

## Рассмотренные варианты

### Вариант 1: 3-проектная структура (Api/Core/Infrastructure)
- Core содержит и Entities, и Use Cases
- Быстрее на старте, но Core неизбежно начинает зависеть от инфраструктурных пакетов
- Сложнее тестировать бизнес-логику без инфраструктурных зависимостей

### Вариант 2: 4-проектная структура (Domain/Application/Infrastructure/Api)
- **Domain**: чистые сущности, Value Objects (нулевые внешние зависимости)
- **Application**: Use Cases, DTOs, Validators, CQRS handlers
- **Infrastructure**: EF Core, Repositories, External Services
- **Api**: Controllers, Middleware, DI Composition

## Решение
**Выбран Вариант 2 — 4-проектная Clean Architecture.**

## Обоснование
- Четкие границы, соблюдение Dependency Rule
- Domain легко тестировать (нет внешних пакетов)
- Application логика изолирована от деталей persistence
- Масштабируемость: новые entry points без изменений Domain/Application
- 4 проекта: `Cruxa.Domain`, `Cruxa.Application`, `Cruxa.Infrastructure`, `Cruxa.Api`

## Последствия
- Domain не должен знать ни о каком внешнем пакете
- Application не должен зависеть от Infrastructure/Api
- Repository abstractions (interfaces) в Application/Domain, реализации в Infrastructure
- DI регистрация через extension methods в каждом слое

## Ссылки
- [Microsoft guidance on clean architecture](https://learn.microsoft.com/en-us/dotnet/architecture/)
- ADR-001: Tech Stack Selection
