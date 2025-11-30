¡Hola Profe Vermen!

 El proyecto consta de dos partes principales (Frontend y Backend) que deben ejecutarse simultáneamente para que la tienda funcione correctamente y cargue los productos desde la base de datos.


1. Configuración y Ejecución del Backend (Servidor)

El Backend es una API construida con Node.js y Express. Es el encargado de servir los productos y procesar la compra.

Requisitos Previos:
Tener instalado Node.js.
Tener MySQL corriendo para que pueda conectarse a la base de datos.

Pasos de Ejecución:
Clonar el Repositorio
  git clone 

Acceder al Directorio del Backend:
cd [Nombre del Proyecto]/backend 

Instalar Dependencias:
npm install

Base de Datos y Archivo .env (CRÍTICO):
He incluido el archivo .env para que el servidor pueda conectarse a la base de datos remota en clever cloud. No es necesario crear uno nuevo.

Iniciar el Servidor:
En la terminal desde la carpeta backend ejecutar:
npm run dev
El servidor comenzará a escuchar en el puerto 4000. Deberías ver el mensaje: Escuchando comunicaciones al puerto 4000.

3. Ejecución del Frontend (Sitio Web)
El Frontend son los archivos HTML, CSS y JS de la tienda.

Pasos de Ejecución:
Abrir los Archivos: Navega a la carpeta principal del proyecto.
Usar un Live Server: Para abrir el panel principal que es index.html
Abrir la Tienda: Abre el archivo index.html en el navegador a través de tu servidor local. La URL debería ser similar a: http://127.0.0.1:5500/index.html (o puerto 5501).

Verificación:
Si el Backend está corriendo correctamente, la página principal (index.html) mostrará la lista de productos consultados a la base de datos remota.
Si se añade un producto al carrito, la lógica de cartService.js lo guardará en localStorage bajo la clave "carrito".
La página del carrito (cart.html) cargará estos productos desde el localStorage.

¡Quedo atento a cualquier duda!

Saludos,

• Javier Steven Becerra Mantilla
• Jhan Carlos Sanabria Vega
• Yarleidy Valentina Paez Caranton

