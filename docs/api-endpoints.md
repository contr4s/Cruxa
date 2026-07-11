# API Endpoints — Cruxa Backend (Phase 1)

Base URL: `http://localhost:5000` (default)

> **OpenAPI Specification:** [`cruxa_api_v1.json`](./cruxa_api_v1.json) — полная машиночитаемая спецификация API в формате OpenAPI 3.1.1.

---

## Аутентификация

| Method | URL | Auth | Policy | Query | Body | Response |
|--------|-----|------|--------|-------|------|----------|
| POST | `/api/auth/register` | ❌ Anon | — | — | `RegisterCommand` | `AuthResponse` |
| POST | `/api/auth/login` | ❌ Anon | — | — | `LoginQuery` | `AuthResponse` |
| POST | `/api/auth/refresh` | ❌ Anon | — | — | `RefreshTokenCommand` | `AuthResponse` |
| PUT | `/api/auth/password` | ✅ Auth | — | — | `ChangePasswordCommand` | 204 No Content |

## Пользователи

| Method | URL | Auth | Policy | Query | Body | Response |
|--------|-----|------|--------|-------|------|----------|
| GET | `/api/users/{id}` | ✅ Auth | — | — | — | `UserDto` |
| GET | `/api/users/username/{username}` | ✅ Auth | — | — | — | `UserDto` |
| GET | `/api/users` | ✅ Auth | `Admin` | — | — | `IEnumerable<UserDto>` |
| PUT | `/api/users/{id}` | ✅ Auth | — | — | `UpdateUserCommand` | `UserDto` |
| DELETE | `/api/users/{id}` | ✅ Auth | `Admin` | — | — | 204 No Content |

## Скалодромы (Gyms)

| Method | URL | Auth | Policy | Query | Body | Response |
|--------|-----|------|--------|-------|------|----------|
| GET | `/api/gyms` | ❌ Anon | — | `page` (1), `pageSize` (10) | — | `OffsetPaginatedList<GymDto>` |
| GET | `/api/gyms` (by city) | ❌ Anon | — | `page` (1), `pageSize` (10), `city` | — | `OffsetPaginatedList<GymDto>` |
| GET | `/api/gyms/{id}` | ❌ Anon | — | — | — | `GymDto` |
| GET | `/api/gyms/cities` | ❌ Anon | — | — | — | `IEnumerable<string>` |
| POST | `/api/gyms` | ✅ Auth | `RequireGymAdmin` | — | `CreateGymCommand` | `GymDto` |
| PUT | `/api/gyms/{id}` | ✅ Auth | `RequireGymAdmin` | — | `UpdateGymCommand` | `GymDto` |
| DELETE | `/api/gyms/{id}` | ✅ Auth | `RequireAdmin` | — | — | 204 No Content |
| POST | `/api/gyms/import` | ✅ Auth | `RequireAdmin` | — | `BulkImportGymsCommand` | `BulkImportResult` |
| POST | `/api/gyms/{id}/favorite` | ✅ Auth | — | — | — | 204 No Content |
| DELETE | `/api/gyms/clear` | ✅ Auth | `RequireAdmin` | — | — | 204 No Content |

## Системы грейдов (GradingSystems)

| Method | URL | Auth | Policy | Query | Body | Response |
|--------|-----|------|--------|-------|------|----------|
| GET | `/api/grading-systems` | ❌ Anon | — | — | — | `IEnumerable<GradingSystemDto>` |
| GET | `/api/grading-systems/{id}` | ❌ Anon | — | — | — | `GradingSystemDto` |
| GET | `/api/grading-systems/gym/{gymId}` | ❌ Anon | — | — | — | `GradingSystemDto` |
| POST | `/api/grading-systems` | ✅ Auth | `RequireAdmin` | — | `CreateGradingSystemCommand` | `GradingSystemDto` |
| PUT | `/api/grading-systems/{id}` | ✅ Auth | `RequireAdmin` | — | `UpdateGradingSystemCommand` | `GradingSystemDto` |
| DELETE | `/api/grading-systems/{id}` | ✅ Auth | `RequireAdmin` | — | — | 204 No Content |

## Трассы (Routes)

