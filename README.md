# Eventify - Sistema de Gestión de Eventos

## Descripción

Eventify es una aplicación web backend desarrollada con Node.js, Express y MongoDB Atlas para la gestión integral de eventos. El sistema permite administrar clientes, empleados, eventos y tareas organizadas por áreas de trabajo.

## Equipo de Desarrollo

- **Micaela**
- **Gerardo**

## Tecnologías Utilizadas

- **Node.js** v16+
- **Express** v4.18.2
- **MongoDB Atlas** con Mongoose v8.19.2
- **Pug** v3.0.2 (Motor de plantillas)
- **JWT** (Autenticación)
- **bcryptjs** (Encriptación de contraseñas)
- **Bootstrap 5** (Frontend)

## Características Principales

### Módulos del Sistema

1. **Gestión de Clientes**
   - CRUD completo de clientes
   - Registro de información de contacto y empresas
   - Tipos de cliente (individual/empresa)

2. **Gestión de Empleados**
   - Administración de personal
   - Roles: Administrador, Planner, Coordinador
   - Áreas: Producción y Logística, Planificación y Finanzas, Atención al Cliente, Administración

3. **Gestión de Eventos**
   - Creación y seguimiento de eventos
   - Asignación de clientes y empleados responsables
   - Control de fechas, lugar y presupuesto
   - Estados: Activo, Pendiente, Finalizado, Cancelado

4. **Gestión de Tareas**
   - Tareas organizadas por área y tipo
   - Asignación a empleados y eventos
   - Control de estado y prioridad
   - Seguimiento de horas estimadas vs. reales

### Sistema de Autenticación

- Registro e inicio de sesión de usuarios
- Autenticación con JWT almacenado en cookies
- Middleware de verificación de autenticación
- Protección de rutas

## Estructura del Proyecto

```
eventify-backend/
├── controllers/          # Lógica de negocio
├── models/              # Esquemas de Mongoose
├── routes/              # Definición de rutas API y Web
├── views/               # Plantillas Pug
├── middleware/          # Middlewares personalizados
├── db/                  # Configuración de base de datos
├── public/              # Archivos estáticos
├── tests/               # Pruebas unitarias
├── app.js               # Configuración principal
├── seed.js              # Carga de datos iniciales
└── .env                 # Variables de entorno
```

## Instalación y Configuración

### Requisitos Previos

- Node.js v16 o superior
- Cuenta en MongoDB Atlas
- NPM o Yarn

### Pasos de Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/micakn/eventify-backend.git
cd eventify-backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:

Crear archivo `.env` en la raíz del proyecto:
```env
PORT=3000
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/eventify
JWT_SECRET=tu_clave_secreta_aqui
JWT_EXPIRES_IN=7d
```

4. Cargar datos iniciales (opcional):
```bash
node seed.js
```

5. Iniciar el servidor:
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## Uso de la API

### Autenticación

#### Registro de Usuario
```
POST /auth/registro
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "passwordConfirm": "password123",
  "rol": "coordinador",
  "area": "Producción y Logística"
}
```

#### Inicio de Sesión
```
POST /auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

### Endpoints Principales

Todas las rutas API requieren autenticación mediante JWT en cookies.

#### Clientes
- `GET /api/clientes` - Listar todos los clientes
- `GET /api/clientes/:id` - Obtener un cliente
- `POST /api/clientes` - Crear cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente

#### Empleados
- `GET /api/empleados` - Listar empleados
- `POST /api/empleados` - Crear empleado
- `PUT /api/empleados/:id` - Actualizar empleado
- `DELETE /api/empleados/:id` - Eliminar empleado

#### Eventos
- `GET /api/eventos` - Listar eventos
- `POST /api/eventos` - Crear evento
- `PUT /api/eventos/:id` - Actualizar evento
- `DELETE /api/eventos/:id` - Eliminar evento

#### Tareas
- `GET /api/tareas` - Listar tareas (con filtros opcionales)
- `POST /api/tareas` - Crear tarea
- `PUT /api/tareas/:id` - Actualizar tarea
- `DELETE /api/tareas/:id` - Eliminar tarea

### Filtros en Tareas

```
GET /api/tareas?estado=pendiente
GET /api/tareas?prioridad=alta
GET /api/tareas?empleadoAsignado=ID_EMPLEADO
GET /api/tareas?fechaInicio=2025-01-01&fechaFin=2025-12-31
```

## Testing

El proyecto incluye pruebas unitarias con Jest y Supertest.

### Ejecutar Pruebas

```bash
npm test
```

### Ejecutar Pruebas en Modo Watch
```bash
npm run test:watch
```

Las pruebas cubren:
- Operaciones CRUD de clientes
- Operaciones CRUD de empleados
- Validaciones de datos
- Manejo de errores

## Decisiones Técnicas

### Base de Datos
Se eligió MongoDB Atlas por su flexibilidad para manejar datos no relacionales y su fácil integración con Node.js mediante Mongoose. La estructura de documentos permite almacenar relaciones mediante referencias (ObjectId) y utilizar `populate()` para obtener datos relacionados.

### Autenticación
Se implementó JWT con almacenamiento en cookies HttpOnly por seguridad. Esto previene ataques XSS y facilita el manejo de sesiones en aplicaciones web.

### Patrón MVC
La arquitectura MVC separa la lógica de negocio (controllers), los datos (models) y la presentación (views), facilitando el mantenimiento y la escalabilidad del código.

### Validaciones
Las validaciones se realizan en dos niveles:
1. Esquema de Mongoose (validaciones de base de datos)
2. Controladores (validaciones de lógica de negocio)

## Scripts Disponibles

```bash
npm start          # Iniciar servidor con nodemon
npm test           # Ejecutar pruebas
npm run test:watch # Ejecutar pruebas en modo watch
node seed.js       # Cargar datos de prueba
```

## Seguridad

- Contraseñas encriptadas con bcrypt
- Tokens JWT con expiración configurable
- Cookies HttpOnly para prevenir XSS
- Validación de ObjectId antes de consultas
- Variables sensibles en archivo .env
- Middleware de autenticación en rutas protegidas

## Estado del Proyecto

Versión: 2.0

### Mejoras Implementadas (vs. Versión 1.0)

- Sistema completo de autenticación y autorización
- Protección de rutas mediante middleware
- Interfaz web con Pug y Bootstrap
- Validaciones mejoradas en modelos y controladores
- Gestión de relaciones entre entidades
- Filtrado avanzado de tareas
- Manejo de errores robusto
- Testing unitario implementado

### Limitaciones Conocidas

- No implementa paginación en listados grandes
- Sin rate limiting en API
- Logs de actividad pendientes
- Sistema de roles básico (sin permisos granulares)


## Licencia

ISC

## Repositorio

[https://github.com/micakn/eventify-backend](https://github.com/micakn/eventify-backend)

## Contacto

Para consultas o soporte, contactar a los desarrolladores del proyecto.