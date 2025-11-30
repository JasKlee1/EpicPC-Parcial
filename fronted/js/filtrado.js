// Archivo: filtrado.js

// 1. Seleccionar los elementos
const botonesCategoria = document.querySelectorAll('.btn-categoria');
const tarjetasProducto = document.querySelectorAll('.tarjeta-producto'); // Deben ser todas las tarjetas cargadas

// 2. Función principal de filtrado
function filtrarProductos(categoria) {
    tarjetasProducto.forEach(tarjeta => {
        const categoriaProducto = tarjeta.getAttribute('data-categoria');

        // Lógica de mostrar/ocultar
        if (categoria === 'todos' || categoriaProducto === categoria) {
            tarjeta.style.display = 'flex'; // O 'block', según tu diseño CSS
        } else {
            tarjeta.style.display = 'none';
        }
    });
}

// 3. Asignar el Event Listener a cada botón
botonesCategoria.forEach(boton => {
    boton.addEventListener('click', (e) => {
        // 3.1. Obtener la categoría del ID del botón
        const categoriaSeleccionada = e.currentTarget.id;

        // 3.2. Actualizar la clase 'active' para el estilo visual
        botonesCategoria.forEach(btn => btn.classList.remove('active'));
        e.currentTarget.classList.add('active');

        // 3.3. Ejecutar la función de filtrado
        filtrarProductos(categoriaSeleccionada);
    });
});
