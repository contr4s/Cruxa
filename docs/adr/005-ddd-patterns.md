# ADR 005: DDD Patterns (Rich Domain Model)

## Статус
Active

## Дата
2026-06-01

## Контекст
Текущая реализация Phase 1 использует Clean Architecture, но Domain слой содержит только **anemic entities** — сущности без поведения, только с геттерами/сеттерами. Бизнес-логика размазана по Application Services. Это приводит к:
- Размыванию границ бизнес-правил
- Дублированию проверок в разных сервисах
- Невозможности гарантировать целостность данных на уровне домена
- Нарушению принципа "богатой доменной модели" (DDD)

Примеры проблем:
- `User` не содержит метод `ChangePassword` — логика хэширования в AuthService
- `Route` не содержит метод `Deactivate` — сервис напрямую меняет `IsActive`
- Валидация Email размазана между Frontend и Backend без единого доменного правила

## Рассмотренные варианты

### Вариант 1: Оставить as-is (anemic entities)
- **За:** Быстрая разработка, привычный подход
- **Против:** Нарушение DDD, технический долг, сложное тестирование

### Вариант 2: Rich Domain Model (DDD)
- Принципы:
  - **Aggregate Root** — единственная точка входа для изменений в границе
  - **Value Object** — неизменяемые объекты с собственным поведением
  - **Domain Event** — реакция на важные бизнес-события
  - **Domain Service** — бизнес-логика без естественного владельца-entity
  - **Factory** — создание сложных объектов

## Решение
**Выбран Вариант 2: Rich Domain Model**

### Что внедряем:

1. **DDD Primitives** (Common/):
   - `Result<T>` monad для типобезопасных ошибок
   - `Entity<TId>` / `AggregateRoot<TId>` базовые классы
   - `ValueObject` базовый класс
   - `Guard` для защитных клауз

2. **Value Objects** (ValueObjects/):
   - `Grade` — инкапсуляция GradeRaw + GradeIndex + GradingSystemId
   - `Email` — валидация на уровне типа
   - `GeoCoordinate` — Lat/Lng + методы (DistanceTo)
   - `GradeMapping` — инкапсуляция словаря с Resolve()

3. **Rich Entities** (поведение вместо data bags):
   - `User.Create()` — фабричный метод с валидацией
   - `Route.Deactivate()` — инвариант: только неактивные могут быть удалены
   - `Gym.AddRoute()` — проверка наличия GradingSystem

4. **Domain Services** (Domain/Services/):
   - `GradeResolver` — разрешение грейда через GradingSystem

## Обоснование
- **Single Source of Truth**: бизнес-правила живут в домене, а не в сервисах
- **Тестируемость**: можно тестировать бизнес-логику без моков
- **Изоляция**: изменения в инфраструктуре не ломают бизнес-логику
- **Соответствие**: ADR-004 (Clean Architecture) предполагает богатый Domain

## Последствия
- Существующие Application Services нужно переписать для работы с Result<T>
- Контроллеры должны разворачивать Result<T> в HTTP response
- Value Objects в EF Core требуют Owned Types или Value Converters
- `Grade` VO меняет таблицу routes (GradeRaw + GradeIndex становятся внутренними)
- Репозитории остаются, но возвращают доменные объекты с поведением

## Ссылки
- [DDD Quickly (Eric Evans)](https://www.domainlanguage.com/ddd/)
- [Microsoft DDD Guidance](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/)
- ADR-001: Project Structure - Clean Architecture
