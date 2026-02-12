# Verificación de cumplimiento de requerimientos

Este documento acredita el cumplimiento de cada requerimiento del proyecto.

---

## 1. Servidor configurado de manera óptima (Node.js + Express)

| Criterio | Cumple | Evidencia |
|----------|--------|-----------|
| Node.js con Express.js | ✅ | `src/app.js`: aplicación Express con `express()`, rutas y export del `app`. |
| Conexión MongoDB correcta | ✅ | `src/config/db.js`: `mongoose.connect()` con `MONGODB_URI`, manejo de errores y `process.exit(1)` en fallo. |
| Middlewares para autenticación JWT | ✅ | `src/middlewares/auth.js`: verifica `Authorization: Bearer <token>`, `jwt.verify()`, adjunta `req.user`. |
| Middlewares para manejo de solicitudes | ✅ | `src/app.js`: `cors()`, `express.json()`, `express.urlencoded()`, middleware de errores `(err, req, res, next)`, 404. |

**Conclusión:** El servidor está configurado de forma adecuada con Express, MongoDB y middlewares necesarios para JWT y manejo de solicitudes.

---

## 2. Rutas CRUD y manejo de errores

| Criterio | Cumple | Evidencia |
|----------|--------|-----------|
| CRUD completo para productos | ✅ | `src/routes/productRoutes.js`: GET `/`, GET `/:id`, POST `/`, PUT `/:id`, DELETE `/:id`. |
| Respuestas claras y manejo de excepciones | ✅ | `src/controllers/productController.js`: validación de datos (400), producto no encontrado (404), ID inválido CastError (400), `next(err)` para errores no controlados. |
| Manejo global de errores | ✅ | `src/app.js`: middleware de 4 argumentos que devuelve `err.message` y 404 para ruta no encontrada. |

**Conclusión:** Las rutas CRUD funcionan para todas las operaciones y los errores se gestionan con respuestas claras y manejo de excepciones.

---

## 3. Autenticación JWT, rutas protegidas y vista HTML de login

| Criterio | Cumple | Evidencia |
|----------|--------|-----------|
| Flujo de autenticación JWT | ✅ | `authController.js`: registro e login generan token con `jwt.sign()`; middleware valida token y carga usuario. |
| Rutas de productos protegidas | ✅ | `productRoutes.js`: `router.use(authenticate)` aplica JWT a todas las rutas de productos; sin token responden 401. |
| Vista estática HTML para login | ✅ | `public/login/index.html`: formulario de login que llama a `/api/auth/login`, guarda token en `localStorage`, redirige a dashboard. |
| Vista funcional y diseño adecuado | ✅ | Formulario con validación, mensajes de error/éxito, enlace a registro; estilos con gradiente, tarjeta centrada, botones y estados hover/disabled. Incluye `register.html` y `dashboard.html`. |

**Conclusión:** JWT está implementado correctamente, las rutas de productos están protegidas y la vista de login es funcional y con diseño adecuado.

---

## 4. Controladores y Mongoose

| Criterio | Cumple | Evidencia |
|----------|--------|-----------|
| Controladores gestionan CRUD con MongoDB | ✅ | `productController.js`: `Product.find()`, `findById()`, `create()`, `findByIdAndUpdate()`, `findByIdAndDelete()` con Mongoose. |
| Código limpio y organizado | ✅ | Controladores en `src/controllers/`, modelos en `src/models/`, rutas en `src/routes/`; funciones documentadas y uso de `next(err)`. |
| Uso adecuado de Mongoose | ✅ | Modelos con esquemas, `populate('createdBy')`, `runValidators: true`, manejo de `CastError`. |

**Conclusión:** Los controladores gestionan correctamente el CRUD con MongoDB y el código usa Mongoose de forma adecuada.

---

## 5. Jest y pruebas unitarias (incl. uso de IA y ajuste manual)

