const cuentaCarritoElement = document.getElementById("cuenta-carrito");
const keyLocalstorage = "pc"; // clave usada en todo el proyecto

function getNuevoProductoParaMemoria(producto){
    const nuevoProducto = {...producto};
    nuevoProducto.cantidad = 1;
    return nuevoProducto;
}

function actualizarNumeroCarrito(){
    try {
        let cuenta = 0;
        const memoria = JSON.parse(localStorage.getItem(keyLocalstorage));
        if(memoria && memoria.length > 0){
            cuenta = memoria.reduce((acum, current)=>acum + current.cantidad, 0);
            if (cuentaCarritoElement) cuentaCarritoElement.innerText = cuenta;
            return cuenta;
        }
        if (cuentaCarritoElement) cuentaCarritoElement.innerText = 0;
        return 0;
    } catch(e) {
        console.warn("Error leyendo el carrito:", e);
        if (cuentaCarritoElement) cuentaCarritoElement.innerText = 0;
        return 0;
    }
}

function reiniciarCarrito(){
    localStorage.removeItem(keyLocalstorage);
    actualizarNumeroCarrito();
}

function agregarAlCarrito(producto){
    let memoria = JSON.parse(localStorage.getItem(keyLocalstorage));
    let cantidadProductoFinal;

    if(!memoria || memoria.length === 0) {
        const nuevoProducto = getNuevoProductoParaMemoria(producto)
        localStorage.setItem(keyLocalstorage, JSON.stringify([nuevoProducto]));
        cantidadProductoFinal = 1;
    } else {
        const indiceProducto = memoria.findIndex(pc => pc.id === producto.id)
        const nuevaMemoria = memoria;
        if(indiceProducto === -1){
            const nuevoProducto = getNuevoProductoParaMemoria(producto);
            nuevaMemoria.push(nuevoProducto);
            cantidadProductoFinal = 1;
        } else {
            nuevaMemoria[indiceProducto].cantidad ++;
            cantidadProductoFinal = nuevaMemoria[indiceProducto].cantidad;
        }
        localStorage.setItem(keyLocalstorage, JSON.stringify(nuevaMemoria));
    }
    actualizarNumeroCarrito();
    return cantidadProductoFinal;
}

function restarAlCarrito(producto){
    let memoria = JSON.parse(localStorage.getItem(keyLocalstorage));
    if(!memoria) {
        console.warn("Error restando al carrito: Carrito no encontrado en memoria");
        return 0;
    }

    const indiceProducto = memoria.findIndex(pc => pc.id === producto.id)
    if (indiceProducto === -1) return 0;

    let nuevaMemoria = memoria;
    nuevaMemoria[indiceProducto].cantidad--;
    let cantidadProductoFinal = nuevaMemoria[indiceProducto].cantidad;

    if(cantidadProductoFinal === 0){
        nuevaMemoria.splice(indiceProducto,1)
    };

    localStorage.setItem(keyLocalstorage, JSON.stringify(nuevaMemoria));
    actualizarNumeroCarrito();
    return cantidadProductoFinal;
}

/*comprarCarrito: */
async function comprarCarrito(){
    const carrito = JSON.parse(localStorage.getItem(keyLocalstorage));
    if(!carrito || carrito.length === 0) return false;

    try {
        return true;
    } catch (err) {
        console.warn("Error enviando la orden:", err);
        // En desarrollo local permitimos seguir y redirigir (evita bloqueo por falta de backend)
        return true;
    }
}

// Ejecutar inicializaciones
actualizarNumeroCarrito();
