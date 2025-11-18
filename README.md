# Eventify - Sistema de Gestión de Eventos (Versión 3.0)

Eventify es una aplicación web backend completa desarrollada con **Node.js, Express y MongoDB Atlas**. Diseñada para la gestión integral de eventos, permite administrar clientes, empleados, eventos y tareas a través de una API RESTful segura y una interfaz web dinámica.

---

## 📈 Evolución del Proyecto

Este proyecto ha evolucionado a lo largo de tres entregas, cada una agregando capas de funcionalidad y robustez, reflejando el aprendizaje progresivo en el desarrollo backend.

### Versión 1.0 - Fundación y Estructura MVC
La primera versión sentó las bases de la aplicación:
-   **Backend Funcional:** Se construyó el servidor con Node.js y Express.
-   **Patrón MVC:** Se implementó una estructura clara separando Modelos, Vistas y Controladores.
-   **API Inicial:** Se crearon los endpoints CRUD básicos para los módulos principales.
-   **Interfaz Web (Pug):** Se desarrollaron vistas iniciales para la visualización de datos.
-   **Persistencia:** Los datos se manejaban de forma local (ej. archivos JSON o en memoria), sin una base de datos persistente.

### Versión 2.0 - Migración a Base de Datos (MongoDB)
La segunda entrega se centró en la persistencia y el manejo de datos a nivel profesional:
-   **Integración con MongoDB Atlas:** Se migró toda la persistencia de datos a una base de datos NoSQL en la nube.
-   **Mongoose como ODM:** Se refactorizaron todos los modelos para usar esquemas de Mongoose, permitiendo validaciones, relaciones y una interacción más segura con la base de datos.
-   **Relaciones entre Entidades:** Se implementaron relaciones entre los modelos (ej. un Evento se relaciona con un Cliente y un Empleado) usando `ref` y `populate`.
-   **Script de Seeding:** Se creó el archivo `seed.js` para poblar la base de datos con datos de prueba de manera consistente.

### Versión 3.0 (Entrega Final) - Seguridad y Robustez
Esta versión final consolida el proyecto, añadiendo capas críticas de seguridad y calidad:
-   🔐 **Sistema de Autenticación y Autorización (JWT):** Se implementó un sistema completo de registro e inicio de sesión. Las contraseñas se encriptan con `bcryptjs` y la gestión de sesiones se realiza mediante JSON Web Tokens (JWT) almacenados en cookies `HttpOnly` para mayor seguridad.
-   🛡️ **Protección de Rutas con Middleware:** Todas las rutas, tanto de la API como de la interfaz web, ahora están protegidas. Solo los usuarios autenticados pueden acceder a los recursos.
-   🧪 **Suite de Pruebas (Jest & Supertest):** Se desarrolló una suite de pruebas unitarias y de integración para validar los aspectos más críticos del sistema, incluyendo la autenticación y las operaciones CRUD.
-   👤 **Módulo de Usuarios y Perfiles:** Se añadió un nuevo modelo `Usuario` y vistas para que los usuarios puedan registrarse y ver su perfil.
-   🌐 **Interfaz Web CRUD Completa:** Las vistas de Pug se expandieron para soportar todas las operaciones (Crear, Leer, Actualizar, Eliminar) en todos los módulos, interactuando con el backend de forma segura.

---

## 🚀 Tecnologías Utilizadas

-   **Backend:** Node.js, Express.js
-   **Base de Datos:** MongoDB Atlas con Mongoose
-   **Motor de Vistas:** Pug
-   **Autenticación:** JSON Web Tokens (JWT), bcryptjs, cookie-parser
-   **Pruebas:** Jest, Supertest
-   **Frontend:** Bootstrap 5
-   **Herramientas:** Nodemon, Dotenv

---

## 🌟 Características Principales

-   **Operaciones CRUD Completas:** Todos los módulos (Clientes, Empleados, Eventos, Tareas) soportan la creación, lectura, actualización y eliminación de registros.
-   **API RESTful y Vistas Web Sincronizadas:** La misma lógica de negocio alimenta tanto una API para consumo externo como una interfaz web para usuarios finales.
-   **Sistema de Autenticación Seguro:** Gestión de usuarios con roles y contraseñas encriptadas.
-   **Filtrado Avanzado:** La API de Tareas permite un filtrado dinámico por múltiples criterios (estado, prioridad, fechas, etc.).
-   **Validaciones a Nivel de Modelo y Controlador:** Se asegura la integridad de los datos antes de persistirlos en la base de datos.

---

