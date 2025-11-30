const contenedorTarjetas = document.getElementById("cart-container");

const cantidadElement = document.getElementById("cantidad");

const precioElement = document.getElementById("precio");

const carritoVacioElement = document.getElementById("carrito-vacio");

const totalesContainer = document.getElementById("totales");



/** Crea las tarjetas de productos teniendo en cuenta lo guardado en localstorage */

function crearTarjetasProductosCarrito() {

  contenedorTarjetas.innerHTML = "";

  const productos = JSON.parse(localStorage.getItem(keyLocalstorage));

  if (productos && productos.length > 0) {

    productos.forEach((producto) => {

      const nuevaPc = document.createElement("div");

      nuevaPc.classList = "tarjeta-producto";

      nuevaPc.innerHTML = `

    <img src="${producto.urlImagen}" alt="PC 1">

    <h3>${producto.nombre}</h3>

    <span>$${producto.precio}</span>

    <div>

    <button>-</button>

    <span class="cantidad">${producto.cantidad}</span>

    <button>+</button>

    </div>

    `;

      contenedorTarjetas.appendChild(nuevaPc);

      nuevaPc

        .getElementsByTagName("button")[0]

        .addEventListener("click", (e) => {

          const cantidadElement = e.target.parentElement.getElementsByClassName("cantidad")[0];

          cantidadElement.innerText = restarAlCarrito(producto);

          crearTarjetasProductosCarrito();

          actualizarTotales();

        });

      nuevaPc

        .getElementsByTagName("button")[1]

        .addEventListener("click", (e) => {

          const cantidadElement = e.target.parentElement.getElementsByClassName("cantidad")[0];

          cantidadElement.innerText = agregarAlCarrito(producto);

          actualizarTotales();

        });

    });

  }

  revisarMensajeVacio();

  actualizarTotales();

  actualizarNumeroCarrito();

}



crearTarjetasProductosCarrito();



/** Actualiza el total de precio y unidades de la página del carrito */

function actualizarTotales() {

  const productos = JSON.parse(localStorage.getItem(keyLocalstorage));

  let cantidad = 0;

  let precio = 0;

  if (productos && productos.length > 0) {

    productos.forEach((producto) => {

      cantidad += producto.cantidad;

      precio += producto.precio * producto.cantidad;

    });

  }

  cantidadElement.innerText = cantidad;

  precioElement.innerText = precio;

  if(precio === 0) {

    reiniciarCarrito();

    revisarMensajeVacio();

  }

}



document.getElementById("reiniciar").addEventListener("click", () => {

  contenedorTarjetas.innerHTML = "";

  reiniciarCarrito();

  revisarMensajeVacio();

});



/** Muestra o esconde el mensaje de que no hay nada en el carrito */

function revisarMensajeVacio() {

  const productos = JSON.parse(localStorage.getItem(keyLocalstorage));

  carritoVacioElement.classList.toggle("escondido", productos);

  totalesContainer.classList.toggle("escondido", !productos);

}



document.getElementById("comprar").addEventListener("click", async () => {
  try {
    const res = await comprarCarrito();

    if (res) {
      reiniciarCarrito();
      // Asegúrate de que esta ruta existe en el servidor (según tu estructura)
      window.location.href = "/fronted/compra-exitosa.html";
    } else {
      alert("No hay productos en el carrito o ocurrió un error al procesar la compra.");
    }
  } catch (err) {
    console.error("Error en el proceso de compra:", err);
    alert("Ocurrió un error. Revisa la consola.");
  }
});


