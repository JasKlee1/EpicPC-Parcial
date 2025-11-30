const contenedorTarjetas = document.getElementById("productos-container");

// 1. LÓGICA DE FILTRADO (Ahora agrupada y lista para llamarse)

/** Inicializa los event listeners de los botones de filtro */
function inicializarFiltrado() {
    // CLAVE: Seleccionamos los elementos AHORA, después de la carga asíncrona.
    const botonesCategoria = document.querySelectorAll('.btn-categoria');
    // Las tarjetas deben seleccionarse cada vez que se llama al filtro 
    // si el DOM se modifica, pero aquí es suficiente con seleccionarlas al inicio.
    const tarjetasProducto = document.querySelectorAll('.tarjeta-producto'); 

    /** Función principal de filtrado */
    function filtrarProductos(categoria) {
        tarjetasProducto.forEach(tarjeta => {
            const categoriaProducto = tarjeta.getAttribute('data-categoria');

            // Lógica de mostrar/ocultar
            if (categoria === 'todos' || categoriaProducto === categoria) {
                tarjeta.style.display = 'flex'; // O el estilo de display que uses
            } else {
                tarjeta.style.display = 'none';
            }
        });
    }

    // Asignar el Event Listener a cada botón
    botonesCategoria.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const categoriaSeleccionada = e.currentTarget.id;

            // Actualizar la clase 'active' para el estilo visual
            botonesCategoria.forEach(btn => btn.classList.remove('active'));
            e.currentTarget.classList.add('active');

            // Ejecutar la función de filtrado
            filtrarProductos(categoriaSeleccionada);
        });
    });
    
    // Ejecutar un filtro inicial para asegurarse de que todos se vean al cargar
    filtrarProductos('todos');
}


// 2. LÓGICA DE CARGA DE PRODUCTOS

/** Obtiene la lista de productos de la API */
async function getPc(){
    const res = await fetch("http://localhost:4000/productos");
    const resJson = await res.json();
    return resJson;
}

/** Crea las tarjetas de productos, incluyendo el atributo de filtrado */
function crearTarjetasProductosInicio(productos){
    const contenedorTarjetas = document.getElementById("productos-container");
    contenedorTarjetas.innerHTML = ''; 

    productos.forEach(producto => {
        const nuevaPc = document.createElement("div");
        
        // Convertimos las categorías a un formato limpio y en minúsculas:
        // "Alto Rendimiento" -> "alto-rendimiento"
        const categoriaLimpia = producto.categoria.toLowerCase().replace(/\s/g, '-');
        
        nuevaPc.classList = "tarjeta-producto";
        nuevaPc.setAttribute('data-categoria', categoriaLimpia); // ⬅️ Atributo esencial

        nuevaPc.innerHTML = `
        <img src="${producto.urlImagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p class="categoria">${producto.categoria}</p>
        <p class="precio">$${producto.precio}</p>
        <p class="desc">${producto.descripcion}</p>
        <button>Agregar al carrito</button>`;
        
        contenedorTarjetas.appendChild(nuevaPc);
        
        const botonAgregar = nuevaPc.querySelector("button");
        if (botonAgregar) {
             botonAgregar.addEventListener("click", () => agregarAlCarrito(producto));
        }
    });
}

// El resto de la lógica de inicialización permanece igual, ya que la sincronización es correcta:
getPc().then(pc => {
  crearTarjetasProductosInicio(pc);
  inicializarFiltrado(); 
})