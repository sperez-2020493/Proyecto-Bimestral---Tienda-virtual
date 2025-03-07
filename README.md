# Guía de Usuario - Ayade

## Descripción del Proyecto
Ayade es una API web desarrollada en Node.js que gestiona el registro de ventas, productos en línea y operaciones comerciales para una empresa. La aplicación está estructurada en dos secciones principales:
- **Administrador**: Gestión de productos, categorías, usuarios y facturas.
- **Cliente**: Autenticación, exploración de productos, gestión de carrito de compras, historial de compras y gestión de perfil.

## Requisitos Previos
Antes de instalar y ejecutar Ayade, asegúrate de tener instalado en tu sistema:
- **Node.js** (versión recomendada: 16 o superior)
- **Git**
- **MongoDB** (como base de datos)

## Instalación
Sigue estos pasos para instalar y ejecutar el proyecto:

### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
```
Reemplaza `<URL_DEL_REPOSITORIO>` con la URL del repositorio de Ayade.

### 2. Acceder al directorio del proyecto
```bash
cd <NOMBRE_DEL_PROYECTO>
```
Reemplaza `<NOMBRE_DEL_PROYECTO>` con el nombre de la carpeta generada al clonar el repositorio.

### 3. Instalar dependencias
Abre un terminal o CMD en la carpeta base del proyecto y ejecuta:
```bash
npm install
```
Este comando instalará todas las dependencias necesarias.

### 4. Ejecutar el servidor
Para iniciar el servidor en modo desarrollo, usa:
```bash
npm run dev
```
O bien, puedes usar:
```bash
npm start dev
```

## Uso del Proyecto
Una vez el servidor esté en ejecución, la API estará disponible en `http://localhost:3000` (o el puerto definido en el archivo de configuración). Puedes interactuar con la API mediante herramientas como **Postman** o **Insomnia**.

## Estructura de Configuración
Dentro de la carpeta `configs`, ubicada en la raíz del proyecto, encontrarás los siguientes archivos importantes:
- **`Tienda virtual.postman_collection.json`**: Archivo de colección para **Postman** que contiene las solicitudes preconfiguradas para probar la API.
- **Carpeta `data`** (dentro de `configs`): Contiene los archivos de la base de datos con los siguientes datos:
  - `storeSystem-2020493;.carts.json`
  - `storeSystem-2020493;.categories.json`
  - `storeSystem-2020493;.facturas.json`
  - `storeSystem-2020493;.productos.json`
  - `storeSystem-2020493;.users.json`

Estos archivos almacenan la información de carritos de compra, categorías, facturas, productos y usuarios, respectivamente.

## Funcionalidades Clave
### Administrador
- **Gestión de Productos**: Agregar, editar, eliminar y visualizar productos.
- **Gestión de Categorías**: Administrar categorías de productos.
- **Gestión de Usuarios**: Registrar, modificar roles y eliminar usuarios.
- **Gestión de Facturas**: Ver y modificar facturas.

### Cliente
- **Autenticación**: Registro e inicio de sesión.
- **Exploración de Productos**: Ver catálogo y buscar productos.
- **Gestión de Carrito**: Agregar productos al carrito.
- **Proceso de Compra**: Completar compras y generar facturas.
- **Historial de Compra**: Revisar compras anteriores.
- **Gestión de Perfil**: Editar información personal y eliminar cuenta.

## Contribución
Si deseas contribuir al desarrollo de Ayade:
1. Realiza un fork del repositorio.
2. Crea una rama para tu nueva funcionalidad (`git checkout -b feature-nueva-funcionalidad`).
3. Realiza tus cambios y súbelos (`git push origin feature-nueva-funcionalidad`).
4. Abre un Pull Request para revisión.

## Contacto
Para más información o soporte, contacta con el equipo de desarrollo.

---
_¡Gracias por usar Ayade!_

### ADMIN POR DEFECTO - CREDENCIALES:
- **Username**: "Admin"
- **Email**: "admin@gmail.com"
- **Password**: "Admin/14"
