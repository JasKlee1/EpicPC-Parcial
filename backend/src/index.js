const express = require("express");
const morgan = require ("morgan");
const database = require("./database"); 
const cors = require("cors")
const jwt = require("jsonwebtoken"); // 🟢 NECESARIO para seguridad
const dotenv = require("dotenv");
dotenv.config(); // Carga las variables de .env


//Configuración inicial
const app = express();
app.set("port",4000);
app.listen(app.get("port"));
console.log("Escuchando comunicaciones al puerto "+app.get("port"));


//Middlewares
app.use(cors({
    // Permite conexiones desde el frontend local
    origin: ["http://127.0.0.1:5501","http://127.0.0.1:5500"] 
}))
app.use(morgan("dev"))
app.use(express.json()) // Permite leer el body en formato JSON



//LÓGICA DE AUTENTICACIÓN Y MIDDLEWARE DE PROTECCIÓN

const verificarToken = (req, res, next) => {
    // Intenta obtener el token del encabezado Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : null;

    if (!token) {
        return res.status(401).send({ message: "Acceso denegado. Token no proporcionado." });
    }

    try {
        // Verifica el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "CLAVE_SECRETA_ADMIN"); 
        req.user = decoded; 
        next(); // Continúa si el token es válido
    } catch (error) {
        return res.status(401).send({ message: "Token inválido o expirado." });
    }
};

// Ruta de LOGIN (Credenciales Fijas: admin / 1234)
app.post("/admin/login", async (req, res) => {
    const { username, password } = req.body;

    const ADMIN_USER = "admin";
    const ADMIN_PASS = "1234"; 

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        // Generar token con duración de 1 hora
        const token = jwt.sign(
            { id: 1, role: 'admin' }, 
            process.env.JWT_SECRET || "CLAVE_SECRETA_ADMIN", 
            { expiresIn: '1h' }
        );
        
        return res.json({ token });
    } else {
        res.status(401).send({ message: "Credenciales inválidas." });
    }
});


// RUTAS CRUD PROTEGIDAS (PANEL ADMIN)

// 1. OBTENER todos los productos
app.get("/admin/productos", verificarToken, async (req, res) => {
    const connection = await database.getConnection();
    try {
        const result = await connection.query("SELECT * FROM producto");
        res.json(result); 
    } catch (error) {
        console.error("Error en /admin/productos:", error);
        res.status(500).send("Error del servidor al obtener productos.");
    }
});

// 2. CREAR nuevo producto
app.post("/admin/productos", verificarToken, async (req, res) => {
    const { nombre, categoria, precio, urlImagen, descripcion } = req.body;
    
    if (!nombre || !categoria || !precio) {
        return res.status(400).send("Faltan campos obligatorios.");
    }
    
    const connection = await database.getConnection();
    try {
        const query = "INSERT INTO producto (nombre, categoria, precio, urlImagen, descripcion) VALUES (?, ?, ?, ?, ?)";
        const result = await connection.query(query, [nombre, categoria, precio, urlImagen, descripcion]);
        res.status(201).json({ message: "Producto creado", id: result.insertId });
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(500).send("Error del servidor.");
    }
});

// 3. ACTUALIZAR producto (PUT)
app.put("/admin/productos/:id", verificarToken, async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;
    const keys = Object.keys(updateFields);

    if (keys.length === 0) {
        return res.status(400).send("No hay campos para actualizar.");
    }

    const setClauses = keys.map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updateFields), id];

    const connection = await database.getConnection();
    try {
        const query = `UPDATE producto SET ${setClauses} WHERE id = ?`;
        await connection.query(query, values);
        res.json({ message: "Producto actualizado" });
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).send("Error del servidor.");
    }
});

// 4. ELIMINAR producto
app.delete("/admin/productos/:id", verificarToken, async (req, res) => {
    const { id } = req.params;
    const connection = await database.getConnection();
    try {
        const query = "DELETE FROM producto WHERE id = ?";
        await connection.query(query, id);
        res.json({ message: "Producto eliminado" });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).send("Error del servidor.");
    }
});

// 5. OBTENER producto por ID (para editar)
app.get("/admin/productos/:id", verificarToken, async (req, res) => {
    const { id } = req.params;
    const connection = await database.getConnection();
    try {
        const result = await connection.query("SELECT * FROM producto WHERE id = ?", id);
        if (result.length === 0) {
            return res.status(404).send("Producto no encontrado.");
        }
        res.json(result[0]);
    } catch (error) {
        console.error("Error al obtener producto:", error);
        res.status(500).send("Error del servidor.");
    }
});


//RUTAS PÚBLICAS (Tienda)

app.get("/productos", async (req,res) =>{
    const connection = await database.getConnection();
    try {
        const result = await connection.query("SELECT * FROM producto");
        res.json(result); 
    } catch (error) {
        console.error("Error en /productos:", error);
        res.status(500).send("Error del servidor al obtener productos.");
    } 
});

app.post("/carrito/comprar", async (req, res) => {
  if(req.body && req.body.length > 0){
    return res.sendStatus(200);
  }
  res.sendStatus(400)
});