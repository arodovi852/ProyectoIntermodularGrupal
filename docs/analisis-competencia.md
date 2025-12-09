# Clasificación de empresas del sector (Criterio 1a)
## Identificación de competidores directos e indirectos:
- Spotify (AI Playlist / Discover / Premium) — gran empresa (streaming global).
- Moodagent — empresa especializada en playlists por mood / white-label. (empresa privada, tecnología de análisis de emoción musical).
- Moodify (apps "Moodify" / AI voice-to-vibe playlist makers) — startup / app pequeña orientada B2C.
- PlaylistAI (y apps similares "AI playlist maker") — startups / herramientas que generan playlists para Spotify/Apple Music desde prompts.
- Soundtrack / Soundtrack Your Brand — servicio B2B para empresas (playlists para locales y generación AI para ambientes de negocio).
- Musicovery — servicio histórico de webradio por mood; desde 2017 se ha orientado a B2B (motor de recomendación).

2. Análisis de características organizativas:
- Spotify
  - Estructura: tradicionalmente matricial/híbrida en grandes techs; áreas por producto (Editorial, Algoritmos, Ads, UX).
  - Nº empleados: gran empresa (miles). Fuentes públicas: ~7–8k empleados recientemente (varía por recortes/2024–2025).
  - Tecnologías públicas/observadas: infra a gran escala (microservicios, Python/Java/Go en backend), ML/IA para recomendaciones, enorme catálogo y APIs públicas/privadas.
- Moodagent 
  - Estructura: pyme / empresa privada con equipo enfocado en producto/product-tech.
  - Empleados: pequeña / mediana (órgano ejecutivo y equipos técnicos; fuentes pública indican decenas). 
  - Tecnologías: DSP (análisis de audio), ML/AI para extracción de características musicales; ofrece white-label streaming y APIs.
- Moodify (apps)
  - Estructura: startup pequeña, equipos reducidos. 
  - Empleados: muy reducido (startups/app). 
  - Tecnologías: modelos de NLP para interpretar voz/texto, uso de APIs de streaming (p. ej. Spotify OAuth/Playback API) y ML leve para detección de "vibe".
- PlaylistAI y herramientas similares
  - Estructura: startups o pequeñas empresas SaaS. 
  - Empleados: small teams / fundadores + devs. 
  - Tecnologías: LLMs/Prompts + integraciones con APIs de música (Spotify, Apple Music), frameworks web (React/Node), uso de OAuth.
- Soundtrack / Soundtrack Your Brand
  - Estructura: empresa orientada a B2B (servicio para locales/retail). Organización comercial + producto. 
  - Empleados: PYME / escala media. 
  - Tecnologías: generación de playlists, curación humana + IA, integraciones para instalación en locales (apps, players).
- Musicovery
  - Estructura: anteriormente B2C, ahora orientada a B2B (licenciamiento de motor de recomendación). 
  - Empleados: pequeña (equipo técnico histórico). 
  - Tecnologías: "mood pad" (clasificación multi-parámetro de tracks), motor de recomendaciones/curación.



3. Análisis del producto/servicio:

- Spotify 
  - Funcionalidades principales: streaming on-demand, playlists automáticas (Discover Weekly, Daily Mixes), recientemente pruebas de AI Playlist generator que crea listas a partir de prompts/moods. Integraciones multiplataforma y SDKs. 
  - Propuesta de valor: catálogo masivo + experiencia de usuario madura; recomendaciones impulsadas por grandes datos de comportamiento. 
  - Precios/condiciones: modelo freemium + suscripción Premium (mensual). AI Playlist features suelen requerir Premium en betas. 
  - Puntos fuertes: escala, catálogo, datos de usuario, posicionamiento de mercado. 
  - Puntos débiles: menos personalización emocional "profunda" (aunque están añadiendo AI), dependencia de modelo de negocio masivo (debajo de la personalización hiper-nicho la UX puede ser genérica).
