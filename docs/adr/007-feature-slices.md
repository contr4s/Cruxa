# ADR 007: Feature Slices Architecture

## Статус
Active

## Дата
2026-06-01

## Контекст
Текущая структура Application группирует код по **техническим слоям** (Services, DTOs, Validators, Repositories). Это приводит к:
- Разбросанной кодовой базе (файлы для одной фичи разбросаны по папкам Services, DTOs, Validators)
- Сложности навигации и понимания границ фичи
- Проблемы с командой: сложно понять, что относится к одной фиче

Текущая структура:
```
Application/
├── DTOs/UserDto.cs, GymDto.cs, RouteDto.cs, ...
├── Interfaces/IUserService.cs, IGymService.cs, ...
├── Services/UserService.cs, GymService.cs, RouteService.cs, ...
└── Mappings/MappingProfile.cs
```

## Рассмотренные варианты

### Вариант 1: Оставить слой-ориентированную структуру
- Плюсы: знакомый паттерн
- Минусы: poor locality, сложно найти все связанные файлы

### Вариант 2: Feature Slices (Group by Business Capability)
- Каждая бизнес-фича (Users, Gyms, Routes, Auth) имеет свою папку
- Внутри папки фичи: Commands, Queries, Validators, Handlers, DTOs
- Infrastructure тоже organized by feature
- **Плюсы**:
  - High cohesion внутри фичи
  - Easy navigation: всё для Users в одной папке
  - Clear boundaries и module boundaries
  - Поддержка modular monolith в будущем

### Вариант 3: Vertical Slices (Full end-to-end пайплайны)
- Еще более радикальный вариант: контроллеры+сервисы+репозитории на одной папке
- Слишком высокое зацепление, сложно соблюдать layered architecture

## Принятое решение
Выбран **Вариант 2 — Feature Slices** с балансом между cohesion и соблюдением слоев.

## Обоснование
- **Навигация**: чтобы найти весь код для "Users" — заходим в Features/Users/
- **Границы фичи**: четкая граница между Gyms и Routes
- **Соответствие CQRS**: Commands/Queries внутри одной фичи
- **Масштабируемость**: можно выделить фичу в отдельный microservice позже

## Новая структура

### Application (после CQRS):
```
src/Cruxa.Application/
├── Features/
│   ├── Users/
│   │   ├── Commands/
│   │   │   ├── RegisterCommand.cs
│   │   │   ├── UpdateProfileCommand.cs
│   │   │   └── DeleteUserCommand.cs
│   │   ├── Queries/
│   │   │   ├── GetUserByIdQuery.cs
│   │   │   ├── GetUserByUsernameQuery.cs
│   │   │   └── SearchUsersQuery.cs
│   │   ├── Validators/
│   │   │   ├── RegisterCommandValidator.cs
│   │   │   └── UpdateProfileValidator.cs
│   │   ├── Handlers/
│   │   │   ├── RegisterHandler.cs
│   │   │   ├── GetUserByIdHandler.cs
│   │   │   └── ...
│   │   └── DTOs/
│   │       ├── UserDto.cs
│   │       └── RegisterRequest.cs
│   ├── Gyms/
│   │   ├── Commands/
│   │   ├── Queries/
│   │   ├── Validators/
│   │   ├── Handlers/
│   │   └── DTOs/
│   ├── Routes/
│   │   ├── Commands/
│   │   ├── Queries/
│   │   ├── Validators/
│   │   ├── Handlers/
│   │   └── DTOs/
│   ├── Posts/
│   │   ├── Commands/
│   │   ├── Queries/
│   │   ├── Validators/
│   │   ├── Handlers/
│   │   └── DTOs/
│   └── Auth/
│       ├── Commands/
│       ├── Queries/
│       ├── Validators/
│       ├── Handlers/
│       └── DTOs/
├── Common/
│   ├── Interfaces/ (IUnitOfWork, ICurrentUser, etc.)
│   ├── Behaviors/ (MediatR pipeline behaviors)
│   ├── Results/ (Result<T>, Error)
│   └── Services/ (Domain Services, Date/Time provider)
└── DI/ServiceCollectionExtensions.cs
```

### Infrastructure:
```
src/Cruxa.Infrastructure/
├── Features/
│   ├── Users/Repositories/UserRepository.cs
│   ├── Gyms/Repositories/GymRepository.cs
│   ├── Routes/Repositories/RouteRepository.cs
│   ├── Posts/Repositories/PostRepository.cs
│   └── Common/ (per-feature configs, helpers)
├── Common/
│   ├── Persistence/
│   │   ├── CruxaDbContext.cs
│   │   ├── Configurations/ (Entity configurations — one file per entity inside feature или centralized?)
│   │   └── UnitOfWork.cs
│   └── Security/JwtTokenGenerator.cs
└── DI/ServiceCollectionExtensions.cs
```

### Api:
```
src/Cruxa.Api/
├── Features/
│   ├── Users/UsersController.cs
│   ├── Gyms/GymsController.cs
│   ├── Routes/RoutesController.cs
│   └── Auth/AuthController.cs
├── Common/
│   ├── Middleware/
│   │   ├── ExceptionHandlingMiddleware.cs
│   │   ├── ValidationExceptionMiddleware.cs
│   │   └── CurrentUserMiddleware.cs
│   └── Filters/ (Action filters, exception filters)
└── Program.cs
```

## Последствия
- Требует миграции текущей кодовой базы (Services → Features)
- DI регистрация по фичам или сбор всего через反射
- Тесты нужно реорганизовать в parallel structure
- Возможен конфликт namespaces при перемещении файлов

## Миграция шаг за шагом
1. НЕ менять старые файлы сразу — создавать новые по новому паттерну
2. Переносить фичи по одной (например, сначала Users)
3. Обновлять Controllers после создания handlers
4. Удалять старые файлы после миграции

## Связанные ADR
- [001](001-tech-stack-selection.md) — Tech Stack
- [004](004-project-structure-clean-architecture.md) — Clean Architecture
- [005](005-ddd-patterns.md) — DDD Patterns
- [006](006-cqrs-mediatr.md) — CQRS с MediatR
