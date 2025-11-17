# Proyecto Intermodular: Generador de Playlists por Estado de Ánimo

Este proyecto consiste en una aplicación web diseñada para que cualquier usuario pueda generar playlists musicales personalizadas según su estado de ánimo y preferencias emocionales. El objetivo principal es eliminar las barreras a la hora de encontrar la música perfecta para cada momento, permitiendo generar una playlist adecuada con solo unos pocos clics y sin necesidad de buscar manualmente cada canción. La solución se apoya en el uso de una API pública para recomendaciones musicales y busca una experiencia de usuario sencilla, intuitiva y accesible para cualquier perfil.

El desarrollo hace especial hincapié en la accesibilidad, la simplicidad visual y la eficiencia. La aplicación está pensada no solo para estudiantes o usuarios experimentados, sino también para personas con menos experiencia tecnológica, ofreciendo una interacción clara y amigable. Aunque el MVP se centra en la generación instantánea y temporal de playlists, el enfoque modular permite futuras ampliaciones —como integración completa con Spotify, login de usuarios y recomendaciones personalizadas a largo plazo.

---

## 🚀 Inicio Rápido

### Desarrollo Local

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Health Check: http://localhost:3001/api/health

### Docker (Local)

```bash
docker-compose up --build
```

- Frontend: http://localhost
- Backend: http://localhost:3001

### Producción

Ver **[QUICKSTART_DESPLIEGUE.md](QUICKSTART_DESPLIEGUE.md)** para desplegar en tu dominio.

---

## 📚 Documentación

### Planificación del Proyecto
- [Fase 1: Detección del problema](docs/problema.md)
- [Fase 2: Estudio de viabilidad técnica](docs/viabilidad-tecnica.md)
- [Fase 3: Objetivos y alcance](docs/objetivos-alcance.md)
- [Fase 4: Planificación de recursos](docs/recursos.md)

### Documentación Técnica
- **[QUICKSTART_DESPLIEGUE.md](QUICKSTART_DESPLIEGUE.md)** - ⭐ Guía rápida para desplegar en producción
- **[GUIA_DESPLIEGUE_PRODUCCION.md](GUIA_DESPLIEGUE_PRODUCCION.md)** - Guía detallada de despliegue
- **[ARQUITECTURA.md](ARQUITECTURA.md)** - Diagramas y explicación de la arquitectura
- **[CONEXION_BACKEND_FRONTEND.md](CONEXION_BACKEND_FRONTEND.md)** - Cómo funciona la conexión
- [GUIA_CONFIGURACION.md](GUIA_CONFIGURACION.md) - Configuración general
- [INSTRUCCIONES_CONEXION.md](INSTRUCCIONES_CONEXION.md) - Instrucciones de conexión

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - Framework UI
- **Vite** - Build tool
- **CSS Modules** - Estilos encapsulados
- **Axios** - Cliente HTTP

### Backend
- **Node.js** - Runtime
- **Express** - Framework web
- **CORS** - Seguridad

### DevOps
- **Docker & Docker Compose** - Contenedorización
- **Nginx** - Web server y proxy reverso
- **Let's Encrypt** - Certificados SSL
- **GitHub** - Control de versiones

---

## 👥 Información del Equipo

- **Alberto** — Frontend Lead (Interfaz, experiencia de usuario, diseño en React)
- **César** — Backend Lead (Node.js/Express, integración de la API, lógica de negocio)
- **Fran** — Project Coordinator (organización, documentación, control de versiones, apoyo en frontend y backend)

Comunicación interna gestionada mediante Discord.  
Repositorio principal: [Ir a repositorio](https://github.com/arodovi852/ProyectoIntermodularGrupal)

---

## 📁 Estructura del Proyecto

```
ProyectoIntermodularGrupal/
├── backend/                    # API Node.js/Express
│   ├── src/
│   │   ├── app.js             # Configuración Express
│   │   └── index.js           # Punto de entrada
│   ├── routes/                # Rutas API
│   ├── Dockerfile             # Imagen Docker backend
│   └── package.json
├── frontend/                   # Aplicación React
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── pages/            # Páginas
│   │   └── services/         # API client
│   ├── nginx.conf            # Configuración nginx (dev)
│   ├── Dockerfile            # Imagen Docker frontend
│   └── package.json
├── docs/                      # Documentación del proyecto
├── docker-compose.yml         # Desarrollo con Docker
├── docker-compose.prod.yml    # Producción con Docker
├── nginx.prod.conf           # Configuración nginx producción
└── deploy.sh                 # Script automatizado de despliegue
```

---

## 🌐 Despliegue en Producción

### Requisitos
- Dominio propio (ej: name.com)
- Servidor VPS (DigitalOcean, AWS, Contabo, etc.)
- Ubuntu 22.04 LTS recomendado

### Despliegue Automático

```bash
# En el servidor
cd /opt
git clone https://github.com/TU_USUARIO/TU_REPO.git proyecto
cd proyecto
chmod +x deploy.sh
./deploy.sh tudominio.com
```

El script configurará automáticamente:
- ✅ Docker y Docker Compose
- ✅ Firewall (UFW)
- ✅ Certificado SSL (Let's Encrypt)
- ✅ Renovación automática de certificados
- ✅ Despliegue de la aplicación

Consulta **[QUICKSTART_DESPLIEGUE.md](QUICKSTART_DESPLIEGUE.md)** para más detalles.

---

## 🔧 Comandos Útiles

```bash
# Ver logs
docker-compose logs -f

# Reiniciar servicios
docker-compose restart

# Reconstruir (después de cambios)
docker-compose up -d --build

# Ver estado
docker-compose ps

# Detener todo
docker-compose down
```

---

## 🎓 Para Evaluación Académica

### Puntos Destacados
1. **Arquitectura Profesional**: Separación frontend/backend, contenedorización
2. **Seguridad**: HTTPS, firewall, headers de seguridad
3. **Despliegue Real**: Aplicación accesible públicamente con dominio propio
4. **Buenas Prácticas**: Docker, Git, documentación extensa
5. **Accesibilidad**: Diseño inclusivo y sencillo

### Documentación para Presentación
- **ARQUITECTURA.md**: Diagramas visuales del sistema
- **QUICKSTART_DESPLIEGUE.md**: Proceso de despliegue
- Capturas de pantalla del sitio en producción
- Widget de conexión backend/frontend funcionando

---

## 📝 Licencia

Este proyecto es parte de un trabajo académico en el IES Hermenegildo Martín Borro.

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