- Moodagent 
  - Funcionalidades: playlists interactivas basadas en análisis emocional/sonoro de canciones; sliders de mood (táctil) para alterar playlists; ofrece white-label / analytics. 
  - Propuesta de valor: tecnología propietaria que analiza pistas por características emocionales y crea secuencias coherentes; experiencia centrada en "estado de ánimo". 
  - Precios: varían; dispone de servicios B2C y licencias B2B/white-label (modelo freemium / suscripción según front). 
  - Fortalezas: tecnología específica de mood, know-how en curación emocional. 
  - Debilidades: alcance menor que grandes plataformas; catálogo limitado por acuerdos/licencias propias para integración con terceros.
- Moodify (apps)
  - Funcionalidades: interpretación de voz/texto para detectar mood y generar playlists directamente usando Spotify como backend; UX centrada en interacción simple (hablar/seleccionar estado).
  - Propuesta: crea playlists por "vibe" desde una entrada natural (voz).
  - Precios: suelen ofrecer modelo freemium o pago in-app.
  - Fortalezas: UX conversacional, enfoque móvil.
  - Debilidades: alcance limitado, dependencia de APIs de terceros (Spotify).
- PlaylistAI (y similares)
  - Funcionalidades: generación por prompt/tema/mood usando IA; exportación a Spotify/Apple Music/Deezer. 
  - Propuesta: rapidez para generar listas desde ideas/temas; buenas integraciones cross-platform. 
  - Precios: normalmente freemium + planes PRO (más generaciones, exportaciones, apps). 
  - Fortalezas: rapidez, coste bajo para usuario que quiere listas temáticas. 
  - Debilidades: calidad variable en selección de tracks, dependencia de LLMs/heurísticas.
- Soundtrack / Soundtrack Your Brand 
  - Funcionalidades: playlists curadas para locales, generación AI para ambientes (moods por hora/día/negocio), administración multi-sitio, cumplimiento de licencias para uso comercial. 
  - Propuesta: música legal y adecuada para negocio con control de ambiente/mood — ideal para retail/hostelería. 
  - Precios: modelos B2B (suscripciones por local/usuario). 
  - Fortalezas: foco B2B y cumplimiento legal; features de gestión multi-local. 
  - Debilidades: no orientado al usuario final B2C; producto diferente al de PlayTheMood.
- Musicovery 
  - Funcionalidades: “mood pad” para navegación musical por dos ejes emocionales; motor semántico de canciones. Ahora provee su motor a terceros.
  - Propuesta: descubrimiento por mood con control visual. 
  - Precios: antes B2C con versión premium; hoy B2B/licencias. 
  - Fortalezas: tecnología de clasificación emocional probada. 
  - Debilidades: pérdida de presencia B2C, catálogo/licencias limitadas si no se asocia con grandes catálogos.

4. tabla comparativa con las empresas analizadas

