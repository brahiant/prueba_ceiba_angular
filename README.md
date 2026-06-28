# Deportal Frontend

Frontend Angular para gestion de canchas, reservas, cancelaciones y reportes de Deportal.

## Requisitos

- Node.js `22` o superior compatible con Angular 22.
- npm `10` o superior.
- Backend Deportal disponible en `http://localhost:8080/api`.

Verificar versiones:

```bash
node --version
npm --version
```

Si usas `nvm`, este proyecto incluye `.nvmrc`:

```bash
nvm use
```

## Configuracion de API

La URL del backend se define en `public/assets/config/app-config.json`:

```json
{
  "apiBaseUrl": "http://localhost:8080/api"
}
```

## Desarrollo local

1. Instalar dependencias:

```bash
npm ci
```

2. Verificar que el backend este levantado:

```bash
curl -f http://localhost:8080/api/health
```

3. Iniciar servidor Angular:

```bash
npm start
```

4. Abrir la aplicacion:

```txt
http://localhost:4200
```

La aplicacion usa hash routing, por eso las rutas se ven asi:

```txt
http://localhost:4200/#/login
http://localhost:4200/#/dashboard
```

## Ejecucion desde cero

Si acabas de clonar el repositorio:

```bash
npm ci
npm start
```

Luego abre:

```txt
http://localhost:4200/#/login
```

## Credenciales de prueba

Si el backend esta usando los datos iniciales:

| Campo | Valor |
|---|---|
| Email | `admin@deportal.local` |
| Password | `Deportal123` |

Tambien puedes crear usuarios desde:

```txt
http://localhost:4200/#/register
```

La contrasena de usuarios nuevos puede ser distinta, siempre que cumpla las validaciones del backend.

## Scripts disponibles

| Comando | Descripcion |
|---|---|
| `npm start` | Levanta Angular en modo desarrollo |
| `npm run build` | Compila la aplicacion en `dist/` |
| `npm test -- --watch=false` | Ejecuta pruebas una sola vez |
| `npm run watch` | Compila en modo watch |

## Build

Compilar la aplicacion:

```bash
npm run build
```

El resultado queda en:

```txt
dist/deportal
```

## Pruebas

Ejecutar pruebas una sola vez:

```bash
npm test -- --watch=false
```

## Flujo recomendado de prueba manual

1. Levantar backend en `http://localhost:8080`.
2. Levantar frontend con `npm start`.
3. Entrar a `/#/login`.
4. Iniciar sesion con el usuario inicial o registrar uno nuevo.
5. Probar las rutas:
   - `/#/courts`
   - `/#/reservations`
   - `/#/reports`
6. Verificar en DevTools que las peticiones protegidas envien:

```txt
Authorization: Bearer <token>
```

## Integracion continua

El repositorio incluye GitHub Actions en `.github/workflows/frontend-ci.yml`. El workflow se ejecuta en `push` y `pull_request` para instalar dependencias con `npm ci`, correr pruebas y compilar el frontend.

## Rutas principales

- Login: `/#/login`
- Registro: `/#/register`
- Dashboard: `/#/dashboard`
- Canchas: `/#/courts`
- Reservas: `/#/reservations`
- Reportes: `/#/reports`

## Solucion de problemas

| Problema | Causa probable | Solucion |
|---|---|---|
| Angular indica que Node no es compatible | Version de Node menor a la requerida | Ejecutar `nvm use` o instalar Node 22 |
| Login falla | Backend apagado o credenciales incorrectas | Validar `/api/health` y usar credenciales correctas |
| Error CORS | Backend no permite `http://localhost:4200` | Revisar `APP_CORS_ALLOWED_ORIGINS` en backend |
| No cargan canchas/reservas/reportes | Token ausente o expirado | Cerrar sesion e iniciar sesion de nuevo |
| Puerto 4200 ocupado | Otro proceso usa el puerto | Ejecutar `npm start -- --port 4300` |
| Datos manuales desaparecen | Se borro el volumen/base H2 backend | Registrar usuarios/datos nuevamente |
