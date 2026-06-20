CONTEXTO DEL PROYECTO

Quiero que generes el prototipo navegable de Astris, una plataforma web (desktop-first, 1440px) de inclusión laboral adaptativa para personas con TDAH, autismo y síndrome de Down. Astris no es una bolsa de empleo genérica: en lugar de pedir diagnósticos médicos, perfila a los candidatos según cómo trabajan mejor (estilo de comunicación, tolerancia ambiental, forma de ejecutar tareas y ajustes razonables que requieren), y hace lo mismo con las empresas (entorno físico, prestaciones de accesibilidad, requisitos reales del cargo). El sistema cruza ambos perfiles para sugerir compatibilidad laboral, y un mentor humano acompaña el proceso desde el match hasta el seguimiento post-contratación.

Frase guía del proyecto: "No preguntamos qué condición tienes. Preguntamos cómo trabajas mejor."

Este es un prototipo de alta fidelidad para presentar ante Microsoft y Genuine Foundation. No necesita backend real ni lógica de matching funcional: todo dato variable (vacantes sugeridas, porcentajes de compatibilidad, perfiles de mentores) puede ser contenido de ejemplo (mock data) coherente y bien curado. Lo que sí debe sentirse real es la navegación completa entre pantallas y la interactividad de los componentes clave (selector de paleta, cuestionario con radar dinámico).


1. IDENTIDAD VISUAL Y PRINCIPIOS DE DISEÑO

Este es el punto más importante: el diseño visual ES el argumento del producto. Cada decisión estética debe poder justificarse desde la accesibilidad cognitiva y sensorial, no desde la tendencia.

Reglas de diseño universal que deben aplicarse en TODA la plataforma, sin excepción:


