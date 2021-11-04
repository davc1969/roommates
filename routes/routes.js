// routing for the server

const fs = require("fs");

const controllerRoommates = require("./../controllers/roommates");

const controllerGastos = require("./../controllers/gastos")


const routes = (req, res) => {

    let roommiesJSON = JSON.parse(fs.readFileSync(process.env.ROOMMIES_FILENAME, "utf8"));
    let roommies = roommiesJSON.roommates;

    const { url, method } = req;

    if (url === "/") {
        res.writeHead(200, { 'Content-Type': 'text/html' })
    
        fs.readFile('./public/index.html', 'utf8', (err, data) => {
            res.end(data)
        });
    }

    if (url === "/roommate") {
        if (method === "GET") {
            controllerRoommates.showRoommates(req, res);
        }

        if (method === "POST") {
            controllerRoommates.addNewRoomate(req, res);
        }
    }

    if (url === "/gastos") {
        if (method === "GET") {
            const results = controllerGastos.showGastos2(req, res);
            console.log("ruts gastos ", results);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(results)
        }

    }

    if (url.startsWith("/gasto")) {
        console.log("en gasto?", method);
        if (method === "POST") {
            const results = controllerGastos.addGasto2(req, res);
            console.log("ruts gastos add ", results);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(results)
        }

        if (method === "DELETE") {
            const results = controllerGastos.deleteGasto2(req, res);
            console.log("ruts gastos delete ", results);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(results)
        }

        if (method === "PUT") {
            const results = controllerGastos.updateGasto2(req, res);
            console.log("ruts gastos update ", results);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(results)
        }
    }

}


module.exports = routes;