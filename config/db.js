const mongoose = require('mongoose');

function connectedToDb(){
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("db connected")
    })
}


module.exports = connectedToDb;