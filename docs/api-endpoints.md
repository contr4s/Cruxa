# API Endpoints — Cruxa Backend (Phase 1)

Base URL: `http://localhost:5000` (default)

> **OpenAPI Specification:** [`cruxa_api_v1.yaml`](./cruxa_api_v1.yaml) — полная машиночитаемая спецификация API в формате OpenAPI 3.1.1.

---

## Аутентификация

| Method | URL | Auth | Policy | Query | Body | Response |
|--------|-----|------|--------|-------|------|----------|
| POST | `/api/auth/register` | ❌ Anon | — | — | `RegisterCommand` | `AuthResponse` |
| POST | `/api/auth/login` | ❌ Anon | — | — | `LoginQuery` | `AuthResponse` |

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
| GET | `/api/gyms` | ❌ Anon | — | `page` (1), `pageSize` (20) | — | `OffsetPaginatedList<GymDto>` |
| GET | `/api/gyms/{id}` | ❌ Anon | — | — | — | `GymDto` |
| GET | `/api/gyms/city/{city}` | ❌ Anon | — | `page` (1), `pageSize` (20) | — | `OffsetPaginatedList<GymDto>` |
| POST | `/api/gyms` | ✅ Auth | `RequireGymAdmin` | — | `CreateGymCommand` | `GymDto` |
| PUT | `/api/gyms/{id}` | ✅ Auth | `RequireGymAdmin` | — | `UpdateGymCommand` | `GymDto` |
| DELETE | `/api/gyms/{id}` | ✅ Auth | `RequireAdmin` | — | — | 204 No Content |

## Системы грейдов (GradingSystems)

| Method | URL | Auth | Policy | Query | Body | Response |
|--------|-----|------|--------|-------|------|----------|
| GET | `/api/grading-systems` | ❌ Anon | — | — | — | `IEnumerable<GradingSystemDto>` |
| GET | `/api/grading-systems/{id}` | ❌ Anon | — | — | — | `GradingSystemDto` |
| GET | `/api/grading-systems/gym/{gymId}` | ❌ Anon | — | — | — | `GradingSystemDto` |

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
| DELETE | `/api/routes/{id}` | ✅ Auth | `RequireAdmin` | — | — | 204 No Content |

## Посты (Posts)

| Method | URL | Auth | Policy | Query | Body | Response |
|--------|-----|------|--------|-------|------|----------|
| GET | `/api/posts/{id}` | ❌ Anon | — | — | — | `PostDto` |
| GET | `/api/posts/user/{userId}` | ❌ Anon | — | — | — | `IEnumerable<PostDto>` |
| GET | `/api/posts/feed` | ✅ Auth | — | `page` (1), `pageSize` (20) | — | `IEnumerable<PostDto>` |
| GET | `/api/posts/gym/{gymId}` | ❌ Anon | — | — | — | `IEnumerable<PostDto>` |
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

## Комментарии (Comments)

| Method | URL | Auth | Policy | Query | Body | Response |
|--------|-----|------|--------|-------|------|----------|
| GET | `/api/posts/{postId}/comments` | ❌ Anon | — | — | — | `IEnumerable<CommentDto>` |
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
| GET | `/api/users/{userId}/followers` | ❌ Anon | — | — | — | `IEnumerable<Guid>` |
| GET | `/api/users/{userId}/following` | ❌ Anon | — | — | — | `IEnumerable<Guid>` |

---

## Сводка

| Категория | Endpoints | Authenticated | Admin-only |
|-----------|-----------|---------------|------------|
| Auth | 2 | 0 | 0 |
| Users | 5 | 4 | 2 |
| Gyms | 6 | 3 | 1 |
| GradingSystems | 3 | 0 | 0 |
| Routes | 8 | 4 | 1 |
| Posts | 8 | 5 | 0 |
| Ascents | 5 | 3 | 0 |
| Comments | 3 | 2 | 0 |
| Likes | 2 | 2 | 0 |
| Followers | 4 | 2 | 0 |
| **Итого** | **46** | **25** | **4** |

## Политики авторизации

| Policy | Roles |
|--------|-------|
| `RequireAdmin` | `Admin` |
| `RequireGymAdmin` | `GymAdmin`, `Admin` |
| `RequireRoutesetter` | `Routesetter`, `GymAdmin`, `Admin` |
