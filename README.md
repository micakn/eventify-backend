# 🎟️ Eventify - Backend de Gestión de Eventos

**Eventify** es un sistema backend desarrollado con **Node.js, Express y MongoDB**, diseñado para gestionar eventos, empleados, clientes y tareas organizadas por área.

---

## 🧠 Descripción general

El sistema permite:

- Registrar **clientes, empleados y eventos**.  
- Crear y asignar **tareas** según el área correspondiente.  
- Validar que los **tipos de tareas** coincidan con el área asignada.  
- Filtrar tareas por **estado, prioridad, empleado, evento o rango de fechas**.  
- Gestionar la información desde una **API REST** o mediante **vistas web (Pug)**.

---

## ⚙️ Tecnologías utilizadas

- **Node.js** + **Express**
- **MongoDB Atlas** + **Mongoose**
- **Dotenv** para configuración del entorno
- **Nodemon** (modo desarrollo)
- **Pug** como motor de vistas
- **Bootstrap 5** para maquetado visual
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
├── routes/
│ ├── clienteRoutes.js
│ ├── clienteWebRoutes.js
│ ├── empleadoRoutes.js
│ ├── eventoRoutes.js
│ ├── tareaRoutes.js
│
├── db/
│ └── mongoose.js
│
├── views/
│ ├── layout/
│ ├── clientes/
│ ├── eventos/
│ ├── tareas/
│
├── public/
│ ├── css/
│ ├── img/
│
├── seed.js # Carga inicial de datos
├── app.js # Configuración principal del servidor
├── .env # Variables de entorno
├── package.json
└── README.md

yaml
Copiar código

---

## 🧱 Modelos de datos principales

### 🧍 Empleado
| Campo | Tipo | Descripción |
|--------|------|-------------|
| nombre | String | Nombre completo |
| rol | String | administrador / planner / coordinador |
| area | String | Área de trabajo |
| email | String | Correo institucional |
| telefono | String | Contacto |

---

### 🧾 Cliente
| Campo | Tipo | Descripción |
|--------|------|-------------|
| nombre | String | Nombre del cliente o empresa |
| email | String | Correo electrónico |
| telefono | String | Teléfono de contacto |
| empresa | String | Empresa asociada |
| notas | String | Observaciones adicionales |

---

### 🗓️ Evento
| Campo | Tipo | Descripción |
|--------|------|-------------|
| nombre | String | Nombre del evento |
| descripcion | String | Descripción o tipo de evento |
| lugar | String | Ubicación |
| fechaInicio / fechaFin | Date | Duración del evento |

---

### 🧮 Tarea
| Campo | Tipo | Descripción |
|--------|------|-------------|
| titulo | String | Nombre de la tarea |
| descripcion | String | Detalle de la tarea |
| estado | String | pendiente / en proceso / finalizada |
| prioridad | String | baja / media / alta |
| area | String | Área correspondiente |
| tipo | String | Tipo de tarea válida según el área |
| empleadoAsignado | ObjectId (Empleado) | Empleado asignado |
| eventoAsignado | ObjectId (Evento) | Evento relacionado |
| horasEstimadas / horasReales | Number | Tiempo de trabajo |

---

## 🧭 Áreas, roles y tareas válidas

### 🔹 Áreas de trabajo
| Área | Tareas posibles |
|------|------------------|
| **Producción y Logística** | Coordinación con proveedores, Montaje de escenario, Verificación técnica previa |
| **Planificación y Finanzas** | Carga y control del presupuesto, Firma de contratos, Seguimiento del cronograma |
| **Administración** | Control de base de datos, permisos y accesos |
| *(Opcional futura)* **Atención al Cliente** | Seguimiento de satisfacción, comunicación post-evento |

---

### 🔹 Roles
| Rol | Descripción |
|------|-------------|
| **administrador** | Control total del sistema |
| **planner** | Planifica presupuestos y cronogramas |
| **coordinador** | Supervisa logística, proveedores y montaje |

---

## 🌱 Carga inicial de datos (seed.js)

Para cargar datos de ejemplo en MongoDB Atlas:

```bash
node seed.js
El script:

✅ Limpia las colecciones existentes
✅ Inserta datos coherentes con los roles y áreas
✅ Crea relaciones válidas entre empleados, clientes, eventos y tareas

🧪 Endpoints de prueba (API REST)
🔹 Clientes
Método	Endpoint	Descripción
GET	/api/clientes	Listar todos
POST	/api/clientes	Crear nuevo cliente
GET	/api/clientes/:id	Ver cliente
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
GET	/api/eventos	Listar todos
POST	/api/eventos	Crear evento
PATCH	/api/eventos/:id	Editar evento
DELETE	/api/eventos/:id	Eliminar evento

🔹 Tareas
Método	Endpoint	Descripción
GET	/api/tareas	Listar todas las tareas
GET	/api/tareas?estado=pendiente	Filtrar por estado
POST	/api/tareas	Crear nueva tarea (validada por área/tipo)
PATCH	/api/tareas/:id	Editar tarea
DELETE	/api/tareas/:id	Eliminar tarea

🧩 Validación automática:
Si se intenta crear una tarea cuyo tipo no pertenece al área asignada, el backend devuelve:

json
Copiar código
{ "mensaje": "Tarea inválida para el área seleccionada" }
⚙️ Variables de entorno (.env)
Ejemplo de archivo .env:

ini
Copiar código
PORT=3000
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/eventify
🚀 Ejecución del proyecto
Instalar dependencias

bash
Copiar código
npm install
Cargar datos iniciales

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
El backend Eventify implementa un sistema completo de gestión de eventos basado en MongoDB Atlas, cumpliendo con los requerimientos académicos:

CRUD completo por entidad

Validación de tareas según área

Roles diferenciados (planner, coordinador, administrador)

Persistencia real con MongoDB Atlas

Script de carga inicial (seed.js)

Endpoints REST documentados

Interfaz web funcional con vistas Pug

📦 Última actualización: Migración completa a MongoDB Atlas, CRUD web funcional y documentación revisada ✅