# Requerimientos del Sistema - Gestión de Productos

## 1. Requerimientos funcionales

### RF01 - Registro de usuarios
- **RF01.1** El sistema debe permitir el registro de nuevos usuarios mediante email y contraseña.
- **RF01.2** Las contraseñas deben almacenarse encriptadas (hash).
- **RF01.3** No se permitirán emails duplicados.

### RF02 - Inicio y cierre de sesión
- **RF02.1** El sistema debe permitir el inicio de sesión con email y contraseña.
- **RF02.2** Tras un login exitoso, el sistema emitirá un token JWT para identificar al usuario.
- **RF02.3** Debe existir una vista HTML estática para el formulario de login.
- **RF02.4** El sistema debe permitir el cierre de sesión (invalidación o no uso del token en el cliente).

### RF03 - Gestión de productos (CRUD)
- **RF03.1** Solo usuarios autenticados (con JWT válido) pueden realizar operaciones sobre productos.
- **RF03.2** **Crear**: el usuario puede agregar un producto (nombre, descripción, precio, stock, etc.).
- **RF03.3** **Leer**: el usuario puede listar todos los productos y obtener un producto por ID.
- **RF03.4** **Actualizar**: el usuario puede modificar un producto existente por ID.
- **RF03.5** **Eliminar**: el usuario puede eliminar un producto por ID.

### RF04 - Autenticación y autorización
- **RF04.1** Las rutas de productos deben estar protegidas con middleware que valide el JWT.
- **RF04.2** Las rutas de registro e inicio de sesión deben ser públicas.
- **RF04.3** Respuestas con código 401 cuando el token sea inválido o no se proporcione.

---

## 2. Requerimientos no funcionales

### RNF01 - Tecnología
- **RNF01.1** Backend: Node.js con Express.js.
- **RNF01.2** Base de datos: MongoDB.
- **RNF01.3** ODM: Mongoose para modelos y consultas.
- **RNF01.4** Autenticación: JWT (JSON Web Tokens).

### RNF02 - Seguridad
- **RNF02.1** Contraseñas hasheadas con bcrypt (o similar).
- **RNF02.2** Tokens JWT con expiración y firma segura.
- **RNF02.3** Variables sensibles (secretos, URI de BD) en variables de entorno.

### RNF03 - Calidad
- **RNF03.1** Pruebas unitarias con Jest para controladores y rutas.
- **RNF03.2** Cobertura de casos de éxito y error en los endpoints.

### RNF04 - Despliegue
- **RNF04.1** Aplicación desplegada en una plataforma SaaS (ej. Vercel).
- **RNF04.2** Pipeline CI/CD con GitHub Actions para automatizar despliegue y/o pruebas.

### RNF05 - Mantenibilidad
- **RNF05.1** Código organizado en capas: rutas, controladores, modelos, middlewares.
- **RNF05.2** Uso de middlewares para parsing JSON y manejo de errores.

---

Para el **diagrama entidad-relación** (User, Product) y la **justificación de la plataforma SaaS** (Vercel), véase [DIAGRAMA_ER_Y_PLATAFORMA.md](DIAGRAMA_ER_Y_PLATAFORMA.md).

---

## 3. Glosario

| Término   | Definición                                                                 |
|----------|-----------------------------------------------------------------------------|
| CRUD     | Create, Read, Update, Delete (crear, leer, actualizar, eliminar).          |
| JWT      | Token firmado que identifica al usuario sin guardar estado en el servidor. |
| Middleware | Función que procesa la petición antes de llegar al controlador.          |
| SaaS     | Software as a Service; plataforma que aloja la aplicación (ej. Vercel).    |
