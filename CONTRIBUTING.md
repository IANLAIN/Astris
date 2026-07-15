# Guía de Contribución — Astris

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Framework** | React | 18 |
| **Lenguaje** | TypeScript | 6 (strict: true) |
| **Build** | Vite | 6 |
| **Plugin React** | @vitejs/plugin-react | 4 |
| **Plugin Tailwind** | @tailwindcss/vite | 4 |
| **Enrutamiento** | React Router DOM | 7 (search params) |
| **Estilos** | Tailwind CSS | 4 |
| **UI Components** | Radix UI primitives | latest |
| **Iconos** | Lucide React | 0.487 |
| **i18n** | i18next + react-i18next + LanguageDetector | latest |
| **Backend** | Supabase (Auth + PostgreSQL) | opcional (~2.108) |
| **Gráficos** | Recharts | 3 |
| **Animaciones** | Framer Motion (via `motion`) | 12 |
| **Drag & Drop** | react-dnd + react-dnd-html5-backend | 16 |
| **Formularios** | react-hook-form | 7 |
| **Notificaciones** | sonner | 2 |
| **Date picker** | react-day-picker | 8 |
| **Carousel** | embla-carousel-react | 8 |

---

## Estándares de Código — Reglas Obligatorias

### TypeScript

- **`strict: true`** — no puede desactivarse
- **Prohibido `any`** — toda función, prop, variable y estado debe tener tipo explícito
- Usar el alias `@/` para imports desde `src/` (configurado en `tsconfig.json` y `vite.config.ts`)
- Nombres semánticos: verbos para funciones, sustantivos para tipos

### Estructura de Archivos — Regla de Oro

> **Un archivo = un componente / hook / servicio / página / tipo.**
> **Prohibido archivos > 150 líneas.** Si un archivo excede este límite, debe dividirse.

| Tipo | Ubicación | Export |
|------|-----------|--------|
| Páginas | `src/pages/{role}/{Nombre}.tsx` | `export function Nombre` |
| Componentes compartidos | `src/components/common/{Nombre}.tsx` | `export function Nombre` |
| Modales | `src/components/modals/{Nombre}.tsx` | `export function Nombre` |
| UI primitives | `src/components/ui/{componente}.tsx` | `export Componente` |
| Hooks | `src/hooks/useNombre.ts` | `export function useNombre` |
| Servicios | `src/services/{nombre}.ts` | `export async function nombre` |
| Traducciones JSON | `src/i18n/{lang}.json` | — (import estático en i18n.ts) |
| Datos estáticos | `src/i18n/content.ts` | `export const NOMBRE` |
| Tipos | `src/types/index.ts` | `export type Nombre` |
| Datos mock | `src/mock/index.ts` | `export const NOMBRE` |

### Límites de Tamaño — DRY Strict

| Métrica | Límite | Acción |
|---------|--------|--------|
| Archivo | ≤ 150 líneas | Extraer a componentes/hijos |
| Función | ≤ 40 líneas | Extraer subfunciones o hooks |
| Componente JSX | ≤ 100 líneas | Dividir en subcomponentes |
| Línea de código | ≤ 100 caracteres | Saltar a la siguiente línea |

### Convención de Nombres

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Componentes | PascalCase | `CandidateVacancies` |
| Hooks | camelCase, prefijo `use` | `useAuth` |
| Funciones | camelCase, verbo | `getCurrentUser`, `handleLogin` |
| Tipos/Interfaces | PascalCase | `Lang`, `VacancyItem` |
| Props | PascalCase + `Props` | `AboutPageProps` |
| Claves i18n | `ámbito.clave` | `modality.remote` |
| Archivos (componentes) | PascalCase | `CandidateQuiz.tsx` |
| Archivos (hooks/servicios) | camelCase | `useAuth.ts`, `supabase.ts` |
| Constantes | UPPER_SNAKE_CASE | `VACANCIES_FALLBACK` |

### Reglas de Importación