## 🗂️ Estructura del Proyecto (Patrón MVC)
eventify-backend/
├── controllers/ # Lógica de negocio (API y Web)
├── models/ # Esquemas y lógica de datos (Mongoose)
├── routes/ # Definición de rutas
├── views/ # Plantillas Pug
├── middleware/ # Middlewares personalizados (auth.js)
├── db/ # Configuración de base de datos
├── publics/ # Archivos estáticos (CSS, JS)
├── tests/ # Pruebas unitarias y de integración
├── app.js # Archivo principal de la aplicación
├── seed.js # Script para poblar la base de datos
└── .env # Variables de entorno
code
Code
---

## 🔧 Instalación y Configuración

**Requisitos:**
-   Node.js v16+
-   Cuenta en MongoDB Atlas

**Pasos:**

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/micakn/eventify-backend.git
    cd eventify-backend
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:
    ```env
    PORT=3000
    MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>...
    JWT_SECRET=tu_clave_secreta_para_jwt
    JWT_EXPIRES_IN=7d
    ```

4.  **(Opcional) Cargar datos de prueba:**
    ```bash
    node seed.js
    ```

5.  **Iniciar el servidor:**
    ```bash
    npm start
    ```
    El servidor estará disponible en `http://localhost:3000`.

---

## 📜 Scripts Disponibles

-   `npm start`: Inicia el servidor en modo de desarrollo con `nodemon`.
-   `npm test`: Ejecuta la suite de pruebas con Jest.
-   `node seed.js`: Limpia y carga la base de datos con datos de prueba.

---

## 🔌 Uso de la API

Todas las rutas de la API (`/api/*`) están protegidas y requieren que el usuario haya iniciado sesión.

#### Autenticación

| Método | Endpoint         | Descripción                |
| :----- | :--------------- | :------------------------- |
| `POST` | `/auth/registro` | Registra un nuevo usuario. |
| `POST` | `/auth/login`    | Inicia sesión y crea un cookie JWT. |
| `GET`  | `/auth/logout`   | Cierra sesión y limpia el cookie. |

#### Clientes

| Método   | Endpoint            | Descripción                     |
| :------- | :------------------ | :------------------------------ |
| `GET`    | `/api/clientes`     | Listar todos los clientes.      |
| `GET`    | `/api/clientes/:id` | Obtener un cliente por su ID.   |
| `POST`   | `/api/clientes`     | Crear un nuevo cliente.         |
| `PUT`    | `/api/clientes/:id` | Actualizar un cliente completo. |
| `DELETE` | `/api/clientes/:id` | Eliminar un cliente.            |

#### Empleados

| Método   | Endpoint             | Descripción                       |
| :------- | :------------------- | :-------------------------------- |
| `GET`    | `/api/empleados`     | Listar todos los empleados.       |
| `GET`    | `/api/empleados/:id` | Obtener un empleado por su ID.    |
| `POST`   | `/api/empleados`     | Crear un nuevo empleado.          |
| `PUT`    | `/api/empleados/:id` | Actualizar un empleado completo.  |
| `DELETE` | `/api/empleados/:id` | Eliminar un empleado.             |

#### Eventos

| Método   | Endpoint           | Descripción                     |
| :------- | :----------------- | :------------------------------ |
| `GET`    | `/api/eventos`     | Listar todos los eventos.       |
| `GET`    | `/api/eventos/:id` | Obtener un evento por su ID.    |
| `POST`   | `/api/eventos`     | Crear un nuevo evento.          |
| `PUT`    | `/api/eventos/:id` | Actualizar un evento completo.  |
| `DELETE` | `/api/eventos/:id` | Eliminar un evento.             |

#### Tareas

| Método   | Endpoint          | Descripción                   |
| :------- | :---------------- | :---------------------------- |
| `GET`    | `/api/tareas`     | Listar y filtrar tareas.     |
| `GET`    | `/api/tareas/:id` | Obtener una tarea por su ID.  |
| `POST`   | `/api/tareas`     | Crear una nueva tarea.        |
| `PUT`    | `/api/tareas/:id` | Actualizar una tarea completa.|
| `DELETE` | `/api/tareas/:id` | Eliminar una tarea.           |

---

## 🧪 Testing

El proyecto incluye una suite de pruebas para asegurar la calidad y el correcto funcionamiento de la lógica de negocio.

**Para ejecutar las pruebas:**
```bash
npm test
Las pruebas cubren:
Autenticación: Registro de usuarios, inicio de sesión con credenciales correctas e incorrectas, y cierre de sesión.
CRUD de Módulos: Creación, lectura, actualización y eliminación de Clientes, Empleados, Eventos y Tareas.
Validaciones: Verificación de que el sistema rechace datos inválidos (ej. roles incorrectos, tipos de tarea no correspondientes al área).
Relaciones: Pruebas que aseguran que las relaciones entre modelos (ej. asignar un empleado a una tarea) funcionen correctamente.
👥 Equipo de Desarrollo
Micaela
Gerardo
📄 Licencia
Este proyecto está bajo la Licencia ISC.
https://github.com/micakn/eventify-backend