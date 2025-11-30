// Importo la librería promise-mysql para poder trabajar con MySQL usando promesas,
// lo cual facilita el manejo de operaciones asíncronas dentro del proyecto.
const mysql = require("promise-mysql");

// Importo dotenv para poder usar variables de entorno desde un archivo .env
// y así evitar mostrar datos sensibles directamente en el código.
const dotenv = require("dotenv");
dotenv.config(); 

// Aquí creo la conexión a la base de datos. Uso createConnection()
// y paso un objeto con la configuración necesaria.
const connection = mysql.createConnection({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: parseInt(process.env.PORT, 10) // Convierto el puerto a número porque .env lo da como texto
});

// Esta función devuelve la conexión creada.
const getConnection = () => connection;

module.exports = {
    getConnection
};
