# Guía de Contribución para Astris

¡Gracias por tu interés en contribuir al proyecto Astris! Para mantener la calidad, legibilidad y el enfoque ético de nuestra plataforma, todos los desarrolladores (humanos y agentes de IA) deben seguir estrictamente estas directrices.

## 1. Estructura de Directorios

El código fuente se encuentra en la carpeta `src/`. Mantenemos una arquitectura modular:

- `assets/`: Imágenes y recursos estáticos. **Regla**: Las imágenes deben estar optimizadas (menos de 200 KB) y preferiblemente en formatos modernos (WebP, SVG o JPEG optimizado).
- `components/`: Componentes reutilizables de React.
  - `common/`: Componentes genéricos (botones, tarjetas, NavBar).
  - `modals/`: Modales de la aplicación (Login, Register).
  - `ui/`: Componentes primitivos base (generalmente basados en Radix UI).
- `hooks/`: Custom hooks de React (`useAuth.ts`, `useTheme.ts`). Mantienen la lógica de estado separada de la vista.
- `i18n/`: Configuración de internacionalización y traducciones. `content.ts` centraliza todos los textos en 4 idiomas.
- `pages/`: Componentes de página, organizados por rol de usuario (`admin/`, `candidate/`, `company/`, `mentor/`, `public/`, `shared/`).
- `services/`: Lógica de integración con APIs externas y base de datos (ej. `supabase.ts`).
- `types/`: Definiciones de interfaces y tipos de TypeScript globales.

## 2. Convenciones de Código

- **Nomenclatura**:
  - Archivos de componentes React: `PascalCase.tsx` (ej. `CandidateProfile.tsx`).
  - Hooks y utilidades: `camelCase.ts` (ej. `useAuth.ts`, `supabase.ts`).
- **Tipado Estricto (TypeScript)**: Evitar el uso de `any`. Definir interfaces claras en `src/types/` para modelos de datos y props.
- **Importaciones**: Usar el alias `@/` configurado en Vite para referenciar la carpeta `src/`. Mantener los imports organizados: primero librerías externas, luego alias internos, finalmente imports relativos.

## 3. Principio DRY (Don't Repeat Yourself)

- Cualquier lógica que se repita en más de dos componentes debe ser extraída a un **custom hook** (en `src/hooks/`) o a un **servicio/utilidad** (en `src/services/` o `src/utils/`).
- Los componentes visuales repetitivos deben centralizarse en `src/components/common/`.

## 4. Code Splitting Obligatorio

- **Todas las rutas y pantallas principales** (`pages/`) deben cargarse de manera diferida utilizando `React.lazy()` y ser envueltas en un bloque `<Suspense>` genérico (gestionado en `App.tsx`).
- No importar de forma síncrona componentes de página pesados, para mantener el bundle inicial (chunk size) lo más pequeño posible.

## 5. Política de Archivos (Limpieza)

- **Prohibido el código basura**: No se permite subir al repositorio archivos temporales, backups o exportaciones sin procesar.
- **Archivos bloqueados**: `.bak`, `.old`, carpetas `temp/`, `backup/`, `figma-exports/`.
- Eliminar cualquier archivo que no esté siendo importado por el proyecto ("archivos huérfanos").

## 6. Internacionalización (i18n)

- **4 Idiomas Obligatorios**: Español (`es`), Inglés (`en`), Portugués (`pt`), Francés (`fr`).
- **Centralización**: Todo texto visible para el usuario debe extraerse y configurarse en el objeto `T` dentro de `src/i18n/content.ts`.
- **Uso**: Utilizar el hook `useT(lang)` en los componentes para acceder a las traducciones. No hardcodear strings en los componentes visuales.

## 7. Estilo y Herramientas

- El proyecto utiliza **Tailwind CSS v4** para los estilos. Mantener el uso de clases utilitarias estandarizadas.
- Los iconos deben provenir de `lucide-react`.
- La paleta de colores corporativos se gestiona mediante variables CSS (`var(--primary)`, `var(--card)`) inyectadas por el hook de tema (`useTheme`). Soporta modos claro y oscuro de manera nativa.

## 8. Flujo de Trabajo y Commits

- **Verificación local**: Es **obligatorio** ejecutar `npm run build` y asegurar que la compilación (TypeScript + Vite) finaliza sin errores antes de realizar un commit.
- **Mensajes de Commit**: Utilizar Conventional Commits (ej. `feat: add candidate dashboard`, `fix: translation issue in navbar`, `refactor: extract logic to useAuth`).
