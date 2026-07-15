# 🌟 Astris

**Conectando talento con entornos laborales adaptativos.**

Astris es una plataforma web SPA que empareja talento diverso con empresas comprometidas con la inclusión laboral real, mediante un sistema de matching basado en estilos de trabajo, necesidades ambientales y ajustes razonables — no en diagnósticos.

---

## ✨ Características

- **Perfilado en 4 ejes**: Procesamiento, Tolerancia Ambiental, Ejecución y Ajustes Razonables — cuestionario interactivo en 4 pasos
- **Matching inteligente**: Compatibilidades calculadas objetivamente entre candidatos y empresas según modalidad, ajustes y entorno
- **Acompañamiento con mentor**: Guía personalizada desde la preparación hasta el día 60 post-contratación, con check-ins y seguimiento
- **4 idiomas**: Español (base), Inglés, Portugués y Francés — con detección automática del navegador
- **Interfaz accesible**: 4 paletas de colores personalizables (Calm Blue, Warm Earth, High Contrast, Natural Green), modo oscuro, fuente para dislexia (Lexend)
- **Modo demo completo**: Explora la plataforma sin backend con credenciales predefinidas para candidato, empresa y mentor
- **Admin dashboard**: Panel administrativo con gestión de usuarios, empresas, candidatos y vacantes
- **Code Splitting**: Cada página se carga bajo demanda con `React.lazy()` — chunks de < 10 KB por página

---

## 🚀 Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Framework** | React | 18 |
| **Lenguaje** | TypeScript | 6 (strict: true) |
| **Build** | Vite | 6 |
| **Enrutamiento** | React Router DOM | 7 (search params) |
| **Estilos** | Tailwind CSS | 4 |
| **UI** | Radix UI + Lucide Icons | latest |
| **i18n** | i18next + react-i18next | latest |
| **Backend** | Supabase (Auth + PostgreSQL) | opcional |
| **Gráficos** | Recharts (RadarChart) | 3 |
| **Animaciones** | Framer Motion | 12 |
| **Formularios** | react-hook-form | 7 |

Ver [`ARCHITECTURE.md`](./ARCHITECTURE.md) para detalles técnicos completos.

---

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/IANLAIN/Astris.git
cd Astris

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

### Requisitos

- Node.js 18+
- npm 9+

---

## 🔧 Comandos Disponibles

| Comando | Descripción |
|---------|------------|
| `npm run dev` | Inicia servidor de desarrollo Vite con HMR |
| `npm run build` | Compila para producción (type-check + bundle) |
| `npm run deploy` | Despliega a GitHub Pages |
| `npm run update-logo` | Actualiza el logo desde SVG/PNG vectorizado |

---

## 🧪 Modo Demo

Usa estas credenciales predefinidas para explorar la plataforma sin backend:

| Rol | Email | Contraseña | Qué verás |
|-----|-------|-----------|-----------|
| **Candidato** | `candidato@astris.org` | `Demo2026` | Perfil completo, radar, vacantes con match, mentor, acompañamiento |
| **Empresa** | `empresa@astris.org` | `Demo2026` | Dashboard de candidatos, perfiles con compatibilidad, postulación de vacantes |
| **Mentor** | `mentor@astris.org` | `Demo2026` | Dashboard con procesos activos, check-ins, lista de empresas asignadas |
| **Admin** | `johansttivelinaresb@gmail.com` | `Astris2026` | Panel administrativo con usuarios, empresas, candidatos y vacantes |

> **Nota**: El modo demo funciona completamente offline. No se necesita conexión a Supabase ni variables de entorno.

---

## 👥 Roles y Flujo

### Candidato
1. **Onboarding**: Configura paleta de colores, modo oscuro y fuente
2. **Quiz de caracterización**: 4 ejes × 4 preguntas sobre estilo de trabajo y necesidades
3. **Perfil**: Visualiza tu radar de compatibilidad
4. **Vacantes**: Explora ofertas con porcentaje de match
5. **Selección de mentor**: Elige acompañamiento profesional
6. **Acompañamiento**: Seguimiento pre y post-contratación

### Empresa
1. **Perfil organizacional**: Define filosofía, ajustes y entorno laboral
2. **Publicar vacantes**: Describe el rol, modalidad y ajustes ofrecidos
3. **Explorar candidatos**: Visualiza perfiles con porcentajes de compatibilidad
4. **Selección y post-contratación**: Proceso de acompañamiento

### Mentor
1. **Dashboard**: Visualiza procesos activos y candidatos asignados
2. **Check-ins**: Realiza seguimiento estructurado
3. **Empresas**: Gestiona relaciones con organizaciones asociadas

---

## 📁 Estructura del Proyecto

```
src/
├── App.tsx                   # Raíz: enrutamiento condicional + lazy loading + modales + tema
├── main.tsx                  # Entry point: BrowserRouter + render
├── assets/                   # Imágenes estáticas optimizadas
├── components/
│   ├── common/               # Componentes compartidos (NavBar, MatchBadge, RadarViz, etc.)
│   ├── modals/               # LanguageModal, LoginModal, RegisterModal, UpdatePasswordModal
│   └── ui/                   # Radix UI wrappers (button, dialog, card, dropdown-menu, etc.)
├── hooks/                    # useAuth, useTheme, useCanGoBack
├── i18n/                     # Traducciones (es, en, pt, fr) + configuración + datos estáticos
├── mock/                     # Datos de demostración (vacantes, mentores, candidatos)
├── pages/                    # Páginas organizadas por rol
│   ├── public/               # LandingPage, AboutPage, SupportPage, PartnersPage
│   ├── candidate/            # Onboarding, Quiz, Profile, Vacancies, Mentor, Accompaniment
│   ├── company/              # OrgProfile, PostVacancy, Candidates, PostHire
│   ├── mentor/               # Dashboard, Checkins, Companies
│   ├── admin/                # AdminDashboard + subvistas
│   └── shared/               # NotFoundPage, SettingsPage
├── services/                 # Supabase (cliente, auth, matching, admin)
├── styles/                   # CSS global (Tailwind v4, tema, fuentes)
└── types/                    # Tipos TypeScript compartidos
```

---

## 🌐 Despliegue

El proyecto está configurado para desplegarse en GitHub Pages:

```bash
# Compilar para producción
npm run build

# Desplegar a GitHub Pages
npm run deploy
```

El sitio se publica en `https://astris.port0.org`.

También puedes hacer deploy manual copiando el contenido de `dist/` a cualquier hosting estático (Netlify, Vercel, Cloudflare Pages).

---

## 🧠 Principios de Desarrollo

Este proyecto sigue estos principios estrictamente:

| Principio | Descripción |
|-----------|-------------|
| **Code Splitting** | Toda página se carga con `React.lazy()`. Prohibido imports estáticos de páginas. |
| **DRY** | Lógica repetida → hooks. API calls → servicios. JSX repetido → componentes. |
| **Modularidad** | 1 archivo = 1 componente/hook/servicio. Carpetas por rol y tipo. |
| **Límite de tamaño** | Archivos ≤ 150 líneas. Funciones ≤ 40 líneas. Componentes ≤ 100 líneas JSX. |
| **i18n first** | Todo texto visible en 4 idiomas. Prohibido texto hardcodeado. |
| **Sin archivos basura** | Sin `.bak`, `.old`, temporales, logs, o datos personales en el repo. |
| **Sin store global** | Estado local en hooks + URL + localStorage. Sin Context API, Redux o Zustand. |

Ver [`CONTRIBUTING.md`](./CONTRIBUTING.md) para la guía completa de contribución.

---

## 📖 Documentación

- [**ARQUITECTURA.md**](./ARCHITECTURE.md) — Decisiones técnicas, estructura del código, flujos de autenticación y enrutamiento
- [**CONTRIBUTING.md**](./CONTRIBUTING.md) — Guía para contribuir: estándares de código, code splitting, i18n, DRY, limpieza de archivos

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Revisa [`CONTRIBUTING.md`](./CONTRIBUTING.md) para conocer:

- Estándares de código y TypeScript
- Code splitting obligatorio
- Sistema de traducciones
- Principio DRY
- Organización modular de carpetas
- Limpieza de archivos antes de commit
- Flujo de trabajo con Git

---

## 📄 Licencia

ISC © 2025–2026 Astris

---

## 🙏 Agradecimientos

- [Vibra Latina](https://www.vibralatinatx.com/) — Inspiración y apoyo
- [The Genuine Foundation](https://genuinecup.org/) — Colaboración en inclusión laboral
- Todos los contribuyentes y personas que hacen posible este proyecto