| Method | URL | Auth | Policy | Query | Body | Response |
|--------|-----|------|--------|-------|------|----------|
| GET | `/api/routes` | ❌ Anon | — | `page` (1), `pageSize` (20) | — | `OffsetPaginatedList<RouteDto>` |
| GET | `/api/routes/{id}` | ❌ Anon | — | — | — | `RouteDto` |
| GET | `/api/routes/gym/{gymId}` | ❌ Anon | — | `page` (1), `pageSize` (20) | — | `OffsetPaginatedList<RouteDto>` |
| POST | `/api/routes` | ✅ Auth | `RequireRoutesetter` | — | `CreateRouteCommand` | `RouteDto` |
| PUT | `/api/routes/{id}` | ✅ Auth | `RequireRoutesetter` | — | `UpdateRouteCommand` | 204 No Content |
| PATCH | `/api/routes/{id}/deactivate` | ✅ Auth | `RequireRoutesetter` | — | — | 204 No Content |
| PATCH | `/api/routes/{id}/reactivate` | ✅ Auth | `RequireRoutesetter` | — | — | 204 No Content |
| GET | `/api/routes/{id}/consensus` | ✅ Auth | — | — | — | `GradeConsensusDto` |
| PUT | `/api/routes/{id}/feedback` | ✅ Auth | — | — | `UpdateRouteFeedbackCommand` | `RouteReviewDto` |
| DELETE | `/api/routes/{id}` | ✅ Auth | `RequireAdmin` | — | — | 204 No Content |

## Посты (Posts)

| Method | URL | Auth | Policy | Query | Body | Response |
|--------|-----|------|--------|-------|------|----------|
| GET | `/api/posts/{id}` | ❌ Anon | — | — | — | `PostDto` |
| GET | `/api/posts/user/{userId}` | ❌ Anon | — | `page` (1), `pageSize` (20) | — | `OffsetPaginatedList<PostDto>` |
| GET | `/api/posts/feed` | ✅ Auth | — | `page` (1), `pageSize` (20), `filter` (subs\|recommended) | — | `OffsetPaginatedList<PostDto>` |
| GET | `/api/posts/gym/{gymId}` | ✅ Auth | — | — | — | `IEnumerable<PostDto>` |
| GET | `/api/posts/my-draft` | ✅ Auth | — | — | — | `PostDto` (null if none) |
| POST | `/api/posts` | ✅ Auth | — | — | `CreatePostRequest` | `PostDto` |
| PUT | `/api/posts/{id}` | ✅ Auth | — | — | `CreatePostRequest` | `PostDto` |
| PUT | `/api/posts/{id}/publish` | ✅ Auth | — | — | — | 204 No Content |
| DELETE | `/api/posts/{id}` | ✅ Auth | — | — | — | 204 No Content |

## Пролазы (Ascents)

| Method | URL | Auth | Policy | Query | Body | Response |
|--------|-----|------|--------|-------|------|----------|
| GET | `/api/posts/{postId}/ascents` | ❌ Anon | — | `page` (1), `pageSize` (20) | — | `OffsetPaginatedList<AscentDto>` |
| POST | `/api/posts/{postId}/ascents` | ✅ Auth | — | — | `AddAscentCommand` | 201 Created |
| PUT | `/api/posts/{postId}/ascents/{id}` | ✅ Auth | — | — | `UpdateAscentCommand` | `AscentDto` |
| DELETE | `/api/posts/{postId}/ascents/{id}` | ✅ Auth | — | — | — | 204 No Content |
| GET | `/api/ascents/user/{userId}` | ❌ Anon | — | `page` (1), `pageSize` (20) | — | `OffsetPaginatedList<AscentDto>` |

## Отзывы о трассах (Route Reviews)

| Method | URL | Auth | Policy | Query | Body | Response |
|--------|-----|------|--------|-------|------|----------|
| GET | `/api/routes/{routeId}/reviews` | ❌ Anon | — | `page` (1), `pageSize` (20) | — | `OffsetPaginatedList<RouteReviewDto>` |
| GET | `/api/routes/{routeId}/reviews/my` | ✅ Auth | — | — | — | `RouteReviewDto` |
| POST | `/api/routes/{routeId}/reviews` | ✅ Auth | — | — | `AddRouteReviewCommand` | 201 Created |
| PUT | `/api/routes/{routeId}/reviews/{id}` | ✅ Auth | — | — | `UpdateRouteReviewCommand` | `RouteReviewDto` |
| DELETE | `/api/routes/{routeId}/reviews/{id}` | ✅ Auth | — | — | — | 204 No Content |

## Тэги (Tags)

| Method | URL | Auth | Policy | Query | Body | Response |
|--------|-----|------|--------|-------|------|----------|
| GET | `/api/routes/tags` | ❌ Anon | — | — | — | `List<string>` |

## Комментарии (Comments)

