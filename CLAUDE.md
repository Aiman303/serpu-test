# Проект Serpuru (Сайт и Мобильное приложение Серпу)

> **Несколько агентов работают параллельно — сначала прочитай `AGENTS_HANDOFF.md` (правила совместной работы, git-ветки, зоны ответственности).**

Экосистема Серпу — справочник лекарств Кыргызстана (реестр Минздрава КР) и напоминания о приёме с живым маскотом Серпу (фиолетовый змей в стиле Duolingo).

---

## Структура проекта

```
~/Рабочий стол/Serpuru/
├── site/                     # Веб-сайт (чистый HTML/CSS/JS без сборки, Vite только как dev-сервер)
│   ├── index.html            # Все экраны (#каталог, #скан, #справка, #аптечка)
│   ├── css/app.css           # Стили (плоский дизайн, без неона/градиентов, плавающие таблетки)
│   ├── js/app.js             # Логика поиска, скан упаковки, карточка, авторизация, аптечка
│   ├── js/rig.js             # Риг маскота Серпу (прыжки, сон, клики, эмоции)
│   ├── js/fx.js              # Фон с таблетками, мини-Серпу
│   ├── js/config.js          # Supabase URL и publishable key
│   └── data/drugs.json       # 7 487 лекарств реестра Минздрава КР
├── app -> /home/vkusny/dev/serpu_app   # Симлинк на Flutter-приложение (путь только латиницей!)
├── _build/                   # fix_data.py — очистка дубликатов реестра и привязка фото
├── supabase/                 # Edge Functions (serpu-ai на базе Gemini) и миграции БД
├── package.json              # Скрипты запуска для сайта и мобильного приложения
├── CLAUDE.md                 # Этот файл инструкции
└── .mcp.json                 # MCP-серверы: dart и mobile
```

---

## Окружение и команды

Окружение автоматически прописано в `~/.bashrc` и `~/.bash_profile` (через `~/development/serpu-env.sh`):
- **Flutter SDK**: 3.47.9 (`~/development/flutter/bin`)
- **JDK 17**: Eclipse Adoptium (`~/development/jdk-17`)
- **Android SDK**: `~/Android/Sdk` (cmdline-tools, platform-tools, emulator, ndk/28.2.13676358)
- **Эмулятор Android**: AVD `Serpu_Pixel` (Android 16, Google APIs / Play Store, x86_64)

### Быстрые команды (из корня `~/Рабочий стол/Serpuru`):
- `npm run dev` — запустить сайт на Vite (`http://localhost:5173`).
- `npm run app` — запустить мобильное приложение в эмуляторе `Serpu_Pixel` с горячей перезагрузкой.
- `npm run app:phone` — запустить приложение на физическом Android-телефоне (по USB или Wi-Fi adb).
- `npm run data` — пересобрать и очистить базу лекарств (`_build/fix_data.py`).
- `npm run deploy` — выкатить сайт в Cloudflare Pages.

**Живой сайт:** https://serpuru.pages.dev · текущий релиз: https://86c7bb3f.serpuru.pages.dev

---

## Мобильное приложение Серпу (Flutter)

Кодовая база приложения живёт в `~/dev/serpu_app` (обязательно путь латиницей — анализатор Dart падает на кириллице).

### Архитектура:
- `lib/main.dart` — точка входа, инициализация Supabase (`jjxtvixlwpwwcznnzkes`), тема и роутер.
- `lib/app/theme.dart` — тема Material 3:
  - Шрифт: `Nunito` (Google Fonts).
  - Цвета: `SerpuColors.purple` (`#8A3FE8`), `green` (`#2FB36F`), `orange` (`#FFFF9F2E` — огонь серии), тёмные тени для объёмных кнопок.
  - Принцип: плотные яркие цвета, без градиентов и неонового свечения, 2px рамки, скругления 18–20px.
- **Позиционирование: продукт от врачей.** Лечение назначает врач и видит, принимает ли пациент лекарства (не родственники).
- `lib/app/router.dart` — `go_router`, две оболочки по роли (`Settings.role`, без роли → `/welcome`):
  - Пациент: `Сегодня` (`/today`), `Лекарства` (`/meds`, реестр + свои курсы), `Скан` (`/scan`), `Аптеки` (`/map`, 332 аптеки Бишкека, маршрут в 2ГИС/Google/Яндекс), `Врач` (`/doctor-chat`, подключение по QR/6-значному коду + чат).
  - Врач: `Пациенты` (`/doctor`, риск-сортировка, живые отметки), `Мой QR` (`/doctor/qr`), `Реестр` (`/doctor/meds`); карточка пациента `/doctor/patient/:id` (лечение, сетка 7 дней, чат).
  - Общие: `/drug/:i`, `/symptoms`, `/settings` (тема, крупный текст, контраст, звуки, «Не забудь таблетки»), `/link`.
- `lib/core/care.dart` — назначения/отметки/связи врач↔пациент (Supabase: `care_links`, `prescriptions`, `dose_logs`, `messages`, RPC `become_doctor`, `link_doctor`), realtime, офлайн-кэш, оптимистичные отметки.
- `lib/core/pill_guard.dart` — «Не забудь таблетки»: геозона дома 150 м, при выходе пуш про дозы на среднее время вне дома.
- `lib/core/notify.dart` — будильники приёма (точные), иконка уведомлений `drawable/ic_stat_serpu`.
- Аккаунт пациента/врача — анонимный «аккаунт устройства» от Edge Function `serpu-device`.
- `lib/core/feedback.dart` — `SerpuFeedback`: звуковые эффекты (12 звуков из `assets/sounds/` по ТЗ) и тактильный отклик (HapticFeedback).
- `lib/widgets/chunky_button.dart` — `ChunkyButton`: объёмная кнопка со ступенькой тени, опускается при тапе.
- `lib/widgets/serpu.dart` — `Serpu`: живой анимированный маскот с дыханием, прыжками и эмоциями (`SerpuMood`: `idle`, `happy`, `party`, `sad`, `sleepy`, `thinking`, `worried`, `surprised`).
- `lib/features/today/today_screen.dart` — экран «Сегодня» с приёмом доз, увеличением серии и реакцией маскота.

---

## Доступные скиллы и инструменты

Для работы подключены все официальные и специализированные скиллы:
1. **Flutter & Dart**: `flutter-fix-layout-issues`, `flutter-build-responsive-layout`, `flutter-apply-architecture-best-practices`, `flutter-setup-declarative-routing`, `dart-run-static-analysis`, `dart-fix-runtime-errors`, `dart-add-unit-test`, `dart-use-pattern-matching`.
2. **Дизайн и UI**: `material-3`, `mobile-android-design`, `rive-animations`, `presentation-design`.
3. **Бэкенд**: `supabase`, `supabase-postgres-best-practices`.
4. **Android & MCP**:
   - MCP `dart` — управление Flutter: hot reload, получение ошибок рантайма, инспекция дерева виджетов.
   - MCP `mobile` — скриншоты экрана эмулятора, нажатия, инспекция UI.
   - Консоль adb: `adb exec-out screencap -p > /tmp/screen.png` для мгновенных снимков экрана.

