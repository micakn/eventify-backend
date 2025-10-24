# 🎟️ Eventify - Backend de Gestión de Eventos

**Eventify** es un sistema backend desarrollado con **Node.js, Express y MongoDB**, diseñado para gestionar eventos, empleados, clientes y tareas organizadas por área.  

---

## 🧠 Descripción general

El sistema permite:
- Registrar **clientes, empleados y eventos**.
- Crear y asignar **tareas** según el área correspondiente.
- Validar que los **tipos de tareas** coincidan con el área.
- Filtrar tareas por **estado, prioridad, empleado, evento y fechas**.
- Gestionar los datos mediante **API REST** o **vistas Pug**.

---

## ⚙️ Tecnologías utilizadas

- **Node.js** + **Express**
- **MongoDB Atlas** con **Mongoose**
- **Dotenv** para variables de entorno
- **Nodemon** para desarrollo
- **Pug** como motor de vistas (para la parte web)
- **Thunder Client / Postman** para pruebas de API

---

## 🧩 Estructura del proyecto

eventify-backend/
│
├── controllers/
│ ├── ClienteController.js
│ ├── EmpleadoController.js
│ ├── EventoController.js
│ ├── TareaController.js
│ └── ClienteWebController.js
│
├── models/
│ ├── ClienteModel.js
│ ├── EmpleadoModel.js
│ ├── EventoModel.js
│ ├── TareaModel.js
│
├── db/
│ └── mongoose.js
│
├── routes/
│ ├── clienteRoutes.js
│ ├── empleadoRoutes.js
│ ├── eventoRoutes.js
│ ├── tareaRoutes.js
│
├── views/
│ ├── layout/
│ ├── clientes/
│ ├── eventos/
│ ├── tareas/
│
├── seed.js # Script de carga inicial
├── app.js # Configuración principal del servidor
├── package.json
└── .env

yaml
Copiar código

---

## 🧱 Modelos de datos principales

### 🧍 Empleado
| Campo | Tipo | Descripción |
|--------|------|-------------|
| nombre | String | Nombre completo |
| rol | String | administrador / planner / coordinador |
| area | String | Área del empleado |
| email | String | Correo institucional |
| telefono | String | Contacto |

### 🧾 Cliente
| Campo | Tipo | Descripción |
|--------|------|-------------|
| nombre | String | Nombre del cliente o empresa |
| email | String | Correo electrónico |
| telefono | String | Teléfono de contacto |
| empresa | String | Empresa asociada |
| notas | String | Observaciones adicionales |

### 🗓️ Evento
| Campo | Tipo | Descripción |
|--------|------|-------------|
| nombre | String | Nombre del evento |
| descripcion | String | Detalle o tipo de evento |
| lugar | String | Ubicación |
| fechaInicio / fechaFin | Date | Duración del evento |

### 🧮 Tarea
| Campo | Tipo | Descripción |
|--------|------|-------------|
| titulo | String | Nombre de la tarea |
| descripcion | String | Detalle de la tarea |
| estado | String | pendiente / en proceso / finalizada |
| prioridad | String | baja / media / alta |
| area | String | Área correspondiente |
| tipo | String | Tipo de tarea válida según área |
| empleadoAsignado | ObjectId (Empleado) | Asignado a |
| eventoAsignado | ObjectId (Evento) | Evento relacionado |
| horasEstimadas / horasReales | Number | Tiempo de trabajo |

---

## 🧭 Áreas, roles y tareas válidas

### 🔹 Áreas de trabajo
| Área | Tareas posibles |
|------|------------------|
| **Producción y Logística** | Coordinación con proveedores, Montaje de escenario, Verificación técnica previa |
| **Planificación y Finanzas** | Carga y control del presupuesto, Firma de contratos, Seguimiento del cronograma y fechas clave |
| **Administración** | Mantenimiento de base de datos de clientes, Control de permisos y accesos |
| *(Opcional futura)* **Atención al Cliente** | Seguimiento de satisfacción, Comunicación post-evento, Gestión de reclamos |

### 🔹 Roles
| Rol | Descripción |
|------|-------------|
| **administrador** | Control total del sistema |
| **planner** | Planifica presupuestos y cronogramas |
| **coordinador** | Supervisa logística, proveedores y montaje |

---

## 🌱 Carga inicial de datos (Seed)

Para cargar datos de ejemplo en la base MongoDB:

```bash
node seed.js
El script:

Limpia las colecciones existentes (clientes, empleados, eventos, tareas)

Inserta datos base coherentes con los roles y áreas

Crea asociaciones válidas entre empleados, eventos y tareas

🧪 Pruebas de API (Thunder Client / Postman)
🔹 Clientes
Método	Endpoint	Descripción
GET	/api/clientes	Listar todos
POST	/api/clientes	Crear nuevo cliente
GET	/api/clientes/:id	Ver un cliente
PATCH	/api/clientes/:id	Editar parcialmente
DELETE	/api/clientes/:id	Eliminar cliente

🔹 Empleados
Método	Endpoint	Descripción
GET	/api/empleados	Listar todos
POST	/api/empleados	Crear nuevo empleado
PATCH	/api/empleados/:id	Editar empleado
DELETE	/api/empleados/:id	Eliminar empleado

🔹 Eventos
Método	Endpoint	Descripción
GET	/api/eventos	Listar eventos
POST	/api/eventos	Crear evento
PATCH	/api/eventos/:id	Editar evento
DELETE	/api/eventos/:id	Eliminar evento

🔹 Tareas
Método	Endpoint	Descripción
GET	/api/tareas	Listar todas las tareas
GET	/api/tareas?estado=pendiente	Filtrar por estado
POST	/api/tareas	Crear tarea (validada por área/tipo)
PATCH	/api/tareas/:id	Editar tarea
DELETE	/api/tareas/:id	Eliminar tarea

💡 Validación automática: si se intenta crear una tarea cuyo tipo no pertenece al area correspondiente, el backend devuelve:

json
Copiar código
{ "mensaje": "Tarea inválida para el área seleccionada" }
💾 Variables de entorno (.env)
Ejemplo de archivo .env:

ini
Copiar código
PORT=3000
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/eventify
🚀 Cómo ejecutar el proyecto
Instalar dependencias

bash
Copiar código
npm install
Cargar los datos iniciales

bash
Copiar código
node seed.js
Ejecutar el servidor

bash
Copiar código
npm run dev
Probar en navegador o Thunder Client

bash
Copiar código
http://localhost:3000/api/tareas
🧾 Conclusiones
Este backend implementa de forma completa el modelo de desarrollo incremental, cumpliendo con los requisitos:

CRUD por entidad

Validación lógica de tareas según área

Roles de usuario diferenciados

Persistencia real en MongoDB Atlas

Scripts de carga inicial (seed.js)

Endpoints REST funcionales y documentados