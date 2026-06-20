# System Guidelines — Astris

Astris es una plataforma de inclusión laboral adaptativa para personas con TDAH, autismo y síndrome de Down. En lugar de pedir diagnósticos, perfila a los candidatos por cómo trabajan mejor y hace match con empresas según su entorno y prestaciones reales. Cada regla de diseño abajo existe para reducir carga cognitiva y sensorial — no son preferencias estéticas, son requisitos funcionales del producto.

Frase guía: "No preguntamos qué condición tienes. Preguntamos cómo trabajas mejor."

---

# General guidelines

- Diseño desktop-first, ancho de referencia 1440px. No generar versión móvil en esta etapa.
- Layouts responsivos con flexbox/grid, evitar posicionamiento absoluto salvo casos puntuales (ej. el chat flotante).
- Todo dato variable (nombres de empresas, candidatos, mentores, porcentajes de compatibilidad) debe ser contenido de ejemplo realista y coherente, nunca "Lorem ipsum" ni placeholders genéricos tipo "Empresa X".
- Cada botón de acción debe navegar realmente a la pantalla correspondiente del flujo — el prototipo debe sentirse completamente clickeable.
- Nunca usar la palabra "discapacidad" ni nombrar diagnósticos (autismo, TDAH, síndrome de Down) dentro de la interfaz funcional del producto. Esos términos solo existen en contenido institucional/landing, nunca en los flujos de uso real.
- La interfaz de empresa usa siempre la paleta de marca base (azul/teal). Las paletas alternativas personalizables son exclusivas del flujo candidato.

---

# Design system guidelines

## Color

**Paleta de marca base** (landing pública, interfaz de empresa, interfaz de mentor — NO personalizable):

- Primario (azul profundo): `#1B4B7A` — headers, botones primarios, navegación
- Acento (teal): `#2E86AB` — links, estados activos, elementos interactivos secundarios
- Highlight (ámbar): `#C9830A` — usar con moderación: badges de compatibilidad alta, callouts informativos. Nunca como color dominante.
- Fondo: `#F7FAFC` (nunca blanco puro `#FFFFFF`)
- Texto principal: `#1A1A2E` (nunca negro puro `#000000`)
- Texto secundario: `#4A5568`

**Paletas seleccionables** (exclusivas del flujo candidato, pantalla de personalización inicial, cada una con versión modo claro y modo oscuro manteniendo contraste AA):

1. Azul neutro / tonos fríos — bajo estímulo visual, hipersensibilidad visual
2. Tierra / beige / marrón cálido — reduce contraste duro, sensibilidad a luz brillante
3. Alto contraste (negro suave / amarillo) — máxima legibilidad
4. Verde salvia / tonos naturales — calmante, sesiones largas

Regla dura: nunca usar blanco puro ni negro puro como fondo o texto en NINGUNA pantalla, paleta o modo.

## Typography

- Fuente principal: **Atkinson Hyperlegible** o **Inter** (ambas optimizadas para baja visión y legibilidad).
- Tamaño base mínimo: 16px en texto de cuerpo.
- Debe existir un control visible de aumento de tamaño de fuente en configuración/perfil.
- Jerarquía clara y limitada: máximo 3 niveles de tamaño por pantalla (título, subtítulo, cuerpo).

## Motion

- Cero animaciones automáticas o parpadeos por defecto.
- Si hay transición, debe ser sutil (fade, máx. 200ms) y nunca bloquear la interacción.
- Incluir siempre un toggle "Reducir movimiento" en configuración cuando haya elementos animados.

## Layout & spacing

- Un elemento protagonista por pantalla — evitar competencia visual entre componentes.
- Whitespace generoso; nunca saturar una pantalla con más de 2-3 bloques de información simultáneos.
- Formularios largos (caracterización de empresa, perfil de vacante) deben organizarse en secciones colapsables (acordeón), nunca como una sola página larga de scroll.

## Iconography

- Estilo line-icons simples, nunca ilustraciones complejas o decorativas.
- Todo ícono va siempre acompañado de una etiqueta de texto — ningún ícono solo.

## Button

- Primary Button: una sola por sección, fondo sólido en color primario, para la acción principal (ej. "Continuar", "Iniciar proceso").
- Secondary Button: borde en color primario, fondo transparente, para acciones alternativas (ej. "Atrás").
- Tertiary Button: solo texto, sin borde, para acciones de baja prioridad (ej. "Omitir por ahora").
- Tamaño mínimo de cualquier botón: 44px de alto. Estados hover/focus deben ser claramente visibles (no solo cambio sutil de opacidad).

## Forms & questions

- Las preguntas del cuestionario de perfilamiento NUNCA usan texto libre ni escalas numéricas abstractas (ej. "del 1 al 10"). Siempre opciones cerradas tipo "¿Prefieres A o B?" presentadas como botones tipo pill o selección visual de 2-3 opciones.
- Checklists de selección múltiple (ej. software/hardware de accesibilidad) deben mostrarse como tarjetas seleccionables con ícono, no como checkboxes pequeños.

## Data visualization — Radar chart

- El diagrama de araña (radar) que representa el perfil del candidato es el componente más importante del producto.
- Debe actualizarse en tiempo real conforme el usuario responde el cuestionario.
- Relleno semi-transparente sobre la forma (no relleno sólido opaco tipo gráfico de Excel).
- Colores suaves, consistentes con la paleta activa del usuario.

## Microcopy / tone of voice

- Trato de "tú", cercano pero profesional. Nunca condescendiente ni infantilizado.
- Frases cortas, una idea por oración. Lenguaje literal y directo, sin metáforas ni dobles sentidos.
- Sin signos de exclamación en exceso ni lenguaje motivacional genérico ("¡Tú puedes lograrlo!").
- El asistente conversacional guiado (chat flotante) usa solo preguntas preconfiguradas con botones de respuesta — nunca campo de texto libre, nunca se presenta como IA generativa libre.

---

# Principios éticos de diseño (filtro obligatorio para cualquier nueva pantalla o componente)

Antes de generar o aceptar cualquier elemento nuevo, debe cumplir estos 5 principios:

- **No etiquetar**: nunca asociar públicamente a un candidato con una condición o diagnóstico. El perfil describe comportamientos y preferencias, no categorías médicas.
- **No infantilizar**: los candidatos son profesionales capaces. Nunca un tono de "ayuda social" o condescendencia.
- **No invadir**: nunca solicitar información más allá de lo necesario para el matching. Información sensible siempre opcional.
- **Integrar, no separar**: nunca crear una categoría visual o funcional aparte de "empleos para personas con discapacidad". Se conectan personas con entornos compatibles.
- **Primero el concepto, luego el desarrollo**: cada funcionalidad nueva debe tener un "por qué" claro antes de construirse.

Pregunta de control: _"¿Esto reduce barreras o solo clasifica personas?"_