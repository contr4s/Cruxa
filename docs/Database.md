# Database Schema

Используем реляционную базу данных **PostgreSQL**.

## 📊 Основные Сущности (Entities)

### 1. `User` (Пользователь)
- `Id` (UUID)
- `Username` (string)
- `Email` (string)
- `AvatarUrl` (string)
- `City` (string) *Город проживания для локализированной ленты и фильтров*
- `Role` (enum: Climber, Routesetter, GymAdmin, Admin)
- `CreatedAt` (timestamp)
- *Пароль хранится в отдельной сущности `PasswordCredential` (1:1)*

### 1a. `PasswordCredential` (Учётные данные)
- `Id` (UUID)
- `UserId` (FK -> User, unique)
- `PasswordHash` (string)
- `CreatedAt` (timestamp)

### 1b. `RefreshToken` (Токен обновления JWT)
- `Id` (UUID)
- `UserId` (FK -> User)
- `Token` (string, unique)
- `ExpiresAt` (timestamp)
- `CreatedAt` (timestamp)
- `RevokedAt` (timestamp, nullable)

### 1c. `ExternalCredential` (Внешняя аутентификация — для будущего OAuth)
- `Id` (UUID)
- `UserId` (FK -> User)
- `Provider` (string) *Например: "Google", "VK"*
- `ProviderId` (string) *ID пользователя у провайдера*
- `CreatedAt` (timestamp)

### 2. `Gym` (Скалодром)
- `Id` (UUID)
- `Name` (string)
- `Description` (text)
- `City` (string) *Город для удобного поиска и списков*
- `Address` (string)
- `Latitude` (double)
- `Longitude` (double)
- `ContactInfo` (string)
- `Website` (string) *Ссылка на официальный сайт или соцсети*
- `Prices` (text / jsonb) *Информация о ценах на разовые посещения и абонементы*
- `WorkingHours` (jsonb) *Часы работы (расписание по дням недели)*
- `PhotoUrls` (string[]) *Список ссылок на фотографии скалодрома*
- `GradingSystemId` (FK -> GradingSystem) *Привязка к системе оценок, используемой в зале*
- `IsParsed` (boolean) - *Означает, добавлено ли автоматически парсером или подтверждено админом/владельцем.*

### 3. `GradingSystem` (Система оценок)
- `Id` (UUID)
- `Name` (string) *Название системы (например: "Французская боулдеринговая", "Limestone Colors")*
- `GradeMapping` (jsonb) *Маппинг "Отображаемое название (GradeRaw)" -> "Индекс сложности (GradeIndex)". Пример: { "6A": 400, "Красная": 650 }*

### 4. `Route` (Трасса на скалодроме)
- `Id` (UUID)
- `GymId` (FK -> Gym)
- `AuthorId` (FK -> User, nullable) *Рутсеттер*
- `GradeRaw` (string) *Оригинальная сложность от админа (выбирается из справочника GradingSystem)*
- `GradeIndex` (int) *Нормализованная средняя сложность (0–1000) для статистики*
- `Type` (enum: Bouldering, Lead, Speed)
- `HoldColor` (enum: 11 цветов + мультиколор) *Цвет зацепок*
- `PhotoUrls` (string[]) *Опционально. Фотографии трассы*
- `Tags` (string[]) *Теги стиля трассы через связь с сущностью `Tag`*
- `Sector` (string) *Опционально. Название зоны на скалодроме или расположение*
- `IsActive` (boolean) *Скручена трасса или нет*

### 5. `Post` (Тренировка / Отчет о посещении)
- `Id` (UUID)
- `UserId` (FK -> User)
- `GymId` (FK -> Gym)
- `Description` (text) *Текст поста, впечатления о тренировке*
- `MediaUrls` (string[]) *Список ссылок на фото (в будущем и видео) с тренировки*
- `Visibility` (enum: Public, Followers, Private) *Настройки приватности поста*
- `Status` (enum: Draft, Published) *Черновик (дополняется во время тренировки) или финальный пост*
- `CreatedAt` (timestamp)

### 6. `Ascent` (Пролаз / Отметка о прохождении)
- `Id` (UUID)
- `PostId` (FK -> Post) *Привязка к конкретному посту-тренировке*
- `UserId` (FK -> User)
- `RouteId` (FK -> Route)
- `Style` (enum: Onsight, Flash, Redpoint, TopRope, Attempt, Project, Repeat)
- `MediaUrls` (string[]) *Опционально. Фото/видео конкретного пролаза*
- `CreatedAt` (timestamp)

### 7. `RouteReview` (Отзыв о трассе)
- `Id` (UUID)
- `RouteId` (FK -> Route)
- `UserId` (FK -> User)
- `Rating` (int) *Опционально. Оценка трассы от 1 до 5*
- `PrivateNotes` (text) *Опционально. Приватные заметки (расклад трассы, ключевые движения — видно только себе)*
- `PublicReview` (text) *Опционально. Публичный отзыв о трассе (виден рутсеттерам и другим скалолазам)*
- `CreatedAt` (timestamp)
- `UpdatedAt` (timestamp) *Опционально. Дата обновления отзыва*
- *Уникальное ограничение: один пользователь — один отзыв на трассу (RouteId + UserId)*

### 8. `Follower` (Социальные связи)
- `FollowerId` (FK -> User)
- `FolloweeId` (FK -> User)
- `CreatedAt` (timestamp)

### 9. `Like` (Лайк поста)
- `Id` (UUID)
- `PostId` (FK -> Post)
- `UserId` (FK -> User)
- `CreatedAt` (timestamp)
- *Уникальное ограничение: один пользователь — один лайк на пост (PostId + UserId)*

### 10. `Comment` (Комментарий к посту)
- `Id` (UUID)
- `PostId` (FK -> Post)
- `UserId` (FK -> User)
- `Text` (text)
- `CreatedAt` (timestamp)

### 11. `Tag` (Тег трассы)
- `Id` (UUID)
- `Name` (string) *"динамика", "пассивы", "техничный" и т.д.*
- `Slug` (string) *Уникальный идентификатор*
- *Связь с Route через таблицу RouteTags*

### 12. `UserScoreSnapshot` (Снимок Крускора)
- `Id` (UUID)
- `UserId` (FK -> User)
- `Score` (double) *Значение Крускора на момент расчёта*
- `ExpirationCount` (double) *Счётчик затухания (C в формуле)*
- `CalculatedAt` (timestamp) *Дата расчёта*
- `CreatedAt` (timestamp)
- *Хранит историю изменения Крускора для построения графика*

### 13. `GymAssignment` (Привязка персонала к залу)
- `Id` (UUID)
- `UserId` (FK -> User)
- `GymId` (FK -> Gym)
- `RoleInGym` (enum: Routesetter, GymAdmin)
- `CreatedAt` (timestamp)

## 💡 Особенности системы оценок (Grades)
Так как скалодромы используют разные системы (Французская шкала, V-Scale, диапазоны цветов), то в базе предусмотрена система нормализации сложности через отдельную сущность `GradingSystem`:
1. В системе создаются популярные шкалы и их правила преобразований (хранятся в словаре `GradeMapping`).
2. Каждый `Gym` привязывается к своей шкале `GradingSystemId`.
3. При добавлении новой трассы UI запрашивает `GradeMapping` и отдает рутсеттеру дропдаун с четким списком доступных сложностей (GradeRaw) для данного зала.
4. Выбранный GradeRaw и его нормализованный `GradeIndex` (число 0-1000 для статистики) сохраняются в самой трассе.
