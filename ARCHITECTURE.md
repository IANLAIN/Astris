# Astris Architecture

## Overview

Astris is a React + Vite + TypeScript SPA that connects diverse talent with inclusive companies through matching based on work styles, environmental needs, and reasonable accommodations — not on diagnoses.

It uses React Router DOM v7 with search params for navigation, React.lazy() + Suspense for mandatory code splitting, i18next for 4 languages, and a fully offline demo data system with no backend dependency.

---

## Current Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 18 |
| Language | TypeScript | 6 (strict: true) |
| Build | Vite | 6 |
| Routing | React Router DOM | 7 (search params) |
| Styles | Tailwind CSS | 4 |
| UI primitives | Radix UI | latest |
| Icons | Lucide React | 0.487 |
| i18n | i18next + react-i18next + LanguageDetector | latest |
| Backend | Demo offline (no backend) | — |
| Demo data | src/services/demoData.ts | complete |
| Charts | Recharts | 3 |
| Animations | Framer Motion (via motion package) | 12 |
| Bundle Analysis | Vite rollupOptions.manualChunks | built-in |

---

## Folder Structure

```
src/
  App.tsx                    # Root: conditional routing by screen + role, modals, theme, Suspense
  main.tsx                   # Entry point: BrowserRouter + render + style/i18n imports
  vite-env.d.ts              # Vite types

  assets/                    # Images (.png, .webp) — no embedded text, < 200 KB

  components/
    common/                  # Shared components: NavBar, MatchBadge, RadarViz,
                             #   CollaboratorCarousel, AnimatedBar, Overlay
    modals/                  # LanguageModal, LoginModal, RegisterModal, UpdatePasswordModal
    ui/                      # Radix UI wrappers shadcn-style: button, dialog, card, form, etc.

  hooks/
    useAuth.ts               # Authentication: session, role, quizCompleted, demo users, CRUD auth
    useCanGoBack.ts          # Detect navigable history (window.history.state.idx)
    useTheme.ts              # Palette, dark mode, font — persisted in localStorage

  i18n/
    i18n.ts                  # i18next configuration (LanguageDetector, resources)
    useT.ts                  # useT() hook, helpers: C(), computeRadar(), getPaletteName(), getInitialLang()
    content.ts               # Static data NOT translated via i18n: QUIZ_AXES (4 axes × 4 questions), PALETTES (4 palettes)
    es.json                  # Spanish translations (base)
    en.json                  # English translations
    pt.json                  # Portuguese translations
    fr.json                  # French translations

  mock/                      # Demo data re-export
    index.ts                 # Re-exports everything from @/services/demoData

  services/
    demoData.ts              # ALL demo data: users, vacancies, mentors, companies, admin
    supabase.ts              # Demo API: auth, matching, profiles, checkins, admin functions
    supabase-admin.ts        # Admin demo functions: stats, users, companies, logs

  pages/
    public/                  # LandingPage, AboutPage, SupportPage, PartnersPage
      PublicPageShell        # Shared layout for public pages
    candidate/               # CandidateOnboarding, CandidateQuiz, CandidateProfile,
                             #   CandidateVacancies, VacancyDetail, MentorSelect,
                             #   CandidateAccompaniment, CandidatePostHire
    company/                 # CompanyOrgProfile, CompanyPostVacancy, CompanyCandidates,
                             #   CompanyCandidateDetail, CompanyPostHire
    mentor/                  # MentorDashboard, MentorCheckins, MentorCompanies
    admin/                   # AdminDashboard + subviews
      views/                 # OverviewView, UsersView, CompaniesView, CandidatesView, JobsView
    shared/                  # NotFoundPage, SettingsPage

  styles/
    index.css                # Entry point: imports all CSS
    globals.css              # Resets and base styles
    tailwind.css             # Tailwind v4 directives (@import "tailwindcss")
    theme.css                # Theme CSS variables (--primary, --background, etc.)
    fonts.css                # @font-face for Atkinson Hyperlegible, Lexend, Inter

  types/
    index.ts                 # Lang, Role, PaletteKey, FontKey, QuizAnswers, VacancyItem, MentorItem, etc.
```

---

## Routing System

- **BrowserRouter** in `main.tsx`
- **Search param navigation**: `?screen=...&view=...`

### Key Functions

