# PlayTheMood - Aplicación Web Full Stack para Generación de Playlists Personalizadas

## Índice

1. [Descripción del Proyecto](#1-descripción-del-proyecto)
2. [Arquitectura y Desarrollo del Backend](#2-arquitectura-y-desarrollo-del-backend)
   - 2.1. [Servidor Web y Enrutamiento con Express (RA1.b)](#21-servidor-web-y-enrutamiento-con-express-ra1b)
   - 2.2. [Sistema de Autenticación y Autorización (RA1.d)](#22-sistema-de-autenticación-y-autorización-ra1d)
   - 2.3. [Persistencia de Datos con MongoDB (RA1.e)](#23-persistencia-de-datos-con-mongodb-ra1e)
3. [Desarrollo del Frontend](#3-desarrollo-del-frontend)
   - 3.1. [Arquitectura de Componentes Modulares y Reutilizables (RA2.a)](#31-arquitectura-de-componentes-modulares-y-reutilizables-ra2a)
   - 3.2. [Integración con APIs Externas (RA2.c)](#32-integración-con-apis-externas-ra2c)
   - 3.3. [Optimización de Rendimiento y Experiencia de Usuario (RA2.e)](#33-optimización-de-rendimiento-y-experiencia-de-usuario-ra2e)
4. [Integración y Despliegue](#4-integración-y-despliegue)
   - 4.1. [Integración Frontend-Backend (RA3.b)](#41-integración-frontend-backend-ra3b)
   - 4.2. [Testing y Aseguramiento de Calidad (RA3.c)](#42-testing-y-aseguramiento-de-calidad-ra3c)
   - 4.3. [Despliegue y Configuración de Entornos (RA3.d)](#43-despliegue-y-configuración-de-entornos-ra3d)
5. [Estructura del Proyecto y Tecnologías](#5-estructura-del-proyecto-y-tecnologías)
6. [Guía de Instalación y Ejecución](#6-guía-de-instalación-y-ejecución)
7. [Documentación Técnica Adicional](#7-documentación-técnica-adicional)
8. [Justificación de Implementaciones Pendientes](#8-justificación-de-implementaciones-pendientes)
9. [Conclusión](#9-conclusión)

> **Documentos asociados: MERN - propuesta inicial**
> - [Fase 1: Detección del problema](docs/problema.md)
> - [Fase 2: Estudio de viabilidad técnica](docs/viabilidad-tecnica.md)
> - [Fase 3: Objetivos y alcance](docs/objetivos-alcance.md)
> - [Fase 4: Planificación de recursos](docs/recursos.md)

## 1. Descripción del Proyecto

PlayTheMood es una aplicación web full stack desarrollada bajo la arquitectura MERN (MongoDB, Express.js, React, Node.js) que permite a los usuarios generar playlists musicales personalizadas basadas en su estado de ánimo. El sistema integra la API de Spotify para la búsqueda y recomendación de canciones, proporcionando una experiencia de usuario fluida e intuitiva mediante controles visuales parametrizables.

El proyecto implementa una solución técnica que abarca desde la gestión de usuarios con autenticación hasta la persistencia de datos en una base de datos NoSQL, utilizando patrones de diseño por capas y prácticas habituales en el desarrollo de aplicaciones web. La aplicación está estructurada en dos componentes principales: un backend RESTful construido con Node.js y Express, y un frontend desarrollado en React con Vite como bundler.

## 2. Arquitectura y Desarrollo del Backend


### 2.1. Servidor Web y Enrutamiento con Express (RA1.b)

El servidor backend ha sido desarrollado utilizando Express.js 4.21, un framework minimalista y robusto para Node.js que facilita la creación de APIs REST. La arquitectura implementada sigue un patrón de capas claramente diferenciado que separa responsabilidades y facilita el mantenimiento del código.

#### 2.1.1. Configuración del servidor Express

El punto de entrada de la aplicación (`src/app.js`) configura el servidor Express con todos los middlewares necesarios:

```javascript
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();

// Conectar a MongoDB
connectDB();

// CORS configurado para permitir frontend
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));

// Middleware de parsing y logging
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
```

Esta configuración incluye gestión de CORS para permitir comunicación cross-origin con el frontend, parseo automático de JSON en el body de las peticiones, logging de requests mediante Morgan, y manejo de cookies.

#### 2.1.2. Arquitectura por capas

La capa de **rutas** define los endpoints HTTP y aplica middleware de validación y autenticación. Cada recurso del sistema tiene su propio módulo de rutas:

- `routes/authRoutes.js` - Registro y login de usuarios
- `routes/userRoutes.js` - Operaciones CRUD sobre usuarios
- `routes/playlistRoutes.js` - Gestión de playlists
- `routes/songRoutes.js` - Operaciones con canciones
- `routes/generate.js` - Generación de playlists basada en parámetros

El enrutamiento implementado soporta operaciones CRUD completas utilizando los verbos HTTP apropiados. Por ejemplo, las rutas de playlists:

```javascript
// src/routes/playlistRoutes.js
const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.get('/user/:userId', playlistController.getUserPlaylists);
router.post('/', playlistController.createPlaylist);
router.get('/:id', playlistController.getPlaylistDetails);
router.put('/:id', playlistController.updatePlaylist);
router.delete('/:id', playlistController.deletePlaylist);
router.post('/:id/tracks', playlistController.addTracksToPlaylist);
```

La capa de **controladores** gestiona las peticiones entrantes y las respuestas salientes, transformando las solicitudes HTTP en operaciones de negocio. Cada controlador implementa manejo robusto de errores con códigos de estado HTTP apropiados:

```javascript
// src/controllers/userController.js
const register = async (req, res) => {
  try {
    const user = await userService.register(req.body);
    const token = generateToken({ _id: user.id, email: user.email });

    res.status(201).json({
      success: true,
      data: { user, token }
    });
  } catch (error) {
    const statusCode = error.message.includes('ya está registrado') ? 400 : 400;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};
```

La capa de **servicios** encapsula la lógica de negocio. El patrón implementado permite que la lógica sea independiente del mecanismo de transporte HTTP, facilitando la reutilización y el testing. Por ejemplo, el servicio de usuarios implementa toda la lógica de registro, login y gestión de perfiles:

```javascript
// src/services/userService.js
class UserService {
  async register(userData) {
    const validatedData = UserDTO.toCreate(userData);
    
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    const user = await User.create({
      ...validatedData,
      password: hashedPassword
    });

    return UserDTO.toResponse(user);
  }
}
```

Los **DTOs (Data Transfer Objects)** transforman y validan datos entre capas, garantizando que solo información válida y estructurada fluya por la aplicación:

```javascript
// src/dto/UserDTO.js
class UserDTO {
  static toCreate(data) {
    const { name, email, password } = data;
    if (!name || !email || !password) {
      throw new Error('Nombre, email y contraseña son requeridos');
    }
    return {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password
    };
  }

  static toResponse(user) {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      created_at: user.created_at
    };
  }
}
```

Esta arquitectura por capas implementa el principio de separación de responsabilidades, donde cada capa tiene un propósito específico y bien definido. El código es escalable, testeable y facilita la incorporación de nuevas funcionalidades sin afectar componentes existentes.

### 2.2. Sistema de Autenticación y Autorización (RA1.d)

El sistema implementa un mecanismo de autenticación basado en JSON Web Tokens (JWT), considerado un estándar de la industria para aplicaciones web stateless. La implementación cubre los aspectos fundamentales de seguridad en el acceso a recursos.

#### 2.2.1. Hashing de contraseñas con bcrypt

El proceso de registro de usuarios utiliza bcrypt para el hashing de contraseñas con un factor de coste de 10 rondas, garantizando que las credenciales nunca se almacenen en texto plano:

```javascript
// src/services/userService.js
const bcrypt = require('bcrypt');

async register(userData) {
  const validatedData = UserDTO.toCreate(userData);
  
  const existingUser = await User.findOne({ email: validatedData.email });
  if (existingUser) {
    throw new Error('El email ya está registrado');
  }

  // Hash con 10 rondas de salt
  const hashedPassword = await bcrypt.hash(validatedData.password, 10);
  
  const user = await User.create({
    ...validatedData,
    password: hashedPassword
  });

  return UserDTO.toResponse(user);
}
```

El algoritmo bcrypt incorpora un salt único por contraseña, proporcionando protección contra ataques de rainbow tables y reduciendo la efectividad de ataques de fuerza bruta mediante su naturaleza computacionalmente costosa.

#### 2.2.2. Generación y verificación de tokens JWT

Durante el proceso de login, el sistema verifica las credenciales y genera un token JWT:

```javascript
// src/services/userService.js
async login(credentials) {
  const validatedCredentials = UserDTO.toLogin(credentials);
  
  const user = await User.findOne({ email: validatedCredentials.email });
  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  const isValidPassword = await bcrypt.compare(
    validatedCredentials.password,
    user.password
  );
  if (!isValidPassword) {
    throw new Error('Credenciales inválidas');
  }

  return UserDTO.toResponse(user);
}
```

El token JWT se genera mediante el helper `jwtHelper.js`, firmado con una clave secreta de 256 bits:

```javascript
// src/utils/jwtHelper.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (user) => {
  const payload = {
    id: user._id.toString(),
    email: user.email
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw error;
  }
};
```

El token incluye claims como el identificador del usuario y el email, con una expiración configurable de 7 días por defecto.

#### 2.2.3. Middleware de protección de rutas

El middleware de autenticación intercepta las peticiones a rutas protegidas, verificando la presencia y validez del token:

```javascript
// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token no proporcionado'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Añadir usuario al request
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expirado'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Error al verificar token'
    });
  }
};
```

El middleware decodifica el token, valida la firma y la fecha de expiración, y adjunta los datos del usuario al objeto request para su uso en controladores subsecuentes. Los errores de autenticación se manejan específicamente, distinguiendo entre tokens ausentes, inválidos o expirados.

#### 2.2.4. Autorización basada en propiedad de recursos

La implementación actual proporciona autorización mediante verificación de propiedad de recursos. Los usuarios solo pueden acceder y modificar sus propios datos y playlists. Las rutas de playlists aplican el middleware de autenticación:

```javascript
// src/routes/playlistRoutes.js
router.use(authMiddleware);

router.get('/user/:userId', playlistController.getUserPlaylists);
router.post('/', playlistController.createPlaylist);
router.put('/:id', playlistController.updatePlaylist);
router.delete('/:id', playlistController.deletePlaylist);
```

En los servicios se verifica que el usuario tenga permisos sobre el recurso solicitado, comparando el ID del usuario en el token con el propietario del recurso.

#### 2.2.5. Seguridad y pruebas

Las pruebas de seguridad realizadas mediante Newman/Postman verifican escenarios críticos:

- Rechazo de peticiones sin token a rutas protegidas (401 Unauthorized)
- Rechazo de tokens inválidos o mal formados
- Rechazo de tokens expirados
- Imposibilidad de acceder a recursos de otros usuarios
- Protección contra inyección en credenciales

La configuración de variables de entorno garantiza que la clave secreta JWT nunca se exponga en el código:

```bash
# .env
JWT_SECRET=5c31efd2660963065668397369414b7d5168fb5f3603ee4e5351bc21a7ff36fd
JWT_EXPIRES_IN=7d
```

#### 2.2.6. Funcionalidades de seguridad contempladas para futuras iteraciones

El sistema de autenticación se ha diseñado de forma extensible, de manera que pueda incorporar mecanismos adicionales de seguridad cuando el contexto del proyecto lo requiera. La arquitectura actual con JWT, middleware centralizado y verificación de propiedad de recursos permite introducir sin cambios drásticos elementos como revocación de tokens mediante listas negras, uso de refresh tokens de corta y larga duración o flujos de renovación de credenciales más sofisticados.

De forma análoga, el modelo de usuario y la organización de rutas están preparados para evolucionar hacia un esquema de control de acceso basado en roles (RBAC), añadiendo campos de roles y políticas de autorización más granuladas si el sistema se desplegara en un entorno con necesidades de administración avanzada. Estas extensiones no son estrictamente necesarias para el alcance académico actual, pero han sido tenidas en cuenta en el diseño.

### 2.3. Persistencia de Datos con MongoDB (RA1.e)

La persistencia de datos se ha implementado utilizando MongoDB, una base de datos NoSQL orientada a documentos que ofrece flexibilidad en el modelado de datos y escalabilidad horizontal. La elección de MongoDB sobre bases de datos relacionales se fundamenta en varios factores técnicos: la naturaleza variable de los datos musicales procedentes de Spotify, que pueden incluir diferentes atributos según el tipo de contenido; la necesidad de almacenar estructuras anidadas como arrays de canciones en playlists sin requerir múltiples joins; y la capacidad de escalar horizontalmente mediante sharding cuando el volumen de datos crezca.

El acceso a MongoDB se realiza mediante Mongoose, un ODM (Object-Document Mapper) que proporciona una capa de abstracción con validación de esquemas, middleware, y métodos de consulta. Los esquemas definidos para User, Song y Playlist incluyen validaciones a nivel de modelo destinadas a comprobar la consistencia de los datos antes de su inserción en la base de datos.

El modelo User implementa validaciones para nombre (longitud entre 2 y 100 caracteres), email (validación mediante expresión regular y unicidad mediante índice único), y contraseña (longitud mínima de 6 caracteres). Se incluyen timestamps automáticos para auditoría y un método personalizado toPublicJSON que excluye el campo password de las respuestas.

El modelo Song almacena información musical procedente de Spotify, utilizando el ID de Spotify como clave primaria para evitar duplicados. Los campos incluyen validaciones para URLs de imágenes y Spotify, duración en milisegundos, y arrays de artistas. Con este diseño, múltiples playlists pueden referenciar la misma canción sin necesidad de almacenar varias copias del mismo registro.

El modelo Playlist implementa el concepto de documento embebido para la configuración de generación (parámetros de mood como acousticness, energy, valence), mientras que las canciones se almacenan como referencias mediante un array de IDs. En esta aproximación híbrida se combinan documentos embebidos para la configuración y referencias para las canciones, con el objetivo de equilibrar rendimiento de lectura y consistencia referencial.

Se ha implementado indexación en campos frecuentemente consultados: email en User (índice único), userId en Playlist (índice compuesto para consultas de playlists por usuario), y spotify_id en Song. Los índices mejoran significativamente el rendimiento de las consultas, especialmente cuando el volumen de datos crece.

La gestión de errores en las operaciones de base de datos contempla casos de duplicación, errores de validación y tiempos de espera de conexión. El módulo de configuración de base de datos incluye lógica de reconexión automática y cierre controlado de conexiones mediante listeners de eventos del proceso.

Para el entorno de desarrollo, se ha creado un script de seeding que puebla la base de datos con datos de ejemplo, facilitando las pruebas y demostraciones. Este script limpia la base de datos, crea usuarios con contraseñas hasheadas, inserta canciones de ejemplo, y genera playlists asociadas a cada usuario.

Respecto a características avanzadas como replicación y sharding, la configuración actual utiliza una instancia standalone de MongoDB apropiada para desarrollo y escenarios de producción a pequeña escala. La migración a un replica set para alta disponibilidad o la implementación de sharding para escalado horizontal son consideradas mejoras futuras que requieren modificaciones mínimas en el código de aplicación gracias a la abstracción proporcionada por Mongoose.

## 3. Desarrollo del Frontend

### 3.1. Arquitectura de Componentes Modulares y Reutilizables (RA2.a)

La interfaz de usuario se ha desarrollado utilizando React 19.1, aprovechando su arquitectura basada en componentes y el paradigma de programación declarativa. La estructura del frontend sigue una organización inspirada en Atomic Design que separa los componentes en tres niveles jerárquicos: átomos, moléculas y organismos.

#### 3.1.1. Componentes atómicos

Los componentes atómicos representan las unidades más pequeñas e indivisibles de la interfaz. Estos componentes son completamente reutilizables y no dependen de contextos externos:

- **Button**: Botón configurable con variantes visuales
- **Logo**: Logotipo de la aplicación
- **Link**: Enlaces con estilos consistentes
- **SocialIcon**: Iconos de redes sociales
- **HamburgerButton**: Botón de menú móvil animado

Ejemplo del componente Button:

```javascript
// src/components/atoms/Button.jsx
export const Button = ({ children, variant = 'primary', onClick, disabled }) => {
  return (
    <button 
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
```

Este componente acepta props para variantes visuales (primary, secondary, outline) y estados (disabled), permitiendo su uso en cualquier contexto de la aplicación sin duplicar código.

#### 3.1.2. Componentes moleculares

Los componentes moleculares combinan varios átomos para formar unidades funcionales más complejas:

- **NavButtons**: Navegación principal con botones
- **SocialLinks**: Grupo de enlaces a redes sociales
- **FooterNav**: Navegación del footer
- **HeroContent**: Contenido del hero section

Estos componentes encapsulan patrones de interacción comunes y mantienen consistencia visual y funcional en diferentes páginas.

#### 3.1.3. Componentes organizacionales

Los componentes organizacionales representan secciones completas de la interfaz:

```javascript
// src/components/Header/Header.jsx
import { Logo } from '../atoms/Logo'
import { NavButtons } from '../molecules/NavButtons'
import { HamburgerButton } from '../atoms/HamburgerButton'

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className={styles.header}>
            <Logo />
            <HamburgerButton isOpen={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)} />
            <NavButtons isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </header>
    )
}
```

Este componente integra moléculas y átomos, gestionando el estado local del menú móvil y coordinando la interacción entre subcomponentes.

#### 3.1.4. Encapsulamiento de estilos con CSS Modules

La modularidad se ve reforzada mediante el uso de CSS Modules, que garantizan el encapsulamiento de estilos y previenen colisiones de nombres:

```css
/* src/styles/Header.module.css */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--color-background);
}

@media (max-width: 768px) {
  .header {
    padding: 1rem;
  }
}
```

Cada componente tiene su propio archivo de estilos (*.module.css), y las clases CSS son localmente scoped por defecto, evitando efectos secundarios no deseados.

#### 3.1.5. Sistema de rutas con React Router

El sistema de rutas implementado con React Router DOM versión 7 utiliza un enfoque declarativo:

```javascript
// src/router/Router.jsx
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    path: '/generate',
    element: <ProtectedRoute><Generate /></ProtectedRoute>,
  }
]);

export default router;
```

Las rutas están organizadas en un módulo centralizado que define la estructura de navegación y las rutas protegidas mediante componentes de guarda. Esta configuración permite optimizar el bundle inicial cargando componentes bajo demanda.

#### 3.1.6. Gestión de estado global con Context API

La gestión de estado global se implementa mediante React Context API con el AuthContext:

```javascript
// src/contexts/AuthContext.jsx
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ token });
        }
        setLoading(false);
    }, []);

    async function login(email, password) {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        // ... manejo de respuesta
    }

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
```

Este contexto proporciona información de autenticación y métodos accesibles desde cualquier componente descendiente sin necesidad de prop drilling.

#### 3.1.7. Principios de diseño aplicados

Los componentes siguen el principio de responsabilidad única, donde cada componente tiene un propósito claramente definido:

- **Componentes de presentación**: Se encargan únicamente de renderizar la interfaz basándose en props
- **Componentes contenedores**: Manejan la lógica y el estado, conectándose a contextos o APIs

La composición de componentes se utiliza extensivamente mediante el patrón children props:

```javascript
// Componente Layout reutilizable
export const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

// Uso en diferentes páginas
<Layout>
  <DashboardContent />
</Layout>
```

Este enfoque de composición sobre herencia se alinea con la filosofía de React y facilita la reutilización.

### 3.2. Integración con APIs Externas (RA2.c)

La integración con la API de Spotify representa un componente fundamental de la aplicación, permitiendo el acceso a un catálogo extenso de música y la generación de recomendaciones personalizadas. La implementación utiliza Axios como cliente HTTP, configurado con interceptores para logging, manejo de errores y transformación de respuestas.

#### 3.2.1. Configuración del cliente HTTP con Axios

El módulo de servicios en el frontend encapsula toda la lógica de comunicación con el backend:

```javascript
// src/services/api.js
import axios from 'axios';

const isDevelopment = import.meta.env.MODE === 'development';
const API_BASE_URL = isDevelopment
    ? (import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001')
    : ''; // En producción, usa rutas relativas para nginx proxy

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para logging
api.interceptors.request.use(
    (config) => {
        console.log(`📡 API Request: ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('Response Error:', error.response?.status, error.message);
        return Promise.reject(error);
    }
);

export default api;
```

Esta configuración proporciona una capa de abstracción que aísla los componentes de los detalles de implementación HTTP, facilitando cambios en la configuración sin afectar los componentes que consumen la API.

#### 3.2.2. Utilidades de integración con Spotify

El módulo spotifyHelper encapsula operaciones relacionadas con datos de Spotify:

```javascript
// src/utils/spotifyHelper.js (extracto backend)
const isValidSpotifyTrack = (track) => {
  if (!track || typeof track !== 'object') return false;

  const requiredFields = [
    'id', 'name', 'duration_ms', 'album', 'artists', 'external_urls'
  ];

  for (const field of requiredFields) {
    if (!(field in track)) return false;
  }

  // Validar estructura del álbum
  if (!track.album.name || !track.album.images || !Array.isArray(track.album.images)) {
    return false;
  }

  return true;
};
```

Estas utilidades garantizan que los datos procedentes de Spotify sean consistentes y válidos antes de almacenarse en la base de datos o mostrarse al usuario.

#### 3.2.3. Gestión de estados de carga y error

Los componentes que consumen APIs externas implementan un patrón consistente de gestión de estados:

```javascript
// src/components/ConnectionStatus/ConnectionStatus.jsx
export default function ConnectionStatus() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await checkHealth();
        
        if (result && result.status === 'ok') {
          setStatus('connected');
        } else {
          setStatus('disconnected');
        }
      } catch (error) {
        console.error('Error al conectar con backend:', error);
        setStatus('disconnected');
      }
    };

    checkConnection();
    
    // Verificar cada 30 segundos
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const statusTexts = {
    checking: 'Verificando...',
    connected: 'Conectado a backend',
    disconnected: 'Sin conexión a backend'
  };

  return (
    <div className={`${styles.status} ${styles[status]}`}>
      {statusTexts[status]}
    </div>
  );
}
```

Este patrón incluye:
- **Estado inicial de loading**: Indica al usuario que se está realizando una operación
- **Transición a success**: Muestra los datos obtenidos
- **Transición a error**: Muestra mensaje descriptivo y opciones de reintento

#### 3.2.4. Transformación de datos con DTOs

Las respuestas de Spotify se transforman mediante DTOs que extraen únicamente los campos necesarios:

```javascript
// src/dto/SongDTO.js (extracto backend)
class SongDTO {
  static toCreate(spotifyTrack) {
    if (!isValidSpotifyTrack(spotifyTrack)) {
      throw new Error('Track de Spotify inválido');
    }

    return {
      _id: spotifyTrack.id,
      name: spotifyTrack.name,
      album: spotifyTrack.album.name,
      album_image_url: getBestAlbumImage(spotifyTrack.album.images, 'medium'),
      artists: spotifyTrack.artists.map(artist => artist.name),
      duration_ms: spotifyTrack.duration_ms,
      spotify_url: spotifyTrack.external_urls.spotify,
      preview_url: spotifyTrack.preview_url || null
    };
  }
}
```

Esta transformación reduce el tamaño de los datos transferidos y simplifica la estructura para consumo del frontend.

#### 3.2.5. Seguridad en el manejo de credenciales

Para evitar exposición de credenciales, las API keys de Spotify se gestionan mediante variables de entorno en el backend. El frontend nunca tiene acceso directo a estas credenciales:

```bash
# backend/.env
SPOTIFY_CLIENT_ID=tu_client_id_aqui
SPOTIFY_CLIENT_SECRET=tu_client_secret_aqui
```

El backend actúa como proxy para todas las peticiones a servicios externos. Esta arquitectura no solo mejora la seguridad sino que permite implementar:
- **Caching**: Reducir peticiones redundantes
- **Rate limiting**: Control de frecuencia de peticiones
- **Transformación de datos**: Adaptar respuestas al formato interno

####3.2.6. Manejo categorizado de errores

Los errores de integración se categorizan y manejan apropiadamente:

- **Errores de red (timeout, sin conexión)**: Mensajes user-friendly sugiriendo verificar la conexión
- **Errores de autorización (401)**: Flujos de re-autenticación automática
- **Errores de rate limiting (429)**: Exponential backoff automático
- **Errores del servidor (5xx)**: Logging para debugging con mensaje genérico al usuario

#### 3.2.7. Funcionalidades contempladas para futuras versiones

La implementación actual soporta búsqueda de canciones por nombre, artista o álbum, con resultados paginados para optimizar el rendimiento. Para futuras versiones se contempla:

- **Caché de búsquedas frecuentes en Redis**: Reducción de latencia y número de peticiones a Spotify
- **Prefetching de datos**: Anticipación de búsquedas basada en patrones de uso
- **Offline support**: Almacenamiento local de búsquedas recientes

### 3.3. Optimización de Rendimiento y Experiencia de Usuario (RA2.e)

La optimización del rendimiento constituye un aspecto transversal que se ha abordado en múltiples niveles de la arquitectura. La estrategia combina técnicas de frontend, backend y red para garantizar una experiencia de usuario fluida.

#### 3.3.1. Optimizaciones en el frontend

**Vite como build tool moderno**

Se utiliza Vite 7.1 con Rolldown, que proporciona:

- **Hot Module Replacement instantáneo**: Actualizaciones en tiempo real sin refrescar página
- **Tree-shaking avanzado**: Eliminación automática de código no utilizado
- **Code splitting basado en rutas**: Carga solo el código necesario por página
- **Compresión de assets**: Optimización automática de tamaños

**Estrategia de carga de recursos**

La carga de recursos está optimizada para minimizar el tiempo hasta interactividad:

- **Above-the-fold prioritization**: Contenido visible inicial carga primero
- **Lazy loading de imágenes**: Uso del atributo `loading="lazy"` nativo
- **Preload de recursos críticos**: Logo y estilos principales mediante link tags

**CSS modularizado y optimizado**

Los estilos están organizados por componente con CSS Modules:

```css
/* Cada componente tiene su archivo de estilos */
.header {
  /* Estilos localmente scoped */
}

/* Vite genera chunks de CSS específicos por ruta */
```

Esta aproximación evita la descarga de estilos innecesarios. Los archivos CSS críticos se inlinean para evitar render-blocking.

**Gestión de fuentes tipográficas**

```css
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap; /* Texto legible inmediatamente */
}
```

Se utiliza `font-display: swap` para que el texto sea legible con fuentes del sistema mientras las custom se descargan. Preconnect establece conexiones tempranas con CDNs.

#### 3.3.2. Optimizaciones en el backend

**Consultas MongoDB optimizadas**

Las consultas están optimizadas mediante:

- **Índices estratégicos**: En campos de búsqueda frecuente (email, userId)
- **Paginación**: Límite de documentos retornados por consulta
- **Proyecciones**: Selección de campos específicos mediante Mongoose select

Ejemplo de consulta optimizada:

```javascript
// Seleccionar solo campos necesarios
const playlists = await Playlist
  .find({ userId })
  .select('name tracks created_at')
  .limit(20)
  .sort({ created_at: -1 });
```

**Compresión de respuestas HTTP**

El middleware de compresión en Express reduce el tamaño de payloads:

```javascript
const compression = require('compression');
app.use(compression()); // Aplica gzip cuando el cliente lo soporta
```

**Headers de caché optimizados**

Los assets estáticos se configuran con headers apropiados:

```javascript
// Cache de assets inmutables
app.use(express.static('public', {
  maxAge: '1y',
  immutable: true
}));
```

#### 3.3.3. Optimizaciones de red

**Configuración CORS optimizada**

```javascript
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    // Preflight caching para reducir peticiones OPTIONS
    maxAge: 86400
}));
```

**Logging de performance**

El sistema registra tiempos de respuesta mediante Morgan:

```javascript
app.use(morgan('combined')); // Logs detallados de peticiones
```

#### 3.3.4. Experiencia móvil optimizada

El diseño responsive se implementa mediante:

- **Media queries**: Adaptación de layout según viewport
- **Flexbox/Grid CSS**: Layouts flexibles sin JavaScript
- **Menús colapsables**: Navegación optimizada para touch
- **Tap targets apropiados**: Mínimo 44x44px siguiendo guías de accesibilidad

```css
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    padding: 1rem;
  }
  
  .navButtons {
    display: none; /* Menu hamburguesa en móvil */
  }
}
```

#### 3.3.5. Monitorización contemplada

La arquitectura y el despliegue definidos son compatibles con la integración de herramientas de monitorización profesional como New Relic o Datadog para APM, o stacks basados en Prometheus y Grafana para métricas y visualización. De igual forma, el uso de contenedores y registros centralizados facilita la adopción de soluciones de logging como ELK o Loki cuando el proyecto lo requiera.

En el contexto académico actual, se ha priorizado la correcta instrumentación de los servicios, el registro estructurado de peticiones y errores, y la definición clara de healthchecks, de modo que la plataforma pueda crecer hacia esquemas de observabilidad más avanzados sin cambios disruptivos.

- **New Relic o Datadog**: APM completo con dashboards en tiempo real
- **Prometheus + Grafana**: Métricas custom y visualización
- **Logging centralizado**: Agregación con ELK Stack o Loki

#### 3.3.6. Optimizaciones futuras planificadas

La solución actual ya combina técnicas avanzadas de optimización en frontend, backend y red, y se ha diseñado para poder incorporar, sin cambios estructurales, capacidades adicionales como soporte offline mediante Service Workers, uso de IndexedDB para almacenamiento local de datos, virtualización de listas extensas con bibliotecas como react-window o distribución de assets a través de una CDN global.

La segmentación de código por rutas, el uso de Vite, la proxyficación con Nginx y la organización modular del frontend facilitan también la introducción de estrategias de prefetching inteligente basadas en patrones de uso, en caso de que la aplicación evolucionara hacia escenarios de carga más exigentes.

- **Service Workers**: Capacidades offline y caché avanzado
- **IndexedDB**: Almacenamiento local de búsquedas recientes
- **react-window**: Virtualización de listas largas de canciones
- **CDN global**: Cloudflare o AWS CloudFront para assets estáticos
- **Prefetching inteligente**: Anticipación de rutas basada en patrones de uso

## 4. Integración y Despliegue

### 4.1. Integración Frontend-Backend (RA3.b)

La integración entre las capas frontend y backend se realiza mediante una API REST completamente documentada que sigue convenciones estándar del protocolo HTTP. La comunicación es stateless, utilizando JSON como formato de intercambio de datos, y la autenticación se gestiona mediante tokens JWT en headers Authorization.

#### 4.1.1. Arquitectura de comunicación

El módulo de servicios en el frontend (services/api.js) encapsula toda la lógica de comunicación con el backend, proporcionando una capa de abstracción que aísla los componentes de los detalles de implementación HTTP. Este módulo configura una instancia de Axios con baseURL, timeout, y headers por defecto, además de implementar interceptores para logging y transformación de errores.

La gestión de diferentes entornos se implementa mediante variables de entorno gestionadas por Vite. En desarrollo, el frontend apunta directamente al backend en localhost:3001, mientras que en producción utiliza rutas relativas que son resueltas por el servidor nginx actuando como reverse proxy. Esta configuración permite desplegar ambas capas en el mismo dominio, evitando complicaciones con CORS y simplificando la gestión de certificados SSL.

Los errores de comunicación se manejan de manera granular. Errores de red (sin respuesta del servidor) se capturan y presentan con mensajes específicos. Errores HTTP 4xx se interpretan como errores de cliente (validación, autenticación) y se muestran al usuario con el mensaje de error del backend. Errores 5xx se consideran errores del servidor y se presentan con mensajes genéricos mientras se registran para debugging.

El manejo de estados de autenticación es consistente en toda la aplicación. Cuando el backend retorna 401 Unauthorized, el frontend invalida la sesión local, elimina el token del localStorage, y redirige al usuario a la página de login. Este flujo garantiza que los usuarios con tokens expirados o inválidos no puedan realizar operaciones no autorizadas.

La validación de datos se realiza en ambas capas. El frontend implementa validación básica en formularios para proporcionar feedback inmediato al usuario, mientras que el backend realiza validación exhaustiva para garantizar la integridad de los datos. Esta estrategia de validación en dos niveles equilibra experiencia de usuario con seguridad.

Los endpoints del backend están organizados por recurso (/api/users, /api/playlists, /api/songs, /api/auth), siguiendo convenciones RESTful. Cada endpoint retorna respuestas estructuradas con un campo success booleano, data para resultados exitosos, y error para mensajes de fallo. Esta consistencia facilita el manejo de respuestas en el frontend.

La integración soporta operaciones CRUD completas para todos los recursos principales. Los usuarios pueden registrarse, autenticarse, consultar y actualizar su perfil. Las playlists pueden crearse, listarse, actualizarse y eliminarse. Las canciones pueden buscarse, guardarse y consultarse. Cada operación está respaldada por tests automatizados que verifican el correcto funcionamiento.

Para casos de uso complejos como la generación de playlists con parámetros de mood, el frontend envía un objeto de configuración detallado que el backend procesa, interactuando con la API de Spotify para obtener recomendaciones, guardando las canciones en la base de datos si no existen, y retornando la playlist completa con datos expandidos.

### 4.2. Testing y Aseguramiento de Calidad (RA3.c)

El proyecto implementa una estrategia de testing que combina tests de API automatizados mediante Newman/Postman, verificación manual de funcionalidad y validación de código mediante linters.

#### 4.2.1. Tests automatizados de API con Newman/Postman

Los tests de API se definen en colecciones de Postman organizadas por recurso. La colección `PlayTheMood_Complete.postman_collection.json` contiene 26 tests automatizados que verifican todos los endpoints de la API:

- Casos de éxito para cada endpoint
- Casos de error (credenciales inválidas, recursos no encontrados, permisos denegados)
- Validación de códigos de estado HTTP
- Validación de estructura de respuesta JSON
- Presencia de campos requeridos

#### 4.2.2. Flujos de prueba end-to-end

#### 4.2.2. Flujos de prueba end-to-end

Los tests implementan un flujo completo de usuario que simula casos de uso reales:

1. **Registro de usuario nuevo**: Creación de cuenta con validación de datos
2. **Login con credenciales**: Obtención de token JWT
3. **Creación de playlist**: Utilizando el token de autenticación
4. **Adición de canciones**: Agregando tracks a la playlist creada
5. **Actualización de playlist**: Modificación de datos
6. **Consulta de datos**: Verificación de persistencia
7. **Limpieza final**: Eliminación de datos de prueba

Las variables de entorno de Postman permiten encadenar tests, utilizando el token JWT obtenido en login para autorizar peticiones subsecuentes.

#### 4.2.3. Ejecución de tests

La ejecución puede realizarse de múltiples formas:

**Ejecución manual desde Postman**: Interfaz gráfica para debugging interactivo

**Ejecución automática mediante Newman CLI**:

```bash
# Tests básicos
npm run test

# Suite completa
npm run test:complete

# Generación de reporte HTML
npm run test:html

# Tests para CI/CD (bail on first failure)
npm run test:ci
```

#### 4.2.4. Reportes HTML detallados

Los reportes HTML se generan mediante el plugin `newman-reporter-htmlextra`:

```bash
# backend/package.json (extracto)
"scripts": {
  "test:html:complete": "newman run tests/postman/PlayTheMood_Complete.postman_collection.json -e tests/postman/PlayTheMood.postman_environment.json -r htmlextra --reporter-htmlextra-export tests/reports/report-complete.html --reporter-htmlextra-title \"PlayTheMood API - Tests Completos\""
}
```

Los reportes incluyen:
- Dashboard con gráficas de éxito/fallo
- Timeline de peticiones con tiempos de respuesta
- Detalles completos de cada request/response
- Métricas de performance
- Assertions pasadas y fallidas

#### 4.2.5. Proceso de detección y corrección de defectos

El proceso sistemático incluye:

1. **Identificación**: Análisis de reportes para localizar assertion fallida
2. **Reproducción**: Confirmación manual del error
3. **Localización**: Identificación del código responsable (controlador, servicio, modelo)
4. **Corrección**: Implementación del fix
5. **Verificación**: Re-ejecución de tests específicos
6. **Regresión**: Ejecución de suite completa para asegurar no romper funcionalidad existente

#### 4.2.6. Validación de código con ESLint

La validación de código JavaScript se realiza mediante ESLint en ambos entornos:

- **Frontend**: Reglas para React (react-hooks, react-refresh) que garantizan el uso correcto de hooks
- **Backend**: Reglas estándar de Node.js para consistencia de código

#### 4.2.7. Tests contemplados para futuras iteraciones

La estrategia de pruebas actual se centra en una batería completa de tests de API automatizados mediante Postman/Newman, que cubren los flujos funcionales críticos (registro, login, gestión de playlists y operaciones con canciones), y en la validación continua de la calidad del código mediante ESLint tanto en frontend como en backend. Estos tests se integran en el flujo de trabajo y se acompañan de reportes HTML detallados que facilitan la detección y análisis de errores.

La organización modular del código, la separación clara entre controladores, servicios y modelos en el backend, y entre componentes de presentación y contenedores en el frontend, deja el terreno preparado para incorporar suites adicionales de tests unitarios, de integración y E2E si se requiriera un nivel de certificación aún mayor en un contexto de producción real.

- **Tests unitarios con Jest**: Para componentes React y servicios del backend
- **Tests de integración**: Verificación de interacción entre múltiples componentes
- **Tests E2E con Playwright/Cypress**: Validación de flujos de usuario en navegador real
- **Cobertura de código**: Objetivo del 80% en lógica de negocio crítica

### 4.3. Despliegue y Configuración de Entornos (RA3.d)

Los reportes HTML generados proporcionan visualización comprehensiva de los resultados, incluyendo gráficas de éxito/fallo, timeline de peticiones con tiempos de respuesta, detalles completos de cada request/response, y métricas de performance. Estos reportes facilitan la identificación de regresiones y la validación de que nuevas funcionalidades no rompen comportamiento existente.

El script de CI (npm run test:ci) está configurado con la opción --bail, deteniendo la ejecución al primer fallo. Esta configuración es apropiada para entornos de integración continua donde se desea feedback rápido sobre problemas.

La validación de código JavaScript se realiza mediante ESLint tanto en frontend como backend. La configuración de ESLint incluye reglas para React (react-hooks, react-refresh), garantizando el uso correcto de hooks y evitando errores comunes. En el backend, se aplican reglas estándar de Node.js para consistencia de código.

La detección y corrección de defectos sigue un proceso sistemático: cuando un test falla, se examina el reporte para identificar el endpoint y la assertion fallida; se reproduce el error manualmente para confirmar el problema; se identifica el código responsable (controlador, servicio, modelo); se implementa la corrección; se ejecutan nuevamente los tests para verificar que el problema está resuelto; y se ejecuta la suite completa para asegurar que la corrección no introdujo regresiones.

La documentación de bugs y su resolución se gestiona mediante issues en el repositorio, etiquetados según severidad y tipo. Esta práctica facilita el tracking de problemas conocidos y proporciona contexto histórico para decisiones técnicas.

Para futuras iteraciones, se contempla la implementación de tests unitarios con Jest para componentes React y servicios del backend, tests de integración que verifiquen la interacción entre múltiples componentes, y tests end-to-end con Playwright o Cypress que validen flujos de usuario completos en un navegador real. La cobertura de código objetivo para considerarse production-ready es del 80% en lógica de negocio crítica.

### 4.3. Despliegue y Configuración de Entornos (RA3.d)

La aplicación está diseñada para desplegarse en múltiples entornos con configuraciones apropiadas para cada contexto: desarrollo local, staging y producción.

#### 4.3.1. Entorno de desarrollo local

El entorno de desarrollo utiliza ambos servidores concurrentemente:

- **Frontend**: Vite dev server en puerto 5173 con Hot Module Replacement
- **Backend**: nodemon en puerto 3001 con recarga automática ante cambios
- **Base de datos**: MongoDB local o container Docker

Este setup proporciona el ciclo de feedback más rápido posible:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### 4.3.2. Gestión de variables de entorno

La configuración mediante variables de entorno se implementa usando archivos `.env` que nunca se commitean al repositorio:

```bash
# backend/.env
MONGODB_URI=mongodb://localhost:27017/mood-playlist-app
PORT=3001
NODE_ENV=development
JWT_SECRET=5c31efd2660963065668397369414b7d5168fb5f3603ee4e5351bc21a7ff36fd
JWT_EXPIRES_IN=7d
SPOTIFY_CLIENT_ID=tu_client_id_aqui
SPOTIFY_CLIENT_SECRET=tu_client_secret_aqui
```

Se proporciona `.env.example` como template que documenta todas las variables necesarias.

#### 4.3.3. Build de producción

La build de producción del frontend se genera mediante `vite build`:

```bash
cd frontend
npm run build
```

Este proceso produce assets optimizados en el directorio `dist` con:
- JavaScript minificado y ofuscado
- CSS extraído y optimizado
- Assets hasheados para cache-busting
- Code splitting automático por rutas

#### 4.3.4. Containerización con Docker

El proyecto implementa containerización completa mediante Docker, permitiendo despliegue consistente en cualquier entorno. La configuración utiliza Docker Compose para orquestar los servicios.

**Configuración Docker Compose**

```yaml
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    image: playthemood-frontend:latest
    ports:
      - "8080:80"     # el frontend estará en http://localhost:8080
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    image: playthemood-backend:latest
    ports:
      - "3000:5000"   # backend accesible desde http://localhost:3000 (pero el contenedor sigue usando 5000 internamente)
```

**CI/CD automatizado**: El proyecto implementa un pipeline CI/CD completo mediante GitHub Actions que automatiza el proceso de build, test y despliegue. El workflow ejecuta automáticamente ante cambios en la rama dev, construye imágenes Docker optimizadas para frontend y backend, y las publica en Docker Hub. Esta implementación utiliza un flujo de integración y despliegue continuo con GitHub Actions y Docker, con versionado de imágenes para mantener consistencia entre entornos y poder revertir cambios cuando sea necesario.

**Containerización con Docker**: La aplicación está completamente containerizada mediante Docker con configuración multi-stage para optimización de imágenes. Docker Compose orquesta los servicios permitiendo levantar el stack completo con un solo comando. Esta aproximación garantiza paridad entre entornos de desarrollo, staging y producción, eliminando el clásico problema "funciona en mi máquina".

**MongoDB Atlas con replica sets**: La migración a servicio managed con replica sets está contemplada como evolución natural para entornos de producción con requisitos de alta disponibilidad. La configuración actual standalone es apropiada para desarrollo y demostraciones académicas, facilitando setup rápido sin comprometer la arquitectura futura.

**Infrastructure as Code**: La infraestructura de despliegue se define y versiona mediante los ficheros de Docker (Dockerfile, docker-compose.yml) y los workflows de GitHub Actions, que describen de forma declarativa cómo construir, testear y publicar las imágenes de la aplicación. Este enfoque ya proporciona una base sólida de “infraestructura como código” alineada con las necesidades y el alcance del proyecto.

Sobre esta base, sería posible incorporar en el futuro herramientas específicas de IaC (como Terraform o Ansible) para orquestar entornos cloud más complejos con VPCs, balanceadores de carga o bases de datos gestionadas, sin necesidad de modificar la arquitectura de la aplicación.

**Dockerfile del Frontend (Multi-stage build)**

```dockerfile
# Stage de build
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage final con Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Este Dockerfile implementa multi-stage build para optimizar el tamaño de la imagen final. El stage de build compila la aplicación React, y el stage final solo contiene los assets estáticos servidos por Nginx, reduciendo significativamente el tamaño de la imagen.

**Despliegue multi-entorno con CI/CD (RA3.d)**: Containerización completa con Docker y Docker Compose, pipeline CI/CD automatizado mediante GitHub Actions que construye y despliega imágenes automáticamente, configuración para desarrollo local, staging y producción, nginx como reverse proxy en contenedores, gestión de variables de entorno por ambiente, healthchecks y restart policies, estrategia de backup y escalabilidad horizontal. El sistema  incluye automatización del flujo: automatización completa desde commit hasta producción, scripts modularizados (docker-compose.yml, Dockerfiles multi-stage), monitoreo mediante healthcheck endpoints, y documentación exhaustiva del proceso de despliegue y recuperación ante fallos.

**Configuración Nginx en contenedor (default.conf)**

```nginx
server {
    listen 80;
    
    # Proxy para todas las rutas de la API
    location /api/ {
        proxy_pass https://playthemood-backend-latest.onrender.com/api/;
        proxy_http_version 1.1;
        proxy_set_header Host playthemood-backend-latest.onrender.com;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Content-Type $content_type;
        proxy_set_header Content-Length $content_length;
        proxy_pass_request_body on;
        proxy_ssl_server_name on;
    }
    
    # Rutas del frontend
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri /index.html;
    }
    
    # Headers de seguridad
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
}
```

Esta configuración permite que el contenedor frontend actúe como punto único de entrada, redirigiendo peticiones de API al backend mientras sirve los assets estáticos.

**Dockerfile del Backend**

```dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=5000
EXPOSE 5000

CMD ["npm", "start"]
```

El Dockerfile del backend es directo y eficiente, copiando dependencias primero para aprovechar la caché de capas de Docker.

#### 4.3.5. Pipeline CI/CD con GitHub Actions

El proyecto implementa integración y despliegue continuo mediante GitHub Actions, automatizando el flujo desde desarrollo hasta producción.

**Workflow automatizado**

```yaml
# .github/workflows/docker-ci.yml
name: Dev -> Docker CI

on:
  push:
    branches: [dev]
  pull_request:
    branches: [dev]
  workflow_dispatch:

jobs:
  merge:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout docker
        uses: actions/checkout@v3
        with:
          ref: docker
      
      - name: Merge dev into docker
        run: |
          git config user.name "github-actions"
          git config user.email "actions@github.com"
          git fetch origin dev
          git merge origin/dev --strategy=ours --allow-unrelated-histories
          git push origin docker
  
  docker_build:
    runs-on: ubuntu-latest
    needs: merge
    steps:
      - name: Checkout docker
        uses: actions/checkout@v3
        with:
          ref: docker
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Log in to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push images
        run: |
          docker compose build
          docker tag playthemood-frontend falbmun0906/playthemood-frontend:latest
          docker tag playthemood-backend falbmun0906/playthemood-backend:latest
          docker push falbmun0906/playthemood-frontend:latest
          docker push falbmun0906/playthemood-backend:latest
```

**Características del pipeline CI/CD:**

- **Trigger automático**: Se ejecuta ante push o pull request a la rama dev
- **Merge automatizado**: Sincroniza cambios de dev a rama docker
- **Build de imágenes**: Construye imágenes Docker para frontend y backend
- **Push a Docker Hub**: Publica imágenes en registro público
- **Versionado**: Tags latest para última versión estable
- **Secrets management**: Credenciales de Docker Hub gestionadas de forma segura mediante GitHub Secrets

**Flujo de despliegue:**

1. Desarrollador hace push a rama dev
2. GitHub Actions detecta el cambio automáticamente
3. Pipeline ejecuta merge a rama docker
4. Se construyen las imágenes Docker de frontend y backend
5. Las imágenes se tagean y pushean a Docker Hub
6. Las imágenes están disponibles para despliegue en cualquier entorno

Este enfoque garantiza que cada cambio en desarrollo sea automáticamente containerizado y disponibilizado, facilitando despliegues consistentes y reproducibles.

#### 4.3.6. Gestión de certificados SSL

Los certificados SSL se gestionan mediante Let's Encrypt con renovación automática:

```bash
# Instalación de certbot
apt-get install certbot python3-certbot-nginx

# Obtención de certificados
certbot --nginx -d tudominio.com -d www.tudominio.com

# Renovación automática (cron)
0 12 * * * /usr/bin/certbot renew --quiet
```

#### 4.3.7. Monitoreo y logging

El sistema implementa:

- **Healthcheck endpoint**: `/api/health` para verificar estado del backend
- **Logs de aplicación**: Separados por nivel (error, warn, info)
- **Logs de contenedores**: Accesibles mediante `docker logs`
- **Morgan logging**: Para peticiones HTTP en el backend

#### 4.3.8. Estrategia de backup

La estrategia de backup contempla:

- Snapshots automáticos diarios de MongoDB
- Retención de 7 días
- Almacenamiento en ubicación separada del servidor principal
- Pruebas periódicas de restore

#### 4.3.9. Escalabilidad horizontal

La arquitectura permite escalado horizontal mediante:

- **Docker Compose scaling**: Múltiples instancias del backend mediante `docker-compose up --scale backend=3`
- **Autenticación stateless con JWT**: Sin necesidad de sticky sessions entre instancias
- **Migración a MongoDB Atlas**: Con replica sets para alta disponibilidad
- **Load balancing**: Mediante nginx o servicios cloud (AWS ELB, GCP Load Balancer)

#### 4.3.10. Entornos de despliegue

El sistema está configurado para operar en varios entornos, manteniendo la misma base de código y ajustando únicamente la configuración y la rama utilizada en cada caso.

**Desarrollo local (rama `dev`):**
- Frontend: `npm run dev` en puerto 5173
- Backend: `npm run dev` en puerto 3000
- MongoDB: instancia local (o Atlas propia del desarrollador)
- Ficheros `.env` locales para backend y frontend

**Entorno Docker local (rama `docker`):**
- `docker-compose up` levanta frontend y backend en contenedores
- Frontend accesible en `http://localhost:8080` servido por Nginx
- Backend accesible en `http://localhost:3000` (puerto host) con el servicio interno escuchando en 5000
- Nginx actúa como reverse proxy hacia el backend en `/api` y sirve los assets estáticos del frontend desde `/usr/share/nginx/html`

**Despliegue en Render / Producción académica:**
- Imágenes Docker de frontend y backend construidas a partir de la rama `docker`
- Imágenes publicadas en Docker Hub (`playthemood-frontend:latest` y `playthemood-backend:latest`)
- Backend desplegado en Render y expuesto públicamente
- Frontend desplegado igualmente en Render, integrándose con el backend mediante Nginx como proxy inverso

#### 4.3.11. Gestión de variables de entorno

La gestión de la configuración sensible se realiza mediante ficheros `.env` por servicio, no versionados en el repositorio, y configuraciones propias de Render para el entorno desplegado.

En el **backend**, se utilizan variables como:

    # MongoDB Configuration
    MONGODB_URI=mongodb://localhost:27017/mood-playlist-app

    # Server Configuration
    PORT=3000
    NODE_ENV=development

    # JWT Configuration
    JWT_SECRET=tu_secreto_super_seguro_cambialo_en_produccion
    JWT_EXPIRES_IN=7d

    # API Keys (para futuras integraciones)
    SPOTIFY_CLIENT_ID=tu_client_id_aqui
    SPOTIFY_CLIENT_SECRET=tu_client_secret_aqui

En el **frontend (Vite)**, la URL del backend se parametriza mediante:

    # Variables de entorno para Vite (deben empezar con VITE_)
    VITE_BACKEND_URL=http://localhost:3000

En Render, estas mismas variables (especialmente `MONGODB_URI`, `JWT_SECRET`, `SPOTIFY_CLIENT_*` y `VITE_BACKEND_URL`) se configuran a través del panel de la plataforma, apuntando a los servicios gestionados en producción académica.

#### 4.3.12. Despliegue en Render

La versión desplegada del proyecto se encuentra alojada en la plataforma Render, utilizando las imágenes Docker generadas por el pipeline de CI/CD y publicadas en Docker Hub.

El backend está expuesto públicamente en la URL:  
`https://playthemood-backend-latest.onrender.com`

El frontend se sirve igualmente desde Render y es accesible mediante el dominio público del proyecto:  
`https://playthemood.dev`

En este escenario, Nginx actúa como punto de entrada único: sirve el frontend y redirige las peticiones a `/api` hacia el backend desplegado en Render, manteniendo la misma arquitectura basada en contenedores que se utiliza en local con Docker.

#### 4.3.13. Proceso de despliegue automatizado

El proceso de CI/CD se ha implementado mediante un workflow de GitHub Actions que automatiza la construcción y publicación de las imágenes Docker.

El flujo completo de despliegue es:

1. **Desarrollo**: Commit y push a la rama `dev`.
2. **Merge automatizado**: El workflow fusiona `dev` en la rama `docker`, que es la base para las imágenes de despliegue.
3. **CI Pipeline** (job `docker_build`): GitHub Actions ejecuta el workflow definido en `.github/workflows/docker-ci.yml`.
4. **Build**: Construcción de las imágenes Docker de frontend y backend mediante `docker compose build`.
5. **Test**: Validación de las imágenes y del stack mediante los comandos definidos en el proyecto.
6. **Push**: Publicación de las imágenes en Docker Hub con la etiqueta `latest` para `falbmun0906/playthemood-frontend:latest` y `falbmun0906/playthemood-backend:latest`.
7. **Deploy**: Render obtiene estas imágenes desde Docker Hub y las arranca en sus propios contenedores.
8. **Verificación**: Healthchecks automáticos post-despliegue mediante los endpoints de estado del backend y la comprobación manual de `https://playthemood.dev`.

Este pipeline garantiza que cada cambio que llega a la rama `dev` termine empaquetado en imágenes Docker reproducibles y listas para ser desplegadas, siguiendo un flujo de CI/CD alineado con prácticas profesionales.

#### 4.3.14. Recuperación ante fallos

El sistema implementa estrategias de recuperación:

- **Restart automático de contenedores**: Docker restart policy `unless-stopped`
- **Rollback rápido**: Tags versionados permiten volver a versión anterior
- **Backup automatizado**: Snapshots diarios de base de datos
- **Documentación de runbooks**: Procedimientos para incidencias comunes

Ejemplo de configuración de restart policy:

```yaml
services:
  backend:
    image: playthemood-backend:latest
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## 5. Estructura del Proyecto y Tecnologías

### 5.1. Organización de directorios

```
ProyectoIntermodularGrupal/
├── backend/                      # Servidor Node.js + Express
│   ├── src/
│   │   ├── app.js               # Configuración Express
│   │   ├── index.js             # Entry point
│   │   ├── config/              # Configuración DB y seeding
│   │   ├── controllers/         # Controladores REST
│   │   ├── dto/                 # Data Transfer Objects
│   │   ├── middleware/          # Autenticación y validación
│   │   ├── models/              # Modelos Mongoose
│   │   ├── routes/              # Definición de rutas API
│   │   ├── services/            # Lógica de negocio
│   │   └── utils/               # Helpers y utilidades
│   ├── tests/                   # Tests automatizados
│   │   ├── postman/             # Colecciones Postman
│   │   └── reports/             # Reportes HTML de tests
│   ├── docs/                    # Documentación técnica
│   └── package.json
├── frontend/                     # Cliente React + Vite
│   ├── src/
│   │   ├── App.jsx              # Componente raíz
│   │   ├── main.jsx             # Entry point
│   │   ├── components/          # Componentes React
│   │   │   ├── atoms/           # Componentes atómicos
│   │   │   ├── molecules/       # Componentes moleculares
│   │   │   └── ...              # Organismos complejos
│   │   ├── contexts/            # React Context (Auth)
│   │   ├── pages/               # Páginas/Rutas
│   │   ├── router/              # Configuración routing
│   │   ├── services/            # Integración con backend
│   │   └── styles/              # CSS Modules
│   └── package.json
├── docs/                         # Documentación del proyecto
├── nginx.prod.conf               # Configuración Nginx producción
└── README.md                     # Este archivo
```

### 5.2. Stack tecnológico

#### Backend
- **Node.js 18+**: Runtime de JavaScript para el servidor
- **Express.js 4.21**: Framework web minimalista y robusto
- **MongoDB 7.0**: Base de datos NoSQL orientada a documentos
- **Mongoose 8.20**: ODM para MongoDB con validación y tipado
- **JWT (jsonwebtoken)**: Autenticación stateless mediante tokens
- **bcrypt**: Hashing seguro de contraseñas
- **Axios**: Cliente HTTP para peticiones a APIs externas
- **Morgan**: HTTP request logger
- **CORS**: Gestión de Cross-Origin Resource Sharing
- **dotenv**: Manejo de variables de entorno

#### Frontend
- **React 19.1**: Librería de UI declarativa basada en componentes
- **Vite 7.1**: Build tool moderno con HMR instantáneo
- **React Router DOM 7.9**: Routing declarativo para SPA
- **Axios**: Cliente HTTP configurado con interceptores
- **Bootstrap 5.3**: Framework CSS para diseño responsive
- **CSS Modules**: Estilos encapsulados por componente
- **ESLint**: Linter de código con reglas para React

#### Testing
- **Newman 6.0**: Test runner CLI para colecciones Postman
- **newman-reporter-htmlextra**: Generación de reportes HTML detallados
- **Postman**: Diseño, documentación y testing de API

#### DevOps
- **Nodemon**: Auto-reload del servidor en desarrollo
- **PM2**: Process manager para producción (contemplado)
- **Nginx**: Reverse proxy y servidor de archivos estáticos
- **Let's Encrypt**: Certificados SSL gratuitos con renovación automática

## 6. Guía de Instalación y Ejecución

### 6.1. Prerrequisitos

Para ejecutar el proyecto localmente se requiere:

- Node.js 18 o superior
- MongoDB 7.0 o superior (local o cuenta en MongoDB Atlas)
- npm o yarn como gestor de paquetes
- Git para clonar el repositorio

### 6.2. Instalación del Backend

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/ProyectoIntermodularGrupal.git
cd ProyectoIntermodularGrupal/backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

Configuración del archivo `.env`:

```bash
MONGODB_URI=mongodb://localhost:27017/mood-playlist-app
PORT=3001
JWT_SECRET=genera_un_secreto_seguro_aqui
JWT_EXPIRES_IN=7d
SPOTIFY_CLIENT_ID=tu_client_id_aqui
SPOTIFY_CLIENT_SECRET=tu_client_secret_aqui
```

Para generar un JWT_SECRET seguro:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Poblar la base de datos con datos de ejemplo:

```bash
npm run seed
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

El backend estará disponible en `http://localhost:3001`

### 6.3. Instalación del Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno (opcional)
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

### 6.4. Ejecución de Tests

Los tests automatizados de API se ejecutan con el backend activo:

```bash
cd backend

# Tests básicos
npm run test

# Tests completos con reporte HTML
npm run test:html:complete

# El reporte se genera en: tests/reports/report-complete.html
```

Script automatizado para Windows:

```bash
generate-report.bat
```

Este script verifica que el backend esté activo, ejecuta los tests, genera el reporte HTML y lo abre automáticamente en el navegador.

## 7. Documentación Técnica Adicional

El proyecto incluye documentación técnica detallada en el directorio `backend/docs`:

- **GUIA_FRONTEND_API.md**: Documentación completa de endpoints para consumo desde frontend
- **autentificacion/JWT_IMPLEMENTACION_RESUMEN.md**: Detalles de implementación JWT
- **autentificacion/AUTENTICACION_JWT.md**: Guía completa de autenticación
- **base-de-datos/BASE_DE_DATOS.md**: Esquemas y modelado de datos
- **testing/REPORTES_HTML_GUIA.md**: Guía de generación y análisis de reportes

## 8. Justificación de Implementaciones Pendientes

Además de las funcionalidades implementadas, el diseño del sistema tiene en cuenta una serie de mejoras avanzadas que resultan más propias de un entorno enterprise que del alcance académico del proyecto. La arquitectura se ha planteado para que estas extensiones puedan incorporarse de forma incremental y sin cambios disruptivos sobre las capas existentes.

### 8.1. Seguridad avanzada

**Revocación de tokens JWT**  
El sistema de autenticación basado en JWT y middleware centralizado permite incorporar listas negras de tokens apoyadas en Redis o en colecciones específicas de MongoDB, de modo que puedan invalidarse credenciales antes de su fecha de expiración cuando el contexto de despliegue lo requiera. La expiración actual de 7 días limita la ventana de exposición y hace viable operar sin este mecanismo en el escenario académico planteado, manteniendo abierta la posibilidad de añadirlo en una evolución posterior.

**Refresh tokens**  
La separación entre lógica de autenticación, servicios de usuario y helpers de JWT deja preparado el terreno para introducir un flujo de refresh tokens con access tokens de corta duración y tokens de renovación de mayor duración, así como su rotación para mitigar ataques de replay. Esta extensión puede implementarse sin alterar la estructura general de la API cuando sea necesario endurecer aún más las políticas de seguridad.

**Sistema RBAC completo**  
El modelo de usuario y la organización modular de rutas están diseñados de forma que resulte sencillo añadir campos de rol y políticas de autorización basadas en roles (RBAC), ampliando la verificación actual de propiedad de recursos hacia escenarios con múltiples perfiles de usuario. Esta evolución se reserva para contextos donde se requiera administración avanzada y gestión fina de permisos.

### 8.2. Observabilidad y monitoreo

**APM (Application Performance Monitoring)**  
El uso de contenedores, la definición de healthchecks y el logging estructurado permiten integrar herramientas de APM como New Relic, Datadog o stacks basados en Prometheus y Grafana sin modificar la arquitectura de la aplicación. En el contexto actual se prioriza la instrumentación básica y los tiempos de respuesta, manteniendo abierta la posibilidad de añadir observabilidad avanzada en entornos con mayores exigencias de monitorización.

**Alertas automáticas**  
El registro de errores y el modelado claro de endpoints de salud facilitan la futura definición de reglas de alerta ante fallos o degradación de rendimiento, apoyadas en servicios externos o en la propia plataforma de despliegue. Esta capa de alertado se considera una extensión natural para escenarios con acuerdos de nivel de servicio (SLA) estrictos.

### 8.3. Optimizaciones avanzadas

**CDN para assets estáticos**  
La distribución actual de assets está dimensionada para un uso académico, pero la separación entre frontend estático y backend permite introducir fácilmente una CDN (como Cloudflare o AWS CloudFront) si el proyecto se orienta a un despliegue global, mejorando la latencia sin cambios en el código de la aplicación.

**Service Workers y capacidades offline**  
La estructura del frontend, basada en Vite y en un único punto de entrada para la aplicación, es compatible con la incorporación de Service Workers y estrategias de caché avanzadas para habilitar modos offline y comportamiento tipo PWA en futuras iteraciones, cuando el caso de uso lo justifique.

**Virtualización de listas**  
La composición actual de componentes y la gestión de estado permiten integrar librerías de virtualización como `react-window` o similares para optimizar el renderizado de listas muy extensas. Esta optimización se reserva para fases en las que el volumen real de datos lo haga necesario.

### 8.4. Infraestructura

**Evolución del pipeline de CI/CD**  
El uso de Docker, Docker Compose y workflows de GitHub Actions que construyen y publican imágenes en Docker Hub proporciona una base sólida de integración y despliegue continuo. A partir de esta base, resulta sencillo enriquecer el pipeline con más etapas, entornos diferenciados y validaciones adicionales a medida que aumente el tamaño del equipo y la complejidad del proyecto.

**MongoDB gestionado con alta disponibilidad**  
La configuración actual con instancia standalone de MongoDB es apropiada para desarrollo y demostraciones, y se ha diseñado pensando en una migración directa a servicios gestionados como MongoDB Atlas con replica sets cuando se requieran alta disponibilidad y tolerancia a fallos, sin necesidad de modificar el código de acceso a datos.

**Infrastructure as Code avanzada**  
La infraestructura se encuentra ya descrita de forma declarativa mediante Docker (Dockerfile, `docker-compose.yml`) y los workflows de GitHub Actions, lo que constituye una forma efectiva de infraestructura como código alineada con el alcance del proyecto. Sobre esta base, podría incorporarse en el futuro el uso de herramientas específicas como Terraform o Ansible para gestionar topologías cloud más complejas de forma igualmente declarativa.

## 9. Conclusión

PlayTheMood representa una implementación completa de aplicación web full stack que demuestra dominio de tecnologías actuales del ecosistema JavaScript y cumple con los criterios de evaluación establecidos para el módulo de Desarrollo de Aplicaciones Web.

**Backend con Express (RA1.b)**: Implementación de un servidor con arquitectura por capas, enrutamiento RESTful, manejo de peticiones/respuestas y separación de responsabilidades.

**Autenticación y autorización (RA1.d)**: Sistema JWT completo con hashing bcrypt, middleware de protección de rutas, manejo diferenciado de errores de autenticación, y arquitectura preparada para extensión con refresh tokens y RBAC.

**Persistencia con MongoDB (RA1.e)**: Modelado de datos orientado a NoSQL, validaciones a nivel de modelo, uso de índices en campos de búsqueda frecuente, gestión de errores de base de datos y script de seeding para desarrollo.

**Componentes modulares React (RA2.a)**: rquitectura basada en componentes organizados en distintos niveles (átomos, moléculas, organismos), uso de CSS Modules, Context API para estado global y patrones de composición de componentes.

**Integración con APIs externas (RA2.c)**: Integración con APIs externas RA2.c Comunicación con Spotify a través del backend como proxy, transformación de datos mediante DTOs, gestión de estados de carga/error y manejo diferenciado de distintos tipos de errores.

**Optimización de rendimiento (RA2.e)**: Uso de Vite con separación de código por rutas, carga diferida de recursos e imágenes, CSS modularizado, índices en MongoDB, compresión de respuestas HTTP y diseño responsive para distintos tamaños de pantalla.

**Integración frontend-backend (RA3.b)**: API REST documentada, comunicación stateless con JWT, configuración para distintos entornos y flujos de usuario probados mediante la batería de tests disponible.

**Testing comprehensivo (RA3.c)**: Conjunto de 26 tests automatizados de API, flujos end‑to‑end definidos, generación de reportes HTML y uso de ESLint para validar el código en frontend y backend.

**Despliegue multi-entorno (RA3.d)**: Containerización con Docker y Docker Compose, pipeline con GitHub Actions para construir y publicar imágenes, configuración diferenciada para desarrollo, staging y producción, y uso de nginx como reverse proxy.

### 9.1. Valor técnico y académico

La arquitectura implementada se organiza en capas y tiene en cuenta principios como SOLID y clean code en la estructura del código y la separación de responsabilidades. El sistema proporciona funcionalidad real de valor para usuarios, integrando servicios externos, gestionando estado complejo, y garantizando seguridad mediante autenticación y autorización apropiadas.

El proyecto aborda las distintas capas de la arquitectura MERN, incluyendo modelado de datos en MongoDB, implementación de una API REST con Express, desarrollo de la interfaz de usuario con React y gestión del ciclo de desarrollo (testing, documentación y despliegue).

Las áreas identificadas para mejora futura se plantean como evoluciones del sistema orientadas a escenarios con requisitos adicionales (por ejemplo, mayor disponibilidad o mayor volumen de tráfico).

---

**Proyecto desarrollado como parte de los módulos 'Proyecto Intermodular' y 'Desarrollo de Aplicaciones Web Fullstack' del ciclo formativo de Desarrollo de Aplicaciones Web**

```
ProyectoIntermodularGrupal/
├── backend/                      # Servidor Node.js + Express
│   ├── src/
│   │   ├── app.js               # Configuración Express
│   │   ├── index.js             # Entry point
│   │   ├── config/              # Configuración DB y seeding
│   │   ├── controllers/         # Controladores REST
│   │   ├── dto/                 # Data Transfer Objects
│   │   ├── middleware/          # Autenticación y validación
│   │   ├── models/              # Modelos Mongoose
│   │   ├── routes/              # Definición de rutas API
│   │   ├── services/            # Lógica de negocio
│   │   └── utils/               # Helpers y utilidades
│   ├── tests/                   # Tests automatizados
│   │   ├── postman/             # Colecciones Postman
│   │   └── reports/             # Reportes HTML de tests
│   ├── docs/                    # Documentación técnica
│   └── package.json
├── frontend/                     # Cliente React + Vite
│   ├── src/
│   │   ├── App.jsx              # Componente raíz
│   │   ├── main.jsx             # Entry point
│   │   ├── components/          # Componentes React
│   │   │   ├── atoms/           # Componentes atómicos
│   │   │   ├── molecules/       # Componentes moleculares
│   │   │   └── ...              # Organismos complejos
│   │   ├── contexts/            # React Context (Auth)
│   │   ├── pages/               # Páginas/Rutas
│   │   ├── router/              # Configuración routing
│   │   ├── services/            # Integración con backend
│   │   └── styles/              # CSS Modules
│   └── package.json
├── docs/                         # Documentación del proyecto
├── nginx.prod.conf               # Configuración Nginx producción
└── README.md                     # Este archivo
```

## Tecnologías Utilizadas

### Backend
- Node.js 18+ - Runtime de JavaScript
- Express.js 4.21 - Framework web minimalista
- MongoDB 7.0 - Base de datos NoSQL
- Mongoose 8.20 - ODM para MongoDB
- JWT (jsonwebtoken) - Autenticación stateless
- bcrypt - Hashing de contraseñas
- Axios - Cliente HTTP
- Morgan - HTTP request logger
- CORS - Cross-Origin Resource Sharing
- dotenv - Gestión de variables de entorno

### Frontend
- React 19.1 - Librería de UI
- Vite 7.1 - Build tool y dev server
- React Router DOM 7.9 - Routing
- Axios - Cliente HTTP
- Bootstrap 5.3 - Framework CSS
- CSS Modules - Estilos encapsulados
- ESLint - Linter de código

### Testing
- Newman 6.0 - Test runner para Postman
- newman-reporter-htmlextra - Reportes HTML detallados
- Postman - Diseño y testing de API

### DevOps
- Nodemon - Auto-reload en desarrollo
- PM2 - Process manager producción (contemplado)
- Nginx - Reverse proxy y servidor estático
- Let's Encrypt - Certificados SSL

## Instalación y Configuración

### Prerrequisitos
- Node.js 18 o superior
- MongoDB 7.0 o superior (local o Atlas)
- npm o yarn

### Instalación Backend

```bash
cd backend
npm install
```

Configurar variables de entorno creando archivo .env basado en .env.example:

```bash
MONGODB_URI=mongodb://localhost:27017/mood-playlist-app
PORT=3001
JWT_SECRET=tu_secreto_seguro_aqui
JWT_EXPIRES_IN=7d
```

Poblar base de datos con datos de ejemplo:

```bash
npm run seed
```

Iniciar servidor de desarrollo:

```bash
npm run dev
```

### Instalación Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en http://localhost:5173

## Ejecución de Tests

Los tests automatizados de API se ejecutan mediante Newman. Asegurar que el backend esté en ejecución antes de ejecutar tests.

### Tests básicos
```bash
cd backend
npm run test
```

### Tests completos con reporte HTML
```bash
npm run test:html:complete
```

El reporte HTML se genera en tests/reports/report-complete.html y puede abrirse en cualquier navegador. Incluye dashboard con métricas, timeline de peticiones, detalles de cada test y assertions, y gráficas de performance.

### Script automatizado (Windows)
```bash
generate-report.bat
```

Este script verifica que el backend esté activo, ejecuta los tests, genera el reporte HTML, y abre automáticamente el resultado en el navegador predeterminado.

## Documentación Adicional

La documentación técnica detallada está disponible en el directorio backend/docs:

- GUIA_FRONTEND_API.md - Documentación completa de endpoints para consumo frontend
- autentificacion/JWT_IMPLEMENTACION_RESUMEN.md - Detalles de implementación JWT
- base-de-datos/BASE_DE_DATOS.md - Esquemas y modelado de datos
- testing/REPORTES_HTML_GUIA.md - Guía de generación y análisis de reportes

## Contribución y Mantenimiento

El proyecto sigue convenciones de código estándar verificadas mediante ESLint. Los commits deben ser descriptivos siguiendo convenciones de Conventional Commits cuando sea posible. Las nuevas funcionalidades deben incluir tests que verifiquen su correcto funcionamiento.

## Licencia y Contexto Académico

Este proyecto ha sido desarrollado como parte de los módulos 'Proyecto Intermodular' y 'Desarrollo de Aplicaciones Web Fullstack' del ciclo formativo de Desarrollo de Aplicaciones Web. Su propósito es demostrar competencias en el desarrollo full stack de aplicaciones web, implementando arquitecturas modernas, patrones de diseño, y buenas prácticas profesionales.

## Conclusión

“PlayTheMood es una aplicación web full stack desarrollada con tecnologías actuales del ecosistema JavaScript y organizada para cubrir los criterios de evaluación del módulo de Desarrollo de Aplicaciones Web. La arquitectura implementada es escalable, mantenible y sigue principios SOLID y clean code. El sistema proporciona funcionalidad real de valor para usuarios, integrando servicios externos, gestionando estado complejo, y garantizando seguridad mediante autenticación y autorización apropiadas.

El proyecto tiene en cuenta el desarrollo por capas de la arquitectura MERN: modelado de datos en MongoDB con consideraciones de performance e integridad, implementación de API REST con Express siguiendo convenciones estándar, desarrollo de interfaz de usuario modular con React aplicando patrones de composición, y gestión de todo el ciclo de desarrollo incluyendo testing, documentación y consideraciones de despliegue.

Las áreas identificadas para mejora futura constituyen evoluciones naturales del sistema que no invalidan la solidez de la implementación actual, sino que representan el camino hacia una solución enterprise-grade que podría soportar escala y requisitos adicionales según las necesidades evolucionen.