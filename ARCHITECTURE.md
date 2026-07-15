# Arquitectura de Astris

## Resumen

Astris es una SPA React + Vite + TypeScript para conectar talento diverso con empresas inclusivas mediante matching basado en estilos de trabajo, necesidades ambientales y ajustes razonables — no en diagnósticos.

Usa React Router DOM v7 con **search params** para navegación, `React.lazy()` + `<Suspense>` para **code splitting obligatorio**, i18next para 4 idiomas, y Supabase como backend opcional con modo demo offline.

---

## Stack Tecnológico Actual

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | React | 18 |
| Lenguaje | TypeScript | 6 (strict: true) |
| Build | Vite | 6 |
| Enrutamiento | React Router DOM | 7 (search params) |
| Estilos | Tailwind CSS | 4 |
| UI primitives | Radix UI | latest |
| Iconos | Lucide React | 0.487 |
| i18n | i18next + react-i18next + LanguageDetector | latest |
| Backend | Supabase (Auth + PostgreSQL) | opcional |
| Gráficos | Recharts | 3 |
| Animaciones | Framer Motion (via motion package) | 12 |
| Bundle Analysis | Vite rollupOptions.manualChunks | incorporado |

---

## Estructura de Carpetas

```
src/
├── App.tsx                    # Raíz: enrutamiento condicional por screen + role, modales, tema, Suspense
├── main.tsx                   # Entry point: BrowserRouter + render + import de estilos/i18n
├── vite-env.d.ts              # Tipos Vite
│
├── assets/                    # Imágenes (.png, .webp) — sin texto incrustado, < 200 KB
│
├── components/
│   ├── common/                # Componentes compartidos: NavBar, MatchBadge, RadarViz,
│   │                          #   CollaboratorCarousel, AnimatedBar, Overlay
│   ├── modals/                # LanguageModal, LoginModal, RegisterModal, UpdatePasswordModal
│   └── ui/                    # Radix UI wrappers shadcn-style: button, dialog, card, form, etc.
│
├── hooks/
│   ├── useAuth.ts             # Autenticación: sesión, rol, quizCompleted, demo users, CRUD auth
│   ├── useCanGoBack.ts        # Detectar historial navegable (window.history.state.idx)
│   └── useTheme.ts            # Paleta, dark mode, fuente — persistidos en localStorage
│
├── i18n/
│   ├── i18n.ts                # Configuración i18next (LanguageDetector, resources)
│   ├── useT.ts                # Hook useT(), helpers: C(), computeRadar(), getPaletteName(), getInitialLang()
│   ├── content.ts             # Datos estáticos: QUIZ_AXES (4 ejes × 4 preguntas), PALETTES (4 paletas)
│   ├── es.json                # Traducciones español (base)
│   ├── en.json                # Traducciones inglés
│   ├── pt.json                # Traducciones portugués
│   └── fr.json                # Traducciones francés
│
├── mock/                      # Datos mock offline
│   └── index.ts               # VACANCIES_FALLBACK, MENTORS_FALLBACK, CANDIDATE_RADAR_FINAL,
│                               #   COMPANY_CANDIDATES_DATA, MENTOR_PROCESSES
│
├── pages/
│   ├── public/                # LandingPage, AboutPage, SupportPage, PartnersPage
│   │   └── PublicPageShell    # Layout compartido para páginas públicas (no usado actualmente)
│   ├── candidate/             # CandidateOnboarding, CandidateQuiz, CandidateProfile,
│   │                          #   CandidateVacancies, VacancyDetail, MentorSelect,
│   │                          #   CandidateAccompaniment, CandidatePostHire
│   ├── company/               # CompanyOrgProfile, CompanyPostVacancy, CompanyCandidates,
│   │                          #   CompanyCandidateDetail, CompanyPostHire
│   ├── mentor/                # MentorDashboard, MentorCheckins, MentorCompanies
│   ├── admin/                 # AdminDashboard + subvistas
│   │   └── views/             # OverviewView, UsersView, CompaniesView, CandidatesView, JobsView
│   └── shared/                # NotFoundPage, SettingsPage
│
├── services/
│   ├── supabase.ts            # Cliente Supabase, auth CRUD, matching, demo fallback
│   └── supabase-admin.ts      # Funciones admin: stats, usuarios, empresas, logs
│
├── styles/
│   ├── index.css              # Entry point: importa todos los CSS
│   ├── globals.css            # Resets y estilos base
│   ├── tailwind.css           # Directivas Tailwind v4 (@import "tailwindcss")
│   ├── theme.css              # Variables CSS tema (--primary, --background, etc.)
│   └── fonts.css              # @font-face para Atkinson Hyperlegible, Lexend, Inter
│
├── types/
│   └── index.ts              # Lang, Role, PaletteKey, FontKey, QuizAnswers, VacancyItem, MentorItem, etc.
```

---

## Sistema de Enrutamiento

- **BrowserRouter** en `main.tsx`
- **Navegación por search params**: `?screen=...&view=...`

### Funciones clave

