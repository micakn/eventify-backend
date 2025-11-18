# Eventify - Sistema de Gestión de Eventos (Versión 3.0)

Eventify es una aplicación web backend completa desarrollada con **Node.js, Express y MongoDB Atlas**. Diseñada para la gestión integral de eventos, permite administrar clientes, empleados, eventos y tareas a través de una API RESTful segura y una interfaz web dinámica.

**[Ver Demo en Vivo en Render](https://eventify-backend-3tzg.onrender.com/)**

---

## Evolución del Proyecto

Este proyecto ha evolucionado a lo largo de tres entregas, cada una agregando capas de funcionalidad y robustez, reflejando el aprendizaje progresivo en el desarrollo backend.

### Versión 1.0 - Fundación y Estructura MVC
La primera versión sentó las bases de la aplicación:
-   **Backend Funcional:** Se construyó el servidor con Node.js y Express.
-   **Patrón MVC:** Se implementó una estructura clara separando Modelos, Vistas y Controladores.
-   **API Inicial:** Se crearon los endpoints CRUD básicos para los módulos principales.
-   **Interfaz Web (Pug):** Se desarrollaron vistas iniciales para la visualización de datos.
-   **Persistencia:** Los datos se manejaban de forma local, sin una base de datos persistente.

### Versión 2.0 - Migración a Base de Datos (MongoDB)
La segunda entrega se centró en la persistencia y el manejo de datos a nivel profesional:
-   **Integración con MongoDB Atlas:** Se migró toda la persistencia de datos a una base de datos NoSQL en la nube.
-   **Mongoose como ODM:** Se refactorizaron todos los modelos para usar esquemas de Mongoose, permitiendo validaciones y relaciones.
-   **Relaciones entre Entidades:** Se implementaron relaciones entre los modelos (ej. un Evento se relaciona con un Cliente) usando `ref` y `populate`.
-   **Script de Seeding:** Se creó el archivo `seed.js` para poblar la base de datos con datos de prueba.

### Versión 3.0 (Entrega Final) - Seguridad, Pruebas y Despliegue
Esta versión final consolida el proyecto, añadiendo capas críticas de seguridad, calidad y producción:
-   **Sistema de Autenticación y Autorización (JWT):** Se implementó un sistema completo de registro e inicio de sesión con `bcryptjs` y cookies `HttpOnly`.
-   **Protección de Rutas con Middleware:** Todas las rutas, tanto de la API como de la interfaz web, ahora están protegidas.
-   **Suite de Pruebas (Jest & Supertest):** Se desarrolló una suite de pruebas para validar los aspectos más críticos del sistema.
-   **Módulo de Usuarios y Perfiles:** Se añadió un nuevo modelo `Usuario` y vistas para la gestión de cuentas.
-   **Despliegue en Producción:** La aplicación fue desplegada en la plataforma **Render**, haciéndola accesible públicamente.

---

## Despliegue en Render (Live Demo)

La aplicación está desplegada y completamente funcional en Render. Puedes acceder a ella a través del siguiente enlace:

**[https://eventify-backend-3tzg.onrender.com/](https://eventify-backend-3tzg.onrender.com/)**

**Nota Importante:** El proyecto está alojado en el plan gratuito de Render. Si el sitio no ha recibido tráfico recientemente, el servidor puede entrar en modo de suspensión. **El primer acceso puede tardar entre 30 y 60 segundos** mientras el servicio se activa. Las visitas posteriores serán instantáneas.

Puedes registrar un nuevo usuario y probar todas las funcionalidades de la interfaz web.

---

## Tecnologías Utilizadas

-   **Backend:** Node.js, Express.js
-   **Base de Datos:** MongoDB Atlas con Mongoose
-   **Motor de Vistas:** Pug
-   **Autenticación:** JSON Web Tokens (JWT), bcryptjs, cookie-parser
-   **Pruebas:** Jest, Supertest
-   **Frontend:** Bootstrap 5
-   **Despliegue:** Render
-   **Herramientas:** Nodemon, Dotenv

---

## Características Principales
-   **Operaciones CRUD Completas:** Todos los módulos (Clientes, Empleados, Eventos, Tareas) soportan la creación, lectura, actualización y eliminación de registros.
-   **API RESTful y Vistas Web Sincronizadas:** La misma lógica de negocio alimenta tanto una API para consumo externo como una interfaz web para usuarios finales.
-   **Sistema de Autenticación Seguro:** Gestión de usuarios con roles y contraseñas encriptadas.
-   **Filtrado Avanzado:** La API de Tareas permite un filtrado dinámico por múltiples criterios.
-   **Validaciones a Nivel de Modelo y Controlador:** Se asegura la integridad de los datos antes de persistirlos.

---

## Arquitectura y Funcionamiento General

El sistema está construido siguiendo el patrón de diseño **Modelo-Vista-Controlador (MVC)** para garantizar una clara separación de responsabilidades.

### Flujo de una Petición Típica

1.  **Entrada (Request):** Una petición HTTP llega al servidor Express.
2.  **Middleware Global:** La petición pasa a través de middlewares en `app.js` que procesan datos, cookies y verifican la sesión del usuario.
3.  **Enrutamiento (Routing):** `app.js` dirige la petición al enrutador correspondiente (ej. `/clientes` o `/api/clientes`).
4.  **Middleware de Autenticación:** El middleware `verificarAuth` intercepta la petición en rutas protegidas. Valida el token JWT del cookie y, si es válido, adjunta los datos del usuario a la petición. Si no, deniega el acceso.
5.  **Controlador (Controller):** El controlador correspondiente (API o Web) se encarga de la lógica de negocio, comunicándose con el modelo.
6.  **Modelo (Model):** El modelo (definido con Mongoose) ejecuta la operación solicitada en la base de datos (CRUD) y aplica las validaciones de su esquema.
7.  **Respuesta (Response):**
    *   **API:** El controlador devuelve una respuesta JSON.
    *   **Web:** El controlador renderiza una vista de Pug con los datos y la envía como HTML al navegador.

---

## Estructura del Proyecto
```eventify-backend/
├── controllers/       # Lógica de negocio (API y Web)
├── models/            # Esquemas de Mongoose
├── routes/            # Definición de rutas
├── views/             # Plantillas Pug
├── middleware/        # Middlewares personalizados (auth.js)
├── db/                # Configuración de base de datos
├── publics/           # Archivos estáticos
├── tests/             # Pruebas unitarias y de integración
├── app.js             # Archivo principal
└── .env               # Variables de entorno 
```


## Instalación y Configuración Local

**Requisitos:**
-   Node.js v16+
-   Cuenta en MongoDB Atlas

**Pasos:**

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/micakn/eventify-backend.git
    ```
2.  **Navegar al directorio:**
    ```bash
    cd eventify-backend
    ```
3.  **Instalar dependencias:**
    ```bash
    npm install
    ```
4.  **Configurar variables de entorno:**
    Crear un archivo `.env` en la raíz del proyecto con la siguiente estructura:
    ```env
    PORT=3000
    MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>...
    JWT_SECRET=tu_clave_secreta_para_jwt
    JWT_EXPIRES_IN=7d
    ```
5.  **Iniciar el servidor:**
    ```bash
    npm start
    ```

---

## Scripts Disponibles

-   `npm start`: Inicia el servidor en modo de desarrollo con `nodemon`.
-   `npm test`: Ejecuta la suite de pruebas con Jest.
-   `node seed.js`: Limpia y carga la base de datos con datos de prueba.

---

## Uso de la API

Todas las rutas de la API (`/api/*`) están protegidas y requieren que el usuario haya iniciado sesión.

| Método   | Endpoint            | Descripción                     |
| :------- | :------------------ | :------------------------------ |
| `POST`   | `/auth/registro`    | Registra un nuevo usuario.      |
| `POST`   | `/auth/login`       | Inicia sesión y crea un cookie JWT. |
| `GET`    | `/api/clientes`     | Listar todos los clientes.      |
| `POST`   | `/api/clientes`     | Crear un nuevo cliente.         |
| `GET`    | `/api/empleados`    | Listar todos los empleados.     |
| `POST`   | `/api/empleados`    | Crear un nuevo empleado.        |

*(Para la lista completa de endpoints, ver el código en la carpeta `routes/`)*

---

## Testing

El proyecto incluye una suite de pruebas para asegurar la calidad y el correcto funcionamiento de la lógica de negocio.

Para ejecutar las pruebas:
```bash
npm test

Las pruebas cubren:
-   **Autenticación:** Registro, inicio de sesión y cierre de sesión.
-   **CRUD de Módulos:** Operaciones completas para Clientes, Empleados, etc.
-   **Validaciones:** Rechazo de datos inválidos.

---

## Equipo de Desarrollo

-   Micaela
-   Gerardo

---

## Licencia

Este proyecto está bajo la Licencia ISC.