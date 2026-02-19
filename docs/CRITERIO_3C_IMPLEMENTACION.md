# Criterio 3c — Permisos, Autorizaciones y Legislación

## Guía de Implementación y Localización de Cambios

**Proyecto:** PlayTheMood  
**Fecha de implementación:** 19 de febrero de 2026  
**Criterio evaluado:** Permisos, autorizaciones y legislación (10 puntos)

---

## Índice

1. [Resumen de cumplimiento](#1-resumen-de-cumplimiento)
2. [Documento de legislación](#2-documento-de-legislación)
3. [Páginas legales implementadas](#3-páginas-legales-implementadas)
4. [Banner de cookies funcional](#4-banner-de-cookies-funcional)
5. [Consentimiento RGPD en registro](#5-consentimiento-rgpd-en-registro)
6. [Gestión de datos personales (backend)](#6-gestión-de-datos-personales-backend)
7. [Accesibilidad web WCAG 2.1](#7-accesibilidad-web-wcag-21)
8. [Propiedad intelectual](#8-propiedad-intelectual)
9. [Normativa específica del sector](#9-normativa-específica-del-sector)
10. [Footer con enlaces legales](#10-footer-con-enlaces-legales)

---

## 1. Resumen de Cumplimiento

| Requisito de la rúbrica | Estado | Ubicación |
|--------------------------|--------|-----------|
| Análisis en profundidad del RGPD | ✅ Completado | `docs/legislacion.md` — Sección 2 |
| Política de cookies con banner funcional | ✅ Completado | Componente `CookieBanner` + página `/legal/cookies` |
| Condiciones de uso y términos de servicio | ✅ Completado | Página `/legal/terminos` |
| Criterios WCAG 2.1 analizados e implementados | ✅ Completado | `docs/legislacion.md` Sección 5 + CSS + skip link |
| Propiedad intelectual verificada | ✅ Completado | `docs/legislacion.md` — Sección 6 |
| Normativa específica del sector | ✅ Completado | `docs/legislacion.md` — Sección 7 |
| Páginas legales implementadas | ✅ Completado | Rutas `/legal/*` en el frontend |
| Gestión de datos personales | ✅ Completado | Endpoint `GET /api/users/:id/data-export` |
| Documento `docs/legislacion.md` exhaustivo | ✅ Completado | 1900+ líneas, normativas, plan, enlaces |

---

## 2. Documento de Legislación

📄 **Archivo:** `docs/legislacion.md`

Documento exhaustivo de más de 1900 líneas que cubre:

| Sección | Contenido |
|---------|-----------|
| Sección 1 | Introducción, descripción del proyecto, datos tratados |
| Sección 2 | **RGPD en profundidad:** principios, consentimiento, transparencia, derechos ARCO+, seguridad, DPO, transferencias internacionales |
| Sección 3 | **Política de Cookies:** clasificación, banner, gestión de preferencias, revocación |
| Sección 4 | **Términos y Condiciones:** identificación de partes, uso aceptable/prohibido, propiedad intelectual, limitación de responsabilidad, jurisdicción |
| Sección 5 | **Accesibilidad WCAG 2.1:** principios POUR, checklist verificado, herramientas de auditoría, declaración de accesibilidad |
| Sección 6 | **Propiedad Intelectual:** inventario de recursos, licencias, APIs externas, protección de marca |
| Sección 7 | **Normativa del sector:** LSSI-CE, contenido generado por usuarios, protección de menores |
| Sección 8 | Permisos y autorizaciones |
| Sección 9 | Implementación técnica (código de ejemplo) |
| Sección 10 | Plan de implementación con fases y cronograma — todo marcado como ✅ Completado |
| Sección 11 | Enlaces a políticas legales (con estado de implementación) |
| Sección 12 | Anexos: registro de tratamiento, análisis de impacto, contactos |

---

## 3. Páginas Legales Implementadas

Todas las páginas legales están en `frontend/src/pages/legal/` y accesibles desde el navegador:

### 3.1 Política de Privacidad

- 📄 **Archivo:** `frontend/src/pages/legal/PrivacyPolicy.jsx`
- 🌐 **Ruta:** `/legal/privacidad`
- 📋 **Contenido:** 14 secciones cubriendo responsable del tratamiento, datos recopilados, finalidad, base legal, destinatarios, transferencias internacionales, plazo de conservación, derechos ARCO+, seguridad, cookies, menores, cambios, contacto y reclamaciones ante la AEPD.

### 3.2 Política de Cookies

- 📄 **Archivo:** `frontend/src/pages/legal/CookiesPolicy.jsx`
- 🌐 **Ruta:** `/legal/cookies`
- 📋 **Contenido:** 7 secciones con definición, normativa aplicable, clasificación de cookies (técnicas, personalización, analíticas, publicitarias), gestión del consentimiento, revocación, enlaces a configuración de navegadores y botón para restablecer preferencias.

### 3.3 Términos y Condiciones

- 📄 **Archivo:** `frontend/src/pages/legal/TermsConditions.jsx`
- 🌐 **Ruta:** `/legal/terminos`
- 📋 **Contenido:** 13 secciones con información general, aceptación, descripción del servicio, registro, uso aceptable/prohibido, propiedad intelectual, contenido de usuarios, servicios de Spotify, limitación de responsabilidad, suspensión/terminación, modificaciones, ley aplicable + resolución alternativa de conflictos (enlace a plataforma ODR de la UE).

### 3.4 Declaración de Accesibilidad

- 📄 **Archivo:** `frontend/src/pages/legal/AccessibilityStatement.jsx`
- 🌐 **Ruta:** `/legal/accesibilidad`
- 📋 **Contenido:** 9 secciones con compromiso, normativa (WCAG 2.1 nivel AA, Directiva UE 2016/2102), estado de conformidad con tabla de criterios implementados, contenido no accesible, tecnologías compatibles, herramientas de verificación, contacto, procedimiento de reclamación y mejora continua.

### Estilos de las páginas legales

- 📄 **Archivo:** `frontend/src/styles/LegalPage.module.css`
- 📋 **Descripción:** Estilos responsive para todas las páginas legales con diseño coherente con el resto de la aplicación.

### Rutas configuradas

- 📄 **Archivo:** `frontend/src/router/Router.jsx`
- 📋 **Líneas añadidas:** Importaciones de los 4 componentes legales + 4 rutas bajo `/legal/*`

---

## 4. Banner de Cookies Funcional

### Componente

- 📄 **Archivo:** `frontend/src/components/CookieBanner/CookieBanner.jsx`
- 📋 **Funcionalidades:**
  - Se muestra automáticamente en la primera visita
  - **3 opciones:** "Solo necesarias", "Guardar preferencias", "Aceptar todas"
  - **Gestión granular:** cookies necesarias (siempre activas, no desactivables), personalización (opcional), analíticas (opcional)
  - Guarda preferencias en `localStorage` con timestamp y versión
  - No precarga cookies no esenciales antes del consentimiento
  - Enlace a la política completa de cookies
  - Atributos de accesibilidad: `role="dialog"`, `aria-label`

### Estilos

- 📄 **Archivo:** `frontend/src/styles/CookieBanner.module.css`
- 📋 **Descripción:** Animación de entrada (slideUp), diseño responsive, indicadores de foco accesibles.

### Integración

- 📄 **Archivo:** `frontend/src/layouts/LayoutRoot.jsx`
- 📋 **Cambio:** `<CookieBanner />` integrado en el layout raíz, aparece en todas las páginas.

### Reapertura del banner

- 📄 **Archivo:** `frontend/src/components/Footer/Footer.jsx`
- 📋 **Cambio:** Botón **"Configurar cookies"** en el footer que borra el consentimiento y recarga la página para reabrir el banner.

---

## 5. Consentimiento RGPD en Registro

- 📄 **Archivo:** `frontend/src/pages/Register.jsx`
- 📋 **Cambios realizados:**

| Elemento | Descripción |
|----------|-------------|
| Checkbox obligatorio | "He leído y acepto la **Política de Privacidad**" (con enlace a `/legal/privacidad`) |
| Checkbox obligatorio | "Acepto los **Términos y Condiciones**" (con enlace a `/legal/terminos`) |
| Checkbox opcional | "Deseo recibir comunicaciones comerciales y novedades" |
| Validación | El formulario no se envía si los checkboxes obligatorios no están marcados |
| Mensaje de error | Rol `alert` para accesibilidad en los mensajes de error |

---

## 6. Gestión de Datos Personales (Backend)

### Endpoint de exportación de datos (Portabilidad RGPD)

Cumple con el **Derecho de Acceso (Art. 15)** y **Derecho de Portabilidad (Art. 20)** del RGPD.

| Aspecto | Detalle |
|---------|---------|
| **Ruta** | `GET /api/users/:id/data-export` |
| **Autenticación** | JWT requerido + verificación de propiedad |
| **Formato** | JSON estructurado con header `Content-Disposition: attachment` |
| **Contenido exportado** | Datos del usuario, playlists, consentimientos, metadatos de exportación |

**Archivos modificados:**

| Archivo | Cambio |
|---------|--------|
| `backend/src/routes/userRoutes.js` | Nueva ruta `GET /:id/data-export` con middleware de autenticación y propiedad |
| `backend/src/controllers/userController.js` | Función `exportUserData` con respuesta JSON descargable |
| `backend/src/services/userService.js` | Método `exportUserData` que recopila usuario + playlists + consentimientos |

### Endpoints existentes relevantes para RGPD

| Derecho RGPD | Endpoint | Estado |
|--------------|----------|--------|
| Rectificación (Art. 16) | `PUT /api/users/:id` | Ya existía ✅ |
| Supresión (Art. 17) | `DELETE /api/users/:id` | Ya existía ✅ |
| Acceso (Art. 15) | `GET /api/users/:id/data-export` | **Nuevo** ✅ |
| Portabilidad (Art. 20) | `GET /api/users/:id/data-export` | **Nuevo** ✅ |

---

## 7. Accesibilidad Web WCAG 2.1

### Cambios implementados

| Mejora WCAG | Archivo | Descripción |
|-------------|---------|-------------|
| **Skip link** (2.4.1) | `frontend/src/layouts/LayoutRoot.jsx` | Enlace "Saltar al contenido principal" oculto, visible al hacer Tab |
| **Skip link CSS** | `frontend/src/index.css` | Estilos de posicionamiento y visibilidad al recibir foco |
| **Foco visible** (2.4.7) | `frontend/src/index.css` | `:focus-visible { outline: 3px solid #5888ed }` |
| **Clase sr-only** | `frontend/src/index.css` | Clase para texto solo visible para lectores de pantalla |
| **Footer semántico** | `frontend/src/components/Footer/Footer.jsx` | `role="contentinfo"`, `aria-label="Enlaces del pie de página"` |
| **Idioma de página** (3.1.1) | `frontend/index.html` | `<html lang="es">` (ya existía) |
| **Errores accesibles** (3.3.1) | `frontend/src/pages/Register.jsx` | `role="alert"` en mensajes de error |
| **Banner accesible** | `frontend/src/components/CookieBanner/CookieBanner.jsx` | `role="dialog"`, `aria-label`, `aria-label` en checkboxes |
| **Páginas legales** | `frontend/src/pages/legal/*.jsx` | `id="main-content"` para el skip link |

### Análisis detallado de WCAG

- 📄 **Archivo:** `docs/legislacion.md` — Sección 5
- 📋 **Contenido:** Tabla completa de criterios WCAG por principio (Perceptible, Operable, Comprensible, Robusto), checklist verificado con 20+ criterios marcados como implementados, herramientas de verificación listadas.

---

## 8. Propiedad Intelectual

- 📄 **Archivo:** `docs/legislacion.md` — Sección 6
- 📋 **Contenido verificado:**

| Categoría | Verificación |
|-----------|-------------|
| Código propio | Licencia MIT ✅ |
| React, React Router, Vite, Axios | MIT ✅ |
| Express, Mongoose, bcrypt, JWT, Helmet | MIT ✅ |
| Recursos multimedia (imágenes, vídeo) | Verificados ✅ |
| Spotify API | Cumplimiento de Developer Terms ✅ |
| Atribución de Spotify | Copyright en footer ✅ |
| Iconos de redes sociales | Uso según directrices de marca ✅ |

---

## 9. Normativa Específica del Sector

- 📄 **Archivo:** `docs/legislacion.md` — Sección 7
- 📋 **Análisis realizado:**
  - **LSSI-CE** (Ley 34/2002): Obligaciones de información, comunicaciones comerciales
  - **Sector streaming/entretenimiento digital:** Análisis de aplicabilidad
  - **Contenido generado por usuarios:** Responsabilidad como hosting (Art. 16 LSSI-CE)
  - **Protección de menores:** Edad mínima 14 años (LOPDGDD)
  - **Tabla de sectores:** E-commerce, salud, finanzas, educación analizados y descartados justificadamente

---

## 10. Footer con Enlaces Legales

- 📄 **Archivo:** `frontend/src/components/Footer/Footer.jsx`
- 📋 **Cambios:**

| Antes | Después |
|-------|---------|
| Enlace "Terms" → `/Terms` | Enlace "Términos" → `/legal/terminos` |
| Enlace "Privacy" → `/Privacy` | Enlace "Privacidad" → `/legal/privacidad` |
| Sin enlace a cookies | Enlace "Cookies" → `/legal/cookies` |
| Sin enlace a accesibilidad | Enlace "Accesibilidad" → `/legal/accesibilidad` |
| Sin botón de cookies | Botón "Configurar cookies" (reabre banner) |
| Sin copyright | © 2026 PlayTheMood + atribución Spotify® |

---

## Estructura de Archivos Creados/Modificados

```
ProyectoIntermodularGrupal/
├── docs/
│   ├── legislacion.md                          [MODIFICADO] v2.0 - exhaustivo
│   └── CRITERIO_3C_IMPLEMENTACION.md           [NUEVO] este documento
├── frontend/src/
│   ├── index.css                               [MODIFICADO] skip link + focus-visible + sr-only
│   ├── router/
│   │   └── Router.jsx                          [MODIFICADO] rutas /legal/*
│   ├── layouts/
│   │   └── LayoutRoot.jsx                      [MODIFICADO] CookieBanner + skip link
│   ├── components/
│   │   ├── CookieBanner/
│   │   │   └── CookieBanner.jsx                [NUEVO] banner funcional de cookies
│   │   └── Footer/
│   │       └── Footer.jsx                      [MODIFICADO] enlaces legales + copyright
│   ├── pages/
│   │   ├── Register.jsx                        [MODIFICADO] checkboxes RGPD
│   │   └── legal/
│   │       ├── PrivacyPolicy.jsx               [NUEVO] /legal/privacidad
│   │       ├── CookiesPolicy.jsx               [NUEVO] /legal/cookies
│   │       ├── TermsConditions.jsx             [NUEVO] /legal/terminos
│   │       └── AccessibilityStatement.jsx      [NUEVO] /legal/accesibilidad
│   └── styles/
│       ├── LegalPage.module.css                [NUEVO] estilos páginas legales
│       └── CookieBanner.module.css             [NUEVO] estilos banner cookies
└── backend/src/
    ├── routes/
    │   └── userRoutes.js                       [MODIFICADO] ruta data-export
    ├── controllers/
    │   └── userController.js                   [MODIFICADO] función exportUserData
    └── services/
        └── userService.js                      [MODIFICADO] servicio exportUserData
```

---

*Documento generado el 19 de febrero de 2026 para facilitar la corrección del Criterio 3c.*
