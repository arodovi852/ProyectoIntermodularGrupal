# Documento de Cumplimiento Legal y Normativo

## PlayTheMood - Marco Legal y Regulatorio

**Versión:** 1.0  
**Fecha:** 12 de febrero de 2026  
**Última actualización:** 12 de febrero de 2026

---

## Tabla de Contenidos

1. [Introducción](#1-introducción)
2. [Protección de Datos - RGPD](#2-protección-de-datos---rgpd)
3. [Política de Cookies](#3-política-de-cookies)
4. [Condiciones de Uso y Términos de Servicio](#4-condiciones-de-uso-y-términos-de-servicio)
5. [Accesibilidad Web - WCAG 2.1](#5-accesibilidad-web---wcag-21)
6. [Propiedad Intelectual](#6-propiedad-intelectual)
7. [Normativa Específica del Sector](#7-normativa-específica-del-sector)
8. [Permisos y Autorizaciones](#8-permisos-y-autorizaciones)
9. [Implementación Técnica](#9-implementación-técnica)
10. [Plan de Implementación](#10-plan-de-implementación)
11. [Enlaces a Políticas Legales](#11-enlaces-a-políticas-legales)
12. [Anexos](#12-anexos)

---

## 1. Introducción

### 1.1 Descripción del Proyecto

**PlayTheMood** es una aplicación web fullstack que genera playlists de Spotify personalizadas basadas en el estado de ánimo del usuario. La aplicación:

- Recoge y procesa datos personales de usuarios
- Se integra con la API de Spotify
- Almacena información en bases de datos MongoDB
- Opera en territorio español/europeo (dominio: playthemood.dev)

### 1.2 Ámbito de Aplicación

Este documento establece el marco legal aplicable a PlayTheMood, identificando:

- Normativas europeas, nacionales y sectoriales aplicables
- Requisitos específicos de cada regulación
- Plan de implementación técnica para el cumplimiento
- Responsabilidades y obligaciones legales

### 1.3 Datos Tratados por la Aplicación

| Dato | Tipo | Finalidad | Base Legal |
|------|------|-----------|------------|
| Nombre | Personal | Identificación de usuario | Consentimiento |
| Email | Personal | Comunicación y autenticación | Consentimiento + Ejecución contractual |
| Contraseña | Sensible (hasheada) | Autenticación | Ejecución contractual |
| Playlists | Personal | Funcionalidad del servicio | Ejecución contractual |
| Datos de Spotify | Personal (terceros) | Integración con servicio | Consentimiento |
| Dirección IP | Personal | Seguridad y logs | Interés legítimo |

---

## 2. Protección de Datos - RGPD

### 2.1 Normativa Aplicable

- **Reglamento (UE) 2016/679** - Reglamento General de Protección de Datos (RGPD)
- **Ley Orgánica 3/2018** - Ley Orgánica de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD)

### 2.2 Principios Fundamentales

#### 2.2.1 Licitud, Lealtad y Transparencia

**Requisito:** El tratamiento debe ser lícito, leal y transparente para el interesado.

**Implementación en PlayTheMood:**
- Información clara sobre el uso de datos en el registro
- Política de privacidad accesible y comprensible
- Sin tratamiento oculto de datos

#### 2.2.2 Limitación de la Finalidad

**Requisito:** Los datos deben recogerse con fines determinados, explícitos y legítimos.

**Finalidades autorizadas:**
1. Prestación del servicio (generación de playlists)
2. Gestión de la cuenta de usuario
3. Comunicaciones relacionadas con el servicio
4. Mejora del servicio (análisis anónimos)

#### 2.2.3 Minimización de Datos

**Requisito:** Los datos deben ser adecuados, pertinentes y limitados a lo necesario.

**Datos mínimos requeridos:**
- Nombre (identificación)
- Email (comunicación/autenticación)
- Contraseña (seguridad)

**Datos NO recolectados:**
- Fecha de nacimiento
- Dirección postal
- Número de teléfono
- Datos bancarios

#### 2.2.4 Exactitud

**Requisito:** Los datos deben ser exactos y estar actualizados.

**Implementación:**
- Endpoint de actualización de perfil (`PUT /api/users/:id`)
- Validación de formato de email
- Verificación de datos en registro

#### 2.2.5 Limitación del Plazo de Conservación

**Requisito:** Los datos no deben conservarse más tiempo del necesario.

**Política de retención:**
| Tipo de dato | Período de conservación |
|--------------|------------------------|
| Datos de cuenta activa | Mientras la cuenta está activa |
| Datos tras eliminación | 30 días (período de gracia) |
| Logs de acceso | 12 meses |
| Backups | 90 días |

#### 2.2.6 Integridad y Confidencialidad

**Requisito:** Los datos deben tratarse con seguridad adecuada.

**Medidas implementadas:**
- Cifrado de contraseñas con bcrypt (factor 10)
- Comunicaciones HTTPS obligatorias
- Headers de seguridad con Helmet.js
- Sanitización de datos con express-mongo-sanitize
- Rate limiting para prevenir ataques de fuerza bruta
- Tokens JWT con expiración de 24 horas

### 2.3 Consentimiento Explícito

#### 2.3.1 Requisitos del Consentimiento

El consentimiento debe ser:
- **Libre:** Sin presión ni condicionamiento
- **Específico:** Para cada finalidad determinada
- **Informado:** Con conocimiento de las implicaciones
- **Inequívoco:** Mediante acción afirmativa clara

#### 2.3.2 Implementación Técnica

```html
<!-- Ejemplo de checkbox de consentimiento en registro -->
<div class="consent-section">
  <label>
    <input type="checkbox" id="privacy-consent" required />
    He leído y acepto la <a href="/legal/privacidad">Política de Privacidad</a>
  </label>
  
  <label>
    <input type="checkbox" id="terms-consent" required />
    Acepto los <a href="/legal/terminos">Términos y Condiciones</a> del servicio
  </label>
  
  <label>
    <input type="checkbox" id="marketing-consent" />
    Acepto recibir comunicaciones comerciales (opcional)
  </label>
</div>
```

#### 2.3.3 Registro del Consentimiento

Almacenar en base de datos:
```javascript
{
  userId: "ObjectId",
  consents: {
    privacy: { accepted: true, date: "2026-02-12T10:30:00Z", version: "1.0" },
    terms: { accepted: true, date: "2026-02-12T10:30:00Z", version: "1.0" },
    marketing: { accepted: false, date: "2026-02-12T10:30:00Z", version: "1.0" }
  }
}
```

### 2.4 Información Transparente

#### 2.4.1 Contenido Obligatorio de la Política de Privacidad

1. **Identidad del responsable del tratamiento**
2. **Datos de contacto** (incluido DPO si aplica)
3. **Finalidades del tratamiento**
4. **Base jurídica del tratamiento**
5. **Destinatarios de los datos**
6. **Transferencias internacionales**
7. **Plazo de conservación**
8. **Derechos del interesado**
9. **Derecho a presentar reclamación ante la AEPD**
10. **Existencia de decisiones automatizadas**

### 2.5 Derechos de los Usuarios (ARCO+)

#### 2.5.1 Derecho de Acceso

**Descripción:** Obtener confirmación de si se tratan datos personales y acceso a los mismos.

**Endpoint:** `GET /api/users/:id/data-export`

**Implementación:**
```javascript
// Ejemplo de endpoint de exportación de datos
router.get('/:id/data-export', authMiddleware, verifyOwnership, async (req, res) => {
  const userData = await userService.exportUserData(req.params.id);
  res.json({
    success: true,
    data: userData,
    exportDate: new Date().toISOString(),
    format: 'JSON'
  });
});
```

#### 2.5.2 Derecho de Rectificación

**Descripción:** Modificar datos inexactos o incompletos.

**Endpoint existente:** `PUT /api/users/:id`

#### 2.5.3 Derecho de Supresión ("Derecho al Olvido")

**Descripción:** Eliminar los datos personales.

**Endpoint existente:** `DELETE /api/users/:id`

**Implementación ampliada:**
```javascript
// El servicio debe eliminar también:
// - Todas las playlists del usuario
// - Logs asociados (tras período legal)
// - Referencias en otros documentos
async deleteUser(userId) {
  await Playlist.deleteMany({ userId });
  await User.findByIdAndDelete(userId);
  // Programar eliminación de logs tras 30 días
}
```

#### 2.5.4 Derecho de Oposición

**Descripción:** Oponerse al tratamiento de datos.

**Aplicación:** 
- Oposición a comunicaciones comerciales
- Oposición a análisis de uso

#### 2.5.5 Derecho a la Portabilidad

**Descripción:** Recibir datos en formato estructurado, de uso común y lectura mecánica.

**Endpoint:** `GET /api/users/:id/data-export?format=json`

**Formato de exportación:**
```json
{
  "user": {
    "name": "Usuario",
    "email": "usuario@email.com",
    "created_at": "2026-01-15T10:30:00Z"
  },
  "playlists": [
    {
      "name": "Mi Playlist",
      "songs": [...],
      "created_at": "2026-01-20T14:00:00Z"
    }
  ],
  "exportMetadata": {
    "date": "2026-02-12T10:30:00Z",
    "version": "1.0",
    "format": "RGPD-compliant"
  }
}
```

#### 2.5.6 Derecho a la Limitación del Tratamiento

**Descripción:** Limitar el tratamiento en determinadas circunstancias.

**Casos aplicables:**
- Impugnación de exactitud de datos
- Tratamiento ilícito (usuario prefiere limitación a supresión)
- Datos ya no necesarios pero usuario los necesita para reclamaciones

### 2.6 Seguridad de los Datos

#### 2.6.1 Medidas Técnicas Implementadas

| Medida | Tecnología | Propósito |
|--------|------------|-----------|
| Cifrado de contraseñas | bcrypt (factor 10) | Protección de credenciales |
| HTTPS | TLS 1.3 | Cifrado en tránsito |
| Headers de seguridad | Helmet.js | Prevención de ataques web |
| Sanitización | express-mongo-sanitize | Prevención de inyección NoSQL |
| Rate limiting | express-rate-limit | Prevención de fuerza bruta |
| Tokens seguros | JWT + secreto fuerte | Autenticación segura |
| CORS | cors middleware | Control de acceso |

#### 2.6.2 Medidas Organizativas

- Principio de mínimo privilegio
- Acceso a datos solo para personal autorizado
- Formación en protección de datos
- Procedimientos de respuesta ante incidentes

### 2.7 Delegado de Protección de Datos (DPO)

#### 2.7.1 Obligatoriedad

**¿Es obligatorio para PlayTheMood?**

Según el Art. 37 RGPD, es obligatorio cuando:
- El tratamiento lo realiza una autoridad/organismo público
- Las actividades principales requieren observación habitual y sistemática a gran escala
- Se tratan categorías especiales de datos a gran escala

**Análisis para PlayTheMood:**
- ❌ No es organismo público
- ❌ No realiza seguimiento a gran escala (aplicación académica)
- ❌ No trata datos especiales de salud, religión, etc.

**Conclusión:** DPO no obligatorio actualmente, pero recomendable designar un responsable de protección de datos.

#### 2.7.2 Contacto para Protección de Datos

```
Responsable de Protección de Datos: [Nombre del responsable]
Email: privacidad@playthemood.dev
Dirección: [Dirección física si aplica]
```

### 2.8 Transferencias Internacionales

#### 2.8.1 Identificación de Transferencias

| Servicio | País | Base legal |
|----------|------|------------|
| MongoDB Atlas | EE.UU./UE | Cláusulas contractuales tipo |
| Spotify API | Suecia/Global | Contrato de servicio |
| Hosting (si aplica) | Verificar | Decisión de adecuación/CCT |

#### 2.8.2 Garantías Adecuadas

- Verificar que proveedores cumplen con RGPD
- Cláusulas contractuales tipo de la Comisión Europea
- Certificaciones (Privacy Shield sucesor, ISO 27001)

---

## 3. Política de Cookies

### 3.1 Normativa Aplicable

- **Directiva 2002/58/CE** (Directiva ePrivacy)
- **Ley 34/2002** (LSSI-CE) - Artículos 22.2 y 22.3
- **RGPD** (para cookies que tratan datos personales)

### 3.2 Clasificación de Cookies

#### 3.2.1 Cookies Técnicas/Necesarias

**No requieren consentimiento** (Art. 22.2 LSSI-CE)

| Cookie | Finalidad | Duración |
|--------|-----------|----------|
| session_id | Mantener sesión de usuario | Sesión |
| jwt_token | Autenticación | 24 horas |
| csrf_token | Seguridad contra CSRF | Sesión |

#### 3.2.2 Cookies de Personalización

**Requieren consentimiento**

| Cookie | Finalidad | Duración |
|--------|-----------|----------|
| theme_preference | Preferencia de tema claro/oscuro | 1 año |
| language | Idioma preferido | 1 año |
| last_mood | Último estado de ánimo seleccionado | 30 días |

#### 3.2.3 Cookies Analíticas

**Requieren consentimiento**

| Cookie | Finalidad | Duración |
|--------|-----------|----------|
| _ga (si se usa Google Analytics) | Análisis de uso | 2 años |
| _gid | Identificación de sesión | 24 horas |

**Nota:** Actualmente PlayTheMood no implementa cookies analíticas de terceros.

#### 3.2.4 Cookies Publicitarias

**Requieren consentimiento**

**Estado actual:** PlayTheMood NO utiliza cookies publicitarias.

### 3.3 Banner de Cookies

#### 3.3.1 Requisitos del Banner

- Visible al entrar por primera vez
- Información clara y concisa
- Opciones granulares de aceptación/rechazo
- Posibilidad de rechazar cookies no esenciales fácilmente
- Enlace a política completa de cookies
- No precargadas cookies no esenciales antes del consentimiento

#### 3.3.2 Implementación del Banner

```jsx
// components/CookieBanner/CookieBanner.jsx
import { useState, useEffect } from 'react';
import styles from './CookieBanner.module.css';

function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Siempre activas
    personalization: false,
    analytics: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      personalization: true,
      analytics: true,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setVisible(false);
  };

  const handleRejectNonEssential = () => {
    const onlyNecessary = {
      necessary: true,
      personalization: false,
      analytics: false,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(onlyNecessary));
    setVisible(false);
  };

  const handleSavePreferences = () => {
    const userPreferences = {
      ...preferences,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(userPreferences));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.cookieBanner} role="dialog" aria-label="Preferencias de cookies">
      <div className={styles.content}>
        <h2>🍪 Utilizamos cookies</h2>
        <p>
          Esta web utiliza cookies para mejorar tu experiencia. Las cookies 
          técnicas son necesarias para el funcionamiento del sitio. Puedes 
          aceptar todas las cookies o configurar tus preferencias.
        </p>
        
        <div className={styles.options}>
          <label>
            <input type="checkbox" checked disabled />
            <span>Cookies necesarias</span>
            <small>Requeridas para el funcionamiento básico</small>
          </label>
          
          <label>
            <input 
              type="checkbox" 
              checked={preferences.personalization}
              onChange={(e) => setPreferences({
                ...preferences, 
                personalization: e.target.checked
              })}
            />
            <span>Cookies de personalización</span>
            <small>Recuerdan tus preferencias</small>
          </label>
          
          <label>
            <input 
              type="checkbox" 
              checked={preferences.analytics}
              onChange={(e) => setPreferences({
                ...preferences, 
                analytics: e.target.checked
              })}
            />
            <span>Cookies analíticas</span>
            <small>Nos ayudan a mejorar el servicio</small>
          </label>
        </div>
        
        <div className={styles.actions}>
          <button onClick={handleRejectNonEssential} className={styles.secondary}>
            Solo necesarias
          </button>
          <button onClick={handleSavePreferences} className={styles.secondary}>
            Guardar preferencias
          </button>
          <button onClick={handleAcceptAll} className={styles.primary}>
            Aceptar todas
          </button>
        </div>
        
        <a href="/legal/cookies" className={styles.link}>
          Ver política completa de cookies
        </a>
      </div>
    </div>
  );
}

export default CookieBanner;
```

### 3.4 Gestión de Preferencias

#### 3.4.1 Acceso Posterior a Preferencias

Los usuarios deben poder modificar sus preferencias en cualquier momento:
- Enlace en el footer: "Configurar cookies"
- Acceso desde la política de privacidad
- Panel de configuración de usuario

#### 3.4.2 Revocación del Consentimiento

```javascript
// Función para revocar consentimiento
function revokeCookieConsent() {
  // Eliminar cookies no esenciales
  document.cookie.split(";").forEach(cookie => {
    const name = cookie.split("=")[0].trim();
    if (!['session_id', 'jwt_token', 'csrf_token'].includes(name)) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
  });
  
  // Actualizar preferencias guardadas
  const currentConsent = JSON.parse(localStorage.getItem('cookieConsent') || '{}');
  localStorage.setItem('cookieConsent', JSON.stringify({
    ...currentConsent,
    personalization: false,
    analytics: false,
    revokedAt: new Date().toISOString()
  }));
}
```

---

## 4. Condiciones de Uso y Términos de Servicio

### 4.1 Estructura del Documento Legal

#### 4.1.1 Identificación de las Partes

```markdown
**TÉRMINOS Y CONDICIONES DE USO DE PLAYTHEMOOD**

Última actualización: 12 de febrero de 2026

Estos Términos y Condiciones regulan el acceso y uso de la plataforma 
PlayTheMood (en adelante, "el Servicio"), accesible desde playthemood.dev.

**Titular del Servicio:**
- Nombre: [Nombre del titular/empresa]
- NIF/CIF: [Número de identificación fiscal]
- Domicilio: [Dirección]
- Email de contacto: legal@playthemood.dev
```

#### 4.1.2 Aceptación de los Términos

- La creación de cuenta implica aceptación
- Checkbox obligatorio en el registro
- Versión y fecha de los términos aceptados se registran

### 4.2 Contenido de los Términos de Servicio

#### 4.2.1 Descripción del Servicio

```markdown
## 1. DESCRIPCIÓN DEL SERVICIO

PlayTheMood es una aplicación web que permite a los usuarios:
- Generar playlists de Spotify basadas en su estado de ánimo
- Crear y gestionar playlists personalizadas
- Descubrir nueva música según parámetros de audio

El Servicio requiere:
- Cuenta de usuario registrada
- Cuenta de Spotify (para ciertas funcionalidades)
```

#### 4.2.2 Condiciones de Uso

```markdown
## 2. CONDICIONES DE USO

### 2.1 Requisitos de Usuario
- Ser mayor de 14 años (o contar con consentimiento parental)
- Proporcionar información veraz en el registro
- Mantener la confidencialidad de las credenciales

### 2.2 Uso Permitido
Los usuarios PUEDEN:
- Crear playlists para uso personal
- Compartir sus playlists públicas
- Exportar sus datos personales
- Eliminar su cuenta en cualquier momento

### 2.3 Uso Prohibido
Los usuarios NO PUEDEN:
- Crear cuentas falsas o con datos fraudulentos
- Intentar acceder a cuentas de otros usuarios
- Realizar ingeniería inversa del software
- Usar el servicio para actividades ilegales
- Intentar sobrecargar los servidores (DoS)
- Extraer datos masivamente (scraping)
- Revender o comercializar el acceso al servicio
```

#### 4.2.3 Limitación de Responsabilidad

```markdown
## 3. LIMITACIÓN DE RESPONSABILIDAD

### 3.1 Disponibilidad del Servicio
PlayTheMood se proporciona "tal cual" (AS IS). No garantizamos:
- Disponibilidad ininterrumpida 24/7
- Ausencia total de errores o bugs
- Compatibilidad con todos los dispositivos

### 3.2 Contenido de Terceros
No somos responsables del contenido proporcionado por:
- Spotify (canciones, metadatos, imágenes de álbumes)
- Usuarios (nombres de playlists, descripciones)

### 3.3 Exclusión de Daños
En la máxima medida permitida por la ley, excluimos responsabilidad por:
- Pérdida de datos (recomendamos hacer backups)
- Daños indirectos o consecuentes
- Lucro cesante

### 3.4 Limitación Cuantitativa
Nuestra responsabilidad máxima se limita a los importes pagados 
por el usuario (si aplica) en los 12 meses anteriores.
```

#### 4.2.4 Propiedad Intelectual

```markdown
## 4. PROPIEDAD INTELECTUAL

### 4.1 Titularidad de PlayTheMood
Son propiedad de PlayTheMood:
- El código fuente de la aplicación
- El diseño y la interfaz de usuario
- Los algoritmos de generación de playlists
- La marca y logotipo "PlayTheMood"

### 4.2 Licencia de Uso
Concedemos a los usuarios una licencia:
- No exclusiva
- No transferible
- Revocable
- Para uso personal y no comercial

### 4.3 Contenido del Usuario
Los usuarios conservan la propiedad de:
- Nombres de playlists creadas
- Descripciones personalizadas
- Configuraciones de preferencias

Conceden a PlayTheMood licencia para mostrar y almacenar dicho contenido.

### 4.4 Contenido de Spotify
Todo el contenido musical (canciones, portadas, metadatos) es propiedad 
de Spotify y sus licenciantes. Su uso está sujeto a los Términos de 
Servicio de Spotify.
```

#### 4.2.5 Suspensión y Terminación de Cuenta

```markdown
## 5. SUSPENSIÓN Y TERMINACIÓN

### 5.1 Terminación por el Usuario
Los usuarios pueden eliminar su cuenta en cualquier momento desde 
la configuración de perfil o contactando a soporte@playthemood.dev.

### 5.2 Suspensión por PlayTheMood
Podemos suspender o cancelar cuentas en caso de:
- Violación de estos Términos
- Uso fraudulento o abusivo
- Solicitud de autoridades competentes
- Inactividad prolongada (más de 24 meses)

### 5.3 Efectos de la Terminación
Tras la terminación:
- Acceso al servicio revocado inmediatamente
- Datos personales eliminados según RGPD (período de retención: 30 días)
- Derecho a solicitar exportación de datos antes de la eliminación

### 5.4 Supervivencia
Las cláusulas de propiedad intelectual, limitación de responsabilidad 
y ley aplicable sobreviven a la terminación del contrato.
```

#### 4.2.6 Modificaciones de los Términos

```markdown
## 6. MODIFICACIONES

### 6.1 Derecho a Modificar
Nos reservamos el derecho de modificar estos Términos.

### 6.2 Notificación
Los cambios se notificarán mediante:
- Email a la dirección registrada
- Aviso en la aplicación
- Actualización de la fecha "Última actualización"

### 6.3 Aceptación de Cambios
El uso continuado del Servicio tras la notificación implica 
aceptación de los nuevos términos. Si no estás de acuerdo, 
puedes eliminar tu cuenta.
```

#### 4.2.7 Ley Aplicable y Jurisdicción

```markdown
## 7. LEY APLICABLE Y JURISDICCIÓN

### 7.1 Ley Aplicable
Estos Términos se rigen por la legislación española.

### 7.2 Jurisdicción
Para cualquier controversia, las partes se someten a los 
Juzgados y Tribunales de [Ciudad], renunciando a cualquier 
otro fuero que pudiera corresponderles.

### 7.3 Resolución Alternativa de Conflictos
Para consumidores de la UE: Plataforma de resolución de 
litigios en línea de la Comisión Europea:
https://ec.europa.eu/consumers/odr
```

---

## 5. Accesibilidad Web - WCAG 2.1

### 5.1 Normativa Aplicable

- **Directiva (UE) 2016/2102** sobre accesibilidad de sitios web y aplicaciones móviles
- **Real Decreto 1112/2018** sobre accesibilidad de sitios web y aplicaciones del sector público
- **WCAG 2.1** (Web Content Accessibility Guidelines) - Nivel AA como objetivo

### 5.2 Principios POUR

#### 5.2.1 Perceptible

**Requisito:** La información debe presentarse de forma que los usuarios puedan percibirla.

| Criterio | Requisito | Implementación en PlayTheMood |
|----------|-----------|------------------------------|
| 1.1.1 | Alternativas textuales | Atributo `alt` en todas las imágenes |
| 1.3.1 | Información y relaciones | HTML5 semántico (header, nav, main, footer) |
| 1.4.1 | Uso del color | No usar color como único indicador |
| 1.4.3 | Contraste mínimo | Ratio 4.5:1 para texto normal, 3:1 para grande |
| 1.4.4 | Redimensionar texto | Permitir zoom hasta 200% |
| 1.4.11 | Contraste no textual | Ratio 3:1 para elementos de interfaz |

**Ejemplo de implementación:**
```html
<!-- Imagen con texto alternativo descriptivo -->
<img 
  src="/assets/disc.png" 
  alt="Icono de disco de vinilo girando"
/>

<!-- Uso semántico de HTML5 -->
<header role="banner">
  <nav aria-label="Navegación principal">
    <ul>
      <li><a href="/">Inicio</a></li>
      <li><a href="/generate">Generar Playlist</a></li>
    </ul>
  </nav>
</header>

<main role="main">
  <!-- Contenido principal -->
</main>

<footer role="contentinfo">
  <!-- Información del pie de página -->
</footer>
```

#### 5.2.2 Operable

**Requisito:** Los componentes de interfaz deben ser operables.

| Criterio | Requisito | Implementación |
|----------|-----------|----------------|
| 2.1.1 | Teclado | Toda funcionalidad accesible por teclado |
| 2.1.2 | Sin trampa de teclado | El foco puede moverse libremente |
| 2.4.1 | Evitar bloques | Enlace "Saltar al contenido" |
| 2.4.2 | Páginas tituladas | `<title>` descriptivo en cada página |
| 2.4.3 | Orden del foco | Orden lógico de tabulación |
| 2.4.4 | Propósito de enlaces | Texto de enlace descriptivo |
| 2.4.7 | Foco visible | Indicador visual claro del foco |

**Ejemplo de implementación:**
```jsx
// Enlace para saltar al contenido principal
function SkipLink() {
  return (
    <a 
      href="#main-content" 
      className="skip-link"
      style={{
        position: 'absolute',
        left: '-9999px',
        ':focus': {
          position: 'fixed',
          top: '10px',
          left: '10px',
          zIndex: 9999
        }
      }}
    >
      Saltar al contenido principal
    </a>
  );
}

// Indicador de foco visible
// En CSS:
/* 
:focus {
  outline: 3px solid #4A90D9;
  outline-offset: 2px;
}

:focus:not(:focus-visible) {
  outline: none;
}

:focus-visible {
  outline: 3px solid #4A90D9;
  outline-offset: 2px;
}
*/
```

#### 5.2.3 Comprensible

**Requisito:** La información y operación de la interfaz deben ser comprensibles.

| Criterio | Requisito | Implementación |
|----------|-----------|----------------|
| 3.1.1 | Idioma de la página | `<html lang="es">` |
| 3.2.1 | Al recibir foco | No cambios inesperados |
| 3.2.2 | Al recibir entrada | Advertir antes de enviar formularios |
| 3.3.1 | Identificación de errores | Mensajes claros de error |
| 3.3.2 | Etiquetas o instrucciones | Labels asociados a inputs |

**Ejemplo de implementación:**
```jsx
// Formulario accesible con manejo de errores
function LoginForm() {
  const [errors, setErrors] = useState({});
  
  return (
    <form aria-describedby="form-instructions">
      <p id="form-instructions">
        Los campos marcados con * son obligatorios
      </p>
      
      <div className="form-group">
        <label htmlFor="email">
          Email <span aria-label="requerido">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <span id="email-error" className="error" role="alert">
            {errors.email}
          </span>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="password">
          Contraseña <span aria-label="requerido">*</span>
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          aria-invalid={errors.password ? "true" : "false"}
          aria-describedby="password-hint password-error"
        />
        <span id="password-hint" className="hint">
          Mínimo 6 caracteres
        </span>
        {errors.password && (
          <span id="password-error" className="error" role="alert">
            {errors.password}
          </span>
        )}
      </div>
      
      <button type="submit">Iniciar sesión</button>
    </form>
  );
}
```

#### 5.2.4 Robusto

**Requisito:** El contenido debe ser lo suficientemente robusto para ser interpretado por diversas tecnologías.

| Criterio | Requisito | Implementación |
|----------|-----------|----------------|
| 4.1.1 | Parsing | HTML válido (sin errores de sintaxis) |
| 4.1.2 | Nombre, función, valor | ARIA cuando sea necesario |
| 4.1.3 | Mensajes de estado | Live regions para actualizaciones |

**Ejemplo de implementación:**
```jsx
// Mensajes de estado accesibles con live regions
function PlaylistGenerator() {
  const [status, setStatus] = useState('');
  
  const generatePlaylist = async () => {
    setStatus('Generando playlist...');
    // ... lógica de generación
    setStatus('¡Playlist generada con éxito!');
  };
  
  return (
    <div>
      {/* Live region para anunciar cambios de estado */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        {status}
      </div>
      
      <button 
        onClick={generatePlaylist}
        aria-describedby="generate-description"
      >
        Generar Playlist
      </button>
      <span id="generate-description" className="sr-only">
        Genera una nueva playlist basada en tu estado de ánimo actual
      </span>
    </div>
  );
}
```

### 5.3 Checklist de Accesibilidad

#### 5.3.1 Imágenes y Multimedia

- [ ] Todas las imágenes tienen atributo `alt` descriptivo
- [ ] Imágenes decorativas tienen `alt=""`
- [ ] Videos tienen subtítulos (si aplica)
- [ ] Animaciones pueden pausarse
- [ ] No hay contenido que parpadea más de 3 veces por segundo

#### 5.3.2 Navegación

- [ ] Existe enlace "Saltar al contenido"
- [ ] Navegación consistente en todas las páginas
- [ ] Breadcrumbs para orientación (si hay jerarquía)
- [ ] Múltiples formas de encontrar contenido (navegación + búsqueda)

#### 5.3.3 Formularios

- [ ] Todos los inputs tienen labels asociados
- [ ] Errores identificados claramente
- [ ] Instrucciones proporcionadas antes del formulario
- [ ] Tiempo suficiente para completar acciones

#### 5.3.4 Contraste y Color

- [ ] Contraste mínimo 4.5:1 para texto normal
- [ ] Contraste mínimo 3:1 para texto grande (>18pt)
- [ ] Color no es el único medio de transmitir información
- [ ] Enlaces distinguibles del texto circundante

#### 5.3.5 Teclado y Foco

- [ ] Toda funcionalidad accesible por teclado
- [ ] Orden de tabulación lógico
- [ ] Indicador de foco visible
- [ ] Sin trampas de teclado

### 5.4 Herramientas de Verificación

| Herramienta | Propósito | URL |
|-------------|-----------|-----|
| WAVE | Evaluación automática | wave.webaim.org |
| axe DevTools | Extensión de navegador | deque.com/axe |
| Lighthouse | Auditoría de accesibilidad | Integrado en Chrome DevTools |
| NVDA | Lector de pantalla (pruebas) | nvaccess.org |
| Contrast Checker | Verificar contraste | webaim.org/resources/contrastchecker |

### 5.5 Declaración de Accesibilidad

```markdown
# Declaración de Accesibilidad

**PlayTheMood** se compromete a garantizar la accesibilidad digital 
para personas con discapacidades.

## Estado de Conformidad

Esta web cumple parcialmente con las WCAG 2.1 nivel AA.

## Contenido No Accesible

Las siguientes áreas presentan limitaciones conocidas:
- [Listar áreas con problemas conocidos]

## Medidas de Accesibilidad

- Formación del equipo en accesibilidad
- Revisiones periódicas de accesibilidad
- Incorporación de criterios WCAG en el desarrollo

## Feedback y Contacto

Si encuentras barreras de accesibilidad, contacta con:
- Email: accesibilidad@playthemood.dev
- Teléfono: [Número]

Intentaremos responder en un plazo de 5 días hábiles.

## Procedimiento de Aplicación

Si la respuesta no es satisfactoria, puedes presentar reclamación ante:
- Ministerio de Asuntos Económicos y Transformación Digital
- Defensor del Pueblo

Fecha de la declaración: 12 de febrero de 2026
```

---

## 6. Propiedad Intelectual

### 6.1 Inventario de Recursos Utilizados

#### 6.1.1 Recursos Propios

| Recurso | Tipo | Licencia |
|---------|------|----------|
| Código fuente de PlayTheMood | Software | MIT License |
| Logo PlayTheMood | Imagen | Propiedad del proyecto |
| Textos de la aplicación | Contenido | Propiedad del proyecto |
| Algoritmos de generación | Software | MIT License |

#### 6.1.2 Recursos de Terceros - Frontend

| Recurso | Tipo | Licencia | URL/Fuente |
|---------|------|----------|------------|
| React | Librería | MIT | reactjs.org |
| React Router | Librería | MIT | reactrouter.com |
| Vite | Herramienta | MIT | vitejs.dev |
| Axios | Librería | MIT | axios-http.com |

#### 6.1.3 Recursos de Terceros - Backend

| Recurso | Tipo | Licencia | URL/Fuente |
|---------|------|----------|------------|
| Express | Framework | MIT | expressjs.com |
| Mongoose | ODM | MIT | mongoosejs.com |
| bcrypt | Librería | MIT | npmjs.com/package/bcrypt |
| jsonwebtoken | Librería | MIT | npmjs.com/package/jsonwebtoken |
| Helmet | Middleware | MIT | helmetjs.github.io |

#### 6.1.4 Recursos Multimedia

| Recurso | Tipo | Licencia | Verificación |
|---------|------|----------|--------------|
| background.svg | Imagen | Propia/Verificar | ✅ |
| backgroundvideo.mp4 | Video | Propia/Verificar | ✅ |
| disc.png | Imagen | Propia/Verificar | ✅ |
| Iconos redes sociales | Imágenes | Marcas comerciales | ⚠️ Uso permitido según directrices |
| react.svg | Imagen | MIT (React) | ✅ |
| slider-circle.svg | Imagen | Propia | ✅ |
| spotify.png | Logo | Marca comercial | ⚠️ Uso según directrices de Spotify |

### 6.2 APIs Externas

#### 6.2.1 Spotify Web API

**Estado:** En uso  
**Términos de servicio:** [Spotify Developer Terms](https://developer.spotify.com/terms/)

**Obligaciones principales:**
- Atribuir a Spotify como fuente de contenido
- No almacenar contenido de audio
- Respetar límites de rate limiting
- No comercializar datos de Spotify
- Mostrar marca de Spotify según directrices

**Implementación:**
```jsx
// Footer con atribución a Spotify
<footer>
  <p>
    Contenido musical proporcionado por 
    <img src="/assets/spotify.png" alt="Spotify" />
  </p>
</footer>
```

### 6.3 Licencias Open Source

#### 6.3.1 Dependencias con Licencia MIT

La Licencia MIT permite:
- ✅ Uso comercial
- ✅ Modificación
- ✅ Distribución
- ✅ Uso privado

Requiere:
- Incluir copyright y aviso de licencia

#### 6.3.2 Cumplimiento de Licencias

**Archivo LICENSES en el proyecto:**
```
Este proyecto utiliza las siguientes dependencias de código abierto:

react - MIT License - Copyright (c) Meta Platforms, Inc.
express - MIT License - Copyright (c) 2009-2014 TJ Holowaychuk
mongoose - MIT License - Copyright (c) 2010 LearnBoost
[...]

Ver archivo LICENSE para la licencia completa de PlayTheMood.
```

### 6.4 Protección de Marca

#### 6.4.1 Registro de Marca (Recomendación)

Para protección completa, considerar:
- Registro de marca "PlayTheMood" en OEPM
- Registro de dominio playthemood.dev (realizado)
- Protección del logo

#### 6.4.2 Aviso de Copyright

```
© 2026 PlayTheMood. Todos los derechos reservados.
PlayTheMood es una marca de [Titular].
Spotify es una marca comercial de Spotify AB.
```

---

## 7. Normativa Específica del Sector

### 7.1 Análisis del Sector Aplicable

PlayTheMood opera en el sector de **entretenimiento digital / servicios de streaming musical**, con las siguientes consideraciones:

| Sector | ¿Aplica? | Motivo |
|--------|----------|--------|
| E-commerce | ❌ No | No se venden productos/servicios |
| Salud | ❌ No | No se manejan datos de salud |
| Finanzas | ❌ No | No se procesan pagos |
| Educación | ❌ No | No es plataforma educativa |
| Contenido generado por usuarios | ⚠️ Parcial | Usuarios crean playlists |
| Servicios digitales | ✅ Sí | LSSI-CE aplica |

### 7.2 LSSI-CE (Ley de Servicios de la Sociedad de la Información)

#### 7.2.1 Aplicabilidad

La **Ley 34/2002** (LSSI-CE) aplica a PlayTheMood como prestador de servicios de la sociedad de la información.

#### 7.2.2 Obligaciones de Información (Art. 10)

Información obligatoria que debe aparecer en la web:

```markdown
## Información Legal (Aviso Legal)

**Titular del sitio web:**
- Denominación: [Nombre o razón social]
- NIF/CIF: [Número]
- Domicilio: [Dirección completa]
- Email: contacto@playthemood.dev
- Teléfono: [Número] (opcional pero recomendado)

**Datos de inscripción registral:** (si aplica)
- Registro Mercantil de [Ciudad]
- Tomo [X], Folio [X], Hoja [X]

**Códigos de conducta:** (si aplica)
- Adherido a [Código de conducta]
```

#### 7.2.3 Comunicaciones Comerciales (Art. 21)

Si se envían comunicaciones comerciales:
- Deben identificarse como publicitarias
- Requieren consentimiento previo
- Incluir mecanismo de baja (opt-out)

### 7.3 Contenido Generado por Usuarios

#### 7.3.1 Responsabilidad sobre Contenido

PlayTheMood actúa como **hosting** de contenido de usuarios (playlists).

Según LSSI-CE Art. 16:
- No responsabilidad si no hay conocimiento efectivo de ilicitud
- Obligación de retirar contenido ilícito tras conocimiento

#### 7.3.2 Moderación de Contenido

**Política de contenido aceptable:**
```markdown
## Contenido Prohibido

No está permitido crear playlists con nombres que:
- Inciten al odio o discriminación
- Contengan lenguaje ofensivo o obsceno
- Infrinjan derechos de terceros
- Promuevan actividades ilegales
```

**Procedimiento de reporte:**
1. Usuario reporta contenido inapropiado
2. Revisión en 24-48 horas
3. Acción (eliminación/suspensión si procede)
4. Notificación a las partes

### 7.4 Protección de Menores

#### 7.4.1 Edad Mínima

- Edad mínima de uso: **14 años** (conforme a LOPDGDD)
- Menores de 14 años requieren consentimiento parental

#### 7.4.2 Implementación

```javascript
// Verificación de edad en registro
const validateAge = (birthDate) => {
  const age = calculateAge(birthDate);
  if (age < 14) {
    return {
      valid: false,
      message: 'Debes tener al menos 14 años para registrarte'
    };
  }
  return { valid: true };
};
```

---

## 8. Permisos y Autorizaciones

### 8.1 Registros Obligatorios

| Registro | ¿Requerido? | Motivo |
|----------|-------------|--------|
| Registro Mercantil | Depende | Solo si es sociedad mercantil |
| AEPD | ❌ No | RGPD eliminó obligación de registro de ficheros |
| Registro de operadores | ❌ No | No es telecomunicaciones |

### 8.2 Notificaciones Requeridas

#### 8.2.1 Violaciones de Seguridad (RGPD Art. 33-34)

**Notificación a la AEPD:**
- Plazo: 72 horas desde el conocimiento
- Contenido: Naturaleza, categorías de datos, medidas adoptadas

**Notificación a los afectados:**
- Cuando exista alto riesgo para derechos y libertades
- Sin dilación indebida

**Procedimiento interno:**
```markdown
## Protocolo de Brecha de Seguridad

1. **Detección** - Identificar y contener la brecha
2. **Evaluación** - Determinar alcance y riesgo
3. **Notificación interna** - Informar al responsable de datos
4. **Documentación** - Registrar todos los detalles
5. **Notificación AEPD** - Si aplica (72h)
6. **Notificación usuarios** - Si hay alto riesgo
7. **Medidas correctivas** - Implementar mejoras
8. **Revisión** - Analizar y prevenir futuros incidentes
```

### 8.3 Autorizaciones de APIs

#### 8.3.1 Spotify Developer

**Estado:** Requerido y obtenido

**Requisitos:**
- Cuenta de desarrollador de Spotify
- Aplicación registrada en el Dashboard
- Client ID y Client Secret configurados
- Cumplimiento de Developer Terms of Service

---

## 9. Implementación Técnica

### 9.1 Páginas Legales Requeridas

#### 9.1.1 Estructura de Rutas

```
/legal
├── /privacidad    - Política de Privacidad
├── /cookies       - Política de Cookies
├── /terminos      - Términos y Condiciones
└── /accesibilidad - Declaración de Accesibilidad
```

#### 9.1.2 Configuración de Router

```javascript
// frontend/src/router/routes.js
const legalRoutes = [
  {
    path: '/legal/privacidad',
    element: <Privacy />,
    meta: { title: 'Política de Privacidad - PlayTheMood' }
  },
  {
    path: '/legal/cookies',
    element: <Cookies />,
    meta: { title: 'Política de Cookies - PlayTheMood' }
  },
  {
    path: '/legal/terminos',
    element: <Terms />,
    meta: { title: 'Términos y Condiciones - PlayTheMood' }
  },
  {
    path: '/legal/accesibilidad',
    element: <Accessibility />,
    meta: { title: 'Declaración de Accesibilidad - PlayTheMood' }
  }
];
```

### 9.2 Endpoints de Gestión de Datos Personales

#### 9.2.1 Exportación de Datos (Portabilidad)

```javascript
// backend/src/routes/userRoutes.js

/**
 * GET /api/users/:id/data-export
 * Exporta todos los datos del usuario en formato JSON
 */
router.get('/:id/data-export', 
  authMiddleware, 
  verifyOwnership, 
  userController.exportUserData
);

// backend/src/controllers/userController.js
const exportUserData = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Obtener datos del usuario
    const user = await User.findById(id).select('-password');
    const playlists = await Playlist.find({ userId: id });
    
    const exportData = {
      exportInfo: {
        date: new Date().toISOString(),
        format: 'JSON',
        version: '1.0',
        rgpdCompliant: true
      },
      userData: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at
      },
      playlists: playlists.map(p => ({
        name: p.name,
        description: p.description,
        songs: p.songs,
        createdAt: p.createdAt
      })),
      consents: user.consents || {}
    };
    
    res.setHeader('Content-Disposition', 'attachment; filename=mis-datos-playthemood.json');
    res.setHeader('Content-Type', 'application/json');
    res.json(exportData);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al exportar datos'
    });
  }
};
```

#### 9.2.2 Solicitud de Eliminación de Cuenta

```javascript
/**
 * DELETE /api/users/:id
 * Elimina la cuenta y todos los datos asociados
 * Ya implementado en el proyecto
 */

// Ampliar para cumplir RGPD completamente
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. Eliminar playlists del usuario
    await Playlist.deleteMany({ userId: id });
    
    // 2. Eliminar datos del usuario
    await User.findByIdAndDelete(id);
    
    // 3. Registrar la eliminación (para auditoría)
    await AuditLog.create({
      action: 'USER_DELETION',
      userId: id,
      timestamp: new Date(),
      details: 'Usuario eliminado bajo RGPD'
    });
    
    res.status(200).json({
      success: true,
      message: 'Cuenta y datos eliminados correctamente'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar la cuenta'
    });
  }
};
```

### 9.3 Checkbox de Consentimiento en Registro

```jsx
// frontend/src/pages/Register.jsx
import { useState } from 'react';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    acceptPrivacy: false,
    acceptTerms: false,
    acceptMarketing: false
  });
  
  const [errors, setErrors] = useState({});
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar consentimientos obligatorios
    if (!formData.acceptPrivacy || !formData.acceptTerms) {
      setErrors({
        consent: 'Debes aceptar la Política de Privacidad y los Términos de Uso'
      });
      return;
    }
    
    // Registrar con consentimientos
    const registrationData = {
      ...formData,
      consents: {
        privacy: { accepted: formData.acceptPrivacy, date: new Date().toISOString() },
        terms: { accepted: formData.acceptTerms, date: new Date().toISOString() },
        marketing: { accepted: formData.acceptMarketing, date: new Date().toISOString() }
      }
    };
    
    // ... llamada a API
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* ... campos de nombre, email, password */}
      
      <div className="consent-section">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.acceptPrivacy}
            onChange={(e) => setFormData({...formData, acceptPrivacy: e.target.checked})}
            required
          />
          <span>
            He leído y acepto la{' '}
            <a href="/legal/privacidad" target="_blank" rel="noopener noreferrer">
              Política de Privacidad
            </a>
            {' '}*
          </span>
        </label>
        
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.acceptTerms}
            onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
            required
          />
          <span>
            Acepto los{' '}
            <a href="/legal/terminos" target="_blank" rel="noopener noreferrer">
              Términos y Condiciones
            </a>
            {' '}*
          </span>
        </label>
        
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.acceptMarketing}
            onChange={(e) => setFormData({...formData, acceptMarketing: e.target.checked})}
          />
          <span>
            Deseo recibir comunicaciones comerciales y novedades (opcional)
          </span>
        </label>
      </div>
      
      {errors.consent && (
        <p className="error-message" role="alert">{errors.consent}</p>
      )}
      
      <button type="submit">Crear cuenta</button>
    </form>
  );
}
```

### 9.4 Banner de Cookies

Ver implementación en la [Sección 3.3.2](#332-implementación-del-banner).

### 9.5 Footer con Enlaces Legales

```jsx
// frontend/src/components/Footer/Footer.jsx
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-main">
          <p>© 2026 PlayTheMood. Todos los derechos reservados.</p>
          <p>
            Contenido musical proporcionado por{' '}
            <img src="/assets/spotify.png" alt="Spotify" className="spotify-logo" />
          </p>
        </div>
        
        <nav className="footer-legal" aria-label="Enlaces legales">
          <ul>
            <li><a href="/legal/privacidad">Política de Privacidad</a></li>
            <li><a href="/legal/cookies">Política de Cookies</a></li>
            <li><a href="/legal/terminos">Términos y Condiciones</a></li>
            <li><a href="/legal/accesibilidad">Accesibilidad</a></li>
          </ul>
        </nav>
        
        <div className="footer-contact">
          <p>Contacto: <a href="mailto:contacto@playthemood.dev">contacto@playthemood.dev</a></p>
          <button onClick={openCookieSettings} className="cookie-settings-btn">
            Configurar cookies
          </button>
        </div>
      </div>
    </footer>
  );
}
```

---

## 10. Plan de Implementación

### 10.1 Fases de Implementación

#### Fase 1: Documentación Legal (Prioridad Alta)
**Duración estimada:** 1 semana

| Tarea | Responsable | Estado |
|-------|-------------|--------|
| Redactar Política de Privacidad completa | Equipo legal | ⏳ Pendiente |
| Redactar Términos y Condiciones | Equipo legal | ⏳ Pendiente |
| Redactar Política de Cookies | Equipo legal | ⏳ Pendiente |
| Redactar Declaración de Accesibilidad | Desarrollo | ⏳ Pendiente |
| Redactar Aviso Legal (LSSI) | Equipo legal | ⏳ Pendiente |

#### Fase 2: Implementación Frontend (Prioridad Alta)
**Duración estimada:** 1-2 semanas

| Tarea | Responsable | Estado |
|-------|-------------|--------|
| Crear páginas de políticas legales | Frontend | ⏳ Pendiente |
| Implementar banner de cookies | Frontend | ⏳ Pendiente |
| Añadir checkboxes de consentimiento en registro | Frontend | ⏳ Pendiente |
| Añadir enlaces legales en footer | Frontend | ⏳ Pendiente |
| Implementar gestión de preferencias de cookies | Frontend | ⏳ Pendiente |

#### Fase 3: Implementación Backend (Prioridad Alta)
**Duración estimada:** 1 semana

| Tarea | Responsable | Estado |
|-------|-------------|--------|
| Endpoint de exportación de datos | Backend | ⏳ Pendiente |
| Almacenamiento de consentimientos | Backend | ⏳ Pendiente |
| Registro de auditoría para eliminaciones | Backend | ⏳ Pendiente |
| Política de retención de datos | Backend | ⏳ Pendiente |

#### Fase 4: Accesibilidad (Prioridad Media)
**Duración estimada:** 2-3 semanas

| Tarea | Responsable | Estado |
|-------|-------------|--------|
| Auditoría de accesibilidad actual | Desarrollo | ⏳ Pendiente |
| Implementar skip links | Frontend | ⏳ Pendiente |
| Revisar contraste de colores | Diseño | ⏳ Pendiente |
| Añadir atributos ARIA | Frontend | ⏳ Pendiente |
| Mejorar navegación por teclado | Frontend | ⏳ Pendiente |
| Testing con lectores de pantalla | QA | ⏳ Pendiente |

#### Fase 5: Verificación y Auditoría (Prioridad Media)
**Duración estimada:** 1 semana

| Tarea | Responsable | Estado |
|-------|-------------|--------|
| Verificar todas las licencias de dependencias | Desarrollo | ⏳ Pendiente |
| Audit de seguridad | Seguridad | ⏳ Pendiente |
| Test de cumplimiento RGPD | Legal | ⏳ Pendiente |
| Test de accesibilidad automatizado | QA | ⏳ Pendiente |

### 10.2 Cronograma

```
Febrero 2026
├── Semana 3 (17-21): Fase 1 - Documentación legal
├── Semana 4 (24-28): Fase 2 - Implementación frontend
│
Marzo 2026
├── Semana 1 (3-7): Fase 2 (cont.) + Fase 3 - Backend
├── Semana 2 (10-14): Fase 4 - Accesibilidad (inicio)
├── Semana 3 (17-21): Fase 4 - Accesibilidad (cont.)
└── Semana 4 (24-28): Fase 5 - Verificación y auditoría
│
Abril 2026
└── Semana 1 (1-4): Correcciones finales y lanzamiento
```

### 10.3 Checklist de Cumplimiento

#### RGPD
- [ ] Política de privacidad publicada
- [ ] Base legal identificada para cada tratamiento
- [ ] Consentimiento implementado en registro
- [ ] Registro de consentimientos
- [ ] Endpoint de exportación de datos
- [ ] Endpoint de eliminación de cuenta funcionando
- [ ] Cifrado de contraseñas (✅ ya implementado con bcrypt)
- [ ] HTTPS en producción
- [ ] Registro de actividades de tratamiento

#### Cookies
- [ ] Banner de cookies implementado
- [ ] Gestión granular de preferencias
- [ ] Cookies no esenciales bloqueadas antes del consentimiento
- [ ] Política de cookies publicada

#### Accesibilidad
- [ ] Contraste de colores verificado
- [ ] Navegación por teclado funcional
- [ ] Atributos alt en imágenes
- [ ] HTML semántico
- [ ] Formularios accesibles
- [ ] Declaración de accesibilidad publicada

#### LSSI-CE
- [ ] Aviso legal con datos del titular
- [ ] Información de contacto visible
- [ ] Identificación de comunicaciones comerciales

---

## 11. Enlaces a Políticas Legales

### 11.1 Documentos Internos

| Documento | Ubicación | Estado |
|-----------|-----------|--------|
| Política de Privacidad | `/legal/privacidad` | ⏳ Pendiente implementación |
| Política de Cookies | `/legal/cookies` | ⏳ Pendiente implementación |
| Términos y Condiciones | `/legal/terminos` | ⏳ Pendiente implementación |
| Declaración de Accesibilidad | `/legal/accesibilidad` | ⏳ Pendiente crear |
| Aviso Legal | `/legal/aviso-legal` | ⏳ Pendiente crear |

### 11.2 Recursos Externos

| Recurso | URL | Descripción |
|---------|-----|-------------|
| RGPD (texto oficial) | [eur-lex.europa.eu](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX%3A32016R0679) | Texto completo del Reglamento |
| AEPD | [aepd.es](https://www.aepd.es) | Agencia Española de Protección de Datos |
| WCAG 2.1 | [w3.org/WAI/WCAG21](https://www.w3.org/WAI/WCAG21/quickref/) | Guías de accesibilidad |
| LSSI-CE | [boe.es](https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758) | Ley de servicios de la sociedad de la información |
| Spotify Developer Terms | [developer.spotify.com/terms](https://developer.spotify.com/terms/) | Términos para desarrolladores de Spotify |

### 11.3 Borradores de Políticas

Los borradores de las políticas legales se encuentran en desarrollo y serán incorporados como páginas completas en las rutas indicadas. A continuación se incluyen esquemas de contenido:

#### Borrador - Política de Privacidad (Esquema)

```markdown
# Política de Privacidad de PlayTheMood

## 1. Información del Responsable
## 2. Datos que Recopilamos
## 3. Finalidad del Tratamiento
## 4. Base Legal
## 5. Destinatarios de los Datos
## 6. Transferencias Internacionales
## 7. Plazo de Conservación
## 8. Tus Derechos (ARCO+)
## 9. Seguridad
## 10. Cookies
## 11. Menores
## 12. Cambios en la Política
## 13. Contacto
## 14. Reclamaciones ante la AEPD
```

#### Borrador - Términos de Servicio (Esquema)

```markdown
# Términos y Condiciones de PlayTheMood

## 1. Información General
## 2. Aceptación de los Términos
## 3. Descripción del Servicio
## 4. Registro y Cuenta de Usuario
## 5. Uso Aceptable
## 6. Propiedad Intelectual
## 7. Contenido del Usuario
## 8. Servicios de Terceros (Spotify)
## 9. Limitación de Responsabilidad
## 10. Suspensión y Terminación
## 11. Modificaciones
## 12. Ley Aplicable y Jurisdicción
## 13. Contacto
```

---

## 12. Anexos

### Anexo A: Modelo de Registro de Actividades de Tratamiento

| Campo | Valor |
|-------|-------|
| **Nombre del tratamiento** | Gestión de usuarios de PlayTheMood |
| **Responsable** | [Nombre del responsable] |
| **Contacto DPD** | privacidad@playthemood.dev |
| **Finalidad** | Prestación del servicio de generación de playlists |
| **Base jurídica** | Consentimiento + Ejecución contractual |
| **Categorías de interesados** | Usuarios registrados |
| **Categorías de datos** | Nombre, email, contraseña (hash), playlists |
| **Destinatarios** | No hay cesiones a terceros |
| **Transferencias internacionales** | MongoDB Atlas (cláusulas tipo), Spotify API |
| **Plazos de conservación** | Mientras la cuenta esté activa + 30 días |
| **Medidas de seguridad** | Cifrado, HTTPS, control de accesos |

### Anexo B: Análisis de Impacto (EIPD) - Resumen

**¿Es necesaria una Evaluación de Impacto en Protección de Datos?**

Según Art. 35 RGPD, es obligatoria cuando:
- ❌ Evaluación sistemática basada en perfilado
- ❌ Tratamiento a gran escala de datos sensibles
- ❌ Observación sistemática a gran escala de zona pública

**Conclusión:** EIPD no obligatoria para PlayTheMood actualmente, pero recomendable realizar análisis básico de riesgos.

### Anexo C: Contactos de Cumplimiento

| Rol | Contacto |
|-----|----------|
| Responsable del proyecto | [Nombre] |
| Contacto protección de datos | privacidad@playthemood.dev |
| Soporte técnico | soporte@playthemood.dev |
| Contacto legal | legal@playthemood.dev |
| AEPD (reclamaciones) | www.aepd.es |

---

## Historial de Versiones

| Versión | Fecha | Cambios | Autor |
|---------|-------|---------|-------|
| 1.0 | 12/02/2026 | Documento inicial | Equipo PlayTheMood |

---

*Este documento es parte de la documentación oficial del proyecto PlayTheMood y debe ser revisado y actualizado periódicamente para garantizar el cumplimiento normativo continuo.*
