const http = require("http"); 
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");

const PORT = process.env.PORT || 3000;

const routes = require("./routes/routes")


//Creación del servidor
http.createServer( (req, res) => {

    routes(req, res);

}).listen(PORT, () => {
    console.log(`Server is up and listening by port ${PORT} - Process id: ${process.pid}`);
})