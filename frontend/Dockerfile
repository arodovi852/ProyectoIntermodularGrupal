# frontend/Dockerfile
FROM node:22 AS build
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto de archivos
COPY . .

# Construir la aplicación
# En producción, el frontend usa rutas relativas y nginx hace el proxy al backend
RUN npm run build

# Etapa de producción con nginx
FROM nginx:stable-alpine

# Instalar certificados CA para permitir proxy a backends HTTPS
RUN apk add --no-cache ca-certificates && update-ca-certificates || true

# Copiar archivos construidos
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar plantilla de configuración y entrypoint para reemplazar BACKEND_HOST en tiempo de ejecución
COPY default.conf.template /app/default.conf.template
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 80

# Usar entrypoint que genera la configuración final y arranca nginx
ENTRYPOINT ["/app/docker-entrypoint.sh"]