```tsx
// ✅ Correcto — lazy loading para páginas
const CandidateProfile = lazy(() =>
  import("@/pages/candidate/CandidateProfile").then(m => ({ default: m.CandidateProfile }))
);

// ❌ INCORRECTO — import estático de páginas (rompe code splitting)
import { CandidateProfile } from "@/pages/candidate/CandidateProfile";

// ✅ Correcto — import estático para componentes, hooks, servicios
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

// ❌ INCORRECTO — imports relativos cuando existe alias @/
import { useAuth } from "../../hooks/useAuth";

// ✅ Correcto — siempre usar @/ para imports de src/
import { Lang } from "@/types";
```

---

## Code Splitting — OBLIGATORIO

Todo el enrutamiento de páginas **debe** usar `React.lazy()` + `<Suspense>`. Ninguna página puede importarse estáticamente.

### Patrón correcto

En `src/App.tsx`:

```tsx
// Para componentes con named export:
const CandidateProfile = lazy(() =>
  import("@/pages/candidate/CandidateProfile").then(m => ({ default: m.CandidateProfile }))
);

// Para componentes con default export:
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
```

### Renderizado

Todas las páginas lazy se renderizan dentro de un solo `<Suspense>`:

```tsx
<Suspense fallback={<Spinner />}>
  {condicion && <MiPagina />}
</Suspense>
```

### Vendor Chunks (vite.config.ts)

El build separa automáticamente las librerías en chunks para maximizar caching:

