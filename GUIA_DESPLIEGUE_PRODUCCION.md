# 🚀 Guía de Despliegue en Producción con Dominio

## 📋 Prerequisitos

- ✅ Dominio comprado en name.com
- ✅ Un servidor (VPS) para alojar tu aplicación
- ✅ Docker instalado en el servidor

## 🌐 Opciones de Hosting (Recomendadas para Estudiantes)

### Opción 1: **DigitalOcean** (Recomendada) 💙
- **Precio**: $6/mes (plan básico)
- **GitHub Student Pack**: $200 gratis de crédito
- **Facilidad**: ⭐⭐⭐⭐⭐

### Opción 2: **AWS EC2** (Gratuito 1 año)
- **Precio**: Gratis el primer año (t2.micro)
- **Facilidad**: ⭐⭐⭐

### Opción 3: **Contabo VPS**
- **Precio**: €4.99/mes
- **Facilidad**: ⭐⭐⭐⭐

### Opción 4: **Oracle Cloud** (Gratis permanente)
- **Precio**: GRATIS (Always Free Tier)
- **Facilidad**: ⭐⭐

---

## 🎯 PASO 1: Configurar el Servidor VPS

### 1.1. Crear el servidor
1. Ve a tu proveedor (ej: DigitalOcean)
2. Crea un nuevo "Droplet" o VPS con:
   - **SO**: Ubuntu 22.04 LTS
   - **Plan**: Básico ($6/mes)
   - **Región**: La más cercana a ti

### 1.2. Conectarte por SSH
```bash
ssh root@TU_IP_DEL_SERVIDOR
```

### 1.3. Instalar Docker y Docker Compose
```bash
# Actualizar el sistema
apt update && apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
apt install docker-compose -y

# Verificar instalación
docker --version
docker-compose --version
```

---

## 🌍 PASO 2: Configurar el Dominio en name.com

### 2.1. Obtener la IP de tu servidor
```bash
# En tu servidor VPS, ejecuta:
curl ifconfig.me
```
Anota esta IP (ej: `123.45.67.89`)

### 2.2. Configurar DNS en name.com

1. **Inicia sesión en name.com**
2. **Ve a "My Domains" → Tu dominio → "Manage"**
3. **Haz clic en "DNS Records"**
4. **Añade estos registros**:

| Tipo | Host | Respuesta | TTL |
|------|------|-----------|-----|
| A    | @    | TU_IP_DEL_SERVIDOR | 300 |
| A    | www  | TU_IP_DEL_SERVIDOR | 300 |

**Ejemplo**:
```
A     @      123.45.67.89    300
A     www    123.45.67.89    300
```

5. **Guarda los cambios**

⏰ **Nota**: Los cambios DNS pueden tardar entre 5 minutos y 48 horas en propagarse (generalmente 15-30 min)

---

## 📦 PASO 3: Subir tu Código al Servidor

### Opción A: Usando Git (Recomendado)

```bash
# En el servidor
cd /opt
git clone https://github.com/TU_USUARIO/TU_REPO.git proyecto
cd proyecto
```

### Opción B: Usando SFTP/SCP

```bash
# En tu PC local (Windows)
# Usa WinSCP o ejecuta desde PowerShell:
scp -r E:\Usuarios\Fran\Documentos\ReposGit\ProyectoIntermodularGrupal root@TU_IP:/opt/proyecto
```

---

## 🔒 PASO 4: Configurar HTTPS con Certbot (SSL Gratis)

### 4.1. Crear docker-compose para producción

Voy a crear este archivo por ti en el siguiente paso.

### 4.2. Instalar Certbot en el servidor

```bash
# En el servidor
apt install certbot python3-certbot-nginx -y
```

### 4.3. Detener nginx temporal (si está corriendo)
```bash
docker-compose down
```

### 4.4. Obtener certificado SSL
```bash
certbot certonly --standalone -d tudominio.com -d www.tudominio.com
```

Sigue las instrucciones y proporciona tu email.

Los certificados se guardarán en:
- `/etc/letsencrypt/live/tudominio.com/fullchain.pem`
- `/etc/letsencrypt/live/tudominio.com/privkey.pem`

---

## 🐋 PASO 5: Desplegar con Docker

### 5.1. Iniciar la aplicación
```bash
cd /opt/proyecto
docker-compose -f docker-compose.prod.yml up -d --build
```

### 5.2. Verificar que está funcionando
```bash
docker-compose ps
docker-compose logs -f
```

### 5.3. Renovación automática de SSL
```bash
# Añadir cron job para renovación automática
crontab -e

# Añade esta línea:
0 3 * * * certbot renew --quiet --post-hook "docker-compose -f /opt/proyecto/docker-compose.prod.yml restart frontend"
```

---

## 🎉 PASO 6: ¡Verificar tu Sitio!

1. Abre tu navegador
2. Ve a: `https://tudominio.com`
3. Deberías ver tu landing page
4. El widget debe mostrar: **🟢 Conectado al servidor**

---

## 🔧 Comandos Útiles

```bash
# Ver logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Reiniciar servicios
docker-compose restart

# Actualizar código (si usas Git)
git pull origin main
docker-compose up -d --build

# Ver estado
docker-compose ps

# Detener todo
docker-compose down

# Liberar espacio
docker system prune -a
```

---

## 🐛 Troubleshooting

### El dominio no carga
```bash
# Verificar DNS
nslookup tudominio.com
ping tudominio.com

# Verificar firewall
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw enable
```

### Error de permisos en certificados
```bash
chmod 755 /etc/letsencrypt/live/
chmod 755 /etc/letsencrypt/archive/
```

### Contenedores no inician
```bash
docker-compose logs
# Revisa los errores específicos
```

---

## 💰 Costos Estimados (Mensual)

| Servicio | Precio |
|----------|--------|
| Dominio (name.com) | ~$12/año (~$1/mes) |
| VPS DigitalOcean | $6/mes |
| SSL (Let's Encrypt) | GRATIS |
| **TOTAL** | **~$7/mes** |

### Con GitHub Student Pack:
- DigitalOcean: $200 de crédito = **GRATIS por ~33 meses**
- Dominio: A veces incluye 1 año gratis

---

## 📚 Recursos Adicionales

- [GitHub Student Pack](https://education.github.com/pack)
- [DigitalOcean Docs](https://docs.digitalocean.com/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Docker Compose Docs](https://docs.docker.com/compose/)

---

## ⚠️ IMPORTANTE - Seguridad

Antes de desplegar en producción:

1. **No expongas puertos innecesarios** (backend debería estar solo interno)
2. **Usa variables de entorno para secretos**
3. **Configura firewall** (ufw)
4. **Habilita actualizaciones automáticas**
5. **Backups regulares** de tu base de datos

```bash
# Configuración básica de seguridad
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

