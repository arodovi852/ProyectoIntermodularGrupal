# Análisis de Necesidades de Financiación - Criterio 2g

**Proyecto:** Sistema de Gestión Intermodular  
**Fecha:** 10 de diciembre de 2025  
**Presupuesto Total:** 3.940,00 €

---

## Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Análisis de Costes de Infraestructura](#análisis-de-costes-de-infraestructura)
3. [Costes de Marketing y Comercialización](#costes-de-marketing-y-comercialización)
4. [Capital de Trabajo](#capital-de-trabajo)
5. [Análisis de Fuentes de Financiación](#análisis-de-fuentes-de-financiación)
6. [Plan de Financiación Propuesto](#plan-de-financiación-propuesto)
7. [Justificación y Conclusiones](#justificación-y-conclusiones)

---

## 1. Resumen Ejecutivo

El proyecto requiere una inversión total de **3.940,00 €** para su desarrollo e implementación inicial. Esta inversión cubre los costes de infraestructura tecnológica, desarrollo, despliegue y operaciones durante el primer año. El análisis contempla diversas fuentes de financiación adecuadas para un proyecto tecnológico en fase inicial.

### Necesidades Totales de Financiación

| Concepto | Importe |
|----------|---------|
| Inversión Inicial (Año 1) | 3.940,00 € |
| Capital de Trabajo (3 meses) | 990,50 € |
| Marketing y Lanzamiento | 1.500,00 € |
| **TOTAL NECESIDADES** | **6.432,50 €** |

---

## 2. Análisis de Costes de Infraestructura

### 2.1 Desglose de Infraestructura Técnica (Basado en presupuesto.md)

#### A. Hosting y Despliegue - Render

**Servicio de Backend (Node.js/Express)**
- Plan: Starter Instance
- Coste mensual: 7,00 €
- Características:
  - 512 MB RAM
  - CPU compartida
  - SSL automático
  - Despliegues continuos desde GitHub
  - Logs básicos
- **Coste anual: 84,00 €**

**Servicio de Frontend (React)**
- Plan: Static Site
- Coste mensual: 0,00 € (Plan Free)
- Características:
  - CDN global integrado
  - SSL automático
  - Despliegues automáticos
  - Build automático
- **Coste anual: 0,00 €**

**Total Render:** 84,00 € anuales

#### B. Base de Datos - MongoDB Atlas

**Plan M0 Sandbox (Desarrollo y Testing)**
- Coste: 0,00 €
- Características:
  - 512 MB de almacenamiento
  - Clusters compartidos
  - Backups básicos
  - Ideal para desarrollo

**Plan M10 (Producción Recomendado)**
- Coste mensual: 57,00 €
- Características:
  - 10 GB almacenamiento
  - 2 GB RAM
  - Backups automáticos
  - Monitorización avanzada
  - Escalabilidad horizontal
  - Réplicas para alta disponibilidad
- **Coste anual: 684,00 €**

**Total MongoDB Atlas:** 684,00 € anuales (producción)

#### C. Dominio y DNS

**Dominio (.com o .es)**
- Coste anual: 12,00 € (.com) / 8,00 € (.es)
- Proveedor recomendado: Namecheap, Google Domains
- **Coste anual: 12,00 €**

**Gestión DNS**
- Servicio: Cloudflare (Plan Free)
- Coste: 0,00 €
- Beneficios:
  - DNS ultra rápido
  - Protección DDoS básica
  - Analytics básicos
  - SSL/TLS

**Total Dominio y DNS:** 12,00 € anuales

#### D. Servicios de API y Límites

**API de Autenticación - Auth0 / JWT**
- Solución propuesta: JWT + bcrypt (implementación propia)
- Coste: 0,00 €
- Alternativa Auth0 (si se requiere):
  - Plan Free: 7.000 usuarios activos
  - Plan Essentials: 35,00 €/mes (25.000 usuarios)

**Email Service - SendGrid**
- Plan Free: 100 emails/día
- Coste: 0,00 €
- Plan Essentials: 14,95 €/mes (40.000 emails/mes)
- **Coste estimado anual: 0,00 € (Plan Free suficiente para inicio)**

**API de Pagos (si se requiere) - Stripe**
- Sin coste de licencia
- Comisión por transacción: 1,4% + 0,25 €
- Integración incluida en el desarrollo

**Total APIs:** 0,00 € (en fase inicial)

#### E. CDN y Servicios de Contenido

**Cloudflare CDN**
- Plan Free
- Características:
  - CDN global
  - Caché automático
  - Protección DDoS
  - Web Application Firewall básico
  - Analytics
- **Coste: 0,00 €**

**Almacenamiento de Assets - Cloudinary**
- Plan Free: 25 GB almacenamiento, 25 GB ancho de banda/mes
- Coste: 0,00 €
- Ideal para imágenes y archivos estáticos
- **Coste: 0,00 €**

**Total CDN:** 0,00 € anuales

#### F. Monitorización y Logs

**Monitorización - UptimeRobot**
- Plan Free: 50 monitores, checks cada 5 min
- Coste: 0,00 €

**Logs y Analytics - Logtail/Better Stack**
- Plan Free: 3 GB logs/mes, 7 días retención
- Coste: 0,00 €

**Error Tracking - Sentry**
- Plan Free: 5.000 eventos/mes
- Coste: 0,00 €

**Total Monitorización:** 0,00 € (planes gratuitos)

#### G. Herramientas de Desarrollo

**Control de Versiones - GitHub**
- Plan Free para proyectos públicos
- Plan Team (si privado): 3,67 €/usuario/mes
- **Coste: 0,00 € (asumiendo repositorio público)**

**CI/CD - GitHub Actions**
- 2.000 minutos/mes gratis
- Coste: 0,00 €

**Testing y Calidad - SonarCloud**
- Gratis para proyectos públicos
- Coste: 0,00 €

**Total Desarrollo:** 0,00 € anuales

### 2.2 Resumen de Costes de Infraestructura

| Servicio | Coste Mensual | Coste Anual |
|----------|---------------|-------------|
| Render (Backend) | 7,00 € | 84,00 € |
| Render (Frontend) | 0,00 € | 0,00 € |
| MongoDB Atlas (M10) | 57,00 € | 684,00 € |
| Dominio | 1,00 € | 12,00 € |
| DNS (Cloudflare) | 0,00 € | 0,00 € |
| APIs y Servicios | 0,00 € | 0,00 € |
| CDN y Assets | 0,00 € | 0,00 € |
| Monitorización | 0,00 € | 0,00 € |
| **TOTAL INFRAESTRUCTURA** | **65,00 €** | **780,00 €** |

### 2.3 Costes de Desarrollo (del presupuesto.md)

Según el documento presupuesto.md, los costes de desarrollo son:

| Concepto | Horas | Tarifa | Total |
|----------|-------|--------|-------|
| Desarrollo Backend (MERN) | 80h | 25,00 €/h | 2.000,00 € |
| Desarrollo Frontend (React) | 60h | 25,00 €/h | 1.500,00 € |
| Integración y Testing | 20h | 20,00 €/h | 400,00 € |
| Documentación | 10h | 15,00 €/h | 150,00 € |
| Gestión de Proyecto | 8h | 20,00 €/h | 160,00 € |
| **TOTAL DESARROLLO** | **178h** | - | **4.210,00 €** |

**Nota:** El presupuesto original contempla 3.182,00 € en desarrollo según presupuesto.md.

### 2.4 Proyección de Costes Escalables

#### Año 1 (0-1000 usuarios)
- Infraestructura: 780,00 €
- Plan actual suficiente

#### Año 2 (1000-5000 usuarios)
- Render: Upgrade a Standard (25 €/mes) = 300,00 €
- MongoDB: Upgrade a M20 (95 €/mes) = 1.140,00 €
- CDN: Posible upgrade Cloudflare Pro = 240,00 €
- **Total estimado: 1.680,00 € (+115%)**

#### Año 3 (5000-20000 usuarios)
- Render: Multiple instances + Load Balancer = 900,00 €
- MongoDB: M30 Cluster = 1.800,00 €
- CDN Pro + Servicios adicionales = 600,00 €
- **Total estimado: 3.300,00 € (+96%)**

---

## 3. Costes de Marketing y Comercialización

### 3.1 Estrategia de Lanzamiento

**Fase 1: Pre-lanzamiento (Mes 1-2)**
- Creación de landing page
- Contenido en redes sociales
- Blog técnico y documentación
- **Inversión: 300,00 €**

**Fase 2: Lanzamiento (Mes 3)**
- Campaña en redes sociales
- Google Ads (presupuesto limitado)
- Outreach a instituciones educativas
- Webinar de demostración
- **Inversión: 500,00 €**

**Fase 3: Crecimiento (Mes 4-12)**
- Mantenimiento redes sociales
- Content marketing
- Email marketing
- SEO optimization
- **Inversión: 700,00 €**

### 3.2 Desglose de Inversión en Marketing

| Concepto | Coste |
|----------|-------|
| Diseño de materiales (logo, branding) | 200,00 € |
| Gestión redes sociales (Hootsuite Free) | 0,00 € |
| Google Ads (campaña inicial) | 400,00 € |
| LinkedIn Ads (B2B targeting) | 300,00 € |
| Email marketing (Mailchimp Free) | 0,00 € |
| Contenido y copywriting | 300,00 € |
| Eventos y webinars (Zoom Free) | 0,00 € |
| Material promocional | 300,00 € |
| **TOTAL MARKETING** | **1.500,00 €** |

---

## 4. Capital de Trabajo

### 4.1 Necesidades de Liquidez

**Capital de trabajo recomendado: 3 meses de gastos operativos**

| Concepto | Mensual | 3 Meses |
|----------|---------|---------|
| Infraestructura | 65,00 € | 195,00 € |
| Mantenimiento y soporte | 100,00 € | 300,00 € |
| Marketing continuo | 50,00 € | 150,00 € |
| Contingencias (10%) | 21,50 € | 64,50 € |
| Licencias y herramientas | 30,00 € | 90,00 € |
| Legal y administrativo | 63,67 € | 191,00 € |
| **TOTAL CAPITAL TRABAJO** | **330,17 €** | **990,50 €** |

### 4.2 Justificación del Capital de Trabajo

El capital de trabajo de **990,50 €** garantiza:
1. Continuidad operativa durante los primeros meses sin ingresos
2. Capacidad de respuesta ante imprevistos técnicos
3. Flexibilidad para aprovechar oportunidades de marketing
4. Colchón financiero para ajustes post-lanzamiento
5. Pago puntual de servicios críticos (hosting, base de datos)

---

## 5. Análisis de Fuentes de Financiación

### 5.1 Bootstrapping (Autofinanciación)

**Descripción:**  
Financiación con recursos propios del equipo fundador sin inversores externos.

**Ventajas:**
- Control total sobre el proyecto
- Sin dilución del capital
- Flexibilidad en la toma de decisiones
- Sin obligaciones de devolución
- Aprendizaje y responsabilidad directa

**Desventajas:**
- Recursos limitados
- Crecimiento más lento
- Riesgo financiero personal
- Puede limitar el alcance inicial

**Aplicabilidad al proyecto:**
- **ALTA** - El presupuesto de 3.962 € es asumible para un equipo pequeño
- Ideal para validar el MVP
- Recomendado para fase inicial

**Aportación recomendada:** 2.000 - 3.000 €

---

### 5.2 Préstamos Bancarios

**Descripción:**  
Financiación mediante crédito de entidades bancarias tradicionales.

**Tipos relevantes:**
1. **Microcréditos (hasta 25.000 €)**
   - ICO Empresas y Emprendedores
   - MicroBank (CaixaBank)
   - Interés: 3-6% anual
   - Plazo: 3-7 años

2. **Líneas ICO**
   - Línea ICO Empresas y Emprendedores
   - Hasta 10 millones €
   - Interés: Euribor + 1-4%
   - Aval: SGR o garantía personal

**Ventajas:**
- Sin dilución del capital
- Cantidades significativas disponibles
- Plazos de devolución flexibles
- Intereses fiscalmente deducibles

**Desventajas:**
- Requiere garantías personales o avales
- Carga financiera fija mensual
- Proceso de aprobación lento
- Riesgo en caso de fracaso del proyecto

**Aplicabilidad al proyecto:**
- **MEDIA-BAJA** para esta cuantía
- Los bancos suelen requerir historial empresarial
- Para 4.000-6.000 € puede ser excesivo el trámite

**Recomendación:** Considerar solo si se necesita más de 10.000 €

---

### 5.3 Subvenciones y Ayudas Públicas

#### A. ENISA (Empresa Nacional de Innovación S.A.)

**ENISA Jóvenes Emprendedores**

**Descripción:**  
Préstamos participativos para emprendedores menores de 40 años.

**Condiciones:**
- Importe: 25.000 - 75.000 €
- Interés: Euribor + 3,25% + interés variable según resultados
- Plazo: 7 años (2 años carencia)
- Sin garantías ni avales

**Requisitos:**
- Empresa constituida hace menos de 2 años
- Fondos propios ≥ préstamo solicitado
- Proyecto viable y escalable
- Innovador y tecnológico

**Ventajas:**
- Sin garantías personales
- Carencia de 2 años
- Interés competitivo
- Mejora el balance (fondos propios)

**Desventajas:**
- Proceso de solicitud complejo
- Requiere empresa constituida
- Mínimo 25.000 € (por encima de nuestras necesidades)
- Tiempo de resolución: 3-6 meses

**Aplicabilidad al proyecto:**
- **BAJA** - Importe mínimo excede necesidades
- Considerar para fase de expansión (Año 2)

---

#### B. Ayudas ICO - Líneas de Financiación

**ICO Empresas y Emprendedores 2025**

**Descripción:**  
Línea de crédito a través de entidades financieras con condiciones favorables.

**Condiciones:**
- Importe: Desde 5.000 € hasta 10 millones €
- Interés: Competitivo (Euribor + diferencial reducido)
- Plazo: Hasta 20 años
- A través de bancos colaboradores

**Aplicabilidad al proyecto:**
- **MEDIA** - Cantidades accesibles
- Requiere intermediación bancaria
- Bueno para complementar autofinanciación

---

#### C. Subvenciones Autonómicas y Locales

**Kit Digital (Red.es)**

**Descripción:**  
Ayudas para digitalización de pequeñas empresas y autónomos.

**Condiciones:**
- Hasta 12.000 € (empresas 10-49 empleados)
- Hasta 6.000 € (empresas 3-9 empleados)
- Hasta 2.000 € (empresas 0-2 empleados)
- Para servicios digitales predefinidos

**Aplicabilidad:** **BAJA** - Requiere empresa constituida y facturación

---

**Programas Regionales (ejemplo: Comunidad de Madrid)**

- **Cheque Innovación:** Hasta 10.000 € para I+D
- **Emprendimiento Digital:** Hasta 15.000 €
- **Startup Capital:** Hasta 50.000 €

**Ventajas generales:**
- Fondos no reembolsables (en muchos casos)
- Sin dilución
- Validación institucional

**Desventajas generales:**
- Procesos largos y burocráticos
- Alta competencia
- Justificación exhaustiva de gastos
- Requisitos estrictos

**Aplicabilidad al proyecto:**
- **MEDIA** - Investigar convocatorias locales específicas
- Ideal para complementar otras fuentes

---

### 5.4 Business Angels

**Descripción:**  
Inversores privados que aportan capital y conocimiento a cambio de participación.

**Condiciones típicas:**
- Inversión: 10.000 - 100.000 € por ángel
- Equity: 10-25% de la empresa
- Implicación: Mentoría y contactos
- Horizonte: 3-7 años

**Redes de Business Angels en España:**
- ESBAN (Spanish Business Angels Network)
- Startupxplore
- Angels Barcelona
- Madrid Network
- SeedRocket Angels

**Ventajas:**
- Aporte de experiencia y contactos
- Sin obligación de devolución
- Validación del modelo de negocio
- Acceso a network profesional
- Flexibilidad

**Desventajas:**
- Dilución del capital (10-25%)
- Pérdida parcial de control
- Proceso de búsqueda puede ser largo
- Expectativas de crecimiento alto
- Requiere pitch y business plan sólido

**Aplicabilidad al proyecto:**
- **MEDIA-ALTA** si se busca crecimiento rápido
- Cantidad (6.500 €) puede ser baja para interés de angels
- Mejor para rondas de 15.000-50.000 €

**Recomendación:** Considerar si se aumentan necesidades a 15.000-25.000 € para expansión

---

### 5.5 Venture Capital (Capital Riesgo)

**Descripción:**  
Fondos de inversión especializados en startups tecnológicas con alto potencial.

**Condiciones típicas:**
- Inversión: 100.000 - 5.000.000 € (seed a Series A)
- Equity: 15-40%
- Exigencia: Crecimiento exponencial
- Due diligence exhaustiva

**Fondos relevantes en España:**
- Seaya Ventures
- Kfund
- JME Ventures
- Antai Venture Builder
- Ship2B Ventures

**Ventajas:**
- Cantidades significativas
- Experiencia en escalado
- Red de contactos amplia
- Seguimiento en rondas posteriores
- Credibilidad en el mercado

**Desventajas:**
- Alta dilución (15-40%)
- Presión por resultados y crecimiento
- Pérdida significativa de control
- Proceso muy competitivo
- Requiere tracción y métricas sólidas

**Aplicabilidad al proyecto:**
- **MUY BAJA** en fase actual
- Nuestro proyecto (6.500 €) está muy por debajo del ticket mínimo
- Considerar solo en fase de escalado (50.000-500.000 € necesarios)

**Recomendación:** NO aplicable para MVP, valorar en Año 2-3 con tracción demostrada

---

### 5.6 Crowdfunding

**Descripción:**  
Financiación colectiva a través de plataformas online.

#### Tipos de Crowdfunding:

**A. Crowdfunding de Recompensas**

Plataformas: Kickstarter, Verkami, Goteo

- Inversores reciben recompensas (producto, servicios, experiencias)
- Sin dilución ni deuda
- Comisión plataforma: 5-8%

**Aplicabilidad:** **MEDIA** - Útil para validar demanda y financiar MVP

**B. Crowdlending (Préstamos P2P)**

Plataformas: Circulantis, Arboribus, Loanbook

- Préstamos colectivos
- Interés: 4-10%
- Plazo: 6-36 meses
- Comisión: 2-5%

**Aplicabilidad:** **MEDIA-ALTA** - Buena opción para 5.000-20.000 €

**C. Crowdequity**

Plataformas: Crowdcube, Seedrs, The Crowd Angel

- Venta de participaciones
- Mínimo habitual: 50.000-100.000 €
- Comisión: 5-8% + equity

**Aplicabilidad:** **BAJA** - Monto demasiado bajo para estas plataformas

**D. Crowdfunding de Donaciones**

Plataformas: GoFundMe, Patreon

- Sin contraprestación
- Proyecto social/educativo

**Aplicabilidad:** **MEDIA** si el proyecto tiene componente social/educativo

---

**Ventajas Crowdfunding:**
- Validación de mercado
- Construcción de comunidad
- Marketing y visibilidad
- Sin garantías personales
- Proceso relativamente rápido

**Desventajas:**
- No garantiza alcanzar objetivo
- Requiere campaña de marketing intensiva
- Comisiones de plataforma (5-10%)
- Compromiso de entrega de recompensas
- Exposición pública del proyecto

**Recomendación para el proyecto:**
- **ALTA** - Crowdfunding de recompensas (Verkami, Goteo)
- Objetivo: 5.000-7.000 €
- Recompensas: Acceso anticipado, licencias premium, formación

---

### 5.7 Aceleradoras e Incubadoras

**Descripción:**  
Programas que ofrecen financiación, formación, mentoring y networking.

#### Principales Aceleradoras en España:

**A. Lanzadera (Juan Roig)**
- Inversión: 0 € (programa gratuito)
- Equity: 0%
- Duración: 1 año
- Ubicación: Valencia
- Beneficios: Espacio, mentoring, networking, financiación opcional
- **Muy competitivo**

**B. Wayra (Telefónica)**
- Inversión: Hasta 60.000 €
- Equity: 6-10%
- Duración: 4 meses
- Sectores: Tech y telecomunicaciones
- Red global

**C. Plug and Play**
- Inversión: Variable
- Equity: 3-7%
- Programas sectoriales
- Red internacional

**D. Demium Startups**
- Inversión: Hasta 100.000 €
- Equity: Según fase
- Construcción de startup desde cero
- Ubicación: Valencia, Madrid, Palma

**E. Google for Startups**
- Créditos: Hasta 100.000 $ en Google Cloud
- Sin equity
- Mentoring y recursos

**F. Microsoft for Startups**
- Créditos: Hasta 150.000 $ en Azure
- Sin equity
- Acceso a herramientas

---

**Ventajas Aceleradoras:**
- Formación y mentoring especializado
- Networking y contactos
- Credibilidad y validación
- Acceso a inversores
- Espacios de trabajo (coworking)
- Créditos en servicios (AWS, Google Cloud, Azure)

**Desventajas:**
- Muy competitivas (tasa aceptación <5%)
- Dilución de equity (variable)
- Compromiso de tiempo intensivo
- Ubicación geográfica específica
- Requiere dedicación exclusiva

**Aplicabilidad al proyecto:**
- **ALTA** - Proyecto tecnológico ideal para aceleradoras
- Recomendar: Google for Startups, Microsoft for Startups (sin equity)
- Valorar: Lanzadera, Wayra

**Beneficio adicional:**  
Créditos cloud pueden reducir costes de infraestructura significativamente:
- Google Cloud: 100.000 $ en créditos = Varios años de infraestructura
- Microsoft Azure: 150.000 $ en créditos
- AWS Activate: Hasta 100.000 $ en créditos

---

### 5.8 Tabla Comparativa de Fuentes de Financiación

| Fuente | Cantidad | Dilución | Plazo Obtención | Coste Capital | Aplicabilidad |
|--------|----------|----------|-----------------|---------------|---------------|
| **Bootstrapping** | 2.000-4.000 € | 0% | Inmediato | 0% | ⭐⭐⭐⭐⭐ |
| **Préstamos Bancarios** | 5.000-25.000 € | 0% | 1-3 meses | 3-6% | ⭐⭐ |
| **ENISA** | 25.000-75.000 € | 0% | 3-6 meses | 4-7% | ⭐⭐ |
| **Subvenciones** | 2.000-15.000 € | 0% | 3-12 meses | 0% | ⭐⭐⭐ |
| **Business Angels** | 15.000-100.000 € | 10-25% | 2-6 meses | Alto | ⭐⭐⭐⭐ |
| **Venture Capital** | 100.000+ € | 15-40% | 3-12 meses | Muy Alto | ⭐ |
| **Crowdfunding** | 3.000-50.000 € | 0% | 1-3 meses | 5-10% comisión | ⭐⭐⭐⭐ |
| **Aceleradoras** | 0-100.000 € | 0-10% | 2-6 meses | Variable | ⭐⭐⭐⭐⭐ |

---

## 6. Plan de Financiación Propuesto

### 6.1 Estrategia Recomendada

Dadas las características del proyecto (presupuesto moderado, proyecto tecnológico educativo, fase MVP), se propone una **estrategia mixta escalonada**:

### Fase 1: MVP y Validación (Meses 1-4)
**Objetivo:** Desarrollar y lanzar versión mínima viable

**Fuentes de financiación:**

1. **Bootstrapping (Autofinanciación):** 3.000 €
   - Aportación equipo fundador
   - Cubre desarrollo inicial
   - Control total del proyecto

2. **Aceleradora sin Equity:** 500-1.000 € (equivalente en créditos)
   - Google for Startups: Créditos GCP
   - Microsoft for Startups: Créditos Azure
   - Reduce costes infraestructura a casi 0 €

3. **Subvenciones locales:** 1.500 €
   - Investigar programas autonómicos
   - Cheques innovación
   - Ayudas municipales emprendimiento

**Total Fase 1:** 4.500-5.000 €

---

### Fase 2: Lanzamiento y Tracción (Meses 5-8)
**Objetivo:** Conseguir primeros usuarios y validar modelo

**Fuentes de financiación:**

1. **Crowdfunding de Recompensas:** 3.000-5.000 €
   - Plataforma: Verkami o Goteo
   - Duración campaña: 40 días
   - Recompensas:
     - 15 €: Acceso anticipado 6 meses
     - 50 €: Licencia premium anual
     - 100 €: Licencia premium + formación personalizada
     - 500 €: Licencia institucional + soporte prioritario

2. **Kit Digital (si aplica):** 2.000 €
   - Solicitar como empresa constituida
   - Para servicios digitales

**Total Fase 2:** 5.000-7.000 €

---

### Fase 3: Crecimiento (Meses 9-12)
**Objetivo:** Escalar usuarios y preparar modelo de negocio sostenible

**Fuentes de financiación:**

1. **Ingresos recurrentes:** Variable
   - Modelo freemium
   - Suscripciones institucionales
   - Servicios de consultoría

2. **Business Angel (opcional):** 15.000-25.000 €
   - Solo si se valida tracción
   - Para aceleración comercial
   - Dilución máxima: 15%

**Total Fase 3:** Variable según tracción

---

### 6.2 Desglose del Plan de Financiación Año 1

| Fuente | Cantidad | Timing | Uso Previsto | Dilución |
|--------|----------|--------|--------------|----------|
| Bootstrapping Fundadores | 3.000 € | Mes 1 | Desarrollo + Infraestructura inicial | 0% |
| Créditos Aceleradora | 1.000 € equiv. | Mes 1-2 | Infraestructura cloud (ahorro) | 0% |
| Subvenciones locales | 1.500 € | Mes 3-4 | Marketing + Legal | 0% |
| Crowdfunding | 4.000 € | Mes 5-6 | Capital trabajo + Marketing | 0% |
| Ingresos operativos | Variable | Mes 7+ | Autofinanciación | 0% |
| **TOTAL AÑO 1** | **9.500 €** | - | - | **0%** |

### 6.3 Uso de Fondos

#### Distribución Presupuestaria Total

| Categoría | Importe | % Total |
|-----------|---------|---------|
| Desarrollo (MERN Stack) | 3.182 € | 48,7% |
| Infraestructura Año 1 | 780 € | 12,0% |
| Marketing y Lanzamiento | 1.500 € | 23,0% |
| Capital de Trabajo | 990 € | 15,2% |
| Contingencias (5%) | 80 € | 1,1% |
| **TOTAL** | **6.532 €** | **100%** |

#### Cronograma de Desembolsos

**Trimestre 1 (Meses 1-3):**
- Desarrollo: 1.500 €
- Infraestructura setup: 195 €
- Legal y admin: 300 €
- **Subtotal: 1.995 €**

**Trimestre 2 (Meses 4-6):**
- Desarrollo: 1.682 €
- Infraestructura: 195 €
- Marketing lanzamiento: 800 €
- **Subtotal: 2.677 €**

**Trimestre 3 (Meses 7-9):**
- Infraestructura: 195 €
- Marketing: 400 €
- Capital trabajo: 500 €
- **Subtotal: 1.095 €**

**Trimestre 4 (Meses 10-12):**
- Infraestructura: 195 €
- Marketing: 300 €
- Reserva: 270 €
- **Subtotal: 765 €**

---

### 6.4 Flujo de Caja Proyectado (Año 1)

| Mes | Ingresos | Gastos | Flujo | Acumulado | Fuente Financiación |
|-----|----------|--------|-------|-----------|---------------------|
| 1 | 0 € | 800 € | -800 € | -800 € | Bootstrapping |
| 2 | 0 € | 650 € | -650 € | -1.450 € | Bootstrapping |
| 3 | 0 € | 545 € | -545 € | -1.995 € | Bootstrapping + Subvención |
| 4 | 0 € | 850 € | -850 € | -2.845 € | Subvención |
| 5 | 0 € | 950 € | -950 € | -3.795 € | Crowdfunding (inicio) |
| 6 | 4.000 € | 877 € | +3.123 € | -672 € | Crowdfunding (cierre) |
| 7 | 300 € | 365 € | -65 € | -737 € | Primeros ingresos |
| 8 | 500 € | 365 € | +135 € | -602 € | Crecimiento usuarios |
| 9 | 800 € | 365 € | +435 € | -167 € | Crecimiento usuarios |
| 10 | 1.200 € | 255 € | +945 € | +778 € | Modelo recurrente |
| 11 | 1.500 € | 255 € | +1.245 € | +2.023 € | Modelo recurrente |
| 12 | 2.000 € | 255 € | +1.745 € | +3.768 € | Modelo consolidado |

**Punto de equilibrio proyectado:** Mes 10  
**Cash flow positivo desde:** Mes 10  
**Capital final Año 1:** +3.768 €

---

### 6.5 Análisis de Riesgos Financieros

#### Riesgos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| No conseguir financiación crowdfunding | Media | Alto | Reducir alcance MVP, aumentar bootstrapping |
| Retraso en desarrollo | Media | Medio | Buffer temporal 20%, metodología ágil |
| Costes infraestructura mayores | Baja | Medio | Usar créditos cloud, plan B con servicios free |
| No alcanzar usuarios objetivo | Media | Alto | Pivote modelo negocio, focus institucional |
| Competencia emergente | Media | Medio | Diferenciación técnica, especialización sector |
| Cambios regulatorios | Baja | Alto | Asesoría legal, flexibilidad arquitectura |

#### Plan de Contingencia

**Escenario Pesimista (-30% financiación):**
- Financiación obtenida: 6.650 €
- Acciones:
  - Reducir alcance funcional MVP
  - Priorizar features core
  - Extender desarrollo a 10 meses
  - Maximizar uso de créditos cloud gratuitos
  - Posponer marketing agresivo

**Escenario Optimista (+30% financiación):**
- Financiación obtenida: 12.350 €
- Oportunidades:
  - Acelerar desarrollo (contratar freelancer adicional)
  - Marketing más agresivo
  - Expandir infraestructura (mejor rendimiento)
  - Contratar diseñador UX profesional
  - Participar en eventos y ferias del sector

---

## 7. Justificación y Conclusiones

### 7.1 Justificación de la Estrategia Propuesta

#### ¿Por qué Bootstrapping + Aceleradoras + Crowdfunding?

**1. Bootstrapping (3.000 €) como base:**
- **Control total:** No hay dilución ni dependencia externa en fase crítica
- **Validación personal:** Demuestra compromiso del equipo
- **Flexibilidad:** Permite pivotar sin restricciones
- **Aprendizaje:** Fuerza a optimizar cada euro

**2. Aceleradoras sin equity:**
- **ROI infinito:** Créditos valorados en 1.000-150.000 $ sin dilución
- **Reduce OPEX:** Los costes de infraestructura bajan de 780 € a casi 0 €
- **Networking:** Acceso a mentores y partners tecnológicos
- **Credibilidad:** Sello de calidad para futuros inversores

**3. Crowdfunding (4.000 €):**
- **Validación de mercado:** Demuestra demanda real del producto
- **Marketing incorporado:** La campaña genera visibilidad
- **Construcción de comunidad:** Early adopters comprometidos
- **Sin dilución ni deuda:** Preserva estructura de capital
- **Feedback temprano:** Los backers son testers naturales

**4. Subvenciones (1.500 €):**
- **Dinero no dilutivo:** Complemento perfecto a otras fuentes
- **Validación institucional:** Reconocimiento del valor del proyecto
- **Networking público:** Acceso a convocatorias y programas

---

### 7.2 Ventajas de Este Modelo

**Preservación de equity:** 0% dilución en Año 1  
**Sin carga financiera:** No hay deuda que devolver con intereses  
**Validación progresiva:** Cada fase valida la anterior  
**Flexibilidad máxima:** Posibilidad de pivotar sin restricciones  
**Construcción de tracción:** Base sólida para rondas futuras  
**Aprendizaje acelerado:** El equipo crece con el proyecto  
**Comunidad desde día 1:** El crowdfunding crea embajadores  

---

### 7.3 Alternativas Consideradas y Descartadas

#### Business Angels desde el inicio
**Descartado porque:**
- Dilución prematura (10-25%) sin tracción demostrada
- El ticket de 6.500 € es bajo para angels (prefieren 25.000+)
- Pérdida de control en fase exploratoria
- **Mejor timing:** Año 2 con métricas de uso

#### Préstamo bancario
**Descartado porque:**
- Carga financiera mensual desde día 1
- Requiere garantías personales o avales
- Para 6.500 € no compensa el proceso
- **Mejor timing:** Solo si se necesita >15.000 € urgente

#### Venture Capital
**Descartado porque:**
- Completamente fuera de escala (ticket mínimo 100.000 €)
- Dilución masiva (20-40%)
- Presión por crecimiento exponencial
- **Mejor timing:** Año 3-4 con modelo probado y escalable

---

### 7.4 Métricas de Éxito para Año 1

Para considerar exitosa la estrategia de financiación y preparar Año 2:

**Métricas Financieras:**
- ✓ Alcanzar objetivo crowdfunding: 4.000 € (mínimo 3.000 €)
- ✓ Obtener créditos cloud: ≥50.000 $ equivalentes
- ✓ Conseguir subvención: ≥1.000 €
- ✓ Alcanzar punto de equilibrio: Mes 10-12
- ✓ Cash flow positivo: A partir de mes 10

**Métricas de Producto:**
- ✓ Lanzar MVP funcional: Mes 6
- ✓ Captar early adopters: 50-100 usuarios
- ✓ Retención mensual: >60%
- ✓ NPS (Net Promoter Score): >40

**Métricas de Mercado:**
- ✓ Validar product-market fit: Entrevistas y feedback
- ✓ Conseguir 2-3 clientes institucionales piloto
- ✓ Generar 5.000 € en ingresos recurrentes (MRR)
- ✓ CAC (Customer Acquisition Cost) <30 €

---

### 7.5 Proyección Año 2 y 3

#### Año 2: Crecimiento y Escalado

**Necesidades financieras estimadas:** 25.000-40.000 €

**Fuentes recomendadas:**
- **Business Angels:** 20.000-30.000 € (Dilución 15-20%)
- **ENISA Jóvenes Emprendedores:** 25.000 € (Sin dilución)
- **Ingresos recurrentes:** 15.000-30.000 €

**Objetivos:**
- Escalar a 500-1.000 usuarios activos
- Contratar 1-2 personas adicionales
- Expandir funcionalidades
- Marketing y ventas agresivos
- Infraestructura escalable (upgrade a M20)

#### Año 3: Consolidación y Expansión

**Necesidades financieras estimadas:** 100.000-250.000 €

**Fuentes recomendadas:**
- **Serie Seed (micro-VC o angels sindicados):** 100.000-200.000 €
- **Préstamo ICO:** 50.000 €
- **Ingresos recurrentes:** 60.000-120.000 €

**Objetivos:**
- 2.000-5.000 usuarios activos
- Equipo de 5-8 personas
- Expansión internacional (mercado latinoamericano)
- Partnerships estratégicos con instituciones educativas
- Preparar Serie A

---

### 7.6 Recomendaciones Finales

#### Para el Equipo Emprendedor

1. **Empezar YA con bootstrapping:**
   - No esperar financiación externa para comenzar
   - Validar hipótesis con MVP mínimo
   - Cada día cuenta en el desarrollo

2. **Aplicar inmediatamente a aceleradoras sin equity:**
   - Google for Startups
   - Microsoft for Startups
   - AWS Activate
   - Proceso: 2-4 semanas

3. **Preparar campaña crowdfunding con 3 meses de antelación:**
   - Construir audiencia en redes sociales
   - Crear video demo profesional
   - Diseñar recompensas atractivas
   - Landing page con email capture

4. **Paralelamente, investigar subvenciones locales:**
   - Contactar Cámara de Comercio local
   - Programas autonómicos
   - Ayuntamiento (programa emprendedores)

5. **Documentar TODA la métrica desde día 1:**
   - Usuarios, engagement, conversión, churn
   - Costes reales vs. proyectados
   - Feedback cualitativo
   - → Preparar terreno para ronda futura

#### Para Investors Potenciales (Año 2+)

El proyecto será atractivo si demuestra:
- ✓ Product-market fit validado con usuarios reales
- ✓ Crecimiento orgánico sostenido (MoM >15%)
- ✓ Retención alta (>70% mes 3)
- ✓ Modelo de negocio con ingresos recurrentes
- ✓ Equipo técnico probado y comprometido
- ✓ Mercado objetivo claro y alcanzable

---

### 7.7 Conclusión Ejecutiva

El **Plan de Financiación Propuesto** para este proyecto es **viable, equilibrado y óptimo** para las necesidades reales:

**Presupuesto:** 6.532 € cubierto con estrategia mixta  
**Dilución:** 0% en Año 1 (preservación control)  
**Deuda:** 0 € (sin carga financiera)  
**Timing:** Financiación progresiva alineada con milestones  
**Riesgo:** Mitigado con múltiples fuentes complementarias  
**Flexibilidad:** Capacidad de ajuste según resultados  

**La clave del éxito financiero no está en conseguir la mayor cantidad de dinero, sino en:**
1. Obtener los fondos justos cuando se necesitan
2. Mantener el control y flexibilidad
3. Validar progresivamente con métricas reales
4. Construir tracción que atraiga financiación futura en mejores condiciones

Este proyecto está en **posición ideal** para comenzar con autofinanciación, aprovechar aceleradoras, validar con crowdfunding y escalar posteriormente con inversores profesionales una vez demostrado el modelo.

---

## Anexos

### Anexo A: Checklist de Aplicación a Aceleradoras

**Google for Startups:**
- [ ] Empresa constituida o en proceso
- [ ] Proyecto tecnológico en fase early-stage
- [ ] Aplicación online: https://startup.google.com/
- [ ] Documentación: Pitch deck, demo producto
- [ ] Tiempo resolución: 2-4 semanas

**Microsoft for Startups:**
- [ ] Empresa <5 años
- [ ] Serie A o anterior
- [ ] Aplicación: https://www.microsoft.com/startups
- [ ] Documentación: Pitch deck, modelo negocio
- [ ] Créditos: Hasta $150.000 Azure

---

### Anexo B: Template de Campaña Crowdfunding

**Objetivo:** 4.000-5.000 €  
**Plataforma:** Verkami o Goteo  
**Duración:** 40 días  

**Recompensas propuestas:**

| Nivel | Aportación | Recompensa | Cantidad |
|-------|------------|------------|----------|
| Tier 1 | 10 € | Agradecimiento + actualizaciones | Ilimitado |
| Tier 2 | 25 € | Acceso anticipado 3 meses | 100 uds |
| Tier 3 | 50 € | Licencia premium 1 año | 50 uds |
| Tier 4 | 100 € | Premium + sesión formación | 20 uds |
| Tier 5 | 250 € | Licencia institucional 5 usuarios | 10 uds |
| Tier 6 | 500 € | Licencia institucional + soporte | 5 uds |

---

### Anexo C: Calendario de Financiación 2025

| Mes | Acción | Objetivo |
|-----|--------|----------|
| Enero | Constitución legal + Aplicación aceleradoras | Créditos cloud |
| Febrero | Desarrollo MVP inicial | Demo funcional |
| Marzo | Preparación campaña crowdfunding | Materiales listos |
| Abril | Solicitud subvenciones locales | Documentación |
| Mayo | Lanzamiento crowdfunding | 4.000 € |
| Junio | Cierre crowdfunding + lanzamiento MVP | Primeros usuarios |
| Julio-Agosto | Iteración producto + validación | Feedback |
| Septiembre | Primeros ingresos recurrentes | Modelo probado |
| Octubre-Diciembre | Optimización + preparación Año 2 | Métricas ronda seed |

---

### Anexo D: Contactos y Recursos Útiles

**Aceleradoras:**
- Google for Startups: startup.google.com
- Microsoft for Startups: microsoft.com/startups
- Lanzadera: lanzadera.es
- Wayra: wayra.com

**Crowdfunding:**
- Verkami: verkami.com
- Goteo: goteo.org
- Kickstarter: kickstarter.com

**Financiación Pública:**
- ENISA: enisa.es
- ICO: ico.es
- Red.es (Kit Digital): red.es

**Redes de Angels:**
- ESBAN: esban.org
- Startupxplore: startupxplore.com
- Angels Barcelona: angelsbarcelona.com

---

**Documento preparado para:** Criterio 2g - Análisis de Financiación  
**Versión:** 1.0  
**Fecha:** 10 de diciembre de 2025  
**Autor:** Equipo ProyectoIntermodularGrupal  
**Contacto:** arodovi852

---

*Este documento es un análisis preliminar y debe ser revisado por asesores financieros y legales profesionales antes de tomar decisiones de financiación.*