| Empresa                                   |            Tamaño | Modelo negocio                           | Alcance                     | Tecnologías / Integraciones                                    | Usuario objetivo                          |                 Precio típico | Fortaleza principal                            | Debilidad principal                    |
| ----------------------------------------- | ----------------: | ---------------------------------------- | --------------------------- | -------------------------------------------------------------- | ----------------------------------------- | ----------------------------: | ---------------------------------------------- | -------------------------------------- |
| **Spotify**                               |      Gran empresa | B2C (freemium + suscripción) + B2B (ads) | Internacional               | Infra a escala, ML/recos, Spotify API, SDKs. ([Spotify][1])    | Consumidor masivo                         |    Freemium / Premium mensual | Catálogo + datos + infra                       | Menos foco en mood hiper-personalizado |
| **Moodagent**                             |              PYME | B2C + B2B (white-label)                  | Internacional               | DSP, ML audio analysis, white-label services. ([Wikipedia][2]) | Usuarios que buscan playlists por mood    |      Freemium / licencias B2B | Especialización en mood / tech propietaria     | Menor escala que Spotify               |
| **Moodify (apps)**                        |           Startup | B2C (app), freemium/in-app               | Internacional (apps stores) | NLP (voz), integraciones Spotify                               | Usuarios móviles que usan voice input     |             Freemium / in-app | UX conversacional (voz→vibe)                   | Dependencia de APIs 3rd party          |
| **PlaylistAI**                            |           Startup | B2C / SaaS                               | Internacional               | LLMs + integraciones Spotify/Apple                             | Usuarios que quieren playlists por prompt |                Freemium / PRO | Rapidez + facilidad                            | Calidad variable y dependencia LLMs    |
| **Soundtrack (B2B)**                      |              PYME | B2B (suscripción por local)              | Internacional               | Curación humana + AI; admin multi-local. ([Soundtrack][3])     | Retail, hostelería, negocios              |               Suscripción B2B | Solución legal/comercial y gestión multi-sitio | No es B2C; distinto mercado objetivo   |
| **Musicovery**                            |              PYME | B2B ahora (motor de recomendaciones)     | Internacional               | Mood pad (2D), motor de recomendación. ([Wikipedia][4])        | Plataformas que licencian motor           |            Licenciamiento B2B | Motor mood innovador                           | No fuerte presencia directa B2C        |
| **Generadores web (MOOD Playlist, etc.)** | Micro / Freelance | B2C (freemium)                           | Internacional               | Integración con Spotify API                                    | Usuarios casuales                         | Normalmente gratis / donación | Simplicidad y alineación mood+tastes           | Escasa escala y soporte                |


5. conclusiones sobre oportunidades detectadas


- Diferenciación por UX conversacional + multimodal 
  - Muchos competidores ofrecen prompt text o sliders; pocos combinan voz (o breve captura de audio) + texto + selección visual (mood sliders) para inferir estado emocional. Integrar reconocimiento de voz que haga intent detection (ej.: "necesito concentrarme", "me siento melancólico") y mapear a parámetros musicales (tempo, energy, valence) puede ser diferencial. (Competidores: Moodify hace voice→playlist, pero hay espacio para un UX más rico).
- Personalización híbrida: mood + taste 
  - No sólo mood puro; mezclar mood con perfil musical del usuario (favs, artista seed, historial) para evitar playlists genéricas. Herramientas como MOOD Playlist y PlaylistAI lo hacen parcialmente; tu ventaja es integrar datos de usuario (MERN backend con usuarios, historial y aprendizaje incremental).
- Integración inteligente con Spotify + fallback multi-catalog 
  - Usa la API de Spotify para generación y reproducción, pero añade capa de fallback (p. ej. soporte para Apple Music export) para usuarios que no usan Spotify — esto amplía alcance vs. apps que dependen 100% de Spotify.
- Transparencia y control sobre "por qué" suena una canción
  - Mostrar por qué una canción fue seleccionada (atributos: tempo, valence, danceability) — esto aumenta confianza y educación del usuario. Moodagent y Musicovery dan pistas; PlayTheMood puede exponer atributos musicales recogidos por análisis on-the-fly.
- Modelo freemium + features premium
  - Monetizar mediante suscripción (listas ilimitadas guardadas, EQ/parametrizaciones avanzadas, generación por voz avanzada), y ofrecer features gratuitas (generación básica y export). Competidores usan freemium o B2B; PlayTheMood puede empezar B2C freemium y explorar acuerdos B2B (licencias white-label) a futuro.
- APIs / SDKs para terceros (white-label)
  - Si tu motor de mood demuestra buena calidad, ofrecer licencias B2B (ej. para marcas, locales) es una vía de crecimiento (modelo usado por Musicovery y Moodagent).
- Características sociales y C2C
  - Permitir compartir "playlists de mood" y que otros usuarios voten/afinen la playlist podría diferenciar frente a soluciones puramente algorítmicas.
- Cumplimiento de licencias y uso comercial
  - Si apuntas a B2B, prepara desde el inicio el cumplimiento de licencias (terminos de uso de Spotify, licencias de ejecución pública). Soundtrack se diferencia por foco legal/comercial; PlayTheMood puede evitar ese camino inicialmente y centrarse en B2C.