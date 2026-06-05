# Architecture & Tech Stack

## 🧱 Основной Стек
- **Backend Core:** C# / .NET 10 (ASP.NET Core Web API)
- **Frontend (Web):** React 18, TypeScript, Material-UI (MUI)
- **Mobile Client:** Flutter (Dart) с использованием Material 3
- **Database:** PostgreSQL (эффективна для легковесных гео-запросов PostGIS в будущем и надежна)
- **ORM:** Entity Framework Core

## 🏗 Архитектура Системы

### 1. Backend Service (C#)
- **Тип архитектуры:** Clean Architecture или облегченная модульная монолитная (с фокусом на скорость доставки MVP).
- **API:** RESTful API.
- **Аутентификация:** JWT или готовое решение типа Firebase Authentication для упрощения входа через Google/Apple. (Рекомендовано взять JWT на базе ASP.NET Core Identity для независимости).

### 2. Mobile App (Flutter)
- Единая кодовая база для iOS и Android.
- State Management: BLoC или Riverpod.
- Автоматически синхронизирует и показывает ленту, интерфейс логирования пролазов.
- Использование сканера QR-кодов (в перспективе) для быстрой отметки трассы.

### 3. Web Admin Dashboard (React + TypeScript)
- Панель управления (CMS) для модерирования базы.
- Управление данными скалодромов, полученными после парсинга.
- Визуализация на базе готовых компонентов MUI (DataGrid, формы и т.д.).

### 4. Парсер Данных (`Cruxa.Parser`)
- **CLI Console App** на C# .NET 10, отдельный проект в солюшене.
- Источник данных: **maps.climbingpro.ru** (каталог скалодромов России, HTML-парсинг через HtmlAgilityPack).
- Координаты: извлекаются из `/data.json` (GeoJSON) с каждой страницы скалодрома.
- **18 полей сбора:** название, город, адрес, координаты, описание, телефон, email, соцсети, сайт, часы работы, цены, фото, площадь стен, макс. высота, год основания, метро, теги.
- Верифицирован вручную на 50+ реальных залах Москвы и Санкт-Петербурга.
- Команды:
  - `scrape` — сбор данных по городам, экспорт в JSON
  - `seed` — загрузка JSON через REST API (`POST /api/gyms/import`)
- Парсер независим от API: общается с ним через HTTP, проходит полный слой валидации.
- Подробнее: [ADR-008](adr/008-parser-architecture.md).

### ☁️ Инфраструктура и Хранение
- **Хранилище медиа (аватарки, фото трасс):** Amazon S3 (или аналоги, например, MinIO / Yandex Object Storage).
- **Хостинг БД и API:** Любой бюджетный VPS (например, Timeweb, Yandex Cloud или DigitalOcean). Docker & Docker Compose для удобного деплоя.
