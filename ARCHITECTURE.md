# Arquitectura de Astris

Este documento detalla las decisiones técnicas clave que guían el desarrollo de Astris y el razonamiento detrás de las mismas.

## 1. Stack Tecnológico Principal

- **Vite + React + TypeScript**: Elegimos Vite por su velocidad de compilación extrema y HMR instantáneo, lo que acelera el ciclo de desarrollo en comparación con CRA o Webpack. React ofrece el ecosistema de componentes maduro que necesitamos para interfaces accesibles, y TypeScript asegura la seguridad de tipos, reduciendo errores en tiempo de ejecución.
- **Tailwind CSS v4 + Radix UI**: Tailwind permite prototipar y construir diseños consistentes rápidamente mediante clases utilitarias. Radix UI proporciona las bases sin estilos para componentes interactivos (modales, menús, acordeones) garantizando que cumplan con los estándares de accesibilidad WAI-ARIA (esenciales para nuestra plataforma).

## 2. Enrutamiento y Performance (Code Splitting)

- **Gestión de Vistas Dinámicas**: Aunque el proyecto cuenta con dependencias como `react-router`, gran parte de la navegación principal para la experiencia de los usuarios autenticados se maneja mediante estado global (`screen` y `publicView` en `App.tsx`) para proporcionar una sensación de SPA ultrafluida.
- **Lazy Loading**: Para asegurar que el "Time to Interactive" (TTI) sea mínimo, todos los componentes de página se importan utilizando `React.lazy()` y se envuelven en un límite `<Suspense>`. Esto instruye a Vite/Rollup para realizar **Code Splitting**, descargando los fragmentos de código solo cuando el usuario navega a esa pantalla en específico.

## 3. Internacionalización (i18n) en 4 Idiomas

- **Implementación**: Utilizamos `react-i18next` con detección automática de idioma (`i18next-browser-languagedetector`). 
- **Centralización**: A diferencia de arquitecturas tradicionales con múltiples archivos JSON (que suelen causar desincronización de claves), en Astris centralizamos **todo** el contenido textual en un único gran diccionario `src/i18n/content.ts`. Esto permite a los desarrolladores y agentes de IA tener el contexto completo de las traducciones en los cuatro idiomas (Español, Inglés, Portugués, Francés) simultáneamente. Un hook personalizado `useT` facilita su consumo.

## 4. Filosofía de Producto: Enfoque Ético

Astris está diseñado para revolucionar la contratación inclusiva eliminando los sesgos clínicos. Esto se traduce en el código mediante reglas de dominio claras:
- **No Etiquetar, No Invadir**: La plataforma no almacena ni procesa diagnósticos clínicos (ej. Autismo, TDAH). En su lugar, parametriza al individuo usando un **Modelo de 4 Ejes**:
  1. *Procesamiento y Comunicación* (cómo recibe la información).
  2. *Tolerancia Ambiental* (ruido, luz, distracciones).
  3. *Ejecución y Tareas* (estilo de trabajo).
  4. *Ajustes Razonables* (herramientas o flexibilidad necesaria).
- **Matching Objetivo**: El algoritmo de conexión ("Radar Cognitivo") realiza coincidencias entre lo que el candidato necesita y lo que la empresa puede ofrecer basándose exclusivamente en esos cuatro ejes. 

## 5. Integración Backend (Supabase)

- **Supabase**: Empleamos Supabase como Backend-as-a-Service (BaaS) debido a su robusta integración con PostgreSQL y su sistema de autenticación nativa.
- **Servicios**: Toda la comunicación se abstrae en `src/services/supabase.ts`. Se utilizan Políticas de Seguridad de Filas (RLS) en la base de datos para garantizar la privacidad, asegurando que empresas no puedan ver nombres o fotos de candidatos hasta que haya un match formal.

## 6. Variables y Diseño Visual

- **CSS Dinámico**: Las paletas de colores están mapeadas a variables CSS genéricas (ej. `--primary`, `--background`, `--card`) que permiten la adaptación instantánea a temas oscuros/claros o a requerimientos de alto contraste, cumpliendo la promesa del pilar "ADAPTAR".