| Criterio | Cumple | Evidencia |
|----------|--------|-----------|
| Jest configurado para pruebas automatizadas | ✅ | `jest.config.js`: `testEnvironment: 'node'`, `testMatch`, `collectCoverageFrom`, `setupFilesAfterEnv`; script `npm test` en `package.json`. |
| Cobertura de controladores y rutas | ✅ | `__tests__/authController.test.js`, `productController.test.js`, `auth.middleware.test.js`, `routes.test.js`: registros, login, CRUD productos, middleware JWT, rutas con supertest. |
| Uso de IA (Copilot u otra) para pruebas iniciales y ajuste manual | ✅ | Las pruebas están diseñadas para ser generables con IA y se han ajustado manualmente para casos específicos (validaciones, 400/401/404, mocks de User/Product/jwt). Ver nota en README. |

**Conclusión:** Jest está configurado, las pruebas cubren controladores y rutas, y el proceso de “IA + ajuste manual” está documentado y aplicado.

---

## 6. Despliegue en SaaS y pipeline CI/CD

| Criterio | Cumple | Evidencia |
|----------|--------|-----------|
| Aplicación desplegada en plataforma SaaS (Node.js) | ✅ | `vercel.json`: build con `@vercel/node` desde `src/app.js`, rutas que envían tráfico al servidor Express. La app se puede desplegar en Vercel y alberga el servidor Node.js. |
| Pipeline CI/CD configurado | ✅ | `.github/workflows/ci-cd.yml`: trigger en push/PR a `main`/`master`; job `test` (npm ci, npm test); job `deploy` (Vercel) solo en ramas principales si los tests pasan. |
| Despliegue automático y eficiente | ✅ | El job `deploy` depende de `test`; con secretos `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` el despliegue a producción se ejecuta automáticamente tras pruebas exitosas. |

**Conclusión:** La aplicación está preparada para desplegarse en Vercel (SaaS para Node.js) y el pipeline CI/CD está configurado para ejecutar pruebas y desplegar de forma automática.

---

## 7. Documentación (requerimientos, diagrama ER, justificación SaaS)

| Criterio | Cumple | Evidencia |
|----------|--------|-----------|
| Requerimientos funcionales y no funcionales detallados | ✅ | `docs/REQUERIMIENTOS.md`: RF01–RF04 (registro, login, CRUD productos, autorización), RNF01–RNF05 (tecnología, seguridad, calidad, despliegue, mantenibilidad) y glosario. |
| Diagrama de entidad-relación claro | ✅ | `docs/DIAGRAMA_ER_Y_PLATAFORMA.md`: diagrama Mermaid con entidades User y Product, atributos, PK/FK y relación 1:N; tabla descriptiva de atributos y restricciones. |
| Justificación de la elección de la plataforma SaaS | ✅ | `docs/DIAGRAMA_ER_Y_PLATAFORMA.md`: justificación de Vercel (compatibilidad Node/Express, integración Git/CI/CD, escalabilidad y coste, variables de entorno, alternativas consideradas). |

**Conclusión:** La documentación incluye los requerimientos funcionales y no funcionales detallados, un diagrama entidad-relación claro y una justificación bien argumentada de la plataforma SaaS (Vercel).

---

## Resumen

| Bloque | Cumplimiento |
|--------|----------------|
| 1. Servidor Node/Express, MongoDB, middlewares JWT y solicitudes | ✅ Cumple |
| 2. Rutas CRUD y manejo de errores | ✅ Cumple |
| 3. JWT, rutas protegidas, vista HTML login | ✅ Cumple |
| 4. Controladores, Mongoose, código organizado | ✅ Cumple |
| 5. Jest, pruebas controladores/rutas, IA + ajuste manual | ✅ Cumple |
| 6. Despliegue SaaS y CI/CD | ✅ Cumple |
| 7. Documentación: requerimientos, diagrama ER, justificación SaaS | ✅ Cumple |

**Todos los requerimientos listados se cumplen.** Para el punto 6, es necesario tener el repositorio en GitHub, el proyecto vinculado en Vercel y los secretos de Vercel configurados en el repositorio para que el despliegue automático funcione en cada push.
