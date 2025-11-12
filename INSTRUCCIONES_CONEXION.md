# 🔗 Guía de Conexión Backend-Frontend

## 📋 Resumen de Cambios Realizados

### Backend (Puerto 3001)
- ✅ Configurado CORS para permitir conexiones desde `http://localhost:5173` (Vite)
- ✅ Endpoint `/api/health` funcionando correctamente
- ✅ Responde con: `{"status":"ok","message":"Backend funcionando","timestamp":"..."}`

### Frontend (Puerto 5173)
- ✅ Componente `ConnectionStatus` mejorado con mejor logging
- ✅ Servicio API configurado con axios
- ✅ Widget visual en la landing page

## 🚀 Cómo Iniciar los Servidores

### 1. Iniciar el Backend

Abre una terminal y ejecuta:

```bash
cd E:\Usuarios\Fran\Documentos\ReposGit\ProyectoIntermodularGrupal\backend
npm start
```

Deberías ver:
```
Servidor corriendo en puerto 3001
```

### 2. Iniciar el Frontend

Abre OTRA terminal y ejecuta:

```bash
cd E:\Usuarios\Fran\Documentos\ReposGit\ProyectoIntermodularGrupal\frontend
npm run dev
```

Deberías ver:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### 3. Verificar la Conexión

1. **Abrir el navegador en:** `http://localhost:5173`
2. **Abrir la consola del navegador** (F12)
3. **Buscar estos mensajes:**
   - 🔍 Verificando conexión con backend...
   - ✅ Respuesta recibida: {status: "ok", ...}

4. **En la página deberías ver:**
   - Widget verde en la esquina inferior derecha: **"✅ Conectado"**

## 🔍 Solución de Problemas

### ❌ Widget muestra "Sin conexión"

**Revisa la consola del navegador:**

1. Si ves errores de CORS:
   - Verifica que el backend esté corriendo en puerto 3001
   - Verifica que la configuración CORS esté correcta en `backend/src/app.js`

2. Si ves "Network Error":
   - El backend no está corriendo o no está en el puerto 3001
   - Ejecuta: `cd backend && npm start`

3. Si ves error 404:
   - Verifica que la ruta `/api/health` exista en `backend/routes/index.js`

### 🧪 Test Manual

Abre el navegador y prueba directamente:
- `http://localhost:3001/api/health` → Debería mostrar el JSON con `status: "ok"`
- `http://localhost:5173` → Tu aplicación React

## 📂 Archivos Modificados

1. **backend/src/app.js** 
   - Cambiado CORS de puerto 3000 a 5173

2. **frontend/src/components/ConnectionStatus/ConnectionStatus.jsx**
   - Mejorado logging y manejo de errores
   - Añadidos iconos visuales

3. **frontend/src/services/api.js**
   - Ya existía con axios configurado correctamente

## 🎓 Conceptos Importantes (Entorno Académico)

### ¿Qué es CORS?
**Cross-Origin Resource Sharing** - Seguridad del navegador que impide que una página web haga peticiones a un dominio diferente al suyo.

**Ejemplo:**
- Frontend: `http://localhost:5173` (dominio A)
- Backend: `http://localhost:3001` (dominio B)
- Sin CORS → ❌ Bloqueado
- Con CORS → ✅ Permitido

### ¿Qué hace `app.use(cors(...))`?

```javascript
app.use(cors({
    origin: 'http://localhost:5173',  // Solo permite este origen
    credentials: true,                // Permite cookies/auth
}));
```

Esto le dice al backend: "Acepta peticiones desde localhost:5173"

### Arquitectura Cliente-Servidor

```
┌─────────────────┐        HTTP Request         ┌─────────────────┐
│   FRONTEND      │─────────────────────────────>│    BACKEND      │
│   React/Vite    │         /api/health          │   Express.js    │
│   :5173         │<─────────────────────────────│   :3001         │
└─────────────────┘        HTTP Response         └─────────────────┘
                           {status: "ok"}
```

### Flujo de la Conexión

1. **Usuario abre** `http://localhost:5173`
2. **React se carga** y renderiza `<ConnectionStatus />`
3. **useEffect se ejecuta** al montar el componente
4. **checkHealth()** hace petición a `http://localhost:3001/api/health`
5. **Backend responde** con JSON
6. **Frontend actualiza** el estado y muestra "✅ Conectado"

## 📚 Buenas Prácticas Aplicadas

✅ **Separación de concerns**: Backend y Frontend separados
✅ **Variables de entorno**: `VITE_API_URL` en api.js
✅ **Manejo de errores**: try/catch con logs detallados
✅ **Feedback visual**: Widget para el usuario
✅ **Logs informativos**: Console.log para debugging
✅ **Código limpio**: Componentes modulares

## 🔄 Próximos Pasos Sugeridos

1. Crear archivo `.env` en frontend:
   ```
   VITE_API_URL=http://localhost:3001
   ```

2. Crear archivo `.env` en backend:
   ```
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   ```

3. Añadir más endpoints en el backend
4. Crear servicios API específicos en el frontend
5. Implementar autenticación (JWT)

---

**Creado:** 2025-11-12  
**Para:** Proyecto Intermodular Grupal  
**Stack:** Express.js + React + Vite

