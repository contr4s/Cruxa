# Architecture Decision Records (ADR)

Этот документ содержит индекс всех архитектурных решений проекта Cruxa.

## Active ADR

| ADR | Title | Status | Date | Description |
|-----|-------|--------|------|-------------|
| [001](001-tech-stack-selection.md) | Tech Stack Selection | Active | 2026-05-29 | .NET 10, PostgreSQL, React, Flutter |
| [002](002-grade-normalization.md) | Grade Normalization | Active | 2026-05-29 | Нормализация грейдов через GradeIndex |
| [003](003-workout-aggregation.md) | Workout Aggregation | Active | 2026-05-29 | Агрегация Post + Ascent |
| [004](004-project-structure-clean-architecture.md) | Clean Architecture | Active | 2026-05-29 | Domain/Application/Infrastructure/Api |
| [005](005-ddd-patterns.md) | DDD Patterns | Active | 2026-06-01 | Value Objects, Aggregates, Domain Events |
| [006](006-cqrs-mediatr.md) | CQRS with MediatR | Active | 2026-06-01 | Commands/Queries separation |
| [007](007-feature-slices.md) | Feature Slices | Active | 2026-06-01 | Группировка по бизнес-фичам |
| [008](008-parser-architecture.md) | Parser Architecture | Active | 2026-06-04 | CLI-парсер + API import endpoint |

## ADR Lifecycle

| Status | Meaning |
|--------|---------|
| **Active** | Текущее решение, в силе |
| **Proposed** | Предложено, но ещё не принято |
| **Superseded** | Заменено другой версией/ADR |
| **Deprecated** | Отклонено или устарело |

## ADR Template

Каждый ADR файл должен содержать:
- Контекст (проблема)
- Рассмотренные варианты
- Принятое решение
- Обоснование
- Последствия

---

*ADR-001...ADR-007 (sequential numbering)*
