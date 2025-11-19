# API de Autenticación y Usuarios

## 🔐 Endpoints de Autenticación

### Registrar un nuevo usuario

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "_id": "65a123...",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "created_at": "2024-01-18T..."
  }
}
```

**Errores posibles:**
- `400`: Email ya registrado o campos faltantes
- `400`: Validación fallida (password < 6 caracteres, email inválido, etc.)

---

### Login de usuario

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "_id": "65a123...",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "created_at": "2024-01-18T..."
  }
}
```

**Errores posibles:**
- `400`: Email o password faltantes
- `401`: Credenciales inválidas

---

## 👤 Endpoints de Gestión de Usuarios

### Obtener perfil de usuario

```http
GET /api/users/:id
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65a123...",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "created_at": "2024-01-18T..."
  }
}
```

---

### Actualizar perfil de usuario

```http
PUT /api/users/:id
Content-Type: application/json

{
  "name": "Juan Pérez Actualizado",
  "email": "juan.nuevo@example.com"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65a123...",
    "name": "Juan Pérez Actualizado",
    "email": "juan.nuevo@example.com",
    "created_at": "2024-01-18T..."
  }
}
```

---

### Cambiar contraseña

```http
PUT /api/users/:id/change-password
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newPassword456"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Contraseña actualizada exitosamente"
}
```

**Errores posibles:**
- `401`: Contraseña actual incorrecta
- `400`: Campos faltantes

---

### Eliminar usuario

```http
DELETE /api/users/:id
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Usuario eliminado exitosamente"
}
```

---

### Obtener todos los usuarios (Admin)

```http
GET /api/users?page=1&limit=50
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "count": 10,
  "total": 25,
  "page": 1,
  "pages": 3,
  "data": [
    {
      "_id": "65a123...",
      "name": "Usuario 1",
      "email": "user1@example.com",
      "created_at": "2024-01-18T..."
    }
  ]
}
```

---

## 🔒 Seguridad Implementada

### Passwords Hasheados con bcrypt

Todos los passwords se hashean con bcrypt usando un factor de coste de 10:

```javascript
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);
```

### Validaciones

- **Email:** Formato válido y único en la base de datos
- **Password:** Mínimo 6 caracteres
- **Name:** Entre 2 y 100 caracteres

### Datos Públicos

El método `toPublicJSON()` del modelo User garantiza que el password nunca se exponga:

```javascript
user.toPublicJSON(); // Devuelve usuario sin password
```

---

## 💡 Notas de Integración con Frontend

### Flujo de Autenticación Recomendado

1. **Registro:**
   ```javascript
   const response = await fetch('http://localhost:3000/api/auth/register', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ name, email, password })
   });
   const { data } = await response.json();
   // Guardar data._id en el estado/localStorage para sesión
   ```

2. **Login:**
   ```javascript
   const response = await fetch('http://localhost:3000/api/auth/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email, password })
   });
   const { data } = await response.json();
   // Guardar data._id en el estado/localStorage para sesión
   ```

3. **Uso del userId:**
   - Una vez autenticado, usa `data._id` para:
     - Crear playlists asociadas al usuario
     - Obtener playlists del usuario
     - Actualizar perfil

### Ejemplo de Context en React

```javascript
// AuthContext.js
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Recuperar usuario del localStorage al cargar
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  
  const login = async (email, password) => {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (response.ok) {
      const { data } = await response.json();
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return true;
    }
    return false;
  };
  
  const register = async (name, email, password) => {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    
    if (response.ok) {
      const { data } = await response.json();
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return true;
    }
    return false;
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## ⚠️ Consideraciones Importantes

### Sesiones

Actualmente el sistema **NO** usa JWT o sesiones persistentes. El frontend debe:
- Guardar el userId después del login/registro
- Enviarlo en las peticiones que lo requieran
- Limpiar el userId al hacer logout

### Para Producción

Si necesitas implementar sesiones seguras:

1. **Instalar JWT:**
   ```bash
   npm install jsonwebtoken
   ```

2. **Crear middleware de autenticación:**
   ```javascript
   const jwt = require('jsonwebtoken');
   
   const authMiddleware = (req, res, next) => {
     const token = req.headers.authorization?.split(' ')[1];
     if (!token) {
       return res.status(401).json({ error: 'No autorizado' });
     }
     try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.userId = decoded.userId;
       next();
     } catch (error) {
       return res.status(401).json({ error: 'Token inválido' });
     }
   };
   ```

3. **Generar token al login:**
   ```javascript
   const token = jwt.sign(
     { userId: user._id },
     process.env.JWT_SECRET,
     { expiresIn: '7d' }
   );
   ```

---

## 🧪 Testing de Endpoints

### Con cURL

```bash
# Registro
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Obtener perfil
curl http://localhost:3000/api/users/65a123...

# Cambiar contraseña
curl -X PUT http://localhost:3000/api/users/65a123.../change-password \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"test123","newPassword":"newpass456"}'
```

---

## 📝 Credenciales de Prueba (después del seeding)

Después de ejecutar `npm run seed`, tendrás estos usuarios disponibles:

- **Email:** demo@example.com | **Password:** demo123
- **Email:** maria@example.com | **Password:** maria123
- **Email:** juan@example.com | **Password:** juan123

**Nota:** Estos passwords YA ESTÁN hasheados en la base de datos gracias a bcrypt.

