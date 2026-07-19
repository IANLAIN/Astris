# Astris

Conectando talento con entornos laborales adaptativos.

Astris es una plataforma web SPA que empareja talento diverso con empresas comprometidas con la inclusion laboral real, mediante un sistema de matching basado en estilos de trabajo, necesidades ambientales y ajustes razonables — no en diagnosticos.

---

## Caracteristicas

- Perfilado en 4 ejes: Procesamiento, Tolerancia Ambiental, Ejecucion y Ajustes Razonables — cuestionario interactivo en 4 pasos
- Matching inteligente: Compatibilidades calculadas objetivamente entre candidatos y empresas segun modalidad, ajustes y entorno
- Acompanamiento con mentor: Guia personalizada desde la preparacion hasta el dia 60 post-contratacion, con check-ins y seguimiento
- 4 idiomas: Espanol (base), Ingles, Portugues y Frances — con deteccion automatica del navegador
- Interfaz accesible: 4 paletas de colores personalizables (Calm Blue, Warm Earth, High Contrast, Natural Green), modo oscuro, fuente para dislexia (OpenDyslexic)
- Modo demo completo: Explora la plataforma sin backend con credenciales predefinidas para candidato, empresa, mentor y admin
- Sin backend requerido: Todo funciona offline con datos de demostracion
- Admin dashboard: Panel administrativo con gestion de usuarios, empresas, candidatos y vacantes
- Code Splitting: Cada pagina se carga bajo demanda con React.lazy() — chunks de menos de 10 KB por pagina

---

## Stack Tecnologico

| Capa | Tecnologia | Version |
|------|-----------|---------|
| Framework | React | 18 |
| Lenguaje | TypeScript | 6 (strict: true) |
| Build | Vite | 6 |
| Enrutamiento | React Router DOM | 7 (search params) |
| Estilos | Tailwind CSS | 4 |
| UI | Radix UI + Lucide Icons | latest |
| i18n | i18next + react-i18next | latest |
| Backend | Demo offline (sin backend) | — |
| Graficos | Recharts (RadarChart) | 3 |
| Animaciones | Framer Motion | 12 |
| Formularios | react-hook-form | 7 |

Ver ARCHITECTURE.md para detalles tecnicos completos.

---

## Instalacion

```bash
git clone https://github.com/IANLAIN/Astris.git
cd Astris
npm install
npm run dev
```

La aplicacion estara disponible en http://localhost:5173.

### Requisitos

- Node.js 18+
- npm 9+
- No se necesita conexion a internet ni variables de entorno. Todo funciona offline.

---

## Comandos Disponibles

| Comando | Descripcion |
|---------|------------|
| npm run dev | Inicia servidor de desarrollo Vite con HMR |
| npm run build | Compila para produccion (type-check + bundle) |
| npm run deploy | Despliega a GitHub Pages |
| npm run update-logo | Actualiza el logo desde SVG/PNG vectorizado |

---

## Modo Demo (sin backend)

Astris funciona completamente offline con datos de demostracion. No necesitas configurar Supabase ni ninguna base de datos.

### Usuarios demo

| Rol | Email | Contrasena | Que veras |
|-----|-------|-----------|-----------|
| Candidato | candidato@astris.org | Demo2026 | Perfil de Bryan Gonzalez (TDAH, Ing. Sistemas), radar de compatibilidad, vacantes de Vibra Latina y Closer To The Stars con % de match |
| Empresa | empresa@astris.org | Demo2026 | Dashboard de Vibra Latina, candidatos con compatibilidad, vacantes activas (Full Stack + Disenador Grafico) |
| Mentor | mentor@astris.org | Demo2026 | Dashboard de Elena Vargas, procesos activos, check-ins, empresas vinculadas |
| Admin | johansttivelinaresb@gmail.com | Astris2026 | Panel administrativo con usuarios, empresas, candidatos y vacantes |

### Empresas demo

- **Vibra Latina** — Corporacion audiovisual con sede en Houston, TX. Especializada en produccion de contenido sobre responsabilidad social, educacion y STEM para la comunidad hispana bilingue. Vacantes: Desarrollador Full Stack (94% match) y Disenador Grafico (87% match).
- **Closer To The Stars Foundation** — Fundacion sin fines de lucro dedicada a la divulgacion cientifica y exploracion espacial. Vacante: Gerente de Administracion de Sistemas (82% match).

---

## Roles y Flujo

