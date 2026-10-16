# Backend API — Plataforma de Captación y Gestión de Leads

API REST modular desarrollada en **Node.js** con **Express**, **Sequelize ORM**, **PostgreSQL** y **ES Modules**. Diseñada bajo principios de arquitectura limpia, seguridad por capas, validación estricta y trazabilidad de eventos comerciales.

---

## 1. Arquitectura y Estructura de Directorios

```text
backend/
├── src/
│   ├── config/             # Configuración de entorno, base de datos y seguridad
│   ├── database/           # Conexión, migraciones reproducibles y seeders
│   │   ├── migrations/     # Migraciones versionadas (Umzug + Sequelize)
│   │   └── seeders/        # Carga inicial idempotente de servicios
│   ├── models/             # Modelos Sequelize y definiciones relacionales
│   ├── repositories/       # Abstracción y consultas de acceso a datos
│   ├── services/           # Lógica y reglas de negocio del dominio
│   ├── controllers/        # Controladores y respuestas HTTP estandarizadas
│   ├── routes/             # Enrutamiento modular con prefijo /api/v1
│   ├── middlewares/        # Autenticación JWT, control de roles, Joi, Boom y Rate Limit
│   ├── validators/         # Esquemas Joi para params, query y body
│   ├── utils/              # Normalización telefónica, JWT, CSV y constantes
│   ├── docs/               # Especificación OpenAPI / Swagger
│   └── app.js              # Configuración principal de Express
├── tests/                  # Pruebas automatizadas unitarias y de integración
├── .env.example            # Plantilla de variables de entorno sin secretos
├── package.json            # Dependencias y scripts de gestión
├── server.js               # Punto de entrada y graceful shutdown
└── README.md
```

---

## 2. Requisitos Previos

- **Node.js**: v18.0.0 o superior (probado en v22+).
- **PostgreSQL**: v13 o superior.
- **npm** o gestor compatible.

---

## 3. Configuración de Variables de Entorno

Copiar el archivo de plantilla `.env.example` a `.env`:

```bash
cp .env.example .env
```

Editar `.env` con las credenciales y parámetros de tu entorno:

| Variable | Descripción | Valor por Defecto / Ejemplo |
| :--- | :--- | :--- |
| `NODE_ENV` | Entorno de ejecución (`development`, `production`, `test`) | `development` |
| `PORT` | Puerto de escucha del servidor HTTP | `4000` |
| `FRONTEND_URL` | URL de la aplicación cliente frontend | `http://localhost:5173` |
| `CORS_ORIGINS` | Orígenes web autorizados separados por coma | `http://localhost:5173,http://127.0.0.1:5173` |
| `DATABASE_URL` | URL de conexión pública a PostgreSQL | `postgresql://usuario:pass@host:5432/db` |
| `DATABASE_SSL` | Habilitar conexión SSL con el proveedor | `false` (o `true` para Supabase/Neon/Render/AWS) |
| `DATABASE_SSL_REJECT_UNAUTHORIZED` | Validación estricta de certificados SSL | `false` (o `true` si el certificado es verificado) |
| `JWT_ACCESS_SECRET` | Clave secreta para Access Tokens | *(Generar cadena aleatoria de 64+ chars)* |
| `JWT_REFRESH_SECRET` | Clave secreta para Refresh Tokens | *(Generar cadena aleatoria de 64+ chars)* |
| `ACCESS_TOKEN_EXPIRES_IN` | Tiempo de vida del token de acceso | `15m` |
| `REFRESH_TOKEN_EXPIRES_IN` | Tiempo de vida del token de refresco | `7d` |
| `ADMIN_INITIAL_NAME` | Nombre del primer usuario administrador | `Administrador Principal` |
| `ADMIN_INITIAL_EMAIL` | Correo del primer administrador | `admin@serviciostecnologicos.com` |
| `ADMIN_INITIAL_PASSWORD` | Contraseña inicial segura del administrador | `CambiarPasswordSegura123!` |
| `RATE_LIMIT_WINDOW_MS` | Ventana de tiempo para limitador de tasa (ms) | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Máximo de peticiones permitidas por ventana | `100` |

> [!IMPORTANT]
> **Nunca incluyas contraseñas reales ni claves secretas en el control de versiones.**

---

## 4. Comandos Disponibles

### Desarrollo y Ejecución
- Iniciar en desarrollo con recarga automática:
  ```bash
  npm run dev
  ```
- Iniciar en producción:
  ```bash
  npm start
  ```
