# Sweet Medical - Plataforma de Seguro de Salud

Este repositorio corresponde al **Trabajo Práctico Cuatrimestral** (1C - 2026) de la materia **Desarrollo de Software**.

### Información del Proyecto

- **Materia:** Desarrollo de Software
- **Proyecto:** Sweet Medical
- **Grupo:** 6

## Deploy en producción (Render)

Arquitectura objetivo de despliegue:

- **Frontend React** → Render (**Static Site**)
- **Backend Node/Express** → Render (**Web Service**)
- **Base de datos** → **MongoDB Atlas**
- **Keycloak** → Render (contenedor) utilizando **PostgreSQL**

---

### 1) Frontend (Render Static Site)

Build/Start:

- Build Command: `npm install && npm run build`
- Publish Directory: `build`

Variables de entorno productivas:

```env
REACT_APP_API_URL=https://<tu-backend>.onrender.com
REACT_APP_KEYCLOAK_URL=https://<tu-keycloak>.onrender.com
REACT_APP_KEYCLOAK_REALM=<tu_realm>
REACT_APP_KEYCLOAK_CLIENT_ID=<tu_client_id_frontend>
```

Notas:

- El frontend usa token OAuth/OIDC de Keycloak.
- El token se guarda en `localStorage` y se envía como `Authorization: Bearer <token>` en requests API.
- No usar valores `localhost` en producción.

---

### 2) Backend (Render Web Service)

Build/Start:

- Build Command: `npm install`
- Start Command: `npm start`

Variables de entorno productivas:

```env
PORT=10000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
MONGODB_DB_NAME=<nombre_db>

CORS_ORIGINS=https://<tu-frontend>.onrender.com

KEYCLOAK_BASE_URL=https://<tu-keycloak>.onrender.com
KEYCLOAK_REALM=<tu_realm>
KEYCLOAK_ADMIN_CLIENT_ID=<admin_client_id>
KEYCLOAK_ADMIN_USERNAME=<admin_user>
KEYCLOAK_ADMIN_PASSWORD=<admin_password>

# Recomendadas para validación JWT
KEYCLOAK_ISSUER=https://<tu-keycloak>.onrender.com/realms/<tu_realm>
KEYCLOAK_JWKS_URL=https://<tu-keycloak>.onrender.com/realms/<tu_realm>/protocol/openid-connect/certs
KEYCLOAK_AUDIENCE=<audiencia_del_token>
```

Notas:

- El backend soporta `PORT` (Render) y fallback local.
- `CORS_ORIGINS` acepta múltiples dominios separados por coma.
- Evitar hardcodear dominios en código.

---

### 3) Keycloak en Render + PostgreSQL

Para Keycloak desplegado en Render (contenedor), configurar:

- URL pública de Keycloak (ej. `https://<tu-keycloak>.onrender.com`)
- Base PostgreSQL administrada (Render PostgreSQL u otra)

Variables típicas del contenedor Keycloak (referenciales, dependen de imagen/versionado):

```env
KC_DB=postgres
KC_DB_URL=jdbc:postgresql://<host>:5432/<db>
KC_DB_USERNAME=<db_user>
KC_DB_PASSWORD=<db_password>

KEYCLOAK_ADMIN=<admin_user>
KEYCLOAK_ADMIN_PASSWORD=<admin_password>

KC_HOSTNAME=<tu-keycloak>.onrender.com
KC_PROXY=edge
KC_HTTP_ENABLED=true
```

Configuración de Realm/Client requerida:

- Realm: `<tu_realm>`
- Client frontend:
  - Access Type / Client authentication según estrategia del proyecto
  - Redirect URIs: `https://<tu-frontend>.onrender.com/*`
  - Web Origins: `https://<tu-frontend>.onrender.com`
  - Direct Access Grants según necesidad del flujo implementado
- Roles de realm: `medico`, `paciente`

---

### 4) MongoDB Atlas

Requisitos:

- Crear cluster Atlas
- Crear usuario de base de datos con permisos mínimos necesarios
- Configurar Network Access (allowlist) para Render

Variables usadas por backend:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>
MONGODB_DB_NAME=<nombre_db>
```

Notas:

- Preferir URI `mongodb+srv`.
- No exponer credenciales en repositorio.
- Validar que el usuario tenga permisos sobre la DB objetivo.

---

### 5) Seguridad recomendada de despliegue

- No commitear `.env` reales.
- No usar credenciales hardcodeadas.
- Rotar secretos si se exponen.
- Definir variables en Render Environment.
- Limitar CORS al dominio real del frontend.
- Verificar JWT en backend contra issuer/JWKS de Keycloak.

---

## Desarrollo local (opcional)

Si necesitás correr localmente para desarrollo:

1. Copiar `client/.env.example` a `client/.env`
2. Copiar `server/.env.example` a `server/.env`
3. Levantar backend:
   ```bash
   cd server
   npm install
   npm run dev
   ```
4. Levantar frontend:
   ```bash
   cd client
   npm install
   npm start
   ```

Para entorno local también podés correr Keycloak localmente, pero **esto no es parte del deploy productivo**.
