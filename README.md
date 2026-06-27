# Deportal Frontend

Frontend Angular para gestion de canchas, reservas, cancelaciones y reportes de Deportal.

## Requisitos

- Node.js `22` o superior compatible con Angular 22.
- Backend Deportal disponible en `http://localhost:8080/api`.

## Configuracion de API

La URL del backend se define en `public/assets/config/app-config.json`:

```json
{
  "apiBaseUrl": "http://localhost:8080/api"
}
```

## Desarrollo local

Instalar dependencias:

```bash
npm ci
```

Iniciar servidor local:

```bash
npm start
```

Abrir `http://localhost:4200`.

## Build

Compilar la aplicacion:

```bash
npm run build
```

## Pruebas

Ejecutar pruebas una sola vez:

```bash
npm test -- --watch=false
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

## Usuario inicial

Si el backend esta usando los datos iniciales:

- Email: `admin@deportal.local`
- Password: `Deportal123`
