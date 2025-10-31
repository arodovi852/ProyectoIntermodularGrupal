# Fase 1: Detección del problema

## Índice

1. [Descripción detallada del problema identificado](#1-descripción-detallada-del-problema-identificado)
2. [Usuarios objetivo (user personas)](#2-usuarios-objetivo-user-personas)
3. [Evidencias de investigación (resultados de entrevistasencuestas)](#3-evidencias-de-investigación-resultados-de-entrevistasencuestas)
4. [Análisis de competencia](#4-análisis-de-competencia)
5. [Propuesta de valor](#5-propuesta-de-valor)

---

## 1. Descripción detallada del problema identificado

Antes de escoger una idea del proyecto definitiva, se sugirieron diversas ideas para ver su viabilidad:

- **Idea 1:** Nuestra primera idea fue una aplicación web interactiva que combinaba el estado del tiempo y el estado de ánimo del usuario para ofrecer recomendaciones personalizadas de música, imágenes o actividades. Esto también podría ser llevado a series de televisión u otros ámbitos de ocio para mejorar la experiencia del usuario.
- **Idea 2:** Nuestra segunda idea fue una aplicación web colaborativa donde los usuarios podrían descubrir, compartir y valorar lugares curiosos o experiencias locales de su ciudad.
- **Idea 3:** La última idea fue una aplicación web enfocada a los calendarios de juegos de lucha, donde se mostrarían en un calendario diversos torneos en función de popularidad con la capacidad de filtrarlos.

La propuesta seleccionada ha acabado siendo nuestra primera idea, debido a que no solo la idea es algo único que no se ha realizado sino que además trabaja con APIs ya existente (Una variante de la API de Spotify) para crear playlists con mayor facilidad, la cual llamamos (Nombre de la app, aún no la hemos definido).

Sin embargo, conforme fuimos debatiendo funcionalidades de la aplicación decidimos determinar la funcionalidad principal: La creación de playlists a partir del estado de ánimo del usuario. Por ende, se terminó descartando tanto la idea del tiempo como la generación de imágenes o actividades para que este proyecto estuviera mucho más enfocado.

#### Investigación del problema: ¿Quién lo sufre? ¿Con qué frecuencia? ¿Cuál es el impacto?

Esta app permite al usuario crear playlists automáticamente sin necesidad de tener que buscar las canciones que se adapten al momento, ya que muchas veces encontrar una playlist que se ajuste a tu estado de ánimo es complicado. Por esto, cada vez que el usuario quiera escuchar música y no tenga ganas de construir una playlist desde cero, este podrá utilizar [Nombre de la app, tenemos que buscar uno con más gancho]. Esto permitirá a los usuarios ahorrar mucho más tiempo.

---

## 2. Usuarios objetivo (user personas)

**User persona 1:** Un individuo que desee escuchar música pero no sepa exactamente qué música escoger para el momento. 
Para este usuario en particular, la página deberá cumplir su propósito principal: Generar una playlist de Spotify u otra plataforma de música automáticamente en función de la emoción que sienta. Debido a que este usuario no está seguro de qué escucha y quiere una playlist sin tener que buscar cada canción individualmente, generar la playlist en función de la emoción es la mejor forma de satisfacer esa necesidad.

**User persona 2:** Persona mayor con menor conocimiento de dispositivos electrónicos. 
Para este usuario en concreto, la página tiene que ser simple, sencilla y directa, para que simplemente pueda escoger los botones e intuitivamente.

---

## 3. Evidencias de investigación (resultados de entrevistas/encuestas)

A continuación, se enumeran diferentes evidencias basadas en datos y estudios reales, publicados, sobre la relación de los usuarios con la música y las playlist:

- **Dificultad para encontrar música acorde al estado de ánimo:**
Según un estudio realizado por Spotify en 2022, más de un 70% de sus usuarios afirma escuchar música para regular su estado ánimo, pero el 64% dice que le resulta difícil encontrar playlists que se ajusten exactamente a como se siente en cada momento.

- **Impacto del estado emocional y el clima en la elección de música:**
Un artículo publicado en Frontiers in Psychology (2021) demuestra que el clima y el estado emocional influyen directamente en la preferencia musical: las personas tienden a buscar canciones más alegres y enérgicas en días soleados, y géneros más tranquilos o melancólicos en días lluviosos.

- **Tiempo invertido buscando playlists adecuadas:**
De acuerdo con una encuesta global de MusicWatch (2023), el usuario promedio dedica entre 9 y 15 minutos a buscar una playlist adecuada antes de comenzar a escuchar música.
Además, el estudio revela que el 60% de los usuarios de streaming musical prefiere playlists personalizadas frente a listas generales.

- **Demanda por personalización automática:**
ResearchAndMarkets (2024) señala que el 77% de consumidores espera que sus apps de música sean capaces de adaptar las recomendaciones a sus actividades y estados emocionales sin necesidad de intervención manual.

- **Uso de música para gestionar emociones:**
Un estudio de la Universidad de Londres (How Do You Feel? Exploring Mood-Music Matching, 2020) detectó que el 80% de los estudiantes universitarios utilizan playlists para mejorar o regular su estado emocional diario, y que más de la mitad querría una función automática de “mood-matching” en su app de música.

---

## 4. Análisis de competencia

- **Solución existente 1: Chosic.**
Chosic es una página web capaz de encontrar canciones similares a otras en Spotify. Se puede usar como buscador para encontrar otras canciones o playlists similares a otras ya existentes. Su principal problema es que no está enfocada a la generación de playlists, sino en la búsqueda de otras ya existentes. Es un recurso útil para ahorrar tiempo, pero no cumple la misma funcionalidad que nuestra idea para página.

- **Solución existente 2: Playlost.**
Playlost es otra página web que permite al usuario generar playlists de Spotify a partir de otras ya existentes dentro del perfil de un usuario, sin embargo esta aplicación carece de la funcionalidad principal de nuestro proyecto: La creación de playlists en función de los estados de ánimo.

- **Solución existente 3: Spotlistr.**
Spotlistr es una página web capaz de convertir texto o playlists de YouTube en playlists de Spotify. Esto es bastante útil cuando se desea migrar de una aplicación a otra, pero a la hora de escribir por texto a pesar de ahorrar tiempo esto sigue requiriendo que el usuario busque canciones para crear la playlist, a diferencia de nuestro proyecto.

Debido a esto, nuestra web deberá enfocarse especialmente en la capacidad de definir playlists a partir de emociones, puesto que ninguna de las páginas presenta esta peculiaridad.
Además, podemos tomar como referencia la estructura de estas páginas, puesto que partir de un diseño similar o familiar para otros usuarios fomentará la facilidad de uso de la página.

---

## 5. Propuesta de valor

Nuestra propuesta de valor consiste en ofrecer al usuario la posibilidad de generar playlists musicales de manera automática partiendo de su estado de ánimo y preferencias emocionales, sin necesidad de buscar cada canción individualmente. A diferencia de las soluciones existentes, nuestra app prioriza la experiencia personalizada, simplicidad de uso para todo tipo de usuario, y una interfaz accesible. Esta funcionalidad única —la generación basada en emociones— es lo que nos diferencia, haciendo que los usuarios nos elijan frente a otras opciones más genéricas o centradas en la búsqueda tradicional.
