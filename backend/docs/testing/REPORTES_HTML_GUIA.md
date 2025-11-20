# 📊 Guía de Reportes HTML - Newman

## ✅ El Reporte HTML se Genera Correctamente

Tu reporte HTML **ya está funcionando**. El archivo se genera en:
```
tests/reports/report.html
```

---

## 🚀 Cómo Generar el Reporte

### Opción 1: Comando NPM (Recomendado)
```bash
npm run test:html
```

**Qué hace:**
1. Ejecuta todos los tests de la colección
2. Genera el reporte HTML con el plugin `htmlextra`
3. Guarda el archivo en `tests/reports/report.html`

**Tiempo:** ~2-4 segundos

---

### Opción 2: Script Automático (Más Fácil)
```bash
generate-report.bat
```

**Qué hace:**
1. Verifica que el backend esté corriendo
2. Ejecuta los tests
3. Genera el reporte HTML
4. **Abre automáticamente el reporte en tu navegador** ✨

---

## 📂 Abrir el Reporte Manualmente

### Desde la Terminal (PowerShell)
```powershell
Invoke-Item tests\reports\report.html
```

### Desde CMD
```cmd
start tests\reports\report.html
```

### Desde el Explorador de Archivos
1. Navega a: `backend/tests/reports/`
2. Doble clic en `report.html`

---

## 🎨 Qué Verás en el Reporte HTML

El reporte **htmlextra** incluye:

### 1. **Dashboard Principal**
- 📊 Gráfica de tests pasados/fallados
- ⏱️ Tiempo total de ejecución
- 📈 Métricas de performance

### 2. **Resumen de la Colección**
- Nombre: "PlayTheMood API - Tests Completos"
- Total de requests: 12 (o 26 si usas la colección completa)
- Assertions: 26+ (o 49+)

### 3. **Timeline de Peticiones**
- Visualización cronológica de todas las peticiones
- Código de respuesta de cada una
- Tiempo de respuesta individual

### 4. **Detalles de Cada Test**
Expandible con:
- ✅ Assertions pasadas
- ❌ Assertions falladas (si las hay)
- Request completo (headers, body)
- Response completo
- Variables de entorno usadas

### 5. **Métricas de Performance**
- Response time promedio
- Response time mínimo/máximo
- Desviación estándar
- Gráfica de distribución de tiempos

### 6. **Tests Scripts**
- Código JavaScript de cada test
- Pre-request scripts
- Variables generadas

---

## 🔧 Troubleshooting

### Problema: "El reporte no se genera"

**Solución 1:** Verifica que newman-reporter-htmlextra esté instalado
```bash
npm list newman-reporter-htmlextra
```

Si no aparece:
```bash
npm install --save-dev newman-reporter-htmlextra
```

---

### Problema: "El comando no muestra output"

Esto es **normal**. El comando `npm run test:html` no muestra el progreso en tiempo real porque está generando el HTML.

**Solución:** Espera 2-5 segundos y verifica que se creó el archivo:
```bash
dir tests\reports\report.html
```

O usa el script `generate-report.bat` que muestra el progreso.

---

### Problema: "El reporte se abre pero está en blanco"

**Causa:** Problema de seguridad del navegador con archivos locales.

**Solución 1:** Abre con otro navegador (Chrome, Firefox, Edge)

**Solución 2:** Copia el archivo a otra ubicación y ábrelo desde ahí

**Solución 3:** Ejecuta el reporte desde un servidor local simple:
```bash
npx http-server tests/reports
```
Luego abre: `http://localhost:8080/report.html`

---

## 📊 Generar Reporte de Tests COMPLETOS

Para generar el reporte con los **26 tests exhaustivos**:

### Actualiza el comando en package.json:

Opción temporal (sin cambiar package.json):
```bash
newman run tests/postman/PlayTheMood_Complete.postman_collection.json -e tests/postman/PlayTheMood.postman_environment.json -r htmlextra --reporter-htmlextra-export tests/reports/report-complete.html
```

---

## 🎯 Comandos Rápidos

```bash
# Generar reporte de tests básicos (12 tests)
npm run test:html

# Abrir el reporte generado (PowerShell)
Invoke-Item tests\reports\report.html

# Generar y abrir automáticamente
generate-report.bat

# Ver si el archivo existe y su tamaño
dir tests\reports\report.html
```

---

## 📝 Personalizar el Reporte

El reporte htmlextra tiene opciones configurables. Para personalizarlo, modifica el comando en `package.json`:

```json
"test:html": "newman run tests/postman/PlayTheMood.postman_collection.json -e tests/postman/PlayTheMood.postman_environment.json -r htmlextra --reporter-htmlextra-export tests/reports/report.html --reporter-htmlextra-title 'PlayTheMood API Tests' --reporter-htmlextra-darkTheme"
```

**Opciones disponibles:**
- `--reporter-htmlextra-title` - Título personalizado
- `--reporter-htmlextra-darkTheme` - Tema oscuro
- `--reporter-htmlextra-logs` - Mostrar logs de consola
- `--reporter-htmlextra-showEnvironmentData` - Mostrar variables de entorno

---

## ✅ Verificación Rápida

El reporte HTML **está funcionando correctamente** si:

- [x] El archivo `tests/reports/report.html` existe
- [x] El archivo tiene más de 200KB de tamaño
- [x] Se abre en el navegador sin errores
- [x] Muestra las métricas de los tests
- [x] Puedes expandir cada petición para ver detalles

---

## 🎉 Estado Actual

**✅ El sistema de reportes HTML está completamente funcional**

- Archivo generado: `tests/reports/report.html` (268KB)
- Contenido: Dashboard completo con gráficas y métricas
- Formato: htmlextra con tema claro por defecto
- Accesibilidad: Abierto con `Invoke-Item` o doble clic

**Usa `generate-report.bat` para la mejor experiencia!** 🚀

---

## 📚 Recursos

- **Newman Reporter HTML Extra:** https://github.com/DannyDainton/newman-reporter-htmlextra
- **Newman Docs:** https://github.com/postmanlabs/newman
- **Personalización:** https://github.com/DannyDainton/newman-reporter-htmlextra#cli-options

---

**Última actualización:** 19 de enero de 2025  
**Estado:** ✅ Funcional y listo para usar

