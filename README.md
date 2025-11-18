# Eventify - Sistema de Gestión de Eventos

**Eventify** es un sistema backend integral desarrollado con **Node.js, Express y MongoDB Atlas**, diseñado para gestionar eventos, empleados, clientes y tareas con un completo sistema de autenticación y autorización basado en roles.

---

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Nuevas Características - Versión 1.1](#nuevas-características---versión-11)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Características Principales](#características-principales)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Modelos de Datos](#modelos-de-datos)
- [Sistema de Autenticación](#sistema-de-autenticación)
- [Áreas, Roles y Permisos](#áreas-roles-y-permisos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Endpoints de la API](#endpoints-de-la-api)
- [Uso de la Interfaz Web](#uso-de-la-interfaz-web)
- [Scripts Disponibles](#scripts-disponibles)
- [Cambios y Mejoras](#cambios-y-mejoras)
- [Equipo de Desarrollo](#equipo-de-desarrollo)

---

## Descripción General

Eventify es un sistema completo de gestión de eventos que permite:

- Gestión de Usuarios con autenticación JWT y roles diferenciados
- CRUD Completo de clientes, empleados, eventos y tareas
- Validación de Permisos según el rol del usuario
- Asignación Inteligente de tareas según área de trabajo
- Filtrado Avanzado de información
- Interfaz Web Responsiva con Bootstrap 5
- API REST completamente documentada

---

## Nuevas Características - Versión 1.1

### Sistema de Autenticación y Autorización

La versión 1.1 introduce un completo sistema de gestión de usuarios con:

#### Autenticación JWT
- Registro de usuarios con validación de datos
- Login con generación de tokens JWT
- Cookies HTTP-only para mayor seguridad
- Tokens con expiración configurable (7 días por defecto)
- Middleware de verificación de autenticación

#### Gestión de Usuarios
```javascript
// Modelo de Usuario
{
  nombre: String,
  email: String (único),
  password: String (encriptado con bcrypt),
  rol: 'administrador' | 'planner' | 'coordinador',
  area: String,
  activo: Boolean
}
```

#### Control de Acceso
- Todas las rutas protegidas con middleware `verificarAuth`
- Middleware `verificarRol` para permisos específicos
- Información del usuario disponible en todas las vistas
- Redirección automática a login para usuarios no autenticados

#### Mejoras en la Interfaz
- Header con información del usuario actual
- Dropdown de perfil con opciones personalizadas
- Indicadores visuales de sesión en el sidebar
- Vistas protegidas con mensajes claros de acceso denegado
- Vista de perfil del usuario

---

## Tecnologías Utilizadas

| Tecnología | Descripción | Versión |
|------------|-------------|---------|
| **Node.js** | Entorno de ejecución JavaScript | 16+ |
| **Express** | Framework web minimalista | 4.18.2 |
| **MongoDB Atlas** | Base de datos NoSQL en la nube | - |
| **Mongoose** | ODM para MongoDB | 8.19.2 |
| **JWT** | JSON Web Tokens para autenticación | 9.0.2 |
| **Bcrypt.js** | Encriptación de contraseñas | 3.0.3 |
| **Cookie Parser** | Manejo de cookies | 1.4.7 |
| **Pug** | Motor de plantillas | 3.0.2 |
| **Bootstrap 5** | Framework CSS | 5.3.0 |
| **Dotenv** | Gestión de variables de entorno | 16.6.1 |
| **Nodemon** | Reinicio automático en desarrollo | 3.1.10 |

---

## Características Principales

### Sistema de Seguridad

#### Encriptación de Contraseñas
```javascript
// Pre-save hook en el modelo de Usuario
UsuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```

#### Generación de Tokens JWT
```javascript
export function generarToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}
```

#### Middleware de Autenticación
```javascript
export async function verificarAuth(req, res, next) {
  const token = req.cookies?.token || 
                req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).render('auth/login', {
      error: 'Debes iniciar sesión'
    });
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const usuario = await UsuarioModel.getById(decoded.id);
  
  req.usuario = usuario;
  res.locals.usuario = usuario;
  next();
}
```

### Validación de Tareas por Área

El sistema valida automáticamente que cada tarea pertenezca a los tipos permitidos según su área:
```json
{
  "area": "Producción y Logística",
  "tipo": "Coordinación con proveedores"
}
```

Si se intenta asignar un tipo inválido:
```json
{
  "mensaje": "Tarea inválida para el área seleccionada"
}
```

### Filtrado Avanzado de Tareas
```bash
# Por estado
GET /api/tareas?estado=pendiente

# Por prioridad
GET /api/tareas?prioridad=alta

# Por empleado
GET /api/tareas?empleadoAsignado=673bef70a24c3c0808d5e7b3

# Por rango de fechas
GET /api/tareas?fechaInicio=2025-01-01&fechaFin=2025-12-31
```

---

## Estructura del Proyecto
```
eventify-backend/
│
├── controllers/           # Lógica de negocio
│   ├── authController.js       # NUEVO: Autenticación
│   ├── ClienteController.js
│   ├── ClienteWebController.js
│   ├── EmpleadoController.js
│   ├── EmpleadoWebController.js
│   ├── EventoController.js
│   ├── EventoWebController.js
│   ├── TareaController.js
│   └── TareaWebController.js
│
├── middleware/           # NUEVO: Middlewares personalizados
│   └── auth.js          # Verificación JWT y roles
│
├── models/              # Esquemas de Mongoose
│   ├── UsuarioModel.js  # NUEVO: Modelo de Usuario
│   ├── ClienteModel.js
│   ├── EmpleadoModel.js
│   ├── EventoModel.js
│   └── TareaModel.js
│
├── routes/              # Definición de rutas
│   ├── authRoutes.js    # NUEVO: Rutas de autenticación
│   ├── clienteRoutes.js
│   ├── clienteWebRoutes.js
│   ├── empleadoRoutes.js
│   ├── empleadoWebRoutes.js
│   ├── eventoRoutes.js
│   ├── eventoWebRoutes.js
│   ├── tareaRoutes.js
│   └── tareaWebRoutes.js
│
├── views/               # Plantillas Pug
│   ├── auth/           # NUEVO: Vistas de autenticación
│   │   ├── login.pug
│   │   ├── registro.pug
│   │   └── perfil.pug
│   ├── layout/
│   │   └── layout.pug  # ACTUALIZADO: Header con usuario
│   ├── clientes/
│   ├── empleados/
│   ├── eventos/
│   ├── tareas/
│   ├── index.pug       # ACTUALIZADO: Dashboard condicional
│   └── error.pug
│
├── publics/             # Archivos estáticos
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── filtros.js
│
├── db/                  # Configuración de BD
│   └── mongoose.js
│
├── .env                 # ACTUALIZADO: Variables de entorno
├── .gitignore
├── app.js              # ACTUALIZADO: Configuración principal
├── seed.js
├── package.json
└── README.md
```

---

## Modelos de Datos

### Usuario (NUEVO)
```javascript
{
  nombre: String (requerido),
  email: String (requerido, único, lowercase),
  password: String (requerido, encriptado, min: 6),
  rol: String (enum: ['administrador', 'planner', 'coordinador']),
  area: String (enum: ['Producción y Logística', 'Planificación y Finanzas', 
                       'Atención al Cliente', 'Administración']),
  activo: Boolean (default: true),
  timestamps: true
}
```

**Métodos del modelo:**
- `getAll()` - Lista usuarios activos
- `getById(id)` - Obtiene usuario por ID (sin password)
- `getByEmail(email)` - Busca usuario por email (con password)
- `add(usuario)` - Crea nuevo usuario
- `update(id, datos)` - Actualiza usuario
- `remove(id)` - Soft delete (marca como inactivo)

**Métodos de instancia:**
- `compararPassword(passwordIngresado)` - Verifica contraseña

### Cliente
```javascript
{
  nombre: String (requerido),
  email: String (requerido, lowercase),
  telefono: String,
  empresa: String,
  notas: String,
  timestamps: true
}
```

### Empleado
```javascript
{
  nombre: String (requerido),
  rol: String (enum: ['administrador', 'planner', 'coordinador']),
  area: String (enum: ['Producción y Logística', 'Planificación y Finanzas', 
                       'Atención al Cliente', 'Administración']),
  email: String (lowercase),
  telefono: String,
  timestamps: true
}
```

### Evento
```javascript
{
  nombre: String (requerido),
  descripcion: String,
  fechaInicio: Date (requerido),
  fechaFin: Date (requerido),
  lugar: String,
  presupuesto: Number (default: 0),
  tipo: String (enum: ['conferencia', 'workshop', 'networking', 'social', 
                       'deportivo', 'cultural', 'educativo', 'corporativo']),
  estado: String (enum: ['activo', 'pendiente', 'cancelado', 'finalizado']),
  clienteId: ObjectId (ref: 'Cliente'),
  empleadoId: ObjectId (ref: 'Empleado'),
  timestamps: true
}
```

### Tarea
```javascript
{
  titulo: String (requerido),
  descripcion: String,
  estado: String (enum: ['pendiente', 'en proceso', 'finalizada']),
  fechaInicio: Date,
  fechaFin: Date,
  prioridad: String (enum: ['baja', 'media', 'alta']),
  area: String (enum: ['Producción y Logística', 'Planificación y Finanzas']),
  tipo: String (requerido),
  empleadoAsignado: ObjectId (ref: 'Empleado'),
  eventoAsignado: ObjectId (ref: 'Evento'),
  horasEstimadas: Number (default: 0),
  horasReales: Number (default: 0),
  timestamps: true
}
```

---

## Sistema de Autenticación

### Flujo de Autenticación
```
1. Usuario → POST /auth/registro → Validación → Hash Password → JWT → Cookie → Dashboard
2. Usuario → POST /auth/login → Verificación → JWT → Cookie → Dashboard
3. Dashboard → Middleware verificarAuth → Verifica JWT → Continúa o Redirige a Login
```

### Variables de Entorno Requeridas
```env
# Base de datos
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/eventify

# Servidor
PORT=3000

# JWT (NUEVO)
JWT_SECRET=tu_clave_secreta_muy_segura_y_larga
JWT_EXPIRES_IN=7d
```

### Rutas de Autenticación

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|---------|
| GET | `/auth/registro` | Formulario de registro | Público |
| POST | `/auth/registro` | Procesar registro | Público |
| GET | `/auth/login` | Formulario de login | Público |
| POST | `/auth/login` | Procesar login | Público |
| GET | `/auth/logout` | Cerrar sesión | Público |
| GET | `/auth/perfil` | Ver perfil | Protegido |

---

## Áreas, Roles y Permisos

### Roles del Sistema

#### Administrador
- Control total del sistema
- Gestión de usuarios
- Acceso a todas las áreas
- Permisos de creación, edición y eliminación

#### Planner
- Planificación de eventos
- Gestión de presupuestos
- Control de cronogramas
- Firma de contratos

#### Coordinador
- Logística de eventos
- Coordinación con proveedores
- Montaje y desmontaje
- Verificación técnica

### Áreas de Trabajo

#### Producción y Logística
**Tareas válidas:**
- Coordinación con proveedores
- Montaje de escenario o mobiliario
- Verificación técnica previa al evento

#### Planificación y Finanzas
**Tareas válidas:**
- Carga y control del presupuesto del evento
- Firma de contratos con clientes/proveedores
- Seguimiento del cronograma y fechas clave

#### Administración
**Tareas válidas:**
- Gestión de usuarios del sistema
- Control de permisos y accesos

---

## Instalación y Configuración

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
JWT_SECRET=tu_clave_secreta_muy_segura_y_larga_minimo_32_caracteres
JWT_EXPIRES_IN=7d
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

### Primer Usuario

Para crear el primer usuario administrador:

1. Accede a `http://localhost:3000/auth/registro`
2. Completa el formulario:
   - Nombre: Tu nombre
   - Email: tu@email.com
   - Contraseña: mínimo 6 caracteres
   - Rol: Administrador
   - Área: Administración

---

## Endpoints de la API

### Autenticación (NUEVO)

| Método | Endpoint | Descripción | Auth | Body |
|--------|----------|-------------|------|------|
| POST | `/auth/registro` | Registrar usuario | No | `{nombre, email, password, passwordConfirm, rol, area}` |
| POST | `/auth/login` | Iniciar sesión | No | `{email, password}` |
| GET | `/auth/logout` | Cerrar sesión | No | - |
| GET | `/auth/perfil` | Ver perfil | Sí | - |

**Ejemplo de registro:**
```json
POST /auth/registro
{
  "nombre": "Juan Pérez",
  "email": "juan@eventify.com",
  "password": "password123",
  "passwordConfirm": "password123",
  "rol": "planner",
  "area": "Planificación y Finanzas"
}
```

**Ejemplo de login:**
```json
POST /auth/login
{
  "email": "juan@eventify.com",
  "password": "password123"
}
```

### Clientes

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/clientes` | Listar todos | Sí |
| GET | `/api/clientes/:id` | Obtener uno | Sí |
| POST | `/api/clientes` | Crear nuevo | Sí |
| PUT | `/api/clientes/:id` | Actualizar completo | Sí |
| PATCH | `/api/clientes/:id` | Actualizar parcial | Sí |
| DELETE | `/api/clientes/:id` | Eliminar | Sí |

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

### Empleados

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/empleados` | Listar todos | Sí |
| GET | `/api/empleados/:id` | Obtener uno | Sí |
| POST | `/api/empleados` | Crear nuevo | Sí |
| PATCH | `/api/empleados/:id` | Actualizar | Sí |
| DELETE | `/api/empleados/:id` | Eliminar | Sí |

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

### Eventos

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/eventos` | Listar todos | Sí |
| GET | `/api/eventos/:id` | Obtener uno | Sí |
| POST | `/api/eventos` | Crear nuevo | Sí |
| PATCH | `/api/eventos/:id` | Actualizar | Sí |
| DELETE | `/api/eventos/:id` | Eliminar | Sí |

### Tareas

| Método | Endpoint | Descripción | Auth | Filtros |
|--------|----------|-------------|------|---------|
| GET | `/api/tareas` | Listar/filtrar | Sí | `estado, prioridad, empleadoAsignado, eventoAsignado, fechaInicio, fechaFin` |
| GET | `/api/tareas/:id` | Obtener una | Sí | - |
| POST | `/api/tareas` | Crear | Sí | - |
| PATCH | `/api/tareas/:id` | Actualizar | Sí | - |
| DELETE | `/api/tareas/:id` | Eliminar | Sí | - |

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

## Uso de la Interfaz Web

### Páginas Disponibles

| Ruta | Descripción | Auth | Rol |
|------|-------------|------|-----|
| `/` | Dashboard principal | Sí | Todos |
| `/auth/login` | Iniciar sesión | No | - |
| `/auth/registro` | Registro de usuarios | No | - |
| `/auth/perfil` | Perfil del usuario | Sí | Todos |
| `/clientes` | Lista de clientes | Sí | Todos |
| `/clientes/nuevo` | Nuevo cliente | Sí | Todos |
| `/clientes/:id` | Detalle del cliente | Sí | Todos |
| `/clientes/editar/:id` | Editar cliente | Sí | Todos |
| `/empleados` | Lista de empleados | Sí | Todos |
| `/empleados/crear` | Nuevo empleado | Sí | Todos |
| `/empleados/editar/:id` | Editar empleado | Sí | Todos |
| `/eventos` | Lista de eventos | Sí | Todos |
| `/eventos/crear` | Nuevo evento | Sí | Todos |
| `/eventos/editar/:id` | Editar evento | Sí | Todos |
| `/tareas` | Lista de tareas | Sí | Todos |
| `/tareas/crear` | Nueva tarea | Sí | Todos |
| `/tareas/editar/:id` | Editar tarea | Sí | Todos |

### Funcionalidades Web

- Sistema de login/registro completo
- Header con información del usuario
- Dropdown de perfil con opciones
- Indicadores de sesión en sidebar
- Dashboard con estadísticas personalizadas
- Visualización de datos en tablas responsivas
- Formularios de creación y edición
- Confirmación de eliminación
- Notificaciones con toasts de Bootstrap
- Navegación con sidebar
- Filtrado y búsqueda de datos

---

## Scripts Disponibles
```bash
# Desarrollo (con auto-restart)
npm start

# Cargar datos de prueba
node seed.js

# Ejecutar sin nodemon
node app.js
```

---

## Cambios y Mejoras

### Versión 1.1 (Noviembre 2025)

#### Nuevas Características

1. **Sistema de Autenticación JWT**
   - Implementación completa de registro y login
   - Tokens JWT con cookies HTTP-only
   - Encriptación de contraseñas con bcrypt
   - Middleware de verificación de autenticación

2. **Modelo de Usuario**
   - Nuevo modelo con roles y permisos
   - Validaciones de email único
   - Soft delete para usuarios
   - Métodos de comparación de contraseñas

3. **Control de Acceso**
   - Middleware `verificarAuth` para rutas protegidas
   - Middleware `verificarRol` para permisos específicos
   - Protección de todas las rutas principales
   - Redirección automática a login

4. **Mejoras en la Interfaz**
   - Header con información del usuario
   - Dropdown de perfil personalizado
   - Vista de perfil del usuario
   - Indicadores de sesión en sidebar
   - Dashboard condicional según autenticación

5. **Seguridad**
   - Variables de entorno para JWT_SECRET
   - Cookies con httpOnly
   - Validación de tokens en cada request
   - Manejo seguro de contraseñas

#### Mejoras Técnicas

1. **Estructura del Proyecto**
   - Nueva carpeta `/middleware`
   - Nuevo modelo `UsuarioModel.js`
   - Nuevas vistas en `/views/auth`
   - Controller de autenticación

2. **Configuración**
   - Nuevas variables de entorno
   - Middleware global de usuario
   - Cookie parser configurado
   - Routes de autenticación

3. **Vistas**
   - Layout actualizado con header de usuario
   - Vista de login responsiva
   - Vista de registro con validaciones
   - Vista de perfil personalizada
   - Index condicional según sesión

#### Correcciones

- Manejo mejorado de errores en autenticación
- Validación de campos en formularios
- Redirecciones correctas tras login/logout
- Compatibilidad mejorada con MongoDB ObjectId

### Versión 1.0 (Octubre 2025)

#### Características Iniciales

1. **CRUD Completo**
   - Clientes, Empleados, Eventos y Tareas
   - API REST con Express
   - Vistas web con Pug

2. **Base de Datos**
   - MongoDB Atlas
   - Mongoose ODM
   - Modelos con validaciones

3. **Interfaz Web**
   - Bootstrap 5
   - Sidebar de navegación
   - Tablas responsivas
   - Formularios de creación/edición

4. **Funcionalidades**
   - Filtrado de tareas
   - Validación de tipos por área
   - Relaciones entre modelos
   - Populate de referencias

---

## Seguridad

### Medidas Implementadas

1. **Autenticación**
   - JWT con firma secreta
   - Cookies HTTP-only (no accesibles desde JavaScript)
   - Expiración de tokens configurable
   - Validación en cada request

2. **Contraseñas**
   - Hash con bcrypt (10 salts)
   - Nunca se devuelven en las respuestas
   - Validación de longitud mínima (6 caracteres)
   - Comparación segura con bcrypt.compare

3. **Base de Datos**
   - Variables sensibles en `.env`
   - Validación de ObjectId
   - Validación de tipos de datos en Mongoose
   - Manejo de errores en consultas

4. **API**
   - Protección de rutas con middleware
   - Validación de permisos por rol
   - Manejo de errores personalizado

---

## Equipo de Desarrollo

### Integrantes y Roles

| Nombre | Rol | Responsabilidades |
|--------|-----|-------------------|
| Micaela | Full Stack Developer | Backend, Autenticación,  API REST, Documentación|
| Gerardo | Full Stack Developer | Controladores, Modelos,  Testing,  Vistas|

### Distribución de Tareas

#### Sprint 1 - Sistema Base
- **Micaela**: Configuración inicial, modelos base, conexión MongoDB, vistas iniciales
- **Gerardo**: Controladores CRUD, rutas API, testing de endpoints

#### Sprint 2 - Autenticación
- **Micaela**: Modelo de Usuario, vistas de login/registro/perfil, header con usuario
- **Gerardo**: JWT implementation, middleware de auth, validaciones, testing de autenticación

#### Sprint 3 - Mejoras y Testing
- **Micaela**: Refinamiento UI/UX, responsive design, optimización de vistas
- **Gerardo**: Manejo de errores, validaciones adicionales, documentación completa

---

## Licencia

Este proyecto está bajo la Licencia ISC.

---

## Enlaces

- Repositorio: [eventify-backend](https://github.com/micakn/eventify-backend)
- Documentación Adicional: Ver PDF adjunto

---

**Gracias por usar Eventify**