| Function | Location | Behavior |
|----------|----------|----------|
| parseParams() | src/App.tsx | Reads window.location.search on each render, returns { screen, publicView } |
| setScreen(s) | App.tsx (useCallback) | navigate("?screen=" + s, { replace: false }) — creates a real history entry |
| setPublicView(v) | App.tsx (useCallback) | navigate("?view=" + v) — for public pages |
| handleBackTo(fallback) | App.tsx | If history exists -> navigate(-1); otherwise -> setScreen(fallback) |
| useCanGoBack() | src/hooks/useCanGoBack.ts | Returns window.history.state?.idx > 0 |

### Screen Map by Role

| Role | Screens |
|------|---------|
| candidate | onboarding, quiz, profile, vacancies, vacancy-detail, mentor-select, accompaniment, post-hire, tracking |
| company | org-profile, post-vacancy, candidates, candidate-detail, comp-post-hire, post-hire |
| mentor | dashboard, checkins, companies |
| admin | dashboard (subviews with internal state + sidebar) |

### Mandatory Quiz Block

- `quizCompleted` is persisted in localStorage as `astris_quiz_completed` (boolean)
- Initial load: useEffect in useAuth() reads it from storage
- While quizCompleted === false, the candidate can ONLY see onboarding and quiz
- Any other screen shows a blocker: "Perfil incompleto" with a button to go to characterization
- The blocker renders directly in App.tsx

---

## Code Splitting — Mandatory

Every page MUST be loaded with React.lazy() + Suspense. No static page imports allowed.

### Correct pattern for named exports

```tsx
const CandidateProfile = lazy(() =>
  import("@/pages/candidate/CandidateProfile").then(m => ({ default: m.CandidateProfile }))
);
```

### Correct pattern for default exports

```tsx
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
```

### Fallback

All lazy pages render within:

```tsx
<Suspense fallback={
  <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
    <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
      style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }}>
    </div>
  </div>
}>
```

### Build chunk splitting (vite.config.ts)

```ts
manualChunks(id: string) {
  if (id.includes('node_modules')) {
    if (id.includes('motion'))     return 'vendor-framer';
    if (id.includes('recharts'))   return 'vendor-recharts';
    if (id.includes('lucide-react')) return 'vendor-lucide';
    if (id.includes('@radix-ui'))  return 'vendor-radix';
    return 'vendor-core';
  }
}
```

Each page chunk should be < 10 KB. Vendor chunks are separated by library to maximize caching.

---

## Translation System (i18n)

### Architecture

| File | Purpose |
|------|---------|
| src/i18n/i18n.ts | Initializes i18next with LanguageDetector and resources from 4 JSON files |
| src/i18n/useT.ts | useT() hook, helpers: C() (nested object access), computeRadar(), getPaletteName(), getInitialLang(), getInitialModalStep() |
| src/i18n/content.ts | Static data NOT translated via i18n: QUIZ_AXES (questions with stems/opts in 4 languages), PALETTES (colors) |
| src/i18n/{es,en,pt,fr}.json | Flat translations with semantic keys |

### Rules

1. **User-visible text** MUST be in the JSON files, not hardcoded
2. **Semantic keys**: `scope.key` (e.g., modality.remote, vacancy.full_time, common.loading)
3. **Data with nested language structure** (questions, palettes) go in content.ts with `{ es, en, pt, fr }` objects
4. **Programmatic access to arrays/objects**: C(lang, "accompStages") returns the translated object
5. **Language persisted** in localStorage["astris_lang"]
6. All dashboards (candidate, company, mentor, admin) must use t() for every user-visible string

### Adding new translations

1. Add "key": "value" in src/i18n/es.json
2. Translate in en.json, pt.json, fr.json
3. Use t("key") in TSX

---

## State Management — No Global Store

| State | Location | Persistence |
|-------|----------|-------------|
| Authentication / role | useAuth() hook | localStorage for demo |
| Theme (palette, dark, font) | useTheme() hook | localStorage["astris_palette"], localStorage["astris_dark"], localStorage["astris_font"] |
| Navigation (screen, view) | URL search params | URL (shareable, navigable with browser back button) |
| Quiz answers / axis | useState in App.tsx | Not persisted |
| Quiz completed | useAuth().quizCompleted | localStorage["astris_quiz_completed"] |
| Translations | i18next context | Cookie / localStorage via LanguageDetector |
| Selected vacancy | useState in App.tsx | Not persisted |
| Selected candidate | useState in App.tsx | Not persisted |

No Context API or global store (Redux, Zustand, Jotai). Hooks are used directly from App.tsx and pass values as props to pages.

---

## Authentication

