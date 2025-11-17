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

# Copiar archivos construidos
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]