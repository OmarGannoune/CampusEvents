# CampusEvents AI — Complete Project Specification

> **Version:** 1.0  
> **Date:** May 2026  
> **Stack:** Expo / React Native · expo-sqlite · Anthropic Claude API  
> **Deadline:** 30 May 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Design System — Non-negotiable](#2-design-system--non-negotiable)
3. [File & Folder Architecture](#3-file--folder-architecture)
4. [Authentication & Session](#4-authentication--session)
5. [Database Schema — SQLite](#5-database-schema--sqlite)
6. [Data Models (TypeScript)](#6-data-models-typescript)
7. [Navigation Structure](#7-navigation-structure)
8. [Screen Specifications — Admin](#8-screen-specifications--admin)
9. [Screen Specifications — Student](#9-screen-specifications--student)
10. [Screen Specifications — AI Assistant](#10-screen-specifications--ai-assistant)
11. [Screen Specifications — Bonus](#11-screen-specifications--bonus)
12. [AI Integration — LLM Service](#12-ai-integration--llm-service)
13. [Prompt Specifications](#13-prompt-specifications)
14. [Business Rules & Validation](#14-business-rules--validation)
15. [Error & Empty States](#15-error--empty-states)
16. [Bonus Features](#16-bonus-features)
17. [Seed Data](#17-seed-data)
18. [Environment & Security](#18-environment--security)

---

## 1. Project Overview

CampusEvents AI centralises university events into a single mobile app with two roles:

- **Admin** — full CRUD over the event catalogue
- **Student** — browse, register, favourite, and interact with an AI assistant that reasons over the entire catalogue

The AI layer is not a chatbot. It is a structured reasoning engine with four distinct modes, each with a dedicated screen, its own prompt, and its own cached result set.

---

## 2. Design System — Non-negotiable

Every screen, component, and piece of text in this project **must** follow the design system below. No exceptions. No deviations for "convenience". These tokens are what make the app feel like a product, not a student project.

### 2.1 Color Tokens

```typescript
// constants/colors.ts  — import these everywhere, never hardcode hex values

export const Colors = {
  // ── Brand ──────────────────────────────────────
  dark:          '#1C1B2E',   // primary dark, headers, nav bg
  purple:        '#7C3AED',   // primary action, CTA buttons, active states
  purpleMid:     '#A78BFA',   // icons, secondary accents
  purpleLight:   '#EDE9FE',   // chip bg, badge bg, tag bg
  surface:       '#F7F6FF',   // page/screen background
  card:          '#FFFFFF',   // card surfaces

  // ── Text ───────────────────────────────────────
  textPrimary:   '#1C1B2E',
  textSecondary: '#6B7280',
  textHint:      '#9CA3AF',
  textOnDark:    '#FFFFFF',
  textOnDarkMuted: 'rgba(255,255,255,0.5)',

  // ── Semantic ───────────────────────────────────
  success:       '#10B981',
  successLight:  '#D1FAE5',
  successDark:   '#065F46',
  amber:         '#F59E0B',
  amberLight:    '#FEF3C7',
  amberDark:     '#92400E',
  danger:        '#EF4444',
  dangerLight:   '#FEE2E2',
  dangerDark:    '#991B1B',
  info:          '#0EA5E9',
  infoLight:     '#E0F2FE',
  infoDark:      '#0369A1',

  // ── Borders ────────────────────────────────────
  borderDefault: 'rgba(124, 58, 237, 0.12)',
  borderStrong:  'rgba(124, 58, 237, 0.25)',
  borderCard:    'rgba(124, 58, 237, 0.10)',

  // ── Category chips ─────────────────────────────
  // Each category: { bg, text, accent }
  categoryTalk:     { bg: '#EDE9FE', text: '#5B21B6', accent: '#7C3AED' },
  categoryWorkshop: { bg: '#E0F2FE', text: '#0369A1', accent: '#0EA5E9' },
  categoryClub:     { bg: '#D1FAE5', text: '#065F46', accent: '#10B981' },
  categoryExam:     { bg: '#FEF3C7', text: '#92400E', accent: '#F59E0B' },
  categoryOther:    { bg: '#F3F4F6', text: '#374151', accent: '#6B7280' },

  // ── AI feature accent colors ────────────────────
  aiSearch:      '#7C3AED',   // Natural language search
  aiReco:        '#0EA5E9',   // Recommendations
  aiPlan:        '#10B981',   // Planning
  aiQA:          '#F59E0B',   // Q&A
} as const
```

### 2.2 Typography

```typescript
// constants/typography.ts

export const Typography = {
  // Sizes
  display:    { fontSize: 22, fontWeight: '500' as const, letterSpacing: -0.5 },
  title:      { fontSize: 18, fontWeight: '500' as const },
  sectionTitle:{ fontSize: 15, fontWeight: '500' as const },
  body:       { fontSize: 14, fontWeight: '400' as const, lineHeight: 22 },
  caption:    { fontSize: 12, fontWeight: '400' as const, color: '#6B7280' },
  label:      { fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.5 },
  tiny:       { fontSize: 10, fontWeight: '400' as const },

  // Logo type treatment
  logo: {
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: -0.5,
    // Render as: "Campus" in white + "Events" in purpleMid
  },
} as const
```

### 2.3 Spacing & Radius

```typescript
// constants/spacing.ts

export const Spacing = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  xxl:  32,
} as const

export const Radius = {
  sm:   6,
  md:   10,
  lg:   14,
  xl:   20,
  full: 999,
} as const
```

### 2.4 Component Tokens — Applied

| Component | Rule |
|---|---|
| Screen background | `Colors.surface` (`#F7F6FF`) — never plain white |
| Header/navbar background | `Colors.dark` (`#1C1B2E`) |
| Card background | `Colors.card` (`#FFFFFF`) |
| Card border | `0.5px solid Colors.borderCard` |
| Card border radius | `Radius.lg` (14px) |
| Primary button bg | `Colors.purple` |
| Primary button text | white, `Typography.label` |
| Primary button radius | `Radius.md` (10px) |
| Ghost button border | `Colors.borderStrong` |
| Ghost button text | `Colors.purple` |
| Input border (default) | `Colors.borderDefault` |
| Input border (focused) | `Colors.borderStrong` |
| Input bg | `Colors.card` |
| Input border radius | `Radius.md` (10px) |
| Bottom tab bar bg | `Colors.card` |
| Bottom tab bar border | `0.5px solid Colors.borderDefault` |
| Active tab icon/label | `Colors.purple` |
| Inactive tab icon/label | `Colors.textSecondary` |

### 2.5 Category Chips

A `CategoryChip` component must exist and be the **only** way to render a category label anywhere in the app.

```typescript
// components/ui/CategoryChip.tsx
// Props: category: EventCategory, size?: 'sm' | 'md'
// Renders: rounded pill with bg/text from Colors.category*
// sm: fontSize 10, padding 2×8
// md: fontSize 12, padding 4×10
```

### 2.6 AI Accent System

Each AI feature has a dedicated accent color applied consistently to:
- The top border of its screen header (2px, full width)
- The left border of AI result cards (2px)
- Button backgrounds on that screen
- The feature card border-top on the AI hub

| Feature | Accent |
|---|---|
| Natural language search | `Colors.aiSearch` — purple `#7C3AED` |
| Recommendations | `Colors.aiReco` — blue `#0EA5E9` |
| Planning | `Colors.aiPlan` — green `#10B981` |
| Q&A | `Colors.aiQA` — amber `#F59E0B` |

### 2.7 Header Component

The `ScreenHeader` component wraps every screen's top section.

```typescript
// components/ui/ScreenHeader.tsx
// Props:
//   title: string
//   subtitle?: string
//   showBack?: boolean
//   onBack?: () => void
//   rightElement?: ReactNode
//   accentColor?: string   ← AI screens pass their accent color → 2px top border
//   logo?: boolean         ← renders the "CampusEvents" logotype instead of title
//
// Background: Colors.dark
// Padding: top 48px (status bar), horizontal 16px, bottom 14px
// Border radius bottom: Radius.lg on bottom-left and bottom-right only
// If accentColor: borderTopWidth 2, borderTopColor accentColor
```

### 2.8 Bottom Tab Bar

Present on all student screens. Hidden on admin screens (admin uses a simple back-navigation stack).

Tabs in order:
1. `ti-calendar-event` → label "Événements"
2. `ti-heart` → label "Favoris"
3. `ti-ticket` → label "Inscrip."
4. `ti-sparkles` → label "Assistant"

Active state: icon + label in `Colors.purple`. Inactive: `Colors.textSecondary`.

### 2.9 Shadows & Elevation

No `elevation` or `boxShadow` anywhere. Depth is communicated through:
- Background color contrast (`Colors.surface` vs `Colors.card`)
- Borders (`Colors.borderCard`)
- The 2-pixel accent borders on featured/AI elements

### 2.10 Loading Skeletons

Never show a blank screen during data loading. Use skeleton placeholders:

```typescript
// components/ui/SkeletonCard.tsx
// Renders a card-shaped rectangle in Colors.purpleLight with opacity 0.4
// Animate opacity 0.4 → 0.8 → 0.4 using Animated.loop (duration 1200ms)
// EventList uses 3 SkeletonCards while loading
```

---

## 3. File & Folder Architecture

```
campusevents-ai/
├── app/                          ← expo-router screens
│   ├── index.tsx                 ← redirects to /auth/login
│   ├── auth/
│   │   └── login.tsx
│   ├── (admin)/
│   │   ├── _layout.tsx           ← stack navigator, no bottom tab bar
│   │   ├── index.tsx             ← event list
│   │   ├── create.tsx
│   │   └── edit/[id].tsx
│   └── (student)/
│       ├── _layout.tsx           ← tab navigator with bottom bar
│       ├── events/
│       │   ├── index.tsx         ← catalogue
│       │   └── [id].tsx          ← event detail
│       ├── favorites.tsx
│       ├── registrations.tsx
│       └── assistant/
│           ├── index.tsx         ← AI hub (4 feature cards)
│           ├── search.tsx
│           ├── recommendations.tsx
│           ├── planning.tsx
│           └── qa.tsx
│
├── components/
│   ├── ui/                       ← pure design-system components
│   │   ├── ScreenHeader.tsx
│   │   ├── CategoryChip.tsx
│   │   ├── Badge.tsx
│   │   ├── EventCard.tsx
│   │   ├── AIResultCard.tsx
│   │   ├── SkeletonCard.tsx
│   │   ├── EmptyState.tsx
│   │   └── ErrorState.tsx
│   ├── admin/
│   │   ├── EventForm.tsx
│   │   └── DeleteConfirmModal.tsx
│   └── student/
│       ├── FilterChips.tsx
│       ├── SearchBar.tsx
│       ├── RegistrationButton.tsx
│       └── FavoriteButton.tsx
│
├── database/
│   ├── init.ts                   ← table creation + migration guard
│   ├── events.ts
│   ├── registrations.ts
│   ├── favorites.ts
│   └── llmResults.ts
│
├── services/
│   ├── llm.ts                    ← single entry point for all AI calls
│   └── auth.ts                   ← session read/write with AsyncStorage
│
├── prompts/
│   ├── search.ts
│   ├── recommendations.ts
│   ├── planning.ts
│   └── qa.ts
│
├── context/
│   ├── AuthContext.tsx
│   └── DatabaseContext.tsx
│
├── constants/
│   ├── colors.ts
│   ├── typography.ts
│   └── spacing.ts
│
├── types/
│   └── index.ts                  ← all TypeScript interfaces
│
├── hooks/
│   ├── useEvents.ts
│   ├── useRegistrations.ts
│   ├── useFavorites.ts
│   └── useLLM.ts
│
├── .env                          ← never committed
├── .env.example                  ← committed, no values
└── .gitignore                    ← must include .env
```

---

## 4. Authentication & Session

### 4.1 Preconfigured Accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@campus.ma` | `admin123` |
| Student | `etudiant@campus.ma` | `etudiant123` |

These are hardcoded constants. No backend. No registration flow.

```typescript
// services/auth.ts
const ACCOUNTS = [
  { email: 'admin@campus.ma',    password: 'admin123',    role: 'admin'   },
  { email: 'etudiant@campus.ma', password: 'etudiant123', role: 'student' },
] as const

export type UserRole = 'admin' | 'student'
export type User = { email: string; role: UserRole }
```

### 4.2 Session Persistence

Use `@react-native-async-storage/async-storage` to persist the logged-in user.

```typescript
// Key: 'campusevents_session'
// Value: JSON.stringify({ email, role })
// On app launch: read this key → if present, skip login screen
// On logout: delete this key → navigate to login
```

### 4.3 AuthContext

```typescript
// context/AuthContext.tsx
interface AuthContextValue {
  user: User | null
  isLoading: boolean      // true while checking AsyncStorage on boot
  login: (email: string, password: string) => Promise<'success' | 'invalid_credentials'>
  logout: () => Promise<void>
}
```

### 4.4 Login Screen Behaviour

- Email field: `keyboardType="email-address"`, `autoCapitalize="none"`
- Password field: `secureTextEntry`
- On submit: validate against ACCOUNTS constant
- On success: write session → navigate to correct stack (admin or student)
- On failure: inline error message below the button, in `Colors.danger`
- No loading spinner needed (local check is instant)

### 4.5 Route Protection

`app/index.tsx` reads the session and redirects:
- No session → `/auth/login`
- Role `admin` → `/(admin)/`
- Role `student` → `/(student)/events/`

---

## 5. Database Schema — SQLite

### 5.1 Installation

```bash
npx expo install expo-sqlite
```

### 5.2 Init Module

```typescript
// database/init.ts
import * as SQLite from 'expo-sqlite'

export const db = SQLite.openDatabaseSync('campusevents.db')

export function initDatabase(): void {
  db.execSync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS events (
      id              TEXT PRIMARY KEY,
      title           TEXT NOT NULL,
      description     TEXT NOT NULL,
      category        TEXT NOT NULL CHECK(category IN ('Talk','Workshop','Club','Exam','Other')),
      startDateTime   TEXT NOT NULL,
      endDateTime     TEXT,
      locationName    TEXT NOT NULL,
      locationAddress TEXT,
      organizerName   TEXT NOT NULL DEFAULT 'Campus Admin',
      capacity        INTEGER,
      registeredCount INTEGER NOT NULL DEFAULT 0,
      imageUrl        TEXT,
      tags            TEXT NOT NULL DEFAULT '[]',
      createdAt       TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS registrations (
      id         TEXT PRIMARY KEY,
      eventId    TEXT NOT NULL,
      userId     TEXT NOT NULL,
      createdAt  TEXT NOT NULL,
      status     TEXT NOT NULL DEFAULT 'confirmed'
                 CHECK(status IN ('confirmed','cancelled')),
      FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE,
      UNIQUE(eventId, userId)
    );

    CREATE TABLE IF NOT EXISTS favorites (
      eventId    TEXT NOT NULL,
      userId     TEXT NOT NULL,
      createdAt  TEXT NOT NULL,
      PRIMARY KEY (eventId, userId),
      FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS llm_results (
      id         TEXT PRIMARY KEY,
      eventId    TEXT,
      userId     TEXT NOT NULL,
      type       TEXT NOT NULL CHECK(type IN ('search','recommendation','planning','qa')),
      inputText  TEXT NOT NULL,
      outputText TEXT NOT NULL,
      createdAt  TEXT NOT NULL
    );
  `)
}
```

Call `initDatabase()` once at app startup, inside the root `_layout.tsx`, before rendering any screens.

### 5.3 CASCADE Behaviour

The `ON DELETE CASCADE` on registrations and favorites means: when admin deletes an event, all associated registrations and favorites are automatically removed. No manual cleanup needed.

### 5.4 Database Modules

#### `database/events.ts`

```typescript
getAllEvents(): Event[]
getEventById(id: string): Event | null
getUpcomingEvents(): Event[]
getPastEvents(): Event[]
createEvent(data: Omit<Event, 'id' | 'createdAt' | 'registeredCount'>): Event
updateEvent(id: string, data: Partial<Event>): Event
deleteEvent(id: string): void
searchEvents(query: string): Event[]       // LIKE %query% on title, case-insensitive
filterByCategory(category: EventCategory): Event[]
getEventsThisWeek(): Event[]               // used by planning prompt
```

#### `database/registrations.ts`

```typescript
getRegistrationsForUser(userId: string): Registration[]
getRegisteredEventIds(userId: string): string[]
isRegistered(eventId: string, userId: string): boolean
register(eventId: string, userId: string): Registration
cancelRegistration(eventId: string, userId: string): void
// register() must also: UPDATE events SET registeredCount = registeredCount + 1
// cancelRegistration() must also: UPDATE events SET registeredCount = registeredCount - 1
```

#### `database/favorites.ts`

```typescript
getFavoritesForUser(userId: string): string[]    // returns eventIds
isFavorited(eventId: string, userId: string): boolean
addFavorite(eventId: string, userId: string): void
removeFavorite(eventId: string, userId: string): void
getFavoriteEvents(userId: string): Event[]       // JOIN with events table
```

#### `database/llmResults.ts`

```typescript
saveResult(data: Omit<LLMResult, 'id' | 'createdAt'>): LLMResult
getLatestResult(userId: string, type: LLMResultType, inputText: string): LLMResult | null
// Cache lookup: exact match on userId + type + inputText
// Returns null if no match found
```

---

## 6. Data Models (TypeScript)

```typescript
// types/index.ts

export type EventCategory = 'Talk' | 'Workshop' | 'Club' | 'Exam' | 'Other'
export type LLMResultType = 'search' | 'recommendation' | 'planning' | 'qa'

export interface Event {
  id: string
  title: string
  description: string
  category: EventCategory
  startDateTime: string       // ISO 8601
  endDateTime?: string        // ISO 8601
  locationName: string
  locationAddress?: string
  organizerName: string
  capacity?: number
  registeredCount: number
  imageUrl?: string
  tags: string[]              // stored as JSON string in SQLite, parsed on read
  createdAt: string           // ISO 8601
}

export interface Registration {
  id: string
  eventId: string
  userId: string
  createdAt: string
  status: 'confirmed' | 'cancelled'
}

export interface Favorite {
  eventId: string
  userId: string
  createdAt: string
}

export interface LLMResult {
  id: string
  eventId?: string
  userId: string
  type: LLMResultType
  inputText: string
  outputText: string          // raw JSON string from LLM
  createdAt: string
}

// Derived types used by AI prompts
export interface EventSummary {
  id: string
  title: string
  category: EventCategory
  startDateTime: string
  locationName: string
  capacity?: number
  registeredCount: number
  tags: string[]
  description: string         // truncated to 200 chars for prompt injection
}
```

---

## 7. Navigation Structure

### 7.1 Root Layout

```typescript
// app/_layout.tsx
// 1. Initialize database (initDatabase())
// 2. Wrap entire app in AuthProvider and DatabaseProvider
// 3. Render <Slot />
```

### 7.2 Auth Layout

Stack navigator. No header. Screen: `login`.

### 7.3 Admin Layout

```typescript
// app/(admin)/_layout.tsx
// Stack navigator
// Custom header: ScreenHeader component (dark bg, logo, subtitle "Admin")
// Screens: index, create, edit/[id]
// No bottom tab bar
// Add a logout icon button (ti-logout) in the top-right of the header
```

### 7.4 Student Layout

```typescript
// app/(student)/_layout.tsx
// Tab navigator
// Custom tab bar: BottomTabBar component (see design system §2.8)
// Tab screens: events (stack), favorites, registrations, assistant (stack)
```

### 7.5 Events Stack (Student)

`index` (catalogue) → `[id]` (detail). The detail screen has a back button and a favourite button in the header.

### 7.6 Assistant Stack (Student)

`index` (hub) → `search` | `recommendations` | `planning` | `qa`. Each sub-screen has a back button and its accent colour applied to the header.

---

## 8. Screen Specifications — Admin

### 8.1 Admin Event List (`/(admin)/index`)

**Header:** Logo + subtitle "X événements" (total count). Right: `ti-plus` icon button → navigate to `/create`.

**Content:** `FlatList` of all events (past + future), sorted descending by `startDateTime`.

**Each list item (`AdminEventRow`):**
- Left side: `CategoryChip`, title (bold), date + location (caption)
- Right side: two inline action buttons
  - "Modifier" → `Colors.purpleLight` bg, `Colors.purple` text → navigate to `/edit/[id]`
  - "Supprimer" → `Colors.dangerLight` bg, `Colors.dangerDark` text → opens `DeleteConfirmModal`
- Past events: rendered at 50% opacity

**States:** Loading (3 SkeletonCards), empty (EmptyState with `ti-calendar` icon + "Aucun événement. Créez-en un."), error (ErrorState).

### 8.2 Event Form — Create (`/(admin)/create`) & Edit (`/(admin)/edit/[id]`)

Both screens use the shared `EventForm` component.

**Header:** "Créer un événement" or "Modifier l'événement". Back button.

**Fields (in order):**

| Field | Type | Required | Notes |
|---|---|---|---|
| Titre | TextInput | ✓ | single line |
| Description | TextInput multiline | ✓ | min 4 rows |
| Catégorie | Selector (5 chips) | ✓ | tapping a chip selects it, active chip filled with category colour |
| Date de début | DateTimePicker | ✓ | shows formatted: "Lun 26 Mai 2026 · 14:00" |
| Date de fin | DateTimePicker | ✗ | shows same format |
| Lieu | TextInput | ✓ | |
| Adresse | TextInput | ✗ | |
| Organisateur | TextInput | ✗ | default: "Campus Admin" |
| Capacité | TextInput numeric | ✗ | |
| Tags | Tag input | ✗ | press Enter or comma to add; rendered as removable pills |

**Validation (run on submit):**
- All required fields must be non-empty (after trim)
- If `endDateTime` is set: must be strictly after `startDateTime` → error "La date de fin doit être après la date de début"
- If `capacity` is set: must parse to integer > 0 → error "La capacité doit être un entier positif"
- Each validation error renders below its field in `Colors.danger`, `Typography.caption`

**Submit button:** "Créer l'événement" / "Enregistrer les modifications". Disabled while validating.

**On success:** navigate back to admin list, show a brief success toast.

### 8.3 Delete Confirmation Modal (`DeleteConfirmModal`)

Full-screen overlay with `rgba(28, 27, 46, 0.6)` background. Modal card centered:

- `ti-trash` icon in danger circle
- Title: "Supprimer l'événement ?"
- Body: "« {title} » sera définitivement supprimé. Toutes les inscriptions et favoris associés seront effacés."
- Two buttons side-by-side: "Annuler" (neutral) + "Supprimer" (danger red)
- On confirm: `deleteEvent(id)` → close modal → list refreshes automatically

---

## 9. Screen Specifications — Student

### 9.1 Event Catalogue (`/(student)/events/index`)

**Header:** Logo + subtitle "X événements à venir". No right button.

**Search bar:** Below header, full-width. Placeholder: "Rechercher un événement...". Left icon: `ti-search`. Filters events by title (case-insensitive LIKE). Debounce 300ms.

**Filter chips row:** Horizontal scroll. Chips: "Tous" (default, filled purple) + one per category. Only one active at a time. Combines with search: category filter AND title search.

**Period toggle:** Two text buttons: "À venir" (default) / "Passés". Positioned right of filter area.

**Event list:** `FlatList`, sorted ascending by `startDateTime`.

**EventCard component:**
```
┌─────────────────────────────────────────┐
│ [CategoryChip]              [❤ icon]    │
│ Title (sectionTitle weight)             │
│ 📅 Date · Time · Location (caption)     │
│ [Badge: places / complet / passé]       │
└─────────────────────────────────────────┘
```
- Tapping the card → navigate to `events/[id]`
- Tapping the heart → toggle favourite (immediate optimistic update)
- Heart icon: filled + purple if favourited, outline + purpleMid if not

**Badge logic:**
- `capacity` undefined → no badge
- `registeredCount < capacity` → green badge "X / Y places"
- `registeredCount >= capacity` → amber badge "Complet"
- Event is past → red badge "Passé"

**States:** Loading (SkeletonCards), empty (EmptyState), error (ErrorState).

### 9.2 Event Detail (`/(student)/events/[id]`)

**Header area:** Dark gradient banner (height 90px) using `Colors.dark` → `#4C1D95`. Back button (top-left). Favourite button (top-right). `CategoryChip` bottom-left of banner.

**Content (scroll view):**
- Title (`sectionTitle`)
- Metadata rows (icon + text, each a flex row):
  - `ti-calendar` → formatted date range
  - `ti-map-pin` → location name + address
  - `ti-user` → organizer name
  - `ti-users` → "X / Y inscrits" (or "Illimité")
- Divider
- Description (body text)
- Tags (purple pills, same as form)

**Sticky bottom bar:**
```
┌─────────────────────────────────────────┐
│  [RegistrationButton — full width]      │
└─────────────────────────────────────────┘
```
`RegistrationButton` states:
- Default: "S'inscrire à cet événement" — purple bg
- Registered: "Annuler mon inscription" — ghost, danger border
- Event full (not registered): "Complet — inscription impossible" — disabled, grey
- Event past: "Événement terminé" — disabled, grey

Tapping "Annuler" shows an inline confirmation: "Confirmer l'annulation ?" with Yes/No.

### 9.3 Favorites (`/(student)/favorites`)

**Header:** "Mes favoris" + count subtitle.

**Content:** `FlatList` of favourite events using `getFavoriteEvents(userId)`. Same `EventCard` component. Heart always filled/purple on this screen (they're all favourites).

**Empty state:** `ti-heart` icon + "Vous n'avez pas encore de favoris. Explorez le catalogue !"

### 9.4 My Registrations (`/(student)/registrations`)

**Header:** "Mes inscriptions" + count subtitle.

**Content:** Two sections — "À venir" (future) and "Passés" — each a `SectionList` header followed by registration cards.

**Registration card:**
- Left: title, date (caption)
- Right: `Badge` — green "Confirmé" or grey "Passé"
- Bottom (future events only): "Annuler l'inscription" in `Colors.danger`, `Typography.caption`

---

## 10. Screen Specifications — AI Assistant

### 10.1 AI Hub (`/(student)/assistant/index`)

**Header:** Logo with `✦` prefix + "Assistant IA". Subtitle: "Propulsé par Claude · Ne soumettez pas de données sensibles."

**Warning banner** (always visible, below header):
```
┌─────────────────────────────────────────────────────┐
│ ⚠  Ne soumettez pas de données personnelles         │
│    ou sensibles à cet assistant.                    │
└─────────────────────────────────────────────────────┘
```
Style: `Colors.amberLight` bg, `Colors.amberDark` text, `Radius.md`, padding 10px.

**Feature grid** (2×2):

Each card:
- `borderTopWidth: 2`, `borderTopColor: accentColor`
- Icon (24px, accent color)
- Feature name (`sectionTitle`)
- One-line description (`caption`)
- Tapping → navigates to feature screen

| Feature | Icon | Description |
|---|---|---|
| Recherche sémantique | `ti-search` | "Trouvez sans connaître les mots-clés" |
| Recommandations | `ti-stars` | "Basé sur vos favoris et inscriptions" |
| Planification | `ti-calendar-time` | "Planning sans conflit sur mesure" |
| Q/R Catalogue | `ti-message-question` | "Posez n'importe quelle question" |

### 10.2 Natural Language Search (`/(student)/assistant/search`)

**Accent color:** `Colors.aiSearch` (purple)

**Header:** Back button + "Recherche sémantique"

**Input:** Multiline `TextInput`, placeholder: "Décrivez ce que vous cherchez en langage libre…", min 2 rows, max 4 rows. `Colors.borderStrong` border.

**Button:** "Rechercher" — purple bg. Disabled while loading.

**On submit:**
1. Check cache: `getLatestResult(userId, 'search', inputText)`
2. If cache hit: render cached result with grey "Résultat en cache" badge
3. If no cache: call `llmService.search(inputText, allEvents)`
4. Save result to `llm_results`
5. Parse and render

**Result rendering:**
- Section title: "X résultats trouvés"
- For each matched event: `AIResultCard` (left accent border purple, event title bold, justification text below in caption)
- Each card is tappable → navigate to event detail

### 10.3 Recommendations (`/(student)/assistant/recommendations`)

**Accent color:** `Colors.aiReco` (blue)

**Header:** Back button + "Recommandations"

**Auto-loads on screen mount** (no user input needed). Shows a loading skeleton while the LLM call runs.

**Data transmitted to LLM:**
- User's favourite event titles + categories + tags
- User's registered event titles + categories + tags
- All upcoming events (as `EventSummary[]`)

**Result rendering:**
- Up to 3 recommendation cards
- First card has "★ Top pick" badge in blue
- Each card: event info + justification paragraph
- If user has no history: EmptyState "Inscrivez-vous à des événements pour recevoir des recommandations personnalisées"

### 10.4 Planning Assistant (`/(student)/assistant/planning`)

**Accent color:** `Colors.aiPlan` (green)

**Header:** Back button + "Planification IA"

**Input:** Large `TextInput`, placeholder: "Ex: J'ai cours lundi et mercredi matin, un exam jeudi…", min 3 rows.

**Button:** "Générer mon planning" — green bg.

**Result rendering:**
- Section title: "Semaine du [date] au [date]"
- Day-by-day rows: day abbreviation (MON, TUE…) + event name + time + status badge
- Conflict rows (blocked slots): amber bg, "!" badge
- Free days: shown as "Aucun événement prévu"

### 10.5 Catalogue Q&A (`/(student)/assistant/qa`)

**Accent color:** `Colors.aiQA` (amber)

**Header:** Back button + "Q/R Catalogue"

**Input:** Single-line `TextInput`, placeholder: "Posez n'importe quelle question sur les événements…"

**Button:** "Poser la question" — amber bg.

**Result rendering:**
- `AIResultCard` with amber left border
- Label: "✦ Réponse IA"
- Body: the LLM's answer in body text
- If events are mentioned: small linked event pills below the answer

---

## 11. Screen Specifications — Bonus

### 11.1 Student Profile (`/(student)/profile`) — Bonus

Accessible via a `ti-user-circle` icon in the student header (top-right).

**Fields:**
- Display name (derived from email by default)
- Filière (e.g. "Génie Informatique")
- Année (e.g. "Master 1", "Licence 3")
- Centres d'intérêt: tag input (same as admin form tags), examples: "IA/ML", "Cloud", "Startup", "DevOps"

Stored in `AsyncStorage` key `campusevents_profile`.

When populated, this data is injected into the recommendations and planning prompts to improve relevance.

### 11.2 Weekly Summary — Bonus

Accessible from the AI hub as a 5th card: "Résumé de la semaine". Auto-generates a narrative digest: "Cette semaine sur le campus...". One API call, cached per week.

### 11.3 Event Sharing — Bonus

In the event detail screen: `ti-share` icon button in the header. Calls `expo-sharing` to share a plain-text summary: title, date, location, description snippet.

### 11.4 Local Notifications — Bonus

At registration time: offer to set a reminder. Use `expo-notifications` to schedule a local notification 1 hour before `startDateTime`. Message: "🎓 Rappel : {title} commence dans 1 heure."

---

## 12. AI Integration — LLM Service

### 12.1 Provider

**Anthropic Claude API** — `claude-sonnet-4-20250514` model.

### 12.2 Central Service Module

```typescript
// services/llm.ts

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-20250514'
const MAX_TOKENS = 1024

async function callLLM(systemPrompt: string, userMessage: string): Promise<string> {
  const apiKey = await getApiKey()    // reads from env or local storage
  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })
  if (!response.ok) {
    const err = await response.json()
    throw new LLMError(err.error?.message ?? 'API error', response.status)
  }
  const data = await response.json()
  return data.content[0].text
}

// Public methods (each imported from /prompts/*.ts)
export const llmService = {
  search:          (query: string, events: EventSummary[]) => ...,
  recommend:       (history: UserHistory, upcomingEvents: EventSummary[]) => ...,
  plan:            (constraints: string, weekEvents: EventSummary[]) => ...,
  answerQuestion:  (question: string, allEvents: EventSummary[]) => ...,
}
```

### 12.3 API Key Management

Priority order:
1. `process.env.EXPO_PUBLIC_ANTHROPIC_KEY` (set in `.env`)
2. `AsyncStorage` key `campusevents_apikey` (set via a settings field in the AI hub)

The AI hub screen must include a small "Clé API" input (collapsed by default, expandable via `ti-settings` icon). If no key is set, all AI buttons are disabled and a banner says "Configurez votre clé API pour utiliser l'assistant."

### 12.4 `LLMError` Class

```typescript
class LLMError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message)
    this.name = 'LLMError'
  }
}
// statusCode 401 → "Clé API invalide"
// statusCode 429 → "Quota dépassé, réessayez plus tard"
// statusCode 0 / network → "Vérifiez votre connexion internet"
// all others → "Erreur inattendue (code X)"
```

### 12.5 Global AI Lock

A React context value `isAIBusy: boolean` is set to `true` while any LLM call is in flight. All AI submit buttons read this value and are disabled when `true`.

### 12.6 Context Size Limit

Before injecting events into a prompt, convert each to `EventSummary` and trim the array:
- Truncate `description` to 200 characters
- Limit the array to 20 events (most recent / upcoming first)
- `JSON.stringify` the array and ensure total length ≤ 6000 characters; if over, remove events from the end until under

---

## 13. Prompt Specifications

All prompts are in `prompts/*.ts` and exported as named constants. Each prompt file exports:
- `SYSTEM_PROMPT: string`
- A builder function that takes typed parameters and returns the user message string

### 13.1 Natural Language Search Prompt

```typescript
// prompts/search.ts

export const SYSTEM_PROMPT = `
You are an intelligent university event search assistant.
You receive a catalogue of events as JSON and a natural language query from a student.
Your task is to identify the most relevant events, even if no exact keywords match.
You reason semantically: "machine learning workshop" should match events about AI, TensorFlow, or data science.

Respond ONLY with a valid JSON object in this exact structure:
{
  "results": [
    {
      "eventId": "string",
      "relevanceScore": number (0-100),
      "justification": "string (max 80 words, in French)"
    }
  ]
}

Rules:
- Maximum 5 results. If nothing is relevant, return { "results": [] }.
- Do not include any text outside the JSON object.
- justification must be in French and explain WHY this event matches the query.
- Only include events from the provided catalogue.
`

export function buildSearchMessage(query: string, events: EventSummary[]): string {
  return `
Query: "${query}"

Event catalogue:
${JSON.stringify(events, null, 0)}
`
}
```

### 13.2 Recommendations Prompt

```typescript
// prompts/recommendations.ts

export const SYSTEM_PROMPT = `
You are a personalised university event recommendation engine.
You receive a student's history (favourited and registered events) and a catalogue of upcoming events.
Identify 3 upcoming events that best match the student's demonstrated interests.
Do NOT recommend events already in the student's history.

Respond ONLY with valid JSON:
{
  "recommendations": [
    {
      "eventId": "string",
      "rank": 1,
      "justification": "string (max 80 words, in French, explaining the match)"
    }
  ]
}

Rules:
- Exactly 3 recommendations if possible, fewer if catalogue is small.
- rank 1 is the strongest match.
- No text outside the JSON object.
`

export interface UserHistory {
  favorited: { title: string; category: string; tags: string[] }[]
  registered: { title: string; category: string; tags: string[] }[]
}

export function buildRecommendationMessage(
  history: UserHistory,
  upcomingEvents: EventSummary[]
): string {
  return `
Student history:
${JSON.stringify(history, null, 0)}

Upcoming events catalogue:
${JSON.stringify(upcomingEvents, null, 0)}
`
}
```

### 13.3 Planning Prompt

```typescript
// prompts/planning.ts

export const SYSTEM_PROMPT = `
You are a university scheduling assistant.
You receive a student's time constraints in natural language and a list of events happening this week.
Your task is to suggest a conflict-free participation schedule.

Respond ONLY with valid JSON:
{
  "planning": [
    {
      "eventId": "string",
      "dayLabel": "string (e.g. 'LUN', 'MAR')",
      "startTime": "string (e.g. '14:00')",
      "status": "suggested" | "conflict",
      "note": "string (optional, max 60 words, in French)"
    }
  ],
  "summary": "string (2-3 sentence French summary of the suggested week)"
}

Rules:
- Flag genuine conflicts (event during stated blocked time) with status "conflict".
- Do not include past events.
- No text outside the JSON object.
`

export function buildPlanningMessage(
  constraints: string,
  weekEvents: EventSummary[]
): string {
  return `
Student constraints: "${constraints}"

Events this week:
${JSON.stringify(weekEvents, null, 0)}
`
}
```

### 13.4 Q&A Prompt

```typescript
// prompts/qa.ts

export const SYSTEM_PROMPT = `
You are a knowledgeable university campus assistant.
You have access to the full event catalogue as JSON.
Answer the student's question accurately, referring only to information present in the catalogue.
If the answer is not in the catalogue, say so clearly.

Respond ONLY with valid JSON:
{
  "answer": "string (in French, max 200 words)",
  "relatedEventIds": ["string"] // event IDs mentioned in the answer, max 5
}

Rules:
- answer must be in French.
- Do not invent events or details not present in the catalogue.
- No text outside the JSON object.
`

export function buildQAMessage(
  question: string,
  allEvents: EventSummary[]
): string {
  return `
Question: "${question}"

Full event catalogue:
${JSON.stringify(allEvents, null, 0)}
`
}
```

---

## 14. Business Rules & Validation

### 14.1 Registration Rules

| Condition | Behaviour |
|---|---|
| Event is past | Registration button disabled |
| Event is full (`registeredCount >= capacity`) | Registration button disabled |
| Already registered | Show "Annuler" button instead |
| Double registration attempt | `UNIQUE` constraint in SQLite — catch error gracefully |
| Cancel registration | Set status = 'cancelled'; decrement `registeredCount` |

### 14.2 Event Form Validation

| Field | Rule |
|---|---|
| Titre | Non-empty after trim |
| Description | Non-empty after trim |
| Catégorie | Must be one of the 5 valid values |
| Date début | Valid date, must be set |
| Date fin | If set: must be > date début |
| Lieu | Non-empty after trim |
| Capacité | If set: integer ≥ 1 |
| Tags | Each tag: non-empty string, max 30 chars |

Show error messages inline, below each field. Do not show a global error toast — field-level errors are preferred.

### 14.3 Search Rules

- Search is client-side via SQLite `LIKE '%query%'` on `title`
- Minimum 1 character to trigger search
- Debounced at 300ms
- Case-insensitive

### 14.4 Data Integrity

- `registeredCount` is never decremented below 0
- When `deleteEvent` is called, SQLite cascade removes registrations and favorites automatically
- All IDs are generated with `crypto.randomUUID()` (available in Expo SDK 49+)
- All dates stored and compared as ISO 8601 strings

---

## 15. Error & Empty States

### 15.1 `EmptyState` Component

```typescript
// components/ui/EmptyState.tsx
// Props: icon: string (Tabler icon name), title: string, subtitle?: string, action?: { label, onPress }
// Layout: centered, icon at 48px in Colors.purpleLight circle, title sectionTitle, subtitle caption
```

| Screen | Empty message |
|---|---|
| Catalogue | "Aucun événement pour le moment" |
| Catalogue (search) | "Aucun résultat pour « {query} »" |
| Favorites | "Pas encore de favoris. Explorez le catalogue !" |
| Registrations | "Aucune inscription. Découvrez les événements !" |
| AI search | "Aucun événement correspondant trouvé" |
| AI recommendations | "Inscrivez-vous à des événements pour recevoir des recommandations" |

### 15.2 `ErrorState` Component

```typescript
// components/ui/ErrorState.tsx
// Props: message: string, onRetry: () => void
// Layout: centered, ti-wifi-off icon in dangerLight circle, message, "Réessayer" button
```

AI error messages (from `LLMError.statusCode`):

| Code | Message |
|---|---|
| 401 | "Clé API invalide. Vérifiez vos paramètres." |
| 429 | "Quota API dépassé. Réessayez dans quelques minutes." |
| Network | "Pas de connexion internet. Vérifiez votre réseau." |
| Other | "Erreur inattendue (code {X}). Réessayez." |

### 15.3 AI Cache Fallback

If a network error occurs and a cached result exists for the same `type` + `inputText`:
- Show the `ErrorState` component
- Below it, show a yellow banner: "Un résultat en cache du {date} est disponible"
- Button: "Voir le résultat en cache" → renders the cached result with a "EN CACHE" grey badge

### 15.4 Loading States

| Context | Loading UI |
|---|---|
| Event list | 3× `SkeletonCard` |
| Event detail | Skeleton for banner + 4 metadata rows |
| AI call in progress | Loading spinner (ActivityIndicator in `Colors.purple`) + "L'assistant analyse…" text + all AI buttons disabled |
| App boot (session check) | Full-screen splash: logo centered on `Colors.dark` |

---

## 16. Bonus Features

### 16.1 Enhanced Profile

- Stored in `AsyncStorage` (not SQLite — no need to relate to events)
- Fields: `filiere`, `annee`, `interests: string[]`
- When present: injected into recommendations and planning system prompts as an additional context block:
  ```
  Student profile: Filière: Génie Informatique, Année: Master 1, Interests: IA/ML, Cloud
  ```

### 16.2 LLM Comparison — "Lequel me convient le mieux ?"

- On any two event detail screens: a "Comparer" button (appears in a persistent compare bar at bottom when 2 events are selected)
- Sends both events + user profile to a comparison prompt
- Returns a recommendation with justification

### 16.3 Weekly Digest

- New AI hub card: "Résumé de la semaine"
- Prompt returns a narrative paragraph: "Cette semaine sur le campus, X événements sont prévus…"
- Cached with key `summary_week_{weekNumber}`

### 16.4 Push Notifications

```typescript
// At registration: ask permission with expo-notifications
// Schedule local notification:
//   trigger: { date: new Date(event.startDateTime) - 60 * 60 * 1000 }
//   content: { title: '🎓 Rappel', body: `${event.title} commence dans 1 heure` }
```

### 16.5 Admin JSON Export

- Admin list screen: `ti-download` button in header
- Exports all events as `events_export_YYYYMMDD.json`
- Uses `expo-sharing` to share the file

---

## 17. Seed Data

Run on first launch (after `initDatabase`), only if `getAllEvents()` returns an empty array.

```typescript
// database/seed.ts
const SEED_EVENTS = [
  {
    title: "Machine Learning avec TensorFlow",
    description: "Découvrez les fondamentaux du ML avec TensorFlow 2.x. Travaux pratiques sur des datasets réels incluant classification d'images et prédiction de séries temporelles.",
    category: "Workshop",
    startDateTime: "2026-05-26T14:00:00",
    endDateTime: "2026-05-26T17:00:00",
    locationName: "Amphi B",
    locationAddress: "Bâtiment Sciences, Université Abdelmalek Essaâdi",
    organizerName: "Club IA Campus",
    capacity: 30,
    tags: ["python", "machine-learning", "tensorflow", "data-science"],
  },
  {
    title: "Entrepreneuriat & Startups Tech",
    description: "Table ronde avec 4 fondateurs de startups marocaines sur les défis du financement, du recrutement et de la croissance en phase early-stage.",
    category: "Talk",
    startDateTime: "2026-05-27T10:00:00",
    endDateTime: "2026-05-27T12:00:00",
    locationName: "Salle C1",
    organizerName: "Bureau des Étudiants",
    capacity: 80,
    tags: ["startup", "entrepreneuriat", "financement", "carrière"],
  },
  {
    title: "IEEE Student Branch — Monthly Meet",
    description: "Réunion mensuelle du club IEEE. Présentation des projets en cours, annonces des prochaines compétitions et hackathons internationaux.",
    category: "Club",
    startDateTime: "2026-05-28T16:00:00",
    locationName: "Salle D2",
    organizerName: "IEEE Student Branch UAE",
    tags: ["ieee", "électronique", "networking", "compétition"],
  },
  {
    title: "Workshop Design System avec Figma",
    description: "Maîtrisez la création de design systems professionnels avec Figma : composants, variantes, auto-layout et tokens. Projet pratique inclus.",
    category: "Workshop",
    startDateTime: "2026-05-30T15:00:00",
    endDateTime: "2026-05-30T18:00:00",
    locationName: "Labo Design",
    organizerName: "Club UX/UI",
    capacity: 20,
    tags: ["figma", "design", "ui-ux", "design-system"],
  },
  {
    title: "Data Science avec Python — Initiation",
    description: "Introduction aux bibliothèques numpy, pandas et matplotlib. Nettoyage de données, analyse exploratoire et première visualisation sur un dataset réel.",
    category: "Workshop",
    startDateTime: "2026-06-02T14:00:00",
    endDateTime: "2026-06-02T17:00:00",
    locationName: "Labo Informatique 2",
    organizerName: "Département Informatique",
    capacity: 25,
    tags: ["python", "data-science", "pandas", "visualisation"],
  },
  {
    title: "Kubernetes & DevOps — Introduction",
    description: "Déploiement d'applications avec Kubernetes, Docker, et CI/CD. Comprendre les architectures cloud-native et les pipelines modernes.",
    category: "Workshop",
    startDateTime: "2026-06-04T09:00:00",
    endDateTime: "2026-06-04T12:00:00",
    locationName: "Salle Réseau",
    organizerName: "Club DevOps",
    capacity: 20,
    tags: ["kubernetes", "docker", "devops", "cloud"],
  },
  {
    title: "Cérémonie de remise des diplômes 2026",
    description: "Cérémonie officielle de remise des diplômes de la promotion 2025-2026. Accueil des familles et autorités universitaires.",
    category: "Other",
    startDateTime: "2026-06-15T10:00:00",
    locationName: "Amphi Principal",
    organizerName: "Administration",
    tags: ["diplômes", "cérémonie", "promotion-2026"],
  },
  {
    title: "Exam Algorithmique Avancée",
    description: "Examen final du module Algorithmique Avancée. Calculatrice non autorisée. Durée : 2h30.",
    category: "Exam",
    startDateTime: "2026-05-22T08:00:00",
    endDateTime: "2026-05-22T10:30:00",
    locationName: "Amphi A",
    organizerName: "Département Informatique",
    tags: ["algorithmique", "exam", "informatique"],
  },
]
```

---

## 18. Environment & Security

### 18.1 `.env` File

```bash
# .env  — never commit this file
EXPO_PUBLIC_ANTHROPIC_KEY=sk-ant-...
```

### 18.2 `.env.example` File (committed)

```bash
# .env.example — copy to .env and fill in your values
EXPO_PUBLIC_ANTHROPIC_KEY=your_anthropic_api_key_here
```

### 18.3 `.gitignore` (required entries)

```
.env
*.env.local
node_modules/
.expo/
```

### 18.4 Data Transmitted to LLM

**Never transmit:**
- User email or password (even hashed)
- Session tokens
- Full event descriptions over 200 characters
- Device identifiers

**Always transmit as `EventSummary`**, not full `Event` objects. The `EventSummary` type (see §6) deliberately excludes `imageUrl` and truncates `description`.

### 18.5 AI Warning

The AI hub and every AI feature screen must display the privacy warning defined in §10.1. It cannot be dismissed or hidden.

---

*Université Abdelmalek Essaâdi — Département Informatique*  
*Specification generated: May 2026*