### Demo mode (no backend)

| Role | Email | Password | ID |
|------|-------|----------|-----|
| Candidate | candidato@astris.org | Demo2026 | demo-cand |
| Company | empresa@astris.org | Demo2026 | demo-comp |
| Mentor | mentor@astris.org | Demo2026 | demo-ment |
| Admin | johansttivelinaresb@gmail.com | Astris2026 | backdoor |

### Flow

1. App.tsx -> useAuth(setScreen, setModalStep) executes on mount
2. getCurrentUser(): checks localStorage["astris_demo_user"] -> if matches demo, returns mock data
3. If no demo, returns null
4. If demo session exists: returns { id, email, name, role, avatarUrl, vocation, completedOnboarding, profile }
5. Based on role, redirects to the initial screen
6. Admin: uses localStorage["astris_admin_session"] to persist session

---

## Demo Data System

All demo content lives in `src/services/demoData.ts`:

| Data | Description |
|------|-------------|
| DEMO_USERS | Demo user credentials and profiles |
| ADMIN_CREDENTIALS | Administrator credentials |
| VACANCIES_FALLBACK | Vacancies: Vibra Latina (Full Stack, Designer) and Closer To The Stars (Sys Admin) |
| MENTORS_FALLBACK | 4 available mentors |
| CANDIDATE_RADAR_FINAL | Bryan Gonzalez radar profile |
| CANDIDATE_ADJUSTMENTS | Candidate adjustments for display |
| COMPANY_CANDIDATES_DATA | Company candidates with matches |
| MENTOR_PROCESSES | Active mentor processes |
| MENTOR_COMPANIES | Companies linked to mentor |
| ADMIN_STATS / ADMIN_USERS / ADMIN_COMPANIES / ADMIN_CANDIDATES | Admin panel data |

No internet connection or environment variables needed. Everything works offline.

---

## Architecture Principles

| Principle | Implementation |
|-----------|---------------|
| Code Splitting | React.lazy() on every page in App.tsx. Chunks < 10 KB per page. Separate vendor chunks. |
| DRY | Repeated logic to hooks (useAuth, useTheme). API calls to services (supabase.ts). Repeated JSX to common components. |
| Modularity | 1 file = 1 component/hook/service. Folders by role (public, candidate, company, mentor, admin) and type (common, ui, modals, hooks, services). |
| One file, one responsibility | No files > 150 lines. Functions < 40 lines. Components < 100 lines of JSX. |
| No spaghetti code | Clear separation: logic (hooks), data (services), presentation (components), config (i18n), types (types/). |
| No static page imports | Every page imported with React.lazy(). Static imports of pages prohibited. |
| No junk files | Before commit: remove .bak, .old, temp scripts, orphan files. |
| No personal data | Never commit tokens, API keys, personal emails in code. Use .env (included in .gitignore). |
| No console.log | Remove debugging logs before commit. |
| No commented code | No commented blocks. If unused, remove. |
| Accessibility | ARIA labels, roles, forms with label, sufficient contrast in palettes, dyslexia font (OpenDyslexic). |
| Responsive | Tailwind breakpoints sm, md, lg. Collapsible radar on mobile. Mobile menu with toggle. |

---

## Key Technical Decisions

1. **Search params instead of nested routes**: avoids complex React Router hierarchies, navigation state is the URL itself, supports natural back button navigation.
2. **i18n with flat JSON**: simple, no namespaces, one file per language. Structured data (questions, palettes) goes in content.ts with `{ es, en, pt, fr }` format.
3. **Demo mode without backend**: full offline development without external dependency. All data lives in src/services/demoData.ts. Demo credentials verified in useAuth.handleLogin().
4. **Recharts (RadarChart)**: lightweight, sufficient for 4-axis radar profile.
5. **localStorage for quizCompleted**: avoids external calls on each render to verify quiz status.
6. **Radix UI + Tailwind**: headless accessible components with utility styles. No heavy component libraries.
7. **Vite manualChunks**: strategic vendor separation for maximum HTTP caching. vendor-supabase chunk removed (no longer needed).

---

## Performance Considerations

- All pages are lazy-loaded: the user only downloads what they visit
- Vendors are cached independently: if only page code changes, vendors are not re-downloaded
- img assets manually optimized (< 200 KB, .webp when possible)
- No global re-renders: each page receives only the props it needs
- No Context API: avoids unnecessary re-renders in the component tree
- No Supabase dependency: removes ~30KB from the bundle, reduces load times