| Chunk | Librerías |
|-------|-----------|
| `vendor-supabase` | @supabase/supabase-js |
| `vendor-framer` | motion (framer-motion) |
| `vendor-recharts` | recharts |
| `vendor-lucide` | lucide-react |
| `vendor-radix` | @radix-ui/* |
| `vendor-core` | React, React DOM, React Router, i18next, etc. |

---

## Sistema de Traducciones — Reglas Estrictas

Toda cadena visible al usuario **DEBE**:

1. Definirse en `src/i18n/es.json` (español como idioma base)
2. Traducirse a los otros 3 idiomas: `en.json`, `pt.json`, `fr.json`
3. Usar clave semántica con formato `ámbito.clave`

### Correcto

```tsx
<button>{t("vacancies.filters")}</button>
<p>{t("common.loading")}</p>
```

### Incorrecto

```tsx
<button>{t("auto.filtros._32")}</button>          {/* Clave no semántica */}
<button>Filtros</button>                           {/* Texto hardcodeado */}
<button>{t("Filtros")}</button>                   /* Clave no semántica (traducción directa) */
```

### Datos estructurados multilingüe

Para arrays, objetos o texto largo que varía por idioma, usar `content.ts` con objeto `{ es, en, pt, fr }` y acceder con `C(lang, "key")`:

```tsx
const stages = C(lang, "accompStages") as Array<{label: string; done: boolean}>;
```

### Añadir nuevas traducciones

1. Agregar `"clave": "valor"` en `src/i18n/es.json`
2. Traducir en `en.json`, `pt.json`, `fr.json`
3. Usar `t("clave")` en el TSX

---

## Principio DRY — Cómo Aplicarlo

| Situación | Solución | Ejemplo |
|-----------|----------|---------|
| Misma lógica en varios componentes | Extraer a **hook** | `useAuth`, `useTheme` |
| Misma llamada API en varios lugares | Centralizar en **servicio** | `supabase.ts` - `getCurrentUser()`, `saveCandidateProfile()` |
| Mismo JSX en varios componentes | Extraer a **componente compartido** | `MatchBadge`, `RadarViz`, `NavBar` |
| Misma configuración repetida | **Constante o tipo compartido** | `types/index.ts`, `content.ts` |
| Mismo estilo repetido | Clase Tailwind reutilizable o variable CSS | `var(--primary)`, `btn-primary` |

---

## Organización Modular de Carpetas

La estructura de carpetas refleja dos criterios: **rol del usuario** (qué ve) y **tipo de archivo** (qué hace).

```
src/
├── pages/                    # ⬅ 1 página por archivo, organizada por rol
│   ├── public/               #   Landing, About, Support, Partners
│   ├── candidate/            #   Onboarding, Quiz, Profile, Vacancies, etc.
│   ├── company/              #   OrgProfile, PostVacancy, Candidates, etc.
│   ├── mentor/               #   Dashboard, Checkins, Companies
│   ├── admin/                #   Dashboard + views/
│   └── shared/               #   NotFound, Settings
│
├── components/               # ⬅ Componentes reutilizables
│   ├── common/               #   NavBar, MatchBadge, RadarViz, etc.
│   ├── modals/               #   LanguageModal, LoginModal, etc.
│   └── ui/                   #   Radix wrappers (button, dialog, card, etc.)
│
├── hooks/                    # ⬅ 1 hook por archivo
├── services/                 # ⬅ 1 servicio por archivo (o archivo único si es pequeño)
├── i18n/                     # ⬅ Traducciones + config + datos estáticos
├── types/                    # ⬅ Tipos globales (1 archivo si es manejable)
├── mock/                     # ⬅ Datos de demostración
├── styles/                   # ⬅ CSS global
└── assets/                   # ⬅ Imágenes estáticas
```

**Regla**: no crear carpetas innecesarias. Si una carpeta tiene un solo archivo, evaluar si realmente necesita su propia carpeta.

---

## Limpieza de Archivos — Antes de Cada Commit

### Checklist obligatorio

- [ ] `npm run build` → 0 errores, 0 warnings
- [ ] Sin archivos `.bak`, `.old`, `.temp`, `.log` en el repo
- [ ] Sin scripts temporales (`/tmp/*.py`, `extract.mjs`, `temp_content.mjs`, `fix_*.py`)
- [ ] Sin tokens, claves API, contraseñas, o emails personales en el código
- [ ] Sin `console.log` de debugging
- [ ] Sin imports no utilizados
- [ ] Sin código comentado
- [ ] Sin archivos huérfanos (creados para una prueba y nunca eliminados)
- [ ] `.gitignore` cubre `node_modules/`, `dist/`, `.env`, `*.log`, `*.bak`, `temp/`, `tmp/`
- [ ] `git status` revisado antes del commit — solo archivos intencionales

### Archivos que NUNCA deben estar en el repo

```
*.bak, *.old, *.temp, *.log
/tmp/*, /temp/*
.env, .env.local
node_modules/, dist/, build/
.DS_Store
coverage/
.vscode/
scripts/ extract temporales
```

---

## Flujo de Trabajo con Git

```bash
# 1. Crear rama desde main
git checkout -b feature/mi-cambio

# 2. Hacer cambios siguiendo los estándares
#    - Code splitting obligatorio
#    - DRY aplicado
#    - Traducciones en los 4 idiomas
#    - Sin archivos basura

# 3. Verificar build
npm run build

# 4. Revisar qué se va a commitear
git status
git diff --cached

# 5. Commit con mensaje semántico
git add -A
git commit -m "tipo: descripción corta (< 72 caracteres)"

# 6. Push y crear PR
git push origin feature/mi-cambio
# Crear PR a main en GitHub
```

### Tipos de commit

| Prefijo | Uso | Ejemplo |
|---------|-----|---------|
| `fix:` | Corrección de bug | `fix: resolver crash en CandidateQuiz al seleccionar multi-opción` |
| `feat:` | Nueva funcionalidad | `feat: agregar vista de tracking post-contratación para empresas` |
| `refactor:` | Refactorización sin cambio funcional | `refactor: extraer lógica de matching a servicio independiente` |
| `docs:` | Documentación | `docs: actualizar ARCHITECTURE.md con flujo de autenticación` |
| `i18n:` | Traducciones | `i18n: agregar claves de onboarding en portugués y francés` |
| `style:` | Estilos/CSS sin cambio de lógica | `style: ajustar padding del navbar en móvil` |
| `chore:` | Limpieza, build, config | `chore: eliminar archivos temporales y actualizar .gitignore` |

### Reglas de commit

- **Mensaje corto** (< 72 caracteres)
- **Sin datos personales**: no incluir tokens, emails reales, contraseñas en el mensaje
- **Sin archivos basura**: revisar `git status` antes de `git add`
- **Un solo propósito por commit**: no mezclar limpieza con features

---

## Cómo Añadir una Nueva Página

1. Crear `src/pages/{role}/{Nombre}.tsx` con `export function Nombre`
2. En `App.tsx`: importar con `React.lazy()` siguiendo el patrón de named export
3. Añadir condición de render en el JSX de App según `screen` y `role`
4. Si la página requiere datos del quiz o selecciones, añadir estado en `App.tsx`
5. Si aparece en navbar, añadir al array de navegación en `NavBar.tsx`
6. Agregar todas las traducciones en los 4 JSON de i18n
7. Verificar con `npm run build`

---

## Cómo Añadir un Nuevo Componente

1. Identificar si es: **común** (compartido entre páginas), **modal**, o **UI primitiva**
2. Crear archivo en la carpeta correspondiente: `components/common/Nombre.tsx`
3. Exportar `export function Nombre(props: NombreProps)`
4. Usar Tailwind CSS + variables CSS para estilos
5. Si contiene texto visible, usar `useT()` o recibir `lang` como prop

---

## Cómo Añadir un Nuevo Hook

1. Crear `src/hooks/useNombre.ts`
2. Exportar `export function useNombre(...)`
3. Tipar **parámetros** y **retorno** explícitamente (sin `any`)
4. Si el hook necesita estado de navegación, recibir `setScreen` como parámetro
5. No usar hooks dentro de hooks condicionalmente (seguir reglas de React)

---

## Cómo Añadir un Nuevo Servicio

1. Identificar si el servicio es de **Supabase** o de **otra API**
2. Si es de Supabase, agregar función en `src/services/supabase.ts` (o `supabase-admin.ts` si es administrativo)
3. Si merece un archivo propio, crear `src/services/{nombre}.ts`
4. Importar `supabase` desde `./supabase`
5. Exportar funciones `async` con tipo de retorno explícito
6. Usar try-catch para errores y retornar valores por defecto en caso de fallo

---

## Estilos

- Usar **Tailwind CSS v4** con clases utilitarias (`@import "tailwindcss"`)
- Variables CSS para tema: `--primary`, `--background`, `--card`, `--border`, `--muted`, etc.
- Radix UI para componentes interactivos (dropdowns, modales, tooltips, selects)
- **No crear nuevos archivos CSS** a menos que sea estrictamente necesario
- Preferir `style={{}}` con variables CSS sobre archivos CSS separados
- Las imágenes deben ir en `src/assets/`, ser relevantes, sin texto incrustado, y pesar < 200 KB
- Tamaños de fuente: usar `text-sm` (14px), `text-base` (16px), `text-lg` (18px), `text-xl` (20px), `text-2xl` (24px)

---

## Testing

No hay suite automatizada actualmente (pendiente). Verificar manualmente:

```bash
# 1. Iniciar servidor de desarrollo
npm run dev

# 2. Probar navegación completa:
#    - Landing page pública
#    - Registro / Login (demo)
#    - Flujo de onboarding + quiz (candidato)
#    - Dashboard de cada rol

# 3. Verificar compilación
npm run build    # DEBE pasar sin errores
```

---

## Documentación

Toda nueva funcionalidad debe reflejarse en:

- `ARCHITECTURE.md` — decisiones técnicas, estructura, flujos
- `CONTRIBUTING.md` — guía de desarrollo, cómo añadir nuevas piezas
- `README.md` — descripción general, stack, instalación, comandos

---

## Resumen: Lo que NO está permitido

| Práctica | Estado |
|----------|--------|
| Import estático de páginas | ❌ Prohibido |
| `any` en TypeScript | ❌ Prohibido |
| Archivos > 150 líneas | ❌ Prohibido (refactorizar) |
| Funciones > 40 líneas | ❌ Prohibido (extraer) |
| Texto hardcodeado visible | ❌ Prohibido (usar i18n) |
| console.log de debugging | ❌ Prohibido en commits |
| Código comentado | ❌ Prohibido en commits |
| Archivos .bak, .old, temporales | ❌ Prohibido en el repo |
| Tokens, claves, emails en código | ❌ Prohibido (usar .env) |
| Context API / store global | ❌ Prohibido (usar hooks + props) |
