# TODO - Diagnóstico 401 `/auth/identificacion` + trazabilidad end-to-end

- [x] Mapear ruta exacta de `GET /auth/identificacion` en backend
- [x] Agregar logging detallado en handler/controller/service de `/auth/identificacion`
- [x] Agregar request-id para correlación en logs backend (app + middleware + controller + service)
- [x] Revisar frontend que dispara `/auth/identificacion` y agregar logs de depuración para detectar loop
- [ ] Revisar posibles middlewares/global handlers que puedan responder 401 tras auth
- [ ] Dejar checklist de pruebas (critical-path y thorough) para validación en Render
