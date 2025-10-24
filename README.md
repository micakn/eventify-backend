# 🎟️ Eventify - Backend de Gestión de Eventos

**Eventify** es un sistema backend desarrollado con **Node.js, Express y MongoDB Atlas**, diseñado para gestionar eventos, empleados, clientes y tareas organizadas por área.

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [Características Principales](#-características-principales)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Modelos de Datos](#-modelos-de-datos)
- [Áreas, Roles y Tareas](#-áreas-roles-y-tareas)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Uso de la Interfaz Web](#-uso-de-la-interfaz-web)
- [Scripts Disponibles](#-scripts-disponibles)

---

## 🧠 Descripción General

El sistema permite:

- ✅ Registrar **clientes, empleados y eventos**
- ✅ Crear y asignar **tareas** según el área correspondiente
- ✅ Validar que los **tipos de tareas** coincidan con el área asignada
- ✅ Filtrar tareas por **estado, prioridad, empleado, evento o rango de fechas**
- ✅ Gestionar la información desde una **API REST** o mediante **vistas web (Pug)**

---

## ⚙️ Tecnologías Utilizadas

| Tecnología | Descripción |
|------------|-------------|
| **Node.js** | Entorno de ejecución para JavaScript |
| **Express** | Framework web minimalista |
| **MongoDB Atlas** | Base de datos NoSQL en la nube |
| **Mongoose** | ODM para MongoDB |
| **Pug** | Motor de plantillas para vistas |
| **Bootstrap 5** | Framework CSS para diseño responsivo |
| **Dotenv** | Gestión de variables de entorno |
| **Nodemon** | Reinicio automático en desarrollo |

---

## ✨ Características Principales

### 🔐 Validación de Tareas por Área
El sistema valida automáticamente que cada tarea pertenezca a los tipos permitidos según su área:
```json
{
  "area": "Producción y Logística",
  "tipo": "Coordinación con proveedores" // ✅ Válido
}
```

Si se intenta asignar un tipo inválido:
```json
{
  "mensaje": "Tarea inválida para el área seleccionada"
}
```

### 🔍 Filtrado Avanzado de Tareas
Filtra tareas usando query parameters:
```
GET /api/tareas?estado=pendiente
GET /api/tareas?prioridad=alta
GET /api/tareas?empleadoAsignado=673bef70a24c3c0808d5e7b3
GET /api/tareas?fechaInicio=2025-01-01&fechaFin=2025-12-31
```

### 👥 Roles y Permisos
Tres roles diferenciados:

- **Administrador**: Control total del sistema
- **Planner**: Planificación, presupuestos y cronogramas
- **Coordinador**: Logística, proveedores y montaje

---

## 🧩 Estructura del Proyecto
```
eventify-backend/
│
├── controllers/          # Lógica de negocio
│   ├── ClienteController.js
│   ├── ClienteWebController.js
│   ├── EmpleadoController.js
│   ├── EventoController.js
│   └── TareaController.js
│
├── models/              # Esquemas de Mongoose
│   ├── ClienteModel.js
│   ├── EmpleadoModel.js
│   ├── EventoModel.js
│   └── TareaModel.js
│
├── routes/              # Definición de rutas
│   ├── clienteRoutes.js
│   ├── clienteWebRoutes.js
│   ├── empleadoRoutes.js
│   ├── eventoRoutes.js
│   └── tareaRoutes.js
│
├── views/               # Plantillas Pug
│   ├── layout/
│   │   └── layout.pug
│   ├── clientes/
│   │   ├── index.pug
│   │   ├── form.pug
│   │   └── show.pug
│   ├── index.pug
│   └── error.pug
│
├── public/              # Archivos estáticos
│   └── css/
│       └── styles.css
│
├── db/                  # Configuración de BD
│   └── mongoose.js
│
├── seed.js              # Carga inicial de datos
├── app.js               # Configuración principal
├── .env                 # Variables de entorno
├── .gitignore
├── package.json
└── README.md
```

---

## 📊 Modelos de Datos

### 👤 Cliente
| Campo | Tipo | Descripción |
|-------|------|-------------|
| nombre | String | Nombre del cliente o empresa |
| email | String | Correo electrónico (requerido) |
| telefono | String | Teléfono de contacto |
| empresa | String | Empresa asociada |
| notas | String | Observaciones adicionales |

### 🧑‍💼 Empleado
| Campo | Tipo | Valores Permitidos |
|-------|------|-------------------|
| nombre | String | Nombre completo |
| rol | String | administrador / planner / coordinador |
| area | String | Producción y Logística / Planificación y Finanzas / Administración |
| email | String | Correo institucional |
| telefono | String | Contacto |

### 🗓️ Evento
| Campo | Tipo | Descripción |
|-------|------|-------------|
| nombre | String | Nombre del evento |
| descripcion | String | Descripción o tipo de evento |
| lugar | String | Ubicación |
| fechaInicio | Date | Fecha de inicio |
| fechaFin | Date | Fecha de finalización |
| presupuesto | Number | Presupuesto asignado |

### 📋 Tarea
| Campo | Tipo | Valores Permitidos |
|-------|------|-------------------|
| titulo | String | Nombre de la tarea |
| descripcion | String | Detalle de la tarea |
| estado | String | pendiente / en proceso / finalizada |
| prioridad | String | baja / media / alta |
| area | String | Producción y Logística / Planificación y Finanzas |
| tipo | String | Tipo de tarea según área |
| empleadoAsignado | ObjectId | Referencia a Empleado |
| eventoAsignado | ObjectId | Referencia a Evento |
| horasEstimadas | Number | Horas planificadas |
| horasReales | Number | Horas trabajadas |

---

## 🧭 Áreas, Roles y Tareas

### Áreas de Trabajo y Tareas Válidas

#### 📦 Producción y Logística
- Coordinación con proveedores
- Montaje de escenario o mobiliario
- Verificación técnica previa al evento

#### 💰 Planificación y Finanzas
- Carga y control del presupuesto del evento
- Firma de contratos con clientes/proveedores
- Seguimiento del cronograma y fechas clave

#### ⚙️ Administración
- Gestión de usuarios del sistema
- Control de permisos y accesos

---

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js v16 o superior
- Cuenta en MongoDB Atlas
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/micakn/eventify-backend.git
cd eventify-backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env` en la raíz:
```env
PORT=3000
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/eventify
```

4. **Cargar datos iniciales**
```bash
node seed.js
```

5. **Iniciar el servidor**
```bash
npm start
```

El servidor estará corriendo en `http://localhost:3000`

---

## 📡 Endpoints de la API

### 👥 Clientes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/clientes` | Listar todos |
| GET | `/api/clientes/:id` | Obtener uno |
| POST | `/api/clientes` | Crear nuevo |
| PUT | `/api/clientes/:id` | Actualizar completo |
| PATCH | `/api/clientes/:id` | Actualizar parcial |
| DELETE | `/api/clientes/:id` | Eliminar |

**Ejemplo de creación:**
```json
POST /api/clientes
{
  "nombre": "Empresa XYZ",
  "email": "contacto@xyz.com",
  "telefono": "+5491122334455",
  "empresa": "XYZ S.A.",
  "notas": "Cliente corporativo"
}
```

### 🧑‍💼 Empleados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/empleados` | Listar todos |
| GET | `/api/empleados/:id` | Obtener uno |
| POST | `/api/empleados` | Crear nuevo |
| PATCH | `/api/empleados/:id` | Actualizar |
| DELETE | `/api/empleados/:id` | Eliminar |

**Ejemplo:**
```json
POST /api/empleados
{
  "nombre": "Ana García",
  "rol": "planner",
  "area": "Planificación y Finanzas",
  "email": "ana@eventify.com",
  "telefono": "+5491133445566"
}
```

### 🗓️ Eventos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/eventos` | Listar todos |
| GET | `/api/eventos/:id` | Obtener uno |
| POST | `/api/eventos` | Crear nuevo |
| PATCH | `/api/eventos/:id` | Actualizar |
| DELETE | `/api/eventos/:id` | Eliminar |

### 📋 Tareas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/tareas` | Listar/filtrar |
| GET | `/api/tareas/:id` | Obtener una |
| POST | `/api/tareas` | Crear (con validación) |
| PATCH | `/api/tareas/:id` | Actualizar |
| DELETE | `/api/tareas/:id` | Eliminar |

**Ejemplos de filtrado:**
```bash
# Por estado
GET /api/tareas?estado=pendiente

# Por prioridad
GET /api/tareas?prioridad=alta

# Por rango de fechas
GET /api/tareas?fechaInicio=2025-01-01&fechaFin=2025-12-31

# Combinando filtros
GET /api/tareas?estado=en%20proceso&prioridad=alta
```

**Crear tarea con validación:**
```json
POST /api/tareas
{
  "titulo": "Coordinar catering",
  "descripcion": "Gestionar menú y servicio",
  "area": "Producción y Logística",
  "tipo": "Coordinación con proveedores",
  "estado": "pendiente",
  "prioridad": "alta",
  "empleadoAsignado": "673bef70a24c3c0808d5e7b3",
  "eventoAsignado": "673bef70a24c3c0808d5e7b7",
  "horasEstimadas": 8
}
```

---

## 🌐 Uso de la Interfaz Web

### Páginas Disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Dashboard principal |
| `/clientes` | Lista de clientes |
| `/clientes/nuevo` | Formulario de nuevo cliente |
| `/clientes/:id` | Detalle del cliente |
| `/clientes/editar/:id` | Editar cliente |

### Funcionalidades Web

- ✅ Visualización de datos en tablas responsivas
- ✅ Formularios de creación y edición
- ✅ Confirmación de eliminación
- ✅ Notificaciones con toasts de Bootstrap
- ✅ Navegación con sidebar

---

## 📜 Scripts Disponibles
```bash
# Desarrollo (con auto-restart)
npm start

# Cargar datos de prueba
node seed.js

# Ejecutar sin nodemon
node app.js
```

---

## 🔒 Seguridad

- ✅ Variables sensibles en `.env` (excluido de git)
- ✅ Validación de tipos de datos en Mongoose
- ✅ Validación de ObjectId antes de consultas
- ✅ Manejo de errores en todas las rutas

---

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/NuevaFuncionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/NuevaFuncionalidad`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la Licencia ISC.

---

## Enlaces

- Proyecto: [eventify-backend](https://github.com/micakn/eventify-backend)


---

## 📚 Documentación Adicional

### Conexión a MongoDB Atlas
```javascript
// Configuración en .env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/eventify
```

### Estructura de una Respuesta de Éxito
```json
{
  "mensaje": "Recurso creado exitosamente",
  "data": { ... }
}
```

### Estructura de una Respuesta de Error
```json
{
  "mensaje": "Descripción del error"
}
```

---

**🎉 ¡Gracias por usar Eventify!**