- Ejecutar suite de pruebas automatizadas:
  ```bash
  npm test
  ```

### Gestión de Base de Datos y Migraciones (Umzug)
- Ejecutar migraciones pendientes:
  ```bash
  npm run db:migrate
  ```
- Ver estado de migraciones (ejecutadas y pendientes):
  ```bash
  npm run db:migrate:status
  ```
- Revertir última migración aplicada:
  ```bash
  npm run db:migrate:undo
  ```
- Ejecutar seeders iniciales (carga de catálogo de servicios):
  ```bash
  npm run db:seed
  ```
- Crear o sincronizar usuario administrador inicial:
  ```bash
  npm run db:admin
  ```

---

## 5. Endpoints de la API REST (`/api/v1`)

### Rutas Públicas
- `GET /api/v1/health`: Estado de vida del proceso (Liveness).
- `GET /api/v1/health/ready`: Estado de conexión con PostgreSQL (Readiness).
- `GET /api/v1/services`: Listado de los 5 servicios tecnológicos activos.
- `POST /api/v1/leads`: Registro de nuevo lead desde la landing page (limitado por rate limiter, valida con Joi, asigna estado `NEW` y guarda servicios asociados y auditoría en una transacción).

### Autenticación Administrativa
- `POST /api/v1/auth/login`: Autentica usuario, entrega access token en cuerpo JSON y refresh token en cookie `HttpOnly` y `Secure`.
- `POST /api/v1/auth/refresh`: Renueva access token a partir del refresh token.
- `POST /api/v1/auth/logout`: Invalida sesión y limpia cookies seguras.
- `GET /api/v1/auth/me`: Retorna los datos del usuario en sesión actual.

### Gestión Administrativa de Leads (`/api/v1/admin`)
- `GET /api/v1/admin/leads`: Listado paginado con búsqueda por nombre/teléfono y filtros por estado, servicio, localidad, tipo de cliente y fechas.
- `GET /api/v1/admin/leads/export`: Exportación filtrada en formato CSV.
- `GET /api/v1/admin/leads/:id`: Detalle completo del lead con servicios, notas, presupuesto y línea de tiempo de actividades.
- `PATCH /api/v1/admin/leads/:id`: Actualización de datos de contacto o ubicación.
- `PATCH /api/v1/admin/leads/:id/status`: Transición entre estados comerciales (`NEW`, `CONTACTED`, `QUALIFIED`, `VISIT_SCHEDULED`, `QUOTE_SENT`, `WON`, `LOST`).
- `PATCH /api/v1/admin/leads/:id/assignment`: Asignación o reasignación a un responsable comercial.
- `POST /api/v1/admin/leads/:id/notes`: Agrega una nota interna confidencial.
- `GET /api/v1/admin/leads/:id/notes`: Consulta las notas internas del lead.
- `POST /api/v1/admin/leads/:id/activities`: Registra un contacto, visita o evento comercial.
- `GET /api/v1/admin/leads/:id/activities`: Consulta el historial de auditoría del lead.
- `GET /api/v1/admin/dashboard`: Métricas comerciales agregadas (totales, por estado, últimos 7/30 días y distribución por servicio).

### Gestión de Usuarios y Presupuestos
- `GET /api/v1/admin/users`: Listado de usuarios administrativos (Solo rol `ADMIN`).
- `POST /api/v1/admin/users`: Crear nuevo operador comercial o admin (Solo rol `ADMIN`).
- `PATCH /api/v1/admin/users/:id`: Modificar estado, rol o contraseña (Solo rol `ADMIN`).
- `GET /api/v1/admin/quotes`: Listado de presupuestos.
- `POST /api/v1/admin/quotes`: Generar presupuesto asociado a un lead.
- `PATCH /api/v1/admin/quotes/:id`: Actualizar monto o estado del presupuesto.

### Documentación Interactiva
- Swagger UI disponible en: `http://localhost:4000/api/docs`

---

## 6. Despliegue en Producción

1. Configurar las variables en la plataforma de hosting (Render, Railway, Fly.io, VPS o AWS).
2. Asegurar que `DATABASE_URL` apunta a PostgreSQL y que `DATABASE_SSL=true` si el proveedor lo requiere.
3. Ejecutar comando de migración: `npm run db:migrate`
4. Ejecutar seeder de servicios: `npm run db:seed`
5. Crear administrador: `npm run db:admin`
6. Iniciar el servicio: `npm start`