| Función | Ubicación | Comportamiento |
|---------|-----------|----------------|
| `parseParams()` | `src/App.tsx` | Lee `window.location.search` en cada render, retorna `{ screen, publicView }` |
| `setScreen(s)` | `App.tsx` (useCallback) | `navigate("?screen=" + s, { replace: false })` — crea entrada real en el historial |
| `setPublicView(v)` | `App.tsx` (useCallback) | `navigate("?view=" + v)` — para páginas públicas |
| `handleBackTo(fallback)` | `App.tsx` | Si hay historial previo → `navigate(-1)`; si no → `setScreen(fallback)` |
| `useCanGoBack()` | `src/hooks/useCanGoBack.ts` | Retorna `window.history.state?.idx > 0` |

### Mapa de screens por rol

| Rol | Screens |
|-----|---------|
| **candidate** | `onboarding`, `quiz`, `profile`, `vacancies`, `vacancy-detail`, `mentor-select`, `accompaniment`, `post-hire`, `tracking` |
| **company** | `org-profile`, `post-vacancy`, `candidates`, `candidate-detail`, `comp-post-hire`, `post-hire` |
| **mentor** | `dashboard`, `checkins`, `companies` |
| **admin** | `dashboard` (subvistas con estado interno + sidebar) |

### Bloqueo de quiz obligatorio

- `quizCompleted` se persiste en `localStorage` como `astris_quiz_completed` (booleano)
- **Carga inicial**: `useEffect` en `useAuth()` lo lee del almacén
- Mientras `quizCompleted === false`, el candidato **solo** puede ver `onboarding` y `quiz`
- Cualquier otra screen muestra un **bloqueador** "Perfil incompleto" con botón para ir a caracterización
- El bloqueador se renderiza **directamente en App.tsx**

---

## Sistema de Code Splitting — OBLIGATORIO

Toda página **debe** cargarse con `React.lazy()` + `<Suspense>`. No existen imports estáticos de páginas.

### Patrón correcto para named exports

```tsx
const CandidateProfile = lazy(() =>
  import("@/pages/candidate/CandidateProfile").then(m => ({ default: m.CandidateProfile }))
);
```

### Patrón para default exports

```tsx
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
```

### Fallback

Todas las páginas lazy se renderizan dentro de:

```tsx
<Suspense fallback={
  <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
    <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }}></div>
  </div>
}>
```

### Chunk splitting en build (vite.config.ts)

```ts
manualChunks(id: string) {
  if (id.includes('node_modules')) {
    if (id.includes('@supabase')) return 'vendor-supabase';
    if (id.includes('motion'))     return 'vendor-framer';
    if (id.includes('recharts'))   return 'vendor-recharts';
    if (id.includes('lucide-react')) return 'vendor-lucide';
    if (id.includes('@radix-ui'))  return 'vendor-radix';
    return 'vendor-core';
  }
}
```

Cada chunk de página debe pesar **< 10 KB**. Los vendors se separan por librería para maximizar caching.

---

## Sistema de Traducción (i18n)

### Arquitectura

| Archivo | Propósito |
|---------|-----------|
| `src/i18n/i18n.ts` | Inicializa i18next con LanguageDetector y resources de 4 JSON |
| `src/i18n/useT.ts` | Hook `useT()`, helpers: `C()` (acceso a objetos anidados), `computeRadar()`, `getPaletteName()`, `getInitialLang()`, `getInitialModalStep()` |
| `src/i18n/content.ts` | Datos estáticos **no traducidos por i18n**: `QUIZ_AXES` (preguntas con stems/opts en 4 idiomas), `PALETTES` (colores) |
| `src/i18n/{es,en,pt,fr}.json` | Traducciones planas con **claves semánticas** |

### Reglas

1. **Texto visible al usuario** → debe ir en los JSON, no hardcodeado
2. **Claves semánticas**: `ámbito.clave` (ej: `modality.remote`, `vacancy.full_time`, `common.loading`)
3. **Datos con estructura anidada por idioma** (preguntas, paletas) → van en `content.ts` con objetos `{ es, en, pt, fr }`
4. **Acceso programático a arrays/objetos**: `C(lang, "accompStages")` retorna el objeto traducido
5. **Idioma persistido** en `localStorage["astris_lang"]`

### Flujo de carga

1. `i18n.ts` importa estáticamente los 4 JSON
2. LanguageDetector detecta idioma del navegador
3. `getInitialLang()` en useT.ts verifica `localStorage` → navegador → español por defecto
4. `getInitialModalStep()`: si no hay idioma persistido, muestra LanguageModal al primer ingreso
5. `useT(lang)` devuelve la función `t()` de react-i18next

---

## Gestión de Estado — Sin Store Global

| Estado | Ubicación | Persistencia |
|--------|-----------|-------------|
| Autenticación / rol | `useAuth()` hook | Sesión Supabase + localStorage para demo |
| Tema (paleta, dark, font) | `useTheme()` hook | `localStorage["astris_palette"]`, `localStorage["astris_dark"]`, `localStorage["astris_font"]` |
| Navegación (screen, view) | URL search params | URL (compartible, navegable con botón atrás) |
| Quiz answers / axis | `useState` en `App.tsx` | No persiste (se envía a Supabase al completar) |
| Quiz completado | `useAuth().quizCompleted` | `localStorage["astris_quiz_completed"]` |
| Traducciones | Contexto i18next | Cookie / localStorage vía LanguageDetector |
| Vacante seleccionada | `useState` en `App.tsx` | No persiste |
| Candidato seleccionado | `useState` en `App.tsx` | No persiste |

