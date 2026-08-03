# TODO - Logging detallado de registro auth / Keycloak

- [x] Revisar `server/src/services/auth.service.js` y `server/src/controllers/auth.controller.js`
- [x] Agregar logs antes/después de cada llamada a Keycloak:
  - [x] getAdminToken
  - [x] creación de usuario
  - [x] obtención de rol
  - [x] asignación de rol
- [x] Agregar logs detallados en todos los catch:
  - [x] error.message
  - [x] error.stack
  - [x] error.response?.status
  - [x] error.response?.data
- [x] Validar `response.headers.location` antes de `split('/')` y loguear error claro si falta
- [x] Agregar logs en `AuthController` para catch de `registrarUsuario` y `obtenerPerfil`
- [x] Verificar consistencia final sin cambios de lógica de negocio
- [x] Reportar archivos modificados y resumen de cambios