### Candidato
1. Onboarding: Configura paleta de colores, modo oscuro y fuente
2. Quiz de caracterizacion: 4 ejes × 4 preguntas sobre estilo de trabajo y necesidades
3. Perfil: Visualiza tu radar de compatibilidad con ajustes recomendados
4. Vacantes: Explora ofertas con porcentaje de match (Vibra Latina, Closer To The Stars)
5. Seleccion de mentor: Elige acompanamiento profesional
6. Acompanamiento: Seguimiento pre y post-contratacion

### Empresa
1. Perfil organizacional: Define filosofia, ajustes y entorno laboral
2. Publicar vacantes: Describe el rol, modalidad y ajustes ofrecidos
3. Explorar candidatos: Visualiza perfiles con porcentajes de compatibilidad
4. Seleccion y post-contratacion: Proceso de acompanamiento

### Mentor
1. Dashboard: Visualiza procesos activos y candidatos asignados con reportes de actividad
2. Check-ins: Realiza seguimiento estructurado
3. Empresas: Gestiona relaciones con organizaciones asociadas

---

## Estructura del Proyecto

```
src/
  App.tsx                   # Raiz: enrutamiento condicional + lazy loading + modales + tema
  main.tsx                  # Entry point: BrowserRouter + render
  assets/                   # Imagenes estaticas optimizadas
  components/
    common/                 # Componentes compartidos (NavBar, MatchBadge, RadarViz, etc.)
    modals/                 # LanguageModal, LoginModal, RegisterModal, UpdatePasswordModal
    ui/                     # Radix UI wrappers (button, dialog, card, dropdown-menu, etc.)
  hooks/                    # useAuth, useTheme, useCanGoBack
  i18n/                     # Traducciones (es, en, pt, fr) + configuracion + datos estaticos
  services/
    demoData.ts             # TODOS los datos de demostracion
    supabase.ts             # API demo: auth, matching, checkins, admin
    supabase-admin.ts       # Funciones admin demo
  pages/                    # Paginas organizadas por rol
    public/                 # LandingPage, AboutPage, SupportPage, PartnersPage
    candidate/              # Onboarding, Quiz, Profile, Vacancies, Mentor, Accompaniment
    company/                # OrgProfile, PostVacancy, Candidates, PostHire
    mentor/                 # Dashboard, Checkins, Companies
    admin/                  # AdminDashboard + subvistas
    shared/                 # NotFoundPage, SettingsPage
  styles/                   # CSS global (Tailwind v4, tema, fuentes)
  types/                    # Tipos TypeScript compartidos
```

---

## Despliegue

```bash
npm run build
npm run deploy
```

El sitio se publica en https://astris.port0.org.

Tambien puedes copiar el contenido de dist/ a cualquier hosting estatico (Netlify, Vercel, Cloudflare Pages).

Nota: Al ser una app 100% offline con datos demo, no se necesita configuracion de servidor backend ni variables de entorno.

---

## Principios de Desarrollo

| Principio | Descripcion |
|-----------|-------------|
| Code Splitting | Toda pagina se carga con React.lazy(). Prohibido imports estaticos de paginas. |
| DRY | Logica repetida a hooks. API calls a servicios. JSX repetido a componentes. |
| Modularidad | 1 archivo = 1 componente/hook/servicio. Carpetas por rol y tipo. |
| Limite de tamano | Archivos maximo 150 lineas. Funciones maximo 40 lineas. Componentes maximo 100 lineas JSX. |
| i18n first | Todo texto visible en 4 idiomas. Prohibido texto hardcodeado. |
| Sin archivos basura | Sin .bak, .old, temporales, logs, o datos personales en el repo. |
| Sin store global | Estado local en hooks + URL + localStorage. Sin Context API, Redux o Zustand. |
| Sin backend | Todo funciona offline con datos demo. No hay dependencia externa. |

Ver CONTRIBUTING.md para la guia completa de contribucion.

---

## Documentacion

- ARCHITECTURE.md — Decisiones tecnicas, estructura del codigo, flujos de autenticacion y enrutamiento
- CONTRIBUTING.md — Guia para contribuir: estandares de codigo, code splitting, i18n, DRY, limpieza de archivos

---

## Licencia

ISC 2025-2026 Astris

---

## Agradecimientos

- Vibra Latina (https://www.vibralatinatx.com/) — Inspiracion y apoyo
- The Genuine Foundation (https://genuinecup.org/) — Colaboracion en inclusion laboral
- Todos los contribuyentes y personas que hacen posible este proyecto
