
const API_URL = 'http://localhost:4000';

// LÓGICA DE AUTORIZACIÓN y LOGOUT

function getAuthHeaders() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        // Si no hay token, redirige al login
        window.location.href = 'login.html'; 
        return null;
    }
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // ⬅️ ENVIAR TOKEN EN CADA PETICIÓN
    };
}

function logout() {
    localStorage.removeItem('jwtToken');
    window.location.href = 'login.html';
}

// CARGA Y ELIMINACIÓN (CRUD R y D)

async function cargarProductosAdmin() {
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
        const res = await fetch(`${API_URL}/admin/productos`, { headers });
        
        if (res.status === 401) {
            alert("Sesión expirada o no autorizada.");
            logout();
            return;
        }

        const productos = await res.json();
        
        const tbody = document.getElementById('productos-tbody');
        tbody.innerHTML = productos.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>${p.nombre}</td>
                <td>${p.categoria}</td>
                <td>$${p.precio}</td>
                <td>
                    <button onclick="mostrarFormularioEdicion(${p.id})">Editar</button>
                    <button onclick="eliminarProducto(${p.id})" style="background-color: #cc0000;">Eliminar</button>
                </td>
            </tr>
        `).join('');

    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

async function eliminarProducto(id) {
    if (!confirm(`¿Estás seguro de eliminar el producto con ID ${id}?`)) return;

    const headers = getAuthHeaders();
    if (!headers) return;

    try {
        const res = await fetch(`${API_URL}/admin/productos/${id}`, {
            method: 'DELETE',
            headers: headers
        });

        if (res.ok) {
            alert('Producto eliminado exitosamente.');
            cargarProductosAdmin(); 
        } else {
            alert('Error al eliminar producto.');
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
}

// GESTIÓN DEL FORMULARIO (CRUD C y U)

function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('formTitle').innerText = 'Añadir';
    document.getElementById('submitButton').innerText = 'Añadir Producto';
}

function mostrarFormularioCreacion() {
    resetForm();
    document.getElementById('productFormContainer').style.display = 'block';
}

async function mostrarFormularioEdicion(id) {
    resetForm();
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
        const res = await fetch(`${API_URL}/admin/productos/${id}`, { headers });
        if (res.status === 401) { logout(); return; }
        if (!res.ok) { alert('Error al cargar datos del producto.'); return; }

        const producto = await res.json();

        // Llenar formulario
        document.getElementById('product-id').value = producto.id;
        document.getElementById('nombre').value = producto.nombre;
        document.getElementById('categoria').value = producto.categoria;
        document.getElementById('precio').value = producto.precio;
        document.getElementById('urlImagen').value = producto.urlImagen || '';
        document.getElementById('descripcion').value = producto.descripcion || '';

        document.getElementById('formTitle').innerText = 'Editar';
        document.getElementById('submitButton').innerText = 'Guardar Cambios';
        document.getElementById('productFormContainer').style.display = 'block';

    } catch (error) {
        console.error("Error al cargar producto para edición:", error);
    }
}


document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('product-id').value;
    const isEdit = !!id;
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `${API_URL}/admin/productos/${id}` : `${API_URL}/admin/productos`;

    const data = {
        nombre: document.getElementById('nombre').value,
        categoria: document.getElementById('categoria').value,
        precio: parseFloat(document.getElementById('precio').value),
        urlImagen: document.getElementById('urlImagen').value,
        descripcion: document.getElementById('descripcion').value,
    };

    const headers = getAuthHeaders();
    if (!headers) return;

    try {
        const res = await fetch(url, {
            method: method,
            headers: headers,
            body: JSON.stringify(data)
        });

        if (res.ok) {
            alert(`Producto ${isEdit ? 'actualizado' : 'añadido'} con éxito.`);
            document.getElementById('productFormContainer').style.display = 'none';
            cargarProductosAdmin();
        } else {
            alert(`Error al ${isEdit ? 'actualizar' : 'añadir'} producto.`);
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
});


//Inicialización: Verifica token y carga la tabla al inicio
cargarProductosAdmin();