Nunca usar blanco puro (#FFFFFF) ni negro puro (#000000) como fondo. Usar siempre tonos suavizados (off-white tipo #F7FAFC, off-black tipo #1A1A2E).
Tipografía de alta legibilidad. Usar Atkinson Hyperlegible o Inter como fuente principal (ambas diseñadas para accesibilidad y baja visión). Tamaño base mínimo 16px, con opción de aumentar tamaño de fuente visible en la interfaz.
Botones grandes (mínimo 44px de alto), con bordes redondeados suaves, alto contraste entre texto y fondo, y estados hover/focus muy claros.
Cero animaciones automáticas, parpadeos o transiciones agresivas por defecto. Si hay transiciones, deben ser sutiles (fade corto, máximo 200ms) y nunca obligatorias: incluir un toggle "Reducir movimiento" visible en configuración.
Lenguaje literal y directo en toda la interfaz: nada de metáforas, dobles sentidos, humor ambiguo ni iconografía sin texto de apoyo. Cada ícono va acompañado de una etiqueta de texto.
Jerarquía visual clara: un solo elemento protagonista por pantalla, espaciado generoso (whitespace amplio), sin saturación de elementos compitiendo por atención.
Iconografía simple y consistente (estilo line-icons, no ilustraciones complejas).


Paleta de marca base (para la interfaz de empresas, mentores y la landing pública, que NO es personalizable):


Azul profundo (primario): tono #1B4B7A — transmite confianza institucional, usar en headers, botones primarios y elementos de navegación.
Azul-teal (acento): tono #2E86AB — usar en links, estados activos, elementos interactivos secundarios.
Ámbar cálido (detalle/highlight): tono #C9830A — usar con moderación para destacar datos clave, badges de compatibilidad alta, o callouts informativos. Nunca como color dominante.
Fondo neutro claro: #F7FAFC. Texto principal: #1A1A2E. Texto secundario: #4A5568.


Paletas alternativas seleccionables SOLO en el flujo de candidato (ver sección 4.2):


Azul neutro / tonos fríos — bajo estímulo visual, para hipersensibilidad visual.
Tierra / beige / marrón cálido — reduce contraste duro, para sensibilidad a luz brillante.
Alto contraste (negro suave / amarillo) — máxima legibilidad, compatible con tecnologías de accesibilidad.
Verde salvia / tonos naturales — paleta calmante, reduce carga cognitiva en sesiones largas.


Cada una de estas 4 paletas debe tener también su versión en modo oscuro (mismo tono base, pero con fondo oscuro suavizado y ajuste de luminosidad para mantener contraste accesible AA mínimo).


2. ARQUITECTURA DE INFORMACIÓN (MAPA COMPLETO DE PANTALLAS)

Genera las siguientes pantallas, todas conectadas por navegación funcional (clicks que llevan de una pantalla a otra):

A. Pantallas generales


Landing page pública
Selección de rol (Candidato / Empresa / Mentor)
Registro / login (uno para candidato, otro para empresa — pueden compartir layout base)


B. Flujo Candidato
4. Bienvenida + selector de paleta de colores y modo claro/oscuro
5. Cuestionario de perfilamiento — Eje 1: Procesamiento y Comunicación
6. Cuestionario de perfilamiento — Eje 2: Tolerancia Ambiental
7. Cuestionario de perfilamiento — Eje 3: Ejecución y Tareas
8. Cuestionario de perfilamiento — Eje 4: Ajustes Razonables
9. Perfil consolidado (radar final + resumen)
10. Exploración de vacantes sugeridas (listado con filtros)
11. Detalle de vacante + empresa (con % de compatibilidad)
12. Selección de mentor (galería de fichas)
13. Panel de acompañamiento (timeline del proceso con el mentor)
14. Panel de seguimiento post-contratación (reportes de progreso)

C. Flujo Empresa
15. Caracterización organizacional (formulario en secciones colapsables)
16. Publicación de vacante (formulario estructurado)
17. Panel de perfiles candidatos sugeridos (listado con % de compatibilidad)
18. Detalle de perfil de candidato (vista de la empresa — sin datos médicos)
19. Panel de seguimiento post-contratación (vista empresa)

D. Componente transversal
20. Asistente conversacional guiado (chat con preguntas preconfiguradas y respuestas de selección múltiple) — debe aparecer como un panel/widget flotante disponible durante el flujo de perfilamiento del candidato (pantallas 5-9).


3. LANDING PAGE (Pantalla 1)

Estructura de arriba a abajo:


Header fijo: logo "Astris" a la izquierda, navegación simple (Cómo funciona / Para empresas / Para candidatos), botones "Iniciar sesión" y "Registrarme" a la derecha.
Hero section: titular grande con la frase "No preguntamos qué condición tienes. Preguntamos cómo trabajas mejor." Subtítulo explicando en 1-2 líneas qué es Astris. Dos CTAs: "Soy candidato" y "Soy empresa". Imagen o ilustración abstracta de fondo (formas geométricas suaves, nada de fotografía de stock genérica con personas sonriendo forzadamente).
Sección "El problema": 3-4 bullets cortos sobre las barreras invisibles del mercado laboral tradicional, con tono directo, sin victimizar.
Sección "Los 4 pilares": 4 tarjetas iguales (PREPARAR / ADAPTAR / ACOMPAÑAR / CONECTAR) con ícono simple, título y una frase descriptiva cada una.
Sección "Cómo funciona": visualización tipo timeline horizontal de las 4 fases (Perfil y Adaptación → Matching Laboral → Entrenamiento Personalizado → Inserción y Seguimiento), cada una con ícono y descripción breve.
Sección de diferencial: tabla comparativa "Modelo tradicional vs. Astris" (usar la tabla del brief, sección 3).
Sección "Impacto esperado": dos columnas, candidatos y empresas, con 4-5 bullets cada una.
Footer: información del programa (Closer to the Stars Educational Program), enlaces simples, sin redes sociales ficticias.



4. FLUJO CANDIDATO — DETALLE PANTALLA POR PANTALLA

4.1 Selección de rol (Pantalla 2)

Dos tarjetas grandes y centradas: "Soy candidato" y "Soy empresa", cada una con un ícono representativo, una frase corta de propósito, y un botón. Nada más en la pantalla — decisión binaria simple sin distracciones.

4.2 Bienvenida + selector de paleta (Pantalla 4)

Esta es una de las pantallas más importantes del prototipo, debe sentirse interactiva de verdad:


Layout de dos columnas. Columna izquierda: las 4 opciones de paleta como tarjetas seleccionables (radio cards), cada una mostrando una muestra de color y su nombre ("Azul calma", "Tierra cálida", "Alto contraste", "Verde natural"). Debajo, un toggle "Modo claro / Modo oscuro".
Columna derecha: preview en tiempo real — un mockup simplificado de cómo se vería una pantalla típica de la plataforma (header + botón + tarjeta de ejemplo) renderizado con los colores seleccionados. Al hacer click en una paleta distinta o cambiar el modo, el preview debe actualizarse instantáneamente.
Botón "Continuar" al final, que lleva al cuestionario.
Nota: la paleta elegida aquí debería, idealmente, aplicarse visualmente a TODAS las pantallas siguientes del flujo candidato (4-14) para demostrar la personalización real. Si la herramienta lo permite mediante variables/estilos, configúralo así.


4.3 Cuestionario de perfilamiento — 4 ejes (Pantallas 5-8)

Cada uno de los 4 ejes es un paso de un wizard de 4 pasos con indicador de progreso visible (ej. "Paso 2 de 4 — Tolerancia Ambiental").

Layout de cada pantalla del cuestionario:


Columna izquierda (60% del ancho): preguntas del eje correspondiente, presentadas como opciones de selección (botones tipo pill o sliders de 2-3 posiciones, NUNCA campos de texto libre ni escalas numéricas abstractas tipo "1 a 10"). Cada pregunta debe tener máximo 2-3 opciones claras y mutuamente excluyentes, con lenguaje literal.
Columna derecha (40% del ancho): un diagrama de araña (radar chart) que se actualiza dinámicamente en tiempo real conforme el usuario va seleccionando respuestas. El radar debe tener entre 4 y 8 ejes visibles (puede ir acumulando los ejes de las 4 secciones del cuestionario a medida que se avanza), con una forma geométrica que cambia de tamaño/forma según las respuestas. Usa colores suaves, sin relleno sólido opaco (usar relleno semi-transparente sobre la forma para que se vea elegante, no como un gráfico técnico de Excel).
Botones "Atrás" y "Siguiente" al pie, siempre visibles.


Contenido específico de preguntas por eje (usa exactamente estas, redactadas en lenguaje directo de "¿Prefieres A o B?"):

Eje 1 — Procesamiento y Comunicación:


Interacción social: ¿Prefieres trabajar solo/a y de forma autónoma, o en equipo con interacción constante?
Retroalimentación: ¿Prefieres que te digan cómo vas apenas terminas una tarea, o revisar tu trabajo en reuniones programadas (ej. semanales)?
Formato de entrada: ¿Aprendes mejor viendo videos/diagramas, leyendo instrucciones escritas, o escuchando explicaciones?
Estilo de comunicación: ¿Prefieres instrucciones directas y literales, o te es cómodo interpretar instrucciones abiertas?


Eje 2 — Tolerancia Ambiental:


Carga sensorial auditiva: ¿Necesitas silencio total, toleras ruido moderado, o te es indiferente un ambiente ruidoso?
Carga sensorial visual: ¿Te molestan las luces fluorescentes, prefieres luz natural, o no tienes preferencia?
Estructura del espacio: ¿Necesitas un puesto fijo, prefieres espacios abiertos/rotativos, o prefieres trabajar remoto?
Interrupciones: ¿Necesitas bloques de tiempo sin interrupciones, o te adaptas bien a cambios de contexto frecuentes?


Eje 3 — Ejecución y Tareas:


Foco y atención: ¿Te concentras mejor en una tarea larga y repetitiva, o prefieres tareas cortas y variadas?
Estructura de la tarea: ¿Prefieres rutinas claras y estructuradas, o resolver problemas de forma creativa sin un camino fijo?
Manejo del tiempo: ¿Necesitas horarios flexibles, o trabajas mejor con un horario fijo?
Profundidad de tarea: ¿Prefieres especializarte en pocas tareas a fondo, o manejar varias tareas distintas a la vez?


Eje 4 — Ajustes Razonables:


Software: selección múltiple — lector de pantalla / tipografía para dislexia / bloqueador de distracciones / alto contraste / ninguno.
Hardware: selección múltiple — audífonos con cancelación de ruido / teclado adaptado / pantalla sin parpadeo / ninguno.
Acompañamiento: ¿Te gustaría tener un mentor asignado durante tus primeros 30-60 días?
Modalidad: ¿Prefieres trabajo presencial, híbrido, o remoto?


4.4 Perfil consolidado (Pantalla 9)


Radar final grande y centrado, mostrando el perfil completo de los 4 ejes combinados.
Debajo o al lado: tarjetas-resumen con los "ajustes razonables" declarados (íconos + texto).
Un botón destacado: "Ver vacantes sugeridas para mi perfil".
Mensaje breve reforzando privacidad: algo como "Tu perfil describe cómo trabajas mejor. Esta información nunca se comparte como diagnóstico médico."


4.5 Exploración de vacantes (Pantalla 10)


Filtros simples a la izquierda (modalidad, sector, nivel de socialización requerido).
Listado de tarjetas de vacante a la derecha, cada una mostrando: cargo, empresa (nombre ficticio), modalidad, y un badge circular grande con el % de compatibilidad (usa 3-4 ejemplos con compatibilidad entre 78% y 95%, en colores tipo semáforo suave: verde para alta, ámbar para media).


4.6 Detalle de vacante (Pantalla 11)


Información de la empresa (nombre ficticio, sector, breve descripción de filosofía y entorno).
Detalle del cargo (funciones, habilidades requeridas, horario).
Sección "Por qué eres compatible": comparación visual simple entre tu perfil y los requisitos de la vacante (puede ser una mini versión del radar superpuesto, o una lista de coincidencias).
Botón "Iniciar proceso" que lleva a selección de mentor.


4.7 Selección de mentor (Pantalla 12)


Galería de 3-4 fichas de mentores ficticios: foto/avatar ilustrado (no foto realista de stock), nombre, especialidad (ej. "Inclusión laboral — TDAH y funciones ejecutivas"), años de experiencia, modalidad de atención (presencial/virtual).
Botón "Elegir como mi mentor" en cada ficha.


4.8 Panel de acompañamiento (Pantalla 13)


Timeline vertical mostrando las etapas del protocolo del mentor: Análisis de perfil → Primer contacto → Plan de acompañamiento → Reunión de explicación → Consentimiento → Inicio de capacitación → Vinculación laboral → Seguimiento. Marca visualmente cuáles etapas están completas, cuál está en curso, y cuáles son futuras.
Información de contacto del mentor asignado.


4.9 Panel de seguimiento (Pantalla 14)


Vista simple tipo dashboard: estado de adaptación (ej. escala visual simple: "Adaptándome" / "Estable" / "Consolidado"), espacio para reportar cómo va el proceso (mock de un formulario corto), e historial de check-ins anteriores.



5. FLUJO EMPRESA — DETALLE PANTALLA POR PANTALLA

Importante: la interfaz de empresa usa SIEMPRE la paleta de marca base (azul profundo + teal), nunca las paletas personalizables del candidato. El tono visual debe sentirse más corporativo y denso en información, pero manteniendo los mismos principios de accesibilidad (sin blanco/negro puro, tipografía legible, etc.).

5.1 Caracterización organizacional (Pantalla 15)

Formulario largo organizado en secciones colapsables (acordeón), para no abrumar:


Sección "Datos generales": campo de actividad, tamaño de la organización, descripción breve.
Sección "Filosofía y cultura": campo de texto corto.
Sección "Entorno físico": selectores para nivel de ruido habitual, tipo de iluminación, distribución de espacios.
Sección "Prestaciones de accesibilidad disponibles": checklist visual con íconos (audífonos de aislamiento, teclados especializados, pantallas anti-reflejo, rampas/ascensores, salas de descanso sensorial, modalidad remota/híbrida).
Sección "Políticas": pausas activas, flexibilidad de horario.


5.2 Publicación de vacante (Pantalla 16)

Formulario estructurado: cargo, descripción de funciones, habilidades técnicas requeridas (checklist: mecanografía, ofimática, lectura intensiva, etc.), nivel de socialización requerido (slider de 3 opciones), tipo de comunicación predominante, horario y modalidad, requisitos de movilidad física.

5.3 Panel de perfiles sugeridos (Pantalla 17)

Listado tipo tabla o tarjetas de candidatos ficticios anonimizados (ej. "Candidato #214"), con badge de % de compatibilidad, y un resumen muy breve de fortalezas (sin datos médicos, ej. "Alto enfoque en tareas detalladas, prefiere entorno silencioso, requiere instrucciones escritas").

5.4 Detalle de candidato (Pantalla 18)

Vista del perfil del candidato desde la empresa: el radar de los 4 ejes (igual que el candidato lo ve, pero sin nombre real, solo identificador), lista de ajustes razonables requeridos, y botón "Iniciar proceso de match".

5.5 Panel de seguimiento — vista empresa (Pantalla 19)

Similar al panel del candidato pero orientado a la empresa: estado de adaptación del nuevo colaborador, espacio para reportar observaciones, contacto directo con el mentor asignado.


6. COMPONENTE: ASISTENTE CONVERSACIONAL GUIADO

Diseña un widget de chat flotante (esquina inferior derecha, expandible) que aparece durante las pantallas 5-9 del flujo candidato. No debe simular ser una IA conversacional libre: debe presentarse como una guía con preguntas preconfiguradas y respuestas de botones (no input de texto libre). Ejemplo de interacción: el asistente dice "¿Quieres que te explique por qué te preguntamos esto?" con botones de respuesta "Sí, explícame" / "No, continuar". Tono cálido pero no infantil, frases cortas.


7. TONO DE REDACCIÓN (MICROCOPY) EN TODA LA PLATAFORMA


Nunca usar la palabra "discapacidad" o nombrar diagnósticos específicos (autismo, TDAH, síndrome de Down) dentro de la interfaz funcional del producto — esos términos solo aparecen en el brief/landing institucional, no en los flujos de uso.
Trato de "tú", cercano pero profesional, nunca condescendiente ni infantilizado.
Frases cortas, una idea por oración.
Nunca usar signos de exclamación en exceso ni lenguaje motivacional genérico tipo "¡Tú puedes lograrlo!".
Las preguntas del cuestionario siempre en formato "¿Prefieres A o B?", nunca abiertas.



8. NOTAS TÉCNICAS PARA LA GENERACIÓN


Diseño desktop-first, ancho de referencia 1440px. No es necesario generar versión móvil en esta etapa.
Todos los datos variables (nombres de empresas, candidatos, mentores, porcentajes de compatibilidad) deben ser contenido de ejemplo realista y coherente, no placeholders genéricos tipo "Lorem ipsum" ni "Empresa X".
La navegación entre las 20 pantallas debe ser completamente clickeable: cada botón de acción debe llevar a la pantalla siguiente correspondiente del flujo.
El selector de paleta de colores (pantalla 4) y el radar dinámico del cuestionario (pantallas 5-8) son los dos componentes más importantes del prototipo: prioriza que estos se vean pulidos e interactivos por encima de cualquier otro detalle.
Nombre del producto a usar en toda la interfaz: Astris.


