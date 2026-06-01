---
name: efcore-postgresql-configuration
description: Entity Framework Core configuration patterns for PostgreSQL with JSONB and arrays
metadata:
  type: reference
---

# ADR: EF Core + PostgreSQL Configuration Patterns

## Контекст

Проект Cruxa использует PostgreSQL как основную БД. Сущности требуют:
- Хранение enum как строк (читаемость) или int (компактность)
- JSONB-колонки для сложных типов (`Prices`, `WorkingHours`, `GradeMapping`, `Tags`)
- Массивы строк (`PhotoUrls`, `MediaUrls`, `Tags`)
- Гео-координаты (`Latitude`, `Longitude` — опционально PostGIS в будущем)

## Рассмотренные варианты

### Enum хранение

| Вариант | Плюсы | Минусы |
|---------|-------|--------|
| **String** | Читаемость в БД, easy debugging | Больше места, case-sensitivity risks |
| **Integer** | Компактность, скорость | Неочевидно при прямых запросах к БД |

### JSONB vs Отдельные таблицы

| Вариант | Плюсы | Минусы |
|---------|-------|--------|
| **JSONB** | Гибкость, schema-less, нет дополнительных таблиц | Сложнее индексация, валидация |
| **Отдельные таблицы** | Структурированность, foreign keys | Overhead, сложнее миграции |

## Принятое решение

### Enum mapping
- **Role enum** → хранить как **string** (читаемость критична для ролей)
- **RouteType, AscentStyle, PostVisibility, PostStatus** → хранить как **string**
- Использовать `HasConversion<string>()` в Fluent API

### JSONB columns
Следующие поля хранить как JSONB:
- `Gym.Prices` — гибкая структура цен
- `Gym.WorkingHours` — расписание по дням недели
- `GradingSystem.GradeMapping` — словарь маппинга грейдов

Использовать `HasColumnType("jsonb")` с `HasDefaultValueSql("'{}'::jsonb")`

### Array columns
- `Gym.PhotoUrls` → `text[]`
- `Route.PhotoUrls` → `text[]`
- `Route.Tags` → `text[]`
- `Post.MediaUrls` → `text[]`
- `Ascent.MediaUrls` → `text[]`

Npgsql автоматически поддерживает `string[]` → `text[]`. Использовать `HasColumnType("text[]")` при необходимости.

### Критические индексы
- `User.Email` — unique index
- `User.Username` — unique index
- `Gym.City` — index для поиска по городу
- `Route.GymId` — index для фильтрации трасс по залу
- `Post.UserId, Post.CreatedAt` — composite index для ленты
- `Ascent.RouteId` — index для статистики трассы

## Обоснование

- **Enum как string**: Роли и типы критичны для читаемости в logs и прямых SQL запросах при отладке.
- **JSONB для сложных объектов**: Цены и часы работы могут варьироваться между залами; JSONB даёт гибкость без schema migrations.
- **PostgreSQL arrays**: Естественная поддержка в Npgsql, эффективнее чем JSONB для простых массивов строк.

## Примеры конфигурации

```csharp
// Enum as string
builder.Property(u => u.Role)
    .HasConversion<string>()
    .HasMaxLength(20);

// JSONB column
builder.Property(g => g.Prices)
    .HasColumnType("jsonb")
    .HasDefaultValueSql("'{}'::jsonb");

// Array column
builder.Property(r => r.Tags)
    .HasColumnType("text[]");
```

## Последствия

- Требуется Npgsql.EntityFrameworkCore.PostgreSQL пакет
- Миграции будут использовать PostgreSQL-specific синтаксис
- При необходимости полнотекстового поиска по JSONB — добавить GIN индексы
