// COntroladores para lo relacionado con los roommates

const fs = require("fs");
const axios = require ("axios");
const { v4: uuidv4 } = require("uuid");





const showRoommates = (req, res) => {
    let roommiesJSON = JSON.parse(fs.readFileSync(process.env.ROOMMIES_FILENAME, "utf8"));
    let roommies = roommiesJSON.roommates;
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end((JSON.stringify(roommies)));
}


const addNewRoomate = (req, res) => {
    let roommiesJSON = JSON.parse(fs.readFileSync(process.env.ROOMMIES_FILENAME, "utf8"));
    let roommies = roommiesJSON.roommates;
    axios("https://randomuser.me/api")
    .then( (response) => {
        return response.data.results;
    })
    .then ( (data) => {
        const fullName = data[0].name.first + " " + data[0].name.last;
        const email = data[0].email;
        const idRoommate = uuidv4().slice(30);
        newUser = {
            "id": idRoommate, 
            "nombre": fullName, 
            "email": email,
            "debe": 0,
            "recibe": 0
        };
        roommies.push(newUser);
        fs.writeFileSync(process.env.ROOMMIES_FILENAME, JSON.stringify(roommiesJSON));
        console.log("Roommate: ", fullName, "was added succesfully");
        res.end(JSON.stringify(newUser));
    })
    .catch()
}


module.exports = {
    showRoommates,
    addNewRoomate
}