| Method | URL | Auth | Policy | Query | Body | Response |
|--------|-----|------|--------|-------|------|----------|
| GET | `/api/posts/{postId}/comments` | ❌ Anon | — | `page` (1), `pageSize` (20) | — | `OffsetPaginatedList<CommentDto>` |
| POST | `/api/posts/{postId}/comments` | ✅ Auth | — | — | `AddCommentCommand` | `CommentDto` |
| DELETE | `/api/comments/{commentId}` | ✅ Auth | — | — | — | 204 No Content |

## Лайки (Likes)

| Method | URL | Auth | Policy | Query | Body | Response |
|--------|-----|------|--------|-------|------|----------|
| POST | `/api/posts/{postId}/like` | ✅ Auth | — | — | — | 204 No Content |
| DELETE | `/api/posts/{postId}/unlike` | ✅ Auth | — | — | — | 204 No Content |

## Подписки (Followers)

| Method | URL | Auth | Policy | Query | Body | Response |
|--------|-----|------|--------|-------|------|----------|
| POST | `/api/users/{userId}/follow` | ✅ Auth | — | — | — | 204 No Content |
| DELETE | `/api/users/{userId}/follow` | ✅ Auth | — | — | — | 204 No Content |
| GET | `/api/users/{userId}/followers` | ❌ Anon | — | — | — | `List<UserDto>` |
| GET | `/api/users/{userId}/following` | ❌ Anon | — | — | — | `List<UserDto>` |
| GET | `/api/users/{userId}/is-following` | ✅ Auth | — | — | — | `bool` |

---

## Статистика (Statistics)

| Method | URL | Auth | Policy | Query | Body | Response |
|--------|-----|------|--------|-------|------|----------|
| GET | `/api/users/{id}/stats` | ✅ Auth | — | — | — | `UserStatsDto` |
| GET | `/api/users/{id}/kruskor-history` | ✅ Auth | — | `period` (year) | — | `List<KruskorPointDto>` |
| GET | `/api/users/{id}/grade-pyramid` | ✅ Auth | — | — | — | `GradePyramidDto` |
| GET | `/api/users/{id}/ascent-distribution` | ✅ Auth | — | — | — | `AscentDistributionDto` |
| GET | `/api/users/{id}/top-routes` | ✅ Auth | — | — | — | `TopRoutesDto` |
| GET | `/api/users/{id}/monthly-activity` | ✅ Auth | — | `year`, `month` | — | `MonthlyActivityDto` |
| GET | `/api/users/{id}/radar-skills` | ✅ Auth | — | — | — | `RadarSkillsDto` |
| GET | `/api/gyms/{id}/stats` | ✅ Auth | — | — | — | `GymStatsDto` |
| GET | `/api/routes/{id}/stats` | ✅ Auth | — | — | — | `RouteStatsDto` |

## Dev / Admin

| Method | URL | Auth | Policy | Query | Body | Response |
|--------|-----|------|--------|-------|------|----------|
| GET | `/api/users/me/managed-gym` | ✅ Auth | — | — | — | `GymDto` (null if none) |
| GET | `/api/dev/accounts` | ✅ Auth | — | — | — | `IEnumerable<DevAccountDto>` |

> **ℹ️ Отложено:** `POST /api/media/upload` (загрузка медиа), `GET /api/feed/suggestions` (рекомендации) — не реализованы, появятся в следующих фазах.

---

## Сводка

| Категория | Endpoints | Authenticated | Admin-only |
|-----------|-----------|---------------|------------|
| Auth | 4 | 1 | 0 |
| Users | 5 | 4 | 2 |
| Gyms | 9 | 6 | 2 |
| GradingSystems | 6 | 3 | 3 |
| Routes | 9 | 5 | 1 |
| Route Reviews | 5 | 4 | 0 |
| Dev/Admin | 2 | 2 | 0 |
| Tags | 1 | 0 | 0 |
| Posts | 10 | 7 | 0 |
| Ascents | 5 | 3 | 0 |
| Statistics | 9 | 9 | 0 |
| Comments | 3 | 2 | 0 |
| Likes | 2 | 2 | 0 |
| Followers | 5 | 3 | 0 |
| **Итого** | **75** | **43** | **8** |

## Политики авторизации

| Policy | Roles |
|--------|-------|
| `RequireAdmin` | `Admin` |
| `RequireGymAdmin` | `GymAdmin`, `Admin` |
| `RequireRoutesetter` | `Routesetter`, `GymAdmin`, `Admin` |
