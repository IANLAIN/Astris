# Guía de Contribución

## Stack Tecnológico

- **Frontend**: React 18 + TypeScript 6 + Vite 6
- **Estilos**: Tailwind CSS v4 con `@tailwindcss/vite`
- **UI Components**: Radix UI primitives + Lucide icons
- **Enrutamiento**: React Router DOM v7, search params
- **Estado**: Hooks locales (ningún store global)
- **i18n**: i18next + react-i18next
- **Backend**: Supabase (Auth + PostgreSQL)
- **Gráficos**: Recharts

## Estándares de Código

### TypeScript

- **Strict mode**: `strict: true` en tsconfig.json
- **No `any`**: tipar explícitamente todas las funciones, props y estados
- **Imports**: usar alias `@/` para `src/`

### Estructura de Archivos

- **Un componente por archivo** (export named function)
- **Páginas** en `src/pages/{role}/{PageName}.tsx`
- **Componentes compartidos** en `src/components/common/`
- **Hooks** en `src/hooks/`
- **Servicios** en `src/services/`
- **Traducciones** en `src/i18n/{lang}.json`

### Nombres

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Componentes | PascalCase | `CandidateVacancies` |
| Hooks | camelCase, prefijo `use` | `useAuth`, `useTheme` |
| Funciones | camelCase, verbo | `getCurrentUser`, `handleLogin` |
| Tipos | PascalCase | `Lang`, `Role`, `VacancyItem` |
| Props | PascalCase con sufijo `Props` | `AboutPageProps` |
| Claves i18n | namespace + dot notation | `modality.remote`, `common.loading` |

### Traducciones

Toda cadena visible al usuario DEBE:

1. Definirse en `src/i18n/es.json` (español como lengua base)
2. Traducirse a los otros 3 idiomas: `en.json`, `pt.json`, `fr.json`
3. Usar claves semánticas con naming namespace: `<ámbito>.<nombre>`

```tsx
// ✅ Correcto
<button>{t("vacancies.filters")}</button>

// ❌ Incorrecto (clave no semántica)
<button>{t("auto.filtros._32")}</button>
```

### Code Splitting

Todas las páginas deben cargarse con `React.lazy()` en `App.tsx`:

```tsx
const MyPage = lazy(() => import("@/pages/role/MyPage").then(m => ({ default: m.MyPage })));
```

### Principios DRY

- Lógica repetitiva → extraer a hook o utilidad
- JSX repetido → extraer a componente
- Misma API call → centralizar en servicio

## Flujo de Trabajo con Git

1. Crear rama desde `main`: `git checkout -b feature/mi-cambio`
2. Hacer cambios incrementales con commits descriptivos
3. Ejecutar `npm run build` antes de abrir PR (debe pasar sin errores)
4. Hacer PR a `main` con descripción del cambio

## Testing

- No hay suite de tests formal (pendiente para futura iteración)
- Verificar manualmente con `npm run dev` y `npm run build`

## Añadir Nuevas Traducciones

1. Agregar clave:valor en `src/i18n/es.json`
2. Traducir en `en.json`, `pt.json`, `fr.json`
3. Usar `t("clave")` en el componente
4. Para arrays/objetos anidados, usar `C(lang, "clave")`

## Añadir Nueva Página

1. Crear archivo `src/pages/{role}/{PageName}.tsx`
2. Exportar función con nombre
3. En `App.tsx`: importar con `React.lazy()`
4. Añadir condición de renderizado según `screen` y `role`
5. Si es navegable desde navbar, añadir al array de navegación en `NavBar.tsx`

## Estilos

- Usar **Tailwind CSS** con clases utilitarias
- Variables CSS para tema: `var(--primary)`, `var(--card)`, etc.
- Radix UI para componentes interactivos avanzados
- No crear nuevos archivos CSS a menos que sea estrictamente necesario
