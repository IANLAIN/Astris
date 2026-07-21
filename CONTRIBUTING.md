# Contributing to Astris

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 18 |
| Language | TypeScript | 6 (strict: true) |
| Build | Vite | 6 |
| React Plugin | @vitejs/plugin-react | 4 |
| Tailwind Plugin | @tailwindcss/vite | 4 |
| Routing | React Router DOM | 7 (search params) |
| Styles | Tailwind CSS | 4 |
| UI Components | Radix UI primitives | latest |
| Icons | Lucide React | 0.487 |
| i18n | i18next + react-i18next + LanguageDetector | latest |
| Backend | Demo offline (no backend) | — |
| Demo data | src/services/demoData.ts | complete |
| Charts | Recharts | 3 |
| Animations | Framer Motion (via motion) | 12 |
| Drag & Drop | react-dnd + react-dnd-html5-backend | 16 |
| Forms | react-hook-form | 7 |
| Notifications | sonner | 2 |
| Date picker | react-day-picker | 8 |
| Carousel | embla-carousel-react | 8 |

---

## Code Standards — Mandatory Rules

### TypeScript

- `strict: true` — cannot be disabled
- `any` is prohibited — every function, prop, variable, and state must have an explicit type
- Use the `@/` alias for imports from `src/` (configured in tsconfig.json and vite.config.ts)
- Semantic naming: verbs for functions, nouns for types

### File Structure — Golden Rule

> One file = one component / hook / service / page / type.
> No files exceeding 150 lines. If a file exceeds this limit, split it.

| Type | Location | Export |
|------|----------|--------|
| Pages | src/pages/{role}/{Name}.tsx | export function Name |
| Shared components | src/components/common/{Name}.tsx | export function Name |
| Modals | src/components/modals/{Name}.tsx | export function Name |
| UI primitives | src/components/ui/{component}.tsx | export Component |
| Hooks | src/hooks/useName.ts | export function useName |
| Services | src/services/{name}.ts | export async function name |
| JSON translations | src/i18n/{lang}.json | — (static import in i18n.ts) |
| Static data | src/i18n/content.ts | export const NAME |
| Types | src/types/index.ts | export type Name |
| Demo data | src/services/demoData.ts | export const NAME |

### Size Limits — Strict DRY

| Metric | Limit | Action |
|--------|-------|--------|
| File | <= 150 lines | Extract to subcomponents/children |
| Function | <= 40 lines | Extract subfunctions or hooks |
| Component JSX | <= 100 lines | Split into subcomponents |
| Code line | <= 100 characters | Break to next line |

### Naming Convention

| Element | Convention | Example |
|---------|-----------|---------|
| Components | PascalCase | CandidateVacancies |
| Hooks | camelCase, use prefix | useAuth |
| Functions | camelCase, verb | getCurrentUser, handleLogin |
| Types/Interfaces | PascalCase | Lang, VacancyItem |
| Props | PascalCase + Props | AboutPageProps |
| i18n keys | scope.key | modality.remote |
| Files (components) | PascalCase | CandidateQuiz.tsx |
| Files (hooks/services) | camelCase | useAuth.ts, supabase.ts |
| Constants | UPPER_SNAKE_CASE | VACANCIES_FALLBACK |

### Import Rules

```tsx
// CORRECT — lazy loading for pages
const CandidateProfile = lazy(() =>
  import("@/pages/candidate/CandidateProfile").then(m => ({ default: m.CandidateProfile }))
);

// INCORRECT — static page import (breaks code splitting)
import { CandidateProfile } from "@/pages/candidate/CandidateProfile";

// CORRECT — static import for components, hooks, services
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

// INCORRECT — relative imports when @/ alias exists
import { useAuth } from "../../hooks/useAuth";

// CORRECT — always use @/ for src/ imports
import { Lang } from "@/types";
```

---

## Code Splitting — Mandatory

All page routing MUST use React.lazy() + Suspense. No page may be imported statically.

### Correct pattern

In src/App.tsx:

```tsx
// For components with named export:
const CandidateProfile = lazy(() =>
  import("@/pages/candidate/CandidateProfile").then(m => ({ default: m.CandidateProfile }))
);

// For components with default export:
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
```

### Rendering

All lazy pages render within a single Suspense:

```tsx
<Suspense fallback={<Spinner />}>
  {condition && <MyPage />}
</Suspense>
```

### Vendor Chunks (vite.config.ts)

The build automatically separates libraries into chunks to maximize caching:

| Chunk | Libraries |
|-------|-----------|
| vendor-framer | motion (framer-motion) |
| vendor-recharts | recharts |
| vendor-lucide | lucide-react |
| vendor-radix | @radix-ui/* |
| vendor-core | React, React DOM, React Router, i18next, etc. |

Note: The vendor-supabase chunk was removed since the project no longer depends on Supabase.

---

## Demo Data System

All demo content (no backend) lives in `src/services/demoData.ts`.

### Key files

| File | Purpose |
|------|---------|
| src/services/demoData.ts | All demo data: users, vacancies, mentors, organizations |
| src/services/supabase.ts | API that replaces Supabase: auth, matching, profiles, checkins, admin |
| src/services/supabase-admin.ts | Admin functions that return demo data |

### How to add demo data

1. Open `src/services/demoData.ts`
2. Add/edit the corresponding data array (e.g., `VACANCIES_FALLBACK`)
3. If you need a new API function, add it in `src/services/supabase.ts`
4. The function must return data from `demoData.ts` directly

### How to add a new demo user

```ts
// In src/services/demoData.ts, inside DEMO_USERS
"new@email.com": {
  email: "new@email.com",
  password: "Demo2026",
  id: "demo-new-1",
  role: "candidate",
  name: "New User",
  vocation: "Developer",
  completedOnboarding: true,
  profile: { /* profile data */ },
}
```

---

## Translation System — Strict Rules

Every user-visible string MUST:

1. Be defined in `src/i18n/es.json` (Spanish as base language)
2. Be translated to the other 3 languages: `en.json`, `pt.json`, `fr.json`
3. Use a semantic key in `scope.key` format

### Correct

```tsx
<button>{t("vacancies.filters")}</button>
<p>{t("common.loading")}</p>
```

### Incorrect

```tsx
<button>{t("auto.filtros._32")}</button>          {/* Non-semantic key */}
<button>Filters</button>                           {/* Hardcoded text */}
<button>{t("Filtros")}</button>                   {/* Non-semantic key (direct translation) */}
```

### Structured multi-language data

For arrays, objects, or long text that varies by language, use content.ts with `{ es, en, pt, fr }` objects and access with `C(lang, "key")`:

```tsx
const stages = C(lang, "accompStages") as Array<{label: string; done: boolean; current: boolean}>;
```

### i18n requirement for all dashboards

Every dashboard (candidate, organization, mentor, admin) must use `t()` for every user-visible string. Hardcoded text is prohibited. The following keys must exist in all 4 language files:

- profile.cognitive_profile
- profile.flexible_hours
- profile.async_comm
- profile.quiet_environment
- profile.recent_activity
- profile.up_to_date
- profile.explore_vacancies
- mentor.dash.report
- mentor.dash.accompaniment_hours
- mentor.dash.completed_sessions
- mentor.dash.active_candidates
- mentor.dash.linked_organizations

---

## DRY Principle — How to Apply

| Situation | Solution | Example |
|-----------|----------|---------|
| Same logic in multiple components | Extract to hook | useAuth, useTheme |
| Same API call in multiple places | Centralize in service | supabase.ts — getCurrentUser(), saveCandidateProfile() |
| Same JSX in multiple components | Extract to shared component | MatchBadge, RadarViz, NavBar |
| Same repeated config | Shared constant or type | types/index.ts, content.ts |
| Same repeated style | Reusable Tailwind class or CSS variable | var(--primary), btn-primary |

---

## Modular Folder Organization

```
src/
  pages/                    # 1 page per file, organized by role
    public/                 # Landing, About, Support, Partners
    candidate/              # Onboarding, Quiz, Profile, Vacancies, etc.
    organization/           # OrgProfile, PostVacancy, Candidates, etc.
    mentor/                 # Dashboard, Checkins, Organizations
    admin/                  # Dashboard + views/
    shared/                 # NotFound, Settings

  components/               # Reusable components
    common/                 # NavBar, MatchBadge, RadarViz, etc.
    modals/                 # LanguageModal, LoginModal, etc.
    ui/                     # Radix wrappers (button, dialog, card, etc.)

  hooks/                    # 1 hook per file
  services/                 # demoData.ts + supabase.ts (demo API) + supabase-admin.ts
  i18n/                     # Translations + config + static data
  types/                    # Global types (1 file if manageable)
  mock/                     # Demo data re-export
  styles/                   # Global CSS
  assets/                   # Static images
