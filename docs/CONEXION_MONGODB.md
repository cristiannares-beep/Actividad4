# Conexión a MongoDB

La aplicación usa la variable de entorno `MONGODB_URI` para conectarse a MongoDB. Puedes usar **MongoDB local** o **MongoDB Atlas** (en la nube).

---

## Opción 1: MongoDB local

### 1. Instalar MongoDB

- **Windows:** Descarga el instalador desde [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community) e instala. Durante la instalación puedes marcar "Install MongoDB as a Service" para que se inicie solo.
- **Mac (Homebrew):** `brew tap mongodb/brew` y luego `brew install mongodb-community`. Iniciar con: `brew services start mongodb-community`.
- **Linux (Ubuntu):** Sigue la [guía oficial](https://www.mongodb.com/docs/manual/administration/install-on-linux/).

### 2. Crear el archivo `.env`

En la raíz del proyecto (donde está `package.json`), crea un archivo llamado `.env` (si no existe) con:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/gestion-productos
JWT_SECRET=tu_secreto_muy_seguro_aqui
JWT_EXPIRES_IN=24h
```

La base de datos `gestion-productos` se creará automáticamente la primera vez que la app se conecte.

### 3. Arrancar la aplicación

```bash
npm run dev
```

Si ves en consola `MongoDB conectado: localhost`, la conexión es correcta.

---

## Opción 2: MongoDB Atlas (gratis en la nube)

### 1. Crear cuenta y clúster

1. Entra en [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Regístrate o inicia sesión.
3. Crea un clúster gratuito (M0).
4. En **Security → Database Access** crea un usuario (nombre y contraseña; guárdalos).
5. En **Security → Network Access** añade una IP: "Allow Access from Anywhere" (`0.0.0.0/0`) para poder conectarte desde cualquier sitio (o añade solo tu IP si prefieres).

### 2. Obtener la URI de conexión

1. En el clúster, pulsa **Connect**.
2. Elige **Drivers** (o "Connect your application").
3. Copia la cadena de conexión. Se verá parecida a:

   ```
   mongodb+srv://usuario:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

4. Sustituye `<password>` por la contraseña real del usuario de base de datos (si hay caracteres especiales, codifícalos en URL o cambia la contraseña a una sin símbolos).
5. Opcional: después de `.net/` puedes poner el nombre de la base de datos, por ejemplo:  
   `mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/gestion-productos?retryWrites=true&w=majority`

### 3. Configurar `.env`

En la raíz del proyecto, en el archivo `.env`:

```
PORT=3000
MONGODB_URI=mongodb+srv://TU_USUARIO:TU_PASSWORD@cluster0.xxxxx.mongodb.net/gestion-productos?retryWrites=true&w=majority
JWT_SECRET=tu_secreto_muy_seguro_aqui
JWT_EXPIRES_IN=24h
```

(Usa tu URI completa de Atlas en `MONGODB_URI`.)

### 4. Arrancar la aplicación

```bash
npm run dev
```

Si la URI es correcta, verás algo como `MongoDB conectado: cluster0.xxxxx.mongodb.net`.

---

## Resumen rápido

| Paso | Acción |
|------|--------|
| 1 | Tener MongoDB local instalado y en ejecución **o** un clúster en MongoDB Atlas con usuario y acceso por red configurado. |
| 2 | En la raíz del proyecto, crear `.env` (puedes copiar `.env.example` y renombrarlo). |
| 3 | En `.env`, definir `MONGODB_URI` (local: `mongodb://localhost:27017/gestion-productos` o tu URI de Atlas). |
| 4 | Ejecutar `npm run dev` y comprobar el mensaje de conexión en consola. |

Si algo falla, revisa que la URI no tenga espacios, que la contraseña de Atlas esté bien puesta y que el puerto 27017 (local) o el acceso desde internet (Atlas) no estén bloqueados por firewall o antivirus.
