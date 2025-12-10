<br>
<p align="center">
  <img width="890" height="201" alt="logo" src="https://github.com/user-attachments/assets/e759ebc3-1802-4346-a991-827ae721a77a" />
</p>

---

**PlayTheMood** es una aplicación web moderna que permite a los usuarios crear playlists de Spotify personalizadas basadas en su estado de ánimo actual. Con una interfaz intuitiva y un sistema de autenticación seguro, los usuarios pueden generar automáticamente listas de reproducción que se adapten perfectamente a cómo se sienten en cada momento.

La aplicación integra la API de Spotify para acceder a un vasto catálogo musical, permitiendo a los usuarios descubrir nuevas canciones que coincidan con sus emociones sin necesidad de buscar manualmente. Es la solución perfecta para cuando sabes que quieres escuchar música pero no sabes exactamente qué canción necesitas.

Este es un proyecto académico realizado como parte del módulo de **Proyecto Intermodular** que combina tecnologías modernas de frontend y backend, integración de APIs externas, y gestión de bases de datos en tiempo real.

![Página de inicio](./assets/main-page.gif)

---

### Stack Tecnológico

**Frontend**
- **React 19** - Framework UI
- **Vite** - Build tool y dev server
- **React Router 7** - Enrutamiento
- **React Bootstrap** - Componentes UI
- **Axios** - Cliente HTTP
- **ESLint** - Linting

**Backend**
- **Node.js** - Runtime
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación segura
- **Bcrypt** - Hash de contraseñas
- **Spotify API** - Integración de música
- **Postman/Newman** - Testing de APIs

**DevOps & Deployment**
- **Docker** - Containerización
- **Docker Compose** - Orquestación de servicios
- **Nginx** - Proxy inverso
- **GitHub** - Control de versiones

---

### Aplicación Desplegada

> [playthemood.dev](playthemood.dev)

---

### Features

![Login](./assets/login.gif)
![Sliders](./assets/sliders.gif)
![Búsqueda](./assets/search.gif)
![Carrusel](./assets/carousel.gif)

---

## Instalación Local

### Requisitos Previos
- Node.js 16+
- npm o yarn
- MongoDB local o Atlas
- Credenciales de Spotify API

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/TuUsuario/PlayTheMood.git
   cd PlayTheMood
   ```

2. **Configurar Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Editar .env con tus variables de entorno
   npm run dev
   ```

3. **Configurar Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Base de Datos**
   ```bash
   cd backend
   npm run seed  # Cargar datos iniciales
   ```

5. **Con Docker (Alternativa)**
   ```bash
   docker-compose up --build
   ```

### Variables de Entorno Necesarias

Backend (.env):
```
# MongoDB Configuration
# Para desarrollo local, usa MongoDB local o tu propia instancia de Atlas
MONGODB_URI=mongodb://localhost:27017/mood-playlist-app

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
# Genera un secreto seguro con: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=tu_secreto_super_seguro_cambialo_en_produccion
JWT_EXPIRES_IN=7d

# API Keys (para futuras integraciones)
# Obtén tus credenciales en https://developer.spotify.com/
SPOTIFY_CLIENT_ID=tu_client_id_aqui
SPOTIFY_CLIENT_SECRET=tu_client_secret_aqui
```

Frontend (.env):
```
# Backend API Configuration
VITE_API_URL=http://localhost:3000/api
```

---

## Equipo de Desarrollo

| Nombre            | GitHub                                       | Rol        |
|-------------------|----------------------------------------------|------------|
| Francisco Alba    | [falbmun0906](https://github.com/falbmun0906)   | Full Stack |
| Alberto Rodríguez | [arodovi852](https://github.com/arodovi852)  | Full Stack |
| César Ucha        | [ricito2001](https://github.com/ricitos2001) | Full Stack |

---

## Documentación

### SCRUM - Proyecto Intermodular
- [Análisis de Competencia](./docs/analisis-competencia.md)
- [Estructura organizativa](./docs/estructura-organizativa.md)
- [Presupuesto](./docs/presupuesto.md)
- [Financiación](./docs/financiacion.md)
- [Legislación](./docs/legislacion.md)
- [Recursos](./docs/recursos.md)

### Desarrollo Técnico - Desarrollo de aplicaciones web fullstack
- [Arquitectura Técnica](./docs/desarrollo-tecnico.md)

### Guías Específicas
- [Autenticación JWT](./backend/docs/autentificacion/AUTENTICACION_JWT.md)
- [Base de Datos](./backend/docs/base-de-datos/BASE_DE_DATOS.md)
- [Guía API Frontend](./backend/docs/GUIA_FRONTEND_API.md)
- [Testing y Reportes](./backend/docs/testing/REPORTES_HTML_GUIA.md)

### Documentación de Componentes
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

---

## Testing

### Ejecutar Tests

```bash
# Tests básicos
npm run test

# Tests completos
npm run test:complete

# Tests con reporte HTML
npm run test:html

# Tests completos con reporte
npm run test:html:complete
```

Las colecciones de Postman están en: `./backend/tests/postman/`

---

## 📋 Estructura del Proyecto

```
PlayTheMood/
├── backend/                    # API REST (Node.js + Express)
│   ├── src/
│   │   ├── controllers/       # Controladores
│   │   ├── services/          # Lógica de negocio
│   │   ├── models/            # Modelos Mongoose
│   │   ├── routes/            # Rutas API
│   │   ├── middleware/        # Middleware personalizado
│   │   ├── dto/               # Data Transfer Objects
│   │   └── utils/             # Utilidades
│   ├── docs/                  # Documentación técnica
│   └── tests/                 # Tests y colecciones Postman
├── frontend/                  # Aplicación React
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── pages/             # Páginas
│   │   ├── services/          # Servicios HTTP
│   │   ├── contexts/          # Context API
│   │   └── styles/            # Estilos
│   └── public/                # Assets estáticos
├── docs/                      # Documentación del proyecto
├── docker-compose.yml         # Configuración Docker
└── nginx.prod.conf           # Configuración Nginx
```

---

## 🔗 Enlaces Rápidos

- **Docker Hub**: [Insertar enlace]
- **Wiki del Proyecto**: [Insertar enlace]
- **Issues**: [Issues](https://github.com/TuUsuario/PlayTheMood/issues)
- **Proyectos**: [Proyectos](https://github.com/TuUsuario/PlayTheMood/projects)

---

## Guía Rápida de Desarrollo

### Flujo de Trabajo
1. Crear rama desde `develop`: `git checkout -b feature/nombre-feature`
2. Hacer cambios y commits descriptivos
3. Push a la rama
4. Crear Pull Request hacia `develop`
5. Merger cuando sea aprobado

### Convención de Commits
```
feat: nueva funcionalidad
fix: solución de bug
docs: cambios en documentación
style: cambios de formato
refactor: refactorización de código
test: añadir/modificar tests
```

---

## Licencia

Este proyecto es académico y está disponible bajo licencia MIT.

---

## Contacto y Soporte

Para preguntas o sugerencias sobre el proyecto:
- Email: falbmun0906@g.educaand.es
- GitHub Issues: [Crear issue](https://github.com/arodovi852/ProyectoIntermodularGrupal/issues)

---
<br>
<div align="center">
  <p><strong>Proyecto Intermodular - Año Académico 2025/2026</strong></p>
  <p>Hecho con ❤️ por el equipo de desarrollo</p>
</div>

