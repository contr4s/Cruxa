# ADR 006: CQRS with MediatR

## Статус
Active

## Дата
2026-06-01

## Контекст
Текущие Application Services объединяют чтение и запись в одних и тех же классах. Это приводит к:
- Контроллеры зависят от конкретных сервисов, а не от абстракций команда/запрос
- Трудно добавить cross-cutting concerns (логирование, валидация, транзакции) без дублирования
- Pipeline поведения (pipeline) не разделён

## Рассмотренные варианты

### Вариант 1: Service Layer (as-is)
Текущие сервисы: IUserService/UserService, IGymService/GymService, и т.д.

### Вариант 2: CQRS с MediatR
- Commands (изменения) и Queries (чтение) — отдельные классы
- Обработчики реализуют интерфейсы IRequestHandler
- Pipeline Behaviors для сквозных задач (валидация, транзакции, логирование)

## Решение
**Выбран Вариант 2: CQRS с MediatR**

### Структура:
```
Features/{Feature}/
├── Commands/{Command}Command.cs + {Command}Handler.cs
├── Queries/{Query}Query.cs + {Query}Handler.cs
├── Validators/{Command}Validator.cs
└── DTOs/{Dto}.cs
```

### Pipeline Behaviors:
1. **ValidationBehavior** — FluentValidation до команды
2. **TransactionBehavior** — unit of work для команд
3. **LoggingBehavior** — логирование каждого запроса

## Обоснование
- Чёткое разделение команды/запросы
- Pipeline Behaviors для cross-cutting concerns
- Контроллеры работают через единый интерфейс IMediator
- Легко тестировать каждый handler изолированно

## Последствия
- Существующие сервисы разбиваются на отдельные Command/Query классы
- Контроллеры получают IMediator вместо специфичных сервисов
- AutoMapper заменяется на Mapster
- FluentValidation подключается через PipelineBehavior

## Ссылки
- [MediatR GitHub](https://github.com/jbogard/MediatR)
- ADR-005: DDD Patterns
- ADR-007: Feature Slices Architecture
