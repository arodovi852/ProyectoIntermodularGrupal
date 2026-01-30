# Fase 3: Estudio de viabilidad técnica

## Índice

1. [Objetivos SMART del proyecto](#1-objetivos-smart-del-proyecto)
2. [Definición del MVP](#2-definición-del-mvp)
3. [Delimitación del alcance (qué SÍ y qué NO)](#3-delimitación-del-alcance-qué-sí-y-qué-no)
4. [Criterios de éxito](#4-criterios-de-éxito)

---

## 1. Objetivos SMART del proyecto

Para asegurar la viabilidad y el impacto del proyecto, es fundamental definir claramente los objetivos, establecer criterios SMART para su medición y delimitar el alcance de la solución. Todo esto se hará teniendo en cuenta tanto el aspecto técnico como la relación emocional con la música que ofrece la aplicación.

Los objetivos generales del proyecto buscan marcar el propósito y las aspiraciones centrales:

- Desarrollar una aplicación web **intuitiva y funcional** que permita a los usuarios **generar playlists musicales** completamente personalizadas según su **estado de ánimo** y **preferencias emocionales**.
- **Garantizar la accesibilidad y facilidad de uso** para cualquier perfil de usuario, promoviendo la inclusión y una experiencia positiva en el entorno académico.
- **Documentar detalladamente** el proceso de desarrollo para facilitar el mantenimiento y la posible ampliación de funcionalidades en el futuro.

De manera más concreta, los objetivos específicos describen las metas a corto plazo y sirven como referencia para el avance del proyecto:
- Permitir la **generación de playlists** en menos de tres clics y en un tiempo inferior a dos minutos, **siguiendo las métricas de eficiencia** sugeridas por estudios del sector.​
- Implementar **controles visuales** mediante sliders que representen distintos estados de ánimo y traduzcan parámetros técnicos (como energía, valencia, tempo, etc.) en preguntas sencillas y comprensibles para el usuario, basados en la evidencia científica de cómo la música afecta la mente.​
- Presentar la plataforma en **pruebas internas y demostraciones**, recopilando comentarios de usuarios reales para evaluar su experiencia de uso en el contexto educativo.
- Redactar la **documentación técnica** y **de usuario**, asegurando que se expliquen tanto la arquitectura MERN como los flujos funcionales clave.

---

## 2. Definición del MVP

*Este apartado agrupa la información de los objetivos y la delimitación inicial de alcance para explicar el primer producto funcional.*

Por último, es necesario delimitar el alcance del proyecto, estableciendo lo que sí y lo que no se incluirá en esta primera versión:

- **Sí se incluye**: una SPA desarrollada con React, la lógica backend con Node y Express para comunicarse con la API de ReccoBeats, la configuración de sliders para los parámetros emocionales, y todas las pruebas y documentación técnica necesarias vinculadas a este primer MVP.
- **No se incluye**: integración directa con cuentas de Spotify, autenticación de usuarios ni persistencia avanzada de playlists en MongoDB, centrándose únicamente en la creación instantánea de playlists durante las pruebas académicas.

Posibles ampliaciones futuras: integración full con Spotify para guardar listas reales, perfilado emocional personalizado, y un sistema de login y almacenamiento de preferencias para el usuario.

---

## 3. Delimitación del alcance (qué SÍ y qué NO)

La delimitación del alcance es fundamental para establecer las fronteras del desarrollo y evitar que el proyecto se disperse, permitiendo centrarse en los objetivos principales y garantizar resultados tangibles en el tiempo previsto. En esta primera fase, la solución abarcará los elementos esenciales para que la generación de playlists personalizadas sea posible y funcional en un contexto académico.

- **Sí se incluye:**
  - Una Single Page Application (SPA) creada en React, con un diseño sencillo y accesible, orientado al manejo intuitivo de sliders para definir parámetros emocionales y musicales.
  - El backend desarrollado en Node.js y Express, responsable de recibir la configuración, conectar con la API pública ReccoBeats y devolver las recomendaciones musicales apropiadas.
  - La integración de controles visuales (sliders) que traducen preguntas emocionales en parámetros técnicos, basados en la evidencia científica sobre cómo las características musicales influyen en el estado de ánimo.​
  - Pruebas internas de funcionalidad, usabilidad y accesibilidad, así como la elaboración de documentación técnica y de usuario clara y completa.

- **No se incluye**, por limitaciones voluntarias del MVP y para asegurar la viabilidad en el tiempo previsto:
  - La integración directa con cuentas de Spotify, evitando tanto el sistema de login como el guardado automático de playlists dentro de la plataforma.
  - Persistencia avanzada en MongoDB; la aplicación funcionará en modo temporal o con datos simulados, evitando la gestión completa de usuarios y sus listas.
  - La implementación de algoritmos personalizados de recomendación o sistemas de machine learning, priorizando la utilización directa de la API ReccoBeats y su lógica nativa.
  - Esto garantiza que el esfuerzo del equipo se concentre en entregar una aplicación funcional y evaluable, sin que el desarrollo se vea retrasado por integraciones o funcionalidades complejas que pueden convertirse en ampliaciones futuras.
  - Entre las posibles mejoras y ampliaciones para siguientes fases, se contemplan la integración total con Spotify para guardar playlists reales, la creación de perfiles emocionales de usuario ajustados mediante aprendizaje automático, la persistencia de preferencias y sesiones a través de login, y un mayor refinamiento tanto de la interfaz como de los algoritmos internos, según la experiencia recopilada en el entorno académico.
  - Este enfoque permite a la vez limitar el desarrollo y abrir la puerta a futuras evoluciones, asegurando que la solución inicial sea accesible, testeable y lista para extenderse según las necesidades y los avances tecnológicos.​

---

## 4. Criterios de éxito

La medición del éxito del proyecto se basará en varios criterios fundamentales, que se describen a continuación:
- **Funcionamiento técnico**: la plataforma debe ser capaz de crear y mostrar playlists personalizadas con las canciones adecuadas según los parámetros elegidos, lo cual será validado mediante pruebas funcionales y de usuario.
- **Usabilidad**: al menos cinco usuarios tipo probarán la herramienta, registrándose el tiempo y el número de clics necesarios para completar el proceso. Se considerará exitoso si el 80% logra la tarea sin dificultades y en el tiempo estimado.
- **Accesibilidad**: se realizarán revisiones manuales y automáticas de la interfaz (usando herramientas como Lighthouse) para garantizar que sea navegable a través de teclado, tenga buen contraste y cumpla estándares básicos de accesibilidad.
- **Retroalimentación y satisfacción**: se recopilarán comentarios en cuestionarios tras las pruebas, considerando exitoso el proyecto si se supera una valoración global de 7/10 por parte de los participantes.
- **Documentación**: el manual técnico y de usuario será revisado por al menos dos personas ajenas al equipo para asegurar claridad y exhaustividad.

---

