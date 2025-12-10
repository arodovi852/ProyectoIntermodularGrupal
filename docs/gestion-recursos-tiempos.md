# Gestión de Recursos y Tiempos - Fase 3

## Índice
1. [Roles del Equipo](#roles-del-equipo)
2. [Metodología de Estimación](#metodología-de-estimación)
3. [Equilibrio de Cargas de Trabajo](#equilibrio-de-cargas-de-trabajo)
4. [Recursos Materiales](#recursos-materiales)
5. [Planificación de Sprints](#planificación-de-sprints)

---

## Roles del Equipo

### Product Owner
- **Responsabilidades:**
  - Definir y priorizar el Product Backlog
  - Comunicar la visión del producto al equipo
  - Tomar decisiones sobre requisitos y funcionalidades
  - Validar entregas y aceptar historias de usuario completadas
  - Interactuar con stakeholders y recoger feedback

### Scrum Master
- **Responsabilidades:**
  - Facilitar eventos Scrum (Daily Standups, Sprint Planning, Sprint Review, Sprint Retrospective)
  - Eliminar impedimentos que bloqueen al equipo
  - Proteger al equipo de interrupciones externas
  - Promover mejora continua
  - Asegurar que se sigan las prácticas ágiles

### Equipo de Desarrollo
#### Desarrolladores Frontend
- **Responsabilidades:**
  - Implementar interfaces de usuario responsive
  - Integrar con APIs backend
  - Optimizar rendimiento del cliente
  - Realizar pruebas unitarias y de integración

#### Desarrolladores Backend
- **Responsabilidades:**
  - Diseñar e implementar APIs RESTful
  - Gestionar lógica de negocio
  - Optimizar consultas a base de datos
  - Implementar medidas de seguridad
  - Realizar pruebas unitarias y de integración

#### Analistas/QA
- **Responsabilidades:**
  - Diseñar casos de prueba
  - Ejecutar pruebas funcionales y de regresión
  - Reportar y hacer seguimiento de bugs
  - Validar requisitos y criterios de aceptación
  - Realizar pruebas de usabilidad

#### DevOps/Administrador de Sistemas
- **Responsabilidades:**
  - Configurar pipelines CI/CD
  - Gestionar entornos (desarrollo, staging, producción)
  - Monitorear rendimiento y disponibilidad
  - Gestionar bases de datos y backups
  - Implementar y mantener infraestructura

---

## Metodología de Estimación

### Planning Poker

Planning Poker es una técnica de estimación colaborativa basada en consenso que utiliza la secuencia de Fibonacci para estimar el esfuerzo relativo de las tareas.

#### Secuencia de Fibonacci Utilizada
```
0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89
```

#### Proceso de Planning Poker

1. **Preparación**
   - El Product Owner presenta una historia de usuario
   - Se explican los requisitos y criterios de aceptación
   - El equipo hace preguntas de clarificación

2. **Estimación Individual**
   - Cada miembro del equipo selecciona una carta en privado
   - La carta representa su estimación en Story Points

3. **Revelación Simultánea**
   - Todos revelan sus cartas al mismo tiempo
   - Evita el sesgo de anclaje

4. **Discusión**
   - Si hay consenso, se acepta la estimación
   - Si hay diferencias significativas, quienes dieron las estimaciones más altas y más bajas explican su razonamiento

5. **Re-estimación**
   - Después de la discusión, se vuelve a estimar
   - Se repite hasta alcanzar consenso

#### Criterios de Estimación

**Factores Considerados:**
- **Complejidad técnica:** Dificultad de implementación
- **Incertidumbre:** Nivel de conocimiento sobre la tarea
- **Esfuerzo:** Tiempo y recursos necesarios
- **Dependencias:** Relaciones con otras tareas

**Escala de Referencia:**
- **1 Story Point:** Tarea trivial (< 2 horas)
- **2-3 Story Points:** Tarea simple (2-4 horas)
- **5 Story Points:** Tarea moderada (4-8 horas)
- **8 Story Points:** Tarea compleja (1-2 días)
- **13 Story Points:** Tarea muy compleja (2-3 días)
- **21+ Story Points:** Épica que debe dividirse

#### Velocity del Equipo

- **Definición:** Story Points completados por sprint
- **Cálculo:** Promedio de los últimos 3 sprints
- **Uso:** Planificar capacidad de sprints futuros
- **Revisión:** Cada sprint retrospective

---

## Equilibrio de Cargas de Trabajo

### Principios de Distribución

1. **Equidad en Story Points**
   - Distribución proporcional entre miembros del equipo
   - Consideración de disponibilidad individual
   - Balance entre tareas complejas y simples

2. **Especialización vs. Cross-Functionality**
   - Asignar tareas según expertise
   - Promover aprendizaje en nuevas áreas
   - Evitar silos de conocimiento

3. **Pair Programming**
   - Emparejar senior con junior para mentoring
   - Tareas críticas realizadas en parejas
   - Rotación de parejas para compartir conocimiento

### Matriz de Capacidad

| Miembro | Rol | Disponibilidad | Capacidad (SP/Sprint) |
|---------|-----|----------------|----------------------|
| Miembro A | Frontend Lead | 100% | 21 |
| Miembro B | Backend Lead | 100% | 21 |
| Miembro C | Fullstack Dev | 100% | 18 |
| Miembro D | QA/Tester | 100% | 15 |
| Miembro E | DevOps | 50% | 10 |

**Total Capacidad por Sprint:** 85 Story Points

### Gestión de Impedimentos

- **Daily Standup:** Identificación temprana de bloqueos
- **Registro de Impedimentos:** Documento centralizado
- **Responsable:** Scrum Master
- **Escalación:** Procedimiento definido para issues críticos

### Indicadores de Balance

- **WIP (Work In Progress):** Máximo 2-3 tareas por persona
- **Lead Time:** Tiempo desde inicio hasta completar tarea
- **Cycle Time:** Tiempo activo trabajando en la tarea
- **Burndown Chart:** Progreso del sprint

---

## Recursos Materiales

### Infraestructura de Desarrollo

#### Hardware
- **Estaciones de Trabajo**
  - Especificaciones mínimas: 16GB RAM, SSD 512GB, procesador i5/Ryzen 5
  - Monitores duales para desarrolladores
  - Periféricos ergonómicos

#### Software y Herramientas

**Control de Versiones:**
- Git + GitHub
- GitKraken/SourceTree (GUI opcional)

**Entornos de Desarrollo:**
- Visual Studio Code / IntelliJ IDEA
- Postman para testing de APIs
- Docker Desktop

**Comunicación y Colaboración:**
- Slack/Microsoft Teams
- Jira/Trello para gestión de tareas
- Confluence/Notion para documentación
- Zoom/Google Meet para videollamadas

**Testing:**
- Jest/JUnit para testing unitario
- Selenium/Cypress para testing E2E
- SonarQube para análisis de código

**CI/CD:**
- GitHub Actions / Jenkins
- Docker para containerización
- Kubernetes para orquestación (si aplica)

### Infraestructura Cloud

#### Entornos

**Desarrollo:**
- Base de datos: PostgreSQL 14
- Servidor de aplicaciones
- Almacenamiento de archivos

**Staging:**
- Réplica de producción
- Para testing pre-release
- Datos anonimizados

**Producción:**
- Alta disponibilidad
- Backups automáticos diarios
- Monitoreo 24/7
- CDN para assets estáticos

#### Servicios Cloud
- **Hosting:** AWS/Azure/Google Cloud/DigitalOcean
- **Base de Datos:** RDS/Cloud SQL o similar
- **Almacenamiento:** S3/Cloud Storage
- **Monitoreo:** CloudWatch/DataDog/New Relic
- **Logs:** ELK Stack/CloudWatch Logs

### Presupuesto de Recursos

| Recurso | Costo Mensual | Proveedor |
|---------|---------------|-----------|
| Servidor Desarrollo | €15 | DigitalOcean |
| Servidor Staging | €25 | DigitalOcean |
| Servidor Producción | €50 | AWS/Azure |
| Base de Datos (RDS) | €30 | AWS |
| Almacenamiento (S3) | €10 | AWS |
| CI/CD | €0 | GitHub Actions (free tier) |
| Monitoreo | €15 | DataDog |
| **Total** | **€145** | |

---

## Planificación de Sprints

### Configuración de Sprints

- **Duración:** 2 semanas (10 días laborables)
- **Inicio:** Lunes
- **Fin:** Viernes (segunda semana)

### Estructura del Sprint

#### Sprint Planning (Lunes - 2 horas)
- **Objetivo:** Definir el Sprint Goal y seleccionar historias del backlog
- **Participantes:** Todo el equipo
- **Entregables:**
  - Sprint Backlog definido
  - Tareas estimadas y asignadas
  - Sprint Goal acordado

#### Daily Standup (Diario - 15 minutos)
- **Horario:** 9:30 AM
- **Formato:** Cada miembro responde:
  1. ¿Qué hice ayer?
  2. ¿Qué haré hoy?
  3. ¿Tengo algún impedimento?

#### Sprint Review (Viernes - 1.5 horas)
- **Objetivo:** Demostrar el trabajo completado
- **Participantes:** Equipo + Stakeholders
- **Agenda:**
  - Demo de funcionalidades completadas
  - Feedback de stakeholders
  - Revisión del Sprint Goal

#### Sprint Retrospective (Viernes - 1 hora)
- **Objetivo:** Mejora continua del proceso
- **Formato:**
  - ¿Qué hicimos bien?
  - ¿Qué podemos mejorar?
  - Acciones de mejora para el próximo sprint

### Cronograma de Sprints - Fase 3

#### Sprint 1: Fundamentos y Configuración
**Duración:** Semanas 1-2  
**Story Points Objetivo:** 80 SP

**Objetivos:**
- Configurar entornos de desarrollo
- Implementar arquitectura base
- Setup de CI/CD
- Diseño de base de datos

**Historias Principales:**
- Configuración de repositorio y estructura de proyecto (3 SP)
- Setup de entornos Docker (5 SP)
- Diseño e implementación del esquema de BD (8 SP)
- Configuración de pipeline CI/CD (8 SP)
- Implementación de autenticación básica (13 SP)
- Setup de testing framework (5 SP)

#### Sprint 2: Módulos Core
**Duración:** Semanas 3-4  
**Story Points Objetivo:** 85 SP

**Objetivos:**
- Implementar módulos principales
- APIs fundamentales
- Interfaces básicas

**Historias Principales:**
- API de gestión de usuarios (13 SP)
- CRUD de entidades principales (21 SP)
- Interfaz de dashboard (13 SP)
- Implementar validaciones backend (8 SP)
- Testing de APIs (8 SP)

#### Sprint 3: Funcionalidades Avanzadas
**Duración:** Semanas 5-6  
**Story Points Objetivo:** 85 SP

**Objetivos:**
- Funcionalidades complejas
- Integraciones
- Mejoras de UX

**Historias Principales:**
- Sistema de notificaciones (13 SP)
- Búsqueda y filtrado avanzado (13 SP)
- Integración con servicios externos (13 SP)
- Panel de reportes (13 SP)
- Optimización de rendimiento (8 SP)

#### Sprint 4: Refinamiento y Testing
**Duración:** Semanas 7-8  
**Story Points Objetivo:** 70 SP

**Objetivos:**
- Testing exhaustivo
- Corrección de bugs
- Mejoras de usabilidad
- Documentación

**Historias Principales:**
- Testing E2E completo (13 SP)
- Corrección de bugs críticos (21 SP)
- Optimización de UI/UX (13 SP)
- Documentación técnica (8 SP)
- Preparación para despliegue (8 SP)

#### Sprint 5: Despliegue y Cierre
**Duración:** Semanas 9-10  
**Story Points Objetivo:** 60 SP

**Objetivos:**
- Despliegue a producción
- Monitoreo y estabilización
- Documentación final
- Capacitación

**Historias Principales:**
- Despliegue a producción (13 SP)
- Configuración de monitoreo (5 SP)
- Testing en producción (8 SP)
- Documentación de usuario (8 SP)
- Capacitación del equipo (5 SP)
- Presentación final del proyecto (5 SP)

### Métricas de Seguimiento

#### Burndown Chart
- **Actualización:** Diaria
- **Visualización:** Gráfico de Story Points restantes vs. días
- **Objetivo:** Línea de tendencia ideal vs. progreso real

#### Velocity Chart
- **Cálculo:** Story Points completados por sprint
- **Uso:** Predicción de capacidad futura
- **Revisión:** Cada Sprint Planning

#### Cumulative Flow Diagram
- **Estados:** Backlog → En Progreso → En Revisión → Completado
- **Análisis:** Identificar cuellos de botella

#### Métricas de Calidad
- **Code Coverage:** Objetivo mínimo 80%
- **Bug Rate:** Bugs por Story Point
- **Deuda Técnica:** Tiempo estimado para resolverla

### Gestión de Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Estimaciones incorrectas | Media | Alto | Refinamiento continuo, usar velocity histórica |
| Ausencias del equipo | Media | Medio | Cross-training, documentación clara |
| Bloqueos técnicos | Alta | Alto | Spike stories, pair programming |
| Cambios de requisitos | Media | Medio | Product Backlog priorizado, comunicación frecuente |
| Problemas de integración | Media | Alto | Integración continua, testing automatizado |

### Definición de Done (DoD)

Una historia de usuario se considera completada cuando:

1. ✅ Código implementado según requisitos
2. ✅ Pruebas unitarias escritas y pasando (>80% coverage)
3. ✅ Pruebas de integración completadas
4. ✅ Code review aprobado por al menos un peer
5. ✅ Documentación técnica actualizada
6. ✅ Sin bugs críticos o bloqueantes
7. ✅ Desplegado en entorno de staging
8. ✅ Aceptado por el Product Owner
9. ✅ Cumple con estándares de código del proyecto
10. ✅ Accesibilidad y responsividad verificadas (frontend)

---

## Conclusión

Esta documentación establece el marco para una gestión efectiva de recursos y tiempos durante la Fase 3 del proyecto. El éxito depende de:

- **Comunicación constante** entre todos los miembros del equipo
- **Flexibilidad** para adaptarse a cambios y aprendizajes
- **Compromiso** con las prácticas ágiles y mejora continua
- **Transparencia** en el progreso y los impedimentos

**Documento vivo:** Esta documentación debe revisarse y actualizarse regularmente según la evolución del proyecto.

---

**Última actualización:** 2025-12-10  
**Versión:** 1.0  
**Responsable:** Equipo de Proyecto