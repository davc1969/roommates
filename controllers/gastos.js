// COntroladores para lo relacionado con los gastos

const fs = require("fs");
const axios = require ("axios");
const { v4: uuidv4 } = require("uuid");
const url = require("url");





const showGastos2 = (req, res) => {
    const allGastos = readJSONFile(process.env.GASTOS_FILENAME);  //readGastos es sincrónica
    console.log("gastos2 all", allGastos);
    return JSON.stringify(allGastos);
};

const deleteGasto2 = (req, res) => {
    const { id } = url.parse(req.url, true).query;
    let jsonGastos = readJSONFile(process.env.GASTOS_FILENAME);
    const allGastos = jsonGastos.gastos;
    const gastoABorrar = allGastos.find( g => g.id == id );
    const filteredGastos = allGastos.filter( g => g.id !== id);
    jsonGastos.gastos = filteredGastos;
    writeJSONFile(process.env.GASTOS_FILENAME, jsonGastos);
    distribuirGastoEntreRoommates2(gastoABorrar.roommate, -gastoABorrar.monto)
    return JSON.stringify({serverCode: 200, statusAction: "borrado"})
}


const addGasto2 = (req, res) => {

    let body;
    req.on("data", (payload) => {
        body = JSON.parse(payload);
    })

    req.on("end", () => {
        let jsonGastos = readJSONFile(process.env.GASTOS_FILENAME);
        console.log("jsongastos ", jsonGastos);
        const nuevoGasto = {
            "id": uuidv4().slice(30),
            "roommate": body.roommate,
            "descripcion": body.descripcion,
            "monto": body.monto
        };
        jsonGastos.gastos.push(nuevoGasto);
        writeJSONFile(process.env.GASTOS_FILENAME, jsonGastos);
        distribuirGastoEntreRoommates2(body.roommate, body.monto)
        return JSON.stringify({serverCode: 201, statusAction: "Creado"})
    })

}


const updateGasto2 = (req, res) => {

    const { id } = url.parse(req.url, true).query;

    let body;
    req.on("data", (payload) => {
        body = JSON.parse(payload);
    })

    req.on("end", () => {
        let jsonGastos = readJSONFile(process.env.GASTOS_FILENAME);

        jsonGastos.gastos.forEach( (g) => {
            if (g.id == id) {
                distribuirGastoEntreRoommates2(body.roommate, -body.monto)
                g.roommate = body.roommate;
                g.descripcion = body.descripcion;
                g.monto = body.monto
            }
        })

        writeJSONFile(process.env.GASTOS_FILENAME, jsonGastos);
        distribuirGastoEntreRoommates2(body.roommate, body.monto)
        return JSON.stringify({serverCode: 201, statusAction: "CAmbiado"})
    })

}



const readJSONFile = (filename) => {
    return JSON.parse(fs.readFileSync(filename, "utf8"))
}

const writeJSONFile = (filename, jsonToWrite) => {
    fs.writeFileSync(filename, JSON.stringify(jsonToWrite), async (err) => {
        if (err) { 
            console.log("Error de escritura de archivo JSON");
            return err
        } else {
            console.log("Escritura de archivo JSON exitosa");
            // await distribuirGastoEntreRoommates(body.roommate, body.monto);
            // res.writeHead(200, { 'Content-Type': 'application/json' });
            return {}
        }
    });
}


const distribuirGastoEntreRoommates2 = (roommateQueHizoElGasto, montoGastado) => {
    let roommiesJSON = readJSONFile(process.env.ROOMMIES_FILENAME);
    let roommies = roommiesJSON.roommates;

    const cuantosRoommates = roommies.length;
    const deudaPorRoommate = (montoGastado / cuantosRoommates).toFixed(2);

    console.log("cuantos y cuanto ", cuantosRoommates, deudaPorRoommate);
    roommies.forEach(element => {
        if (element.nombre == roommateQueHizoElGasto) {
            element.recibe += parseFloat(deudaPorRoommate);
        } else {
            element.debe += parseFloat(deudaPorRoommate);
        }
    });
    writeJSONFile(process.env.ROOMMIES_FILENAME, roommiesJSON);
}



module.exports = {
    showGastos2,
    addGasto2,
    deleteGasto2,
    updateGasto2
}