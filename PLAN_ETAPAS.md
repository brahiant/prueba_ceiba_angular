# Plan de Etapas - Frontend Angular

Este documento define el proceso incremental para construir y validar el frontend de Deportal. La prioridad es que funcione localmente y que quede preparado para hosting estatico futuro en AWS S3/CloudFront sin acoplar URLs directas.

## Objetivo

Construir una aplicacion Angular moderna, modular y mantenible que consuma el backend Spring Boot, maneje autenticacion JWT sin cookies y permita operar los flujos principales de la prueba tecnica.

## Decisiones Tecnicas

- Angular ultima version estable.
- Ejecucion local por consola con `npm start` o `ng serve`.
- No ejecutar frontend en Docker para evitar consumo extra de memoria.
- Rutas compatibles con hosting estatico mediante hash routing.
- Configuracion de API por archivo externo en `assets/config/app-config.json`.
- JWT enviado por header `Authorization: Bearer <token>`.
- Sin cookies por compatibilidad local y futura separacion de dominios.
- Formularios reactivos con validaciones en cliente.
- Separacion por features: auth, users, courts, products, reservations, reports.

## Estructura Objetivo

```txt
src/app/
├── core/
│   ├── api/
│   ├── auth/
│   ├── config/
│   ├── guards/
│   ├── interceptors/
│   └── models/
├── shared/
│   ├── components/
│   ├── pipes/
│   └── validators/
└── features/
    ├── auth/
    ├── users/
    ├── courts/
    ├── products/
    ├── reservations/
    └── reports/
```

## Etapa 1 - Base Angular Local

Responsabilidades:

- Crear proyecto Angular.
- Configurar estructura base por carpetas.
- Configurar routing inicial.
- Configurar hash routing para compatibilidad futura con S3.
- Crear layout base con navegacion.
- Crear archivo `assets/config/app-config.json`.

Criterios de aceptacion:

- La app inicia con `npm start`.
- Se puede navegar entre rutas base.
- La URL base del backend no esta quemada en servicios.
- Existe una configuracion local con `http://localhost:8080/api`.

Validaciones:

- Ejecutar `npm start`.
- Verificar carga en `http://localhost:4200`.
- Refrescar una ruta hash y confirmar que no falla.

## Etapa 2 - Cliente HTTP Y Modelos

Responsabilidades:

- Crear modelos TypeScript para requests y responses.
- Crear servicio base para cargar configuracion.
- Crear servicios API para auth, courts, products, reservations y reports.
- Centralizar manejo basico de errores HTTP.

Criterios de aceptacion:

- Los servicios no usan URLs absolutas hardcodeadas.
- Los modelos no incluyen campos sensibles innecesarios.
- El codigo queda listo para consumir backend local.

Validaciones:

- Compilar Angular.
- Revisar que todos los servicios usen `apiBaseUrl`.

## Etapa 3 - Auth Sin Cookies

Responsabilidades:

- Crear pantallas de login y registro.
- Guardar JWT en storage del navegador.
- Crear `AuthInterceptor` para enviar `Authorization: Bearer <token>`.
- Crear `AuthGuard` para proteger rutas.
- Crear cierre de sesion local.

Criterios de aceptacion:

- Login guarda token.
- Requests protegidos envian header Authorization.
- Logout limpia token y redirige a login.
- No se usan cookies.

Validaciones:

- Probar login contra backend local.
- Inspeccionar request en navegador y confirmar header Authorization.

## Etapa 4 - Canchas

Responsabilidades:

- Crear listado de canchas.
- Crear formulario de registro de cancha.
- Validar nombre, tipo, capacidad, horario y tarifa.
- Mostrar mensajes de error del backend.

Criterios de aceptacion:

- Se listan canchas precargadas.
- Se puede registrar una cancha valida.
- Se muestran errores de validacion.

Validaciones:

- Registrar cancha valida.
- Intentar nombre duplicado.
- Intentar capacidad fuera de rango.
- Intentar tarifa menor a 5.

## Etapa 5 - Reservas

Responsabilidades:

- Crear listado de reservas.
- Crear formulario de reserva.
- Seleccionar cancha existente.
- Validar fecha, hora, duracion y tipo de cliente.
- Mostrar total calculado por backend.

Criterios de aceptacion:

- Se puede crear una reserva valida.
- Se muestra conflicto de horario cuando aplique.
- Se visualiza estado `CONFIRMED`, `WAITLISTED` o `CANCELLED`.

Validaciones:

- Crear reserva valida.
- Intentar reserva en el pasado.
- Intentar solapamiento.
- Intentar reserva sin hora de limpieza.

## Etapa 6 - Cancelaciones Y Reembolsos

Responsabilidades:

- Permitir cancelar reservas futuras.
- Mostrar monto de reembolso calculado por backend.
- Actualizar estado de reserva despues de cancelar.

Criterios de aceptacion:

- Se puede cancelar una reserva futura.
- No se puede cancelar una reserva ocurrida.
- Se visualiza reembolso.

Validaciones:

- Cancelar reserva con mas de 24 horas.
- Cancelar reserva entre 2 y 24 horas.
- Cancelar reserva con menos de 2 horas.

## Etapa 7 - Reportes

Responsabilidades:

- Crear pantalla de reporte de utilizacion.
- Filtrar por rango de fechas.
- Mostrar reservas totales, horas reservadas, horas disponibles, ingresos y ocupacion.

Criterios de aceptacion:

- El reporte consulta backend por fechas.
- Los datos se muestran en tabla clara.
- Se valida que fecha inicial no sea posterior a fecha final.

Validaciones:

- Consultar un rango con datos.
- Consultar un rango sin datos.

## Etapa 8 - Preparacion Futura S3

Responsabilidades:

- Mantener rutas hash.
- Mantener API configurable por archivo externo.
- Documentar como cambiar `app-config.json` para AWS.
- Evitar dependencias de runtime que requieran servidor Node.

Criterios de aceptacion:

- El build genera archivos estaticos.
- La API se puede cambiar sin recompilar si se reemplaza `app-config.json`.

Validaciones:

- Ejecutar build de produccion.
- Revisar que no existan URLs directas del backend en codigo fuente.

## Prioridades

- Alta: auth, canchas, reservas, cancelacion, reportes.
- Media: productos/servicios, mejoras visuales, Swagger estatico futuro.
- Baja: despliegue real en AWS, CI/CD, CloudFront.

## Checklist Final Frontend

- App ejecuta localmente.
- Login y registro funcionan.
- JWT se envia por header.
- No se usan cookies.
- CORS funciona contra backend local.
- CRUD de canchas operativo.
- Reservas operativas con errores claros.
- Cancelacion muestra reembolso.
- Reporte de utilizacion visible.
- README documenta ejecucion local.
- Codigo queda preparado para S3 mediante hash routing y config externa.
