# Gestión de Productos - API REST

Aplicación web para la gestión de productos con autenticación JWT, CRUD sobre MongoDB y despliegue en Vercel.

## Requisitos

- Node.js 18+
- MongoDB (local o [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Cuenta en [Vercel](https://vercel.com) y [GitHub](https://github.com) (para CI/CD)

## Instalación

```bash
npm install
```

Copia las variables de entorno y configúralas:

```bash
cp .env.example .env
```

Edita `.env` y define al menos:

- `MONGODB_URI`: URI de tu base MongoDB
- `JWT_SECRET`: secreto para firmar los tokens (usa uno seguro en producción)

## Uso local

```bash
npm run dev
```

El servidor quedará en `http://localhost:3000`.

- **Login (vista estática):** http://localhost:3000/login  
- **API salud:** GET http://localhost:3000/api/health  
- **Registro:** POST http://localhost:3000/api/auth/register  
- **Login API:** POST http://localhost:3000/api/auth/login  
- **Productos (requieren `Authorization: Bearer <token>`):**  
  - GET/POST http://localhost:3000/api/products  
  - GET/PUT/DELETE http://localhost:3000/api/products/:id  

## Pruebas unitarias

```bash
npm test
```

Las pruebas usan Jest y mockean MongoDB y JWT. No es necesario tener MongoDB en ejecución. Las pruebas se generaron con ayuda de IA (p. ej. Copilot) y se ajustaron manualmente para cubrir todos los casos requeridos: controladores (auth, productos), middleware JWT y rutas con supertest (éxito, 400, 401, 404). Ver `docs/VERIFICACION_REQUERIMIENTOS.md` para el detalle de cumplimiento.

## Despliegue en Vercel

1. Sube el proyecto a un repositorio en GitHub.
2. En [Vercel](https://vercel.com), importa el repositorio y despliega.
3. En el proyecto de Vercel, configura las variables de entorno:  
   `MONGODB_URI`, `JWT_SECRET` y opcionalmente `JWT_EXPIRES_IN`.

La aplicación se sirve desde la URL que te asigne Vercel. Los estáticos de login están en `public/login/` y la API en la misma base URL.

## CI/CD con GitHub Actions

El workflow en `.github/workflows/ci-cd.yml`:

1. **En cada push y PR:** ejecuta las pruebas (`npm test`).
2. **Solo en `main` o `master`:** si las pruebas pasan, puede desplegar en Vercel.

Para habilitar el despliegue automático desde GitHub:

1. Crea un [token de Vercel](https://vercel.com/account/tokens).
2. En tu repositorio GitHub: **Settings → Secrets and variables → Actions** y añade:
   - `VERCEL_TOKEN`: el token de Vercel
   - `VERCEL_ORG_ID`: ID de tu equipo/org en Vercel
   - `VERCEL_PROJECT_ID`: ID del proyecto en Vercel  

(Opcional) Si solo quieres CI (pruebas en cada push/PR), puedes eliminar o desactivar el job `deploy` en el workflow.

## Documentación de requerimientos

Los requerimientos funcionales y no funcionales están en [docs/REQUERIMIENTOS.md](docs/REQUERIMIENTOS.md).

## Estructura del proyecto

```
├── src/
│   ├── app.js              # Entrada Express
│   ├── config/db.js        # Conexión MongoDB
│   ├── controllers/        # authController, productController
│   ├── middlewares/auth.js # Protección JWT
│   ├── models/             # User, Product (Mongoose)
│   ├── routes/             # authRoutes, productRoutes
│   └── public/login/       # Copia local de vistas (ver public/)
├── public/login/           # Vistas HTML login (Vercel y local)
├── __tests__/              # Pruebas Jest
├── docs/REQUERIMIENTOS.md
├── .github/workflows/ci-cd.yml
├── vercel.json
└── package.json
```
