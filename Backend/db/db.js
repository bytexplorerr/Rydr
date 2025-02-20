const mongoose = require("mongoose");

function connectTODB(){
    mongoose.connect(process.env.DB_CONNECTION)
    .then(()=>{
        console.log("Connceted to DB");
    }).catch(err => console.log(err));
}

module.exports = connectTODB;