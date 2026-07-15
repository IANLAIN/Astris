# 🌟 Astris

**Conectando talento con entornos laborales adaptativos.**

Astris es una plataforma web que empareja talento neurodivergente con empresas comprometidas con la inclusión laboral real, mediante un sistema de matching basado en estilos de trabajo, necesidades ambientales y ajustes razonables—no en diagnósticos.

---

## ✨ Características

- **Perfilado en 4 ejes**: Procesamiento, Tolerancia Ambiental, Ejecución y Ajustes Razonables
- **Matching inteligente**: Compatibilidades calculadas objetivamente entre candidatos y empresas
- **Acompañamiento con mentor**: Guía personalizada desde la preparación hasta el día 60 post-contratación
- **4 idiomas**: Español, Inglés, Portugués y Francés
- **Interfaz accesible**: Paletas de colores personalizables, modo oscuro, fuente para dislexia
- **Modo demo**: Explora la plataforma sin necesidad de backend

---

## 🚀 Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Framework** | React 18 + TypeScript 6 |
| **Build** | Vite 6 |
| **Estilos** | Tailwind CSS v4 |
| **UI** | Radix UI + Lucide Icons |
| **Enrutamiento** | React Router DOM v7 |
| **i18n** | i18next + react-i18next |
| **Backend** | Supabase (Auth + PostgreSQL) |
| **Gráficos** | Recharts |

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

---

## 🔧 Comandos Disponibles

| Comando | Descripción |
|---------|------------|
| `npm run dev` | Inicia servidor de desarrollo Vite |
| `npm run build` | Compila para producción |
| `npm run deploy` | Despliega a GitHub Pages |
| `npm run update-logo` | Actualiza el logo desde scripts |

---

## 🧪 Modo Demo

Usa estas credenciales predefinidas para explorar la plataforma sin backend:

| Rol | Email | Contraseña |
|-----|-------|-----------|
| **Candidato** | `candidato@astris.org` | `Demo2026` |
| **Empresa** | `empresa@astris.org` | `Demo2026` |
| **Mentor** | `mentor@astris.org` | `Demo2026` |
| **Admin** | `johansttivelinaresb@gmail.com` | `Astris2026` |

---

## 📁 Estructura del Proyecto

```
src/
├── App.tsx                # Componente raíz + enrutamiento
├── main.tsx               # Entry point
├── assets/                # Imágenes
├── components/
│   ├── common/            # Componentes compartidos
│   ├── modals/            # Modales (login, registro, idioma)
│   └── ui/                # Componentes UI (Radix wrappers)
├── hooks/                 # Hooks personalizados
├── i18n/                  # Traducciones y configuración i18n
├── mock/                  # Datos de demostración
├── pages/                 # Páginas por rol
├── services/              # Servicios (Supabase)
├── styles/                # CSS global
└── types/                 # Tipos TypeScript
```

---

## 📖 Documentación

- [**ARQUITECTURA.md**](./ARCHITECTURE.md) — Decisiones técnicas y estructura del código
- [**CONTRIBUTING.md**](./CONTRIBUTING.md) — Guía para contribuir al proyecto

---

## 🌐 Despliegue

El proyecto está configurado para desplegarse en GitHub Pages:

```bash
npm run build
npm run deploy
```

El sitio se publica en `https://astris.port0.org`.

---

## 🤝 Contribuir

Revisa [CONTRIBUTING.md](./CONTRIBUTING.md) para conocer los estándares de código, flujo de trabajo y cómo añadir traducciones o nuevas páginas.

---

## 📄 Licencia

ISC © 2025–2026 Astris