```

---

## File Cleanup — Before Each Commit

### Mandatory checklist

- [ ] npm run build -> 0 errors, 0 warnings
- [ ] No .bak, .old, .temp, .log files in the repo
- [ ] No temp scripts (/tmp/*.py, extract.mjs, temp_content.mjs, fix_*.py)
- [ ] No tokens, API keys, passwords, or personal emails in code
- [ ] No console.log for debugging
- [ ] No unused imports
- [ ] No commented code
- [ ] No orphan files (created for testing and never deleted)
- [ ] .gitignore covers node_modules/, dist/, .env, *.log, *.bak, temp/, tmp/
- [ ] git status reviewed before commit — only intentional files

### Files that should NEVER be in the repo

```
*.bak, *.old, *.temp, *.log
/tmp/*, /temp/*
.env, .env.local
node_modules/, dist/, build/
.DS_Store
coverage/
.vscode/
temp scripts (extract, fix, convert)
```

---

## Git Workflow

```bash
# 1. Create branch from main
git checkout -b feature/my-change

# 2. Make changes following standards
#    - Mandatory code splitting
#    - DRY applied
#    - Translations in all 4 languages
#    - No junk files

# 3. Verify build
npm run build

# 4. Review what is being committed
git status
git diff --cached

# 5. Commit with semantic message
git add -A
git commit -m "type: short description (< 72 characters)"

# 6. Push and create PR
git push origin feature/my-change
# Create PR to main on GitHub
```

### Commit types

| Prefix | Usage | Example |
|--------|-------|---------|
| fix: | Bug fix | fix: resolve crash in CandidateQuiz when selecting multi-option |
| feat: | New feature | feat: add post-hire tracking view for organizations |
| refactor: | Refactoring without functional change | refactor: remove Supabase dependency, use demo data |
| docs: | Documentation | docs: update ARCHITECTURE.md with new demo system |
| i18n: | Translations | i18n: add onboarding keys in Portuguese and French |
| style: | Styles/CSS without logic change | style: adjust navbar padding on mobile |
| chore: | Cleanup, build, config | chore: remove temp files and update .gitignore |

---

## How to Add a New Page

1. Create `src/pages/{role}/{Name}.tsx` with `export function Name`
2. In `App.tsx`: import with `React.lazy()` following the named export pattern
3. Add render condition in App's JSX based on `screen` and `role`
4. If the page needs quiz data or selections, add state in `App.tsx`
5. If it appears in the navbar, add it to the navigation array in `NavBar.tsx`
6. Add all translations in the 4 i18n JSON files
7. If the page needs data, import from `@/services/demoData` or `@/services/supabase`
8. Verify with `npm run build`

---

## How to Add a New Component

1. Identify if it is: **common** (shared between pages), **modal**, or **UI primitive**
2. Create the file in the corresponding folder: `components/common/Name.tsx`
3. Export `export function Name(props: NameProps)`
4. Use Tailwind CSS + CSS variables for styles
5. If it contains visible text, use `useT()` or receive `lang` as a prop

---

## How to Add a New Hook

1. Create `src/hooks/useName.ts`
2. Export `export function useName(...)`
3. Type **parameters** and **return** explicitly (no `any`)
4. If the hook needs navigation state, receive `setScreen` as a parameter
5. Do not use hooks conditionally inside hooks (follow React hooks rules)

---

## How to Add a New Service

1. If the service needs demo data, add it in `src/services/demoData.ts`
2. Create the function in `src/services/supabase.ts` that returns the data
3. If administrative, use `src/services/supabase-admin.ts`
4. Export `async` functions with explicit return types

---

## Styles

- Use **Tailwind CSS v4** with utility classes (`@import "tailwindcss"`)
- CSS variables for theme: `--primary`, `--background`, `--card`, `--border`, `--muted`, etc.
- Radix UI for interactive components (dropdowns, modals, tooltips, selects)
- **Do not create new CSS files** unless strictly necessary
- Prefer `style={{}}` with CSS variables over separate CSS files
- Images must go in `src/assets/`, be relevant, with no embedded text, and weigh < 200 KB
- Font sizes: use `text-sm` (14px), `text-base` (16px), `text-lg` (18px), `text-xl` (20px), `text-2xl` (24px)
- Font options: Inter (default) or OpenDyslexic (dyslexia-friendly toggle)

---

## Testing

No automated test suite currently (pending). Manual verification:

```bash
# 1. Start development server
npm run dev

# 2. Test complete navigation:
#    - Public landing page
#    - Login as candidate (candidato@astris.org / Demo2026)
#    - Candidate dashboard with Vibra Latina vacancies
#    - Login as organization (organizacion@astris.org / Demo2026)
#    - Organization dashboard with candidates
#    - Login as mentor (mentor@astris.org / Demo2026)
#    - Mentor dashboard with active processes

# 3. Verify compilation
npm run build    # MUST pass with no errors

# 4. Test i18n: switch to each language and verify all strings
```

---

## Documentation

Every new feature must be reflected in:

- `ARCHITECTURE.md` — technical decisions, structure, flows
- `CONTRIBUTING.md` — development guide, how to add new pieces
- `README.md` — general description, stack, installation, commands

---

## Prohibited Practices

| Practice | Status |
|----------|--------|
| Static page imports | Prohibited |
| `any` in TypeScript | Prohibited |
| Files > 150 lines | Prohibited (refactor) |
| Functions > 40 lines | Prohibited (extract) |
| Hardcoded visible text | Prohibited (use i18n) |
| console.log for debugging | Prohibited in commits |
| Commented code | Prohibited in commits |
| .bak, .old, temp files | Prohibited in repo |
| Tokens, keys, emails in code | Prohibited (use .env) |
| Context API / global store | Prohibited (use hooks + props) |
