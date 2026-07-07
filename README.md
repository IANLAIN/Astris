# Astris - Plataforma de Inclusión Laboral Adaptativa

Astris es una plataforma tecnológica diseñada para facilitar la inserción al mercado laboral de personas con diferentes estilos cognitivos, sensoriales y de aprendizaje, a través de un perfilamiento por habilidades y necesidades reales (procesamiento de información, tolerancia ambiental, ejecución de tareas y ajustes razonables).

## Arquitectura y Estructura del Proyecto

Tras una auditoría y refactorización masiva, el proyecto se ha organizado siguiendo principios de modularidad, DRY (Don't Repeat Yourself), y Clean Architecture para facilitar la mantenibilidad y escalabilidad.

```
/src
├── assets/          # Imágenes, fuentes, íconos y assets estáticos generales.
├── components/      # Componentes UI reutilizables (divididos en common/, modals/ y ui/ para Shadcn).
├── context/         # Contextos globales de React (Theme, Auth, etc.).
├── hooks/           # Hooks personalizados (e.g. useAuth, useTheme).
├── i18n/            # Internacionalización y contenido de la app.
├── mock/            # Datos mockeados y de prueba (hasta la conexión total con el backend).
├── pages/           # Vistas principales de la aplicación, separadas por rol (admin, candidate, company, mentor, public, shared).
├── services/        # Lógica de negocio pura y conexión externa (Supabase, API).
├── styles/          # Estilos globales (globals.css, tailwind.css, theme.css).
├── types/           # Interfaces y tipos globales de TypeScript.
├── App.tsx          # Componente raíz que maneja el layout global y las rutas a alto nivel.
└── main.tsx         # Punto de entrada de la aplicación (React 18).
```

### Tecnologías Clave

- **Vite + React 18**: Herramientas de empaquetado y librería de UI principal.
- **TypeScript**: Tipado estático estricto.
- **Tailwind CSS + Shadcn**: Sistema de diseño rápido y modular. Accesibilidad priorizada.
- **Supabase**: Backend como servicio (BaaS) para autenticación y base de datos (lógica encapsulada en `src/services`).

## Configuración y Entorno de Desarrollo

Para comenzar a desarrollar en local:

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Levantar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

3. **Construir para producción**:
   ```bash
   npm run build
   ```

## Normas de Desarrollo

Todo agente o desarrollador que colabore en Astris debe leer y acatar estrictamente los documentos de gobierno del proyecto antes de modificar código:

1. **[CONTRIBUTING.md](./CONTRIBUTING.md)**: Guía detallada sobre la estructura de archivos, convenciones de nomenclatura (PascalCase para componentes, camelCase para hooks), prohibición estricta de archivos temporales/basura, política de imágenes optimizadas (< 200 KB) y requerimientos para commits.
2. **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Explicación de las decisiones de diseño clave, como el uso del ecosistema Vite + React, ruteo mediante estado (con Code Splitting obligatorio usando `React.lazy`), la centralización de traducciones (4 idiomas), y la filosofía de diseño ético del perfil de 4 ejes.
3. **[.cursorrules](./.cursorrules)**: Reglas core automatizadas para agentes de Inteligencia Artificial que resumen las normativas de DRy, i18n y limpieza de código.

**Puntos Clave:**
- **DRY (Don't Repeat Yourself)**: La lógica redundante debe ser extraída a custom hooks (`src/hooks/`) o utilidades compartidas.
- **Limpieza Absoluta**: Nunca dejes código comentado sin justificación, archivos `.bak`, `.old`, o copias sin procesar de Figma.
- **Validación Continua**: Es obligatorio ejecutar `npm run build` y asegurar la compilación completa antes de realizar cualquier commit en el repositorio.