**No hay Context API ni store global** (Redux, Zustand, Jotai). Los hooks se usan directamente desde `App.tsx` y pasan valores como props a las páginas.

---

## Autenticación

### Proveedores

- **Supabase Auth**: email/password, Google OAuth, password recovery
- **Modo demo offline** (sin backend):

| Rol | Email | Contraseña | ID |
|-----|-------|-----------|-----|
| Candidato | `candidato@astris.org` | `Demo2026` | `demo-cand` |
| Empresa | `empresa@astris.org` | `Demo2026` | `demo-comp` |
| Mentor | `mentor@astris.org` | `Demo2026` | `demo-ment` |
| Admin | `johansttivelinaresb@gmail.com` | `Astris2026` | backdoor |

### Flujo

1. `App.tsx` → `useAuth(setScreen, setModalStep)` se ejecuta en el montaje
2. `getCurrentUser()`: verifica primero `localStorage["astris_demo_user"]` → si coincide con demo, retorna datos mock sin llamar a Supabase
3. Si no hay demo, consulta sesión Supabase via `supabase.auth.getSession()`
4. Si hay sesión: lee `users_profiles` → retorna `{ id, email, name, role, avatarUrl, vocation, completedOnboarding, needsRegistration }`
5. Según el rol, redirige a la screen inicial
6. Google OAuth: flujo con `pending_role` y `google_intent` en localStorage para completar registro
7. Password recovery: detectado por `window.location.hash.includes("type=recovery")`

---

## Principios de Arquitectura

| Principio | Implementación |
|-----------|---------------|
| **Code Splitting** | `React.lazy()` en cada página de App.tsx. Chunks < 10 KB por página. Vendor chunks separados. |
| **DRY** | Lógica repetida → hooks (`useAuth`, `useTheme`). API calls → servicios (`supabase.ts`). JSX repetido → componentes comunes. |
| **Modularidad** | 1 archivo = 1 componente/hook/servicio. Carpetas por **rol** (public, candidate, company, mentor, admin) y por **tipo** (common, ui, modals, hooks, services). |
| **Un archivo, una responsabilidad** | Prohibido archivos > 150 líneas. Funciones < 40 líneas. Componentes < 100 líneas de JSX. |
| **Sin código espagueti** | Separación clara: lógica (hooks), datos (servicios), presentación (componentes), configuración (i18n), tipos (types/). |
| **Sin imports estáticos de páginas** | Toda página se importa con `React.lazy()`. Prohibido `import { Pagina } from "./pages/..."`. |
| **Sin archivos basura** | Antes de commit: eliminar `.bak`, `.old`, scripts temporales (`/tmp/*.py`), archivos huérfanos. |
| **Sin datos personales** | Nunca committear tokens, claves API, emails personales en el código. Usar `.env` (incluido en `.gitignore`). |
| **Sin console.log** | Eliminar logs de debugging antes de commit. |
| **Sin código comentado** | No dejar bloques comentados. Si no se usa, se elimina. |
| **Accesibilidad** | ARIA labels, roles, formularios con `<label>`, contraste suficiente en paletas, fuente para dislexia (Lexend). |
| **Responsive** | Tailwind breakpoints `sm`, `md`, `lg`. Radar colapsable en móvil. Mobile menu con toggle. |

---

## Decisiones Técnicas Clave

1. **Search params en vez de rutas anidadas**: evita jerarquías complejas de React Router, el estado de navegación es la URL misma, soporta navegación con botón atrás del navegador de forma natural.
2. **i18n con JSON plano**: simple, sin namespaces, un solo archivo por idioma. Los datos estructurados (preguntas, paletas) van en `content.ts` con formato `{ es, en, pt, fr }`.
3. **Modo demo sin backend**: desarrollo offline completo sin depender de Supabase. Las credenciales demo se verifican en `useAuth.handleLogin()` antes de cualquier llamada a Supabase.
4. **Recharts (RadarChart)**: liviano comparado con alternativas, suficiente para el radar de perfil en 4 ejes.
5. **localStorage para quizCompleted**: evita llamadas a Supabase en cada render para verificar estado del cuestionario.
6. **Radix UI + Tailwind**: componentes headless accesibles con estilos utilitarios. Sin librerías de componentes pesadas.
7. **Vite manualChunks**: separación estratégica de vendors para maximizar caching HTTP y minimizar recarga de librerías al cambiar de página.

---

## Consideraciones de Rendimiento

- Todas las páginas son lazy-loaded: el usuario solo descarga lo que visita
- Los vendors se cachean independientemente: si solo cambia código de página, los vendors no se descargan de nuevo
- `img` assets optimizados manualmente (< 200 KB, .webp cuando es posible)
- Sin re-renders globales: cada página recibe solo las props que necesita
- Sin Context API: evita re-renders innecesarios en el árbol de componentes
