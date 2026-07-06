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

## Notas de Desarrollo (Guía Rápida)

- **Alias de Importación**: Se ha configurado el alias `@/` para apuntar a la carpeta `src/`. Usa `@/components/...` o `@/services/...` en lugar de rutas relativas complejas como `../../../`.
- **Hooks Globales**: La lógica del tema (colores, fuentes) y de la sesión (login, roles) ha sido desacoplada de la interfaz gráfica y movida a `src/hooks/useTheme.ts` y `src/hooks/useAuth.ts`.
- **Sin Dependencia de Figma**: Todos los componentes exportados automáticamente por Figma y archivos temporales residuales han sido completamente eliminados. Utiliza los componentes base en `src/components/ui/` (construidos con Tailwind y Radix) para mantener un ecosistema limpio.
