# Arquitectura de Astris

## Resumen

Astris es una aplicación React + Vite + TypeScript de página única (SPA) diseñada para conectar talento neurodivergente con empresas comprometidas con la inclusión laboral. Utiliza React Router basado en URL search params para la navegación, lazy loading con `React.lazy()` y `Suspense` para code splitting, i18n con i18next para 4 idiomas, y Supabase como backend.

---

## Estructura de Carpetas

```
src/
├── App.tsx                        # Componente raíz: enrutamiento, estado global
├── main.tsx                       # Entry point, renderiza <BrowserRouter>
├── assets/                        # Imágenes estáticas
├── components/
│   ├── common/                    # Componentes compartidos: NavBar, MatchBadge, RadarViz, etc.
│   ├── modals/                    # Modales: Language, Login, Register, UpdatePassword
│   └── ui/                        # Componentes UI genéricos (Radix UI wrappers)
├── hooks/
│   ├── useAuth.ts                 # Lógica de autenticación y sesión
│   ├── useCanGoBack.ts            # Hook para detectar si se puede navegar atrás
│   └── useTheme.ts                # Gestión de tema: paleta, modo oscuro, fuente
├── i18n/
│   ├── i18n.ts                    # Configuración de i18next
│   ├── useT.ts                    # Hook useT, helpers de traducción
│   ├── content.ts                 # Contenido estático: quiz axes, paletas
│   ├── es.json / en.json / pt.json / fr.json  # Traducciones
├── mock/                          # Datos mock para desarrollo offline
├── pages/
│   ├── public/                    # Landing, About, Support, Partners
│   │   └── about/                 # Subcomponentes de AboutPage
│   ├── candidate/                 # Onboarding, Quiz, Profile, Vacancies, etc.
│   ├── company/                   # OrgProfile, PostVacancy, Candidates, PostHire
│   ├── mentor/                    # Dashboard, Checkins, Companies
│   ├── admin/                     # AdminDashboard + vistas (Overview, Users, etc.)
│   └── shared/                    # NotFoundPage, SettingsPage
├── services/
│   ├── supabase.ts                # Cliente Supabase, auth CRUD, matching
│   └── supabase-admin.ts          # Funciones administrativas
├── styles/                        # CSS global, Tailwind, tema, fuentes
└── types/
    └── index.ts                   # Tipos compartidos: Lang, Role, PaletteKey, etc.
```

---

## Sistema de Enrutamiento

- **BrowserRouter** en `main.tsx`
- **Navegación basada en search params**: `?screen=...&view=...`
- `setScreen()` y `setPublicView()` mutan los search params con `replace: true`
- `handleBackTo()` usa `useCanGoBack()` para decidir entre `navigate(-1)` o fallback
- `popstate` listener en App.tsx sincroniza el estado con botones atrás/adelante del navegador
- **Todas las rutas de página** se cargan con `React.lazy()` + `Suspense`

### Mapa de screens por rol

| Rol | Screens |
|-----|---------|
| **candidate** | onboarding, quiz, profile, vacancies, vacancy-detail, mentor-select, accompaniment, post-hire, tracking |
| **company** | org-profile, post-vacancy, candidates, candidate-detail, comp-post-hire, post-hire |
| **mentor** | dashboard, checkins, companies |
| **admin** | dashboard (con sub-vistas vía estado interno) |

---

## Sistema de Traducción (i18n)

- **i18next** + **react-i18next** con **LanguageDetector**
- 4 idiomas: español (es), inglés (en), portugués (pt), francés (fr)
- Los JSON de traducción se importan estáticamente en `i18n.ts`
- `useT()` hook devuelve la función `t()` de react-i18next
- `C(lang, key)` para acceso programático a objetos anidados
- **Claves de traducción con naming semántico**: `modality.remote`, `vacancy.full_time`, `common.loading`, etc.
- **Idioma persistido** en `localStorage` bajo `astris_lang`

---

## Gestión de Estado

| Estado | Ubicación | Propósito |
|--------|-----------|-----------|
| Autenticación | `useAuth()` hook | Sesión, rol, login/logout/register |
| Tema | `useTheme()` hook | Paleta, modo oscuro, fuente (persistidos en localStorage) |
| Navegación | App.tsx (useState) | Screen actual, vista pública, quiz, selecciones |
| Traducciones | i18next | Contexto global de idioma |

No se usa React Context directamente para el estado global—los hooks pasan valores como props a los componentes.

---

## Autenticación

- **Supabase Auth** con email/password y Google OAuth
- **Modo demo**: usuarios hardcodeados (`candidato@astris.org`, `empresa@astris.org`, `mentor@astris.org`) con contraseña `Demo2026`
- **Admin backdoor**: `johansttivelinaresb@gmail.com` con `Astris2026`
- Flujo: `getCurrentUser()` → detecta sesión → redirige a screen inicial según rol
- Perfil de usuario en tabla `users_profiles` en Supabase

---

## Principios de Diseño

- **DRY**: lógica repetitiva extraída a hooks o servicios
- **Code Splitting**: lazy loading en todas las rutas
- **Modularidad**: cada componente/página en su propio archivo
- **Accesibilidad**: atributos ARIA, labels en formularios, contraste suficiente
- **Responsive**: Tailwind CSS con breakpoints md, lg
- **Estilo**: interfaces accesibles con paletas personalizables y modo oscuro

---

## Decisiones Técnicas Clave

1. **URL search params en lugar de rutas anidadas** para state de navegación—simplifica el enrutamiento y evita rutas duplicadas
2. **Traducciones en JSON plano** en lugar de archivos namespace—simple para el alcance actual
3. **Modo demo sin backend**—permite desarrollo y testeo offline
4. **Recharts para gráficos** (RadarChart) en lugar de bibliotecas más pesadas
