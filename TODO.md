# Plan de arreglo de imports (case-sensitive)

- [x] 1. Auditar imports relativos en `server/src` y detectar inconsistencias de mayúsculas/minúsculas.
- [x] 2. Corregir imports conflictivos para que coincidan exactamente con nombres reales de archivos.
- [ ] 3. Verificar estáticamente que no queden rutas conflictivas.
- [ ] 4. Ejecutar backend para validar que no aparezca `ERR_MODULE_NOT_FOUND`.
- [ ] 5. Documentar cambios y pasos de validación para redeploy en Render.
