const { default: mongoose } = require('mongoose');
const mongose = require('mongoose')
require('dotenv').config()
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
const db = mongoose.connection;

db.on("connected",()=>{
    console.log("Conneted to MongoDB Server")
})

db.on("error", (err)=>{
    console.log("MongoDB Connection error" , err)

})

db.on("disconnected", (msg)=>{
    console.log("MongoDB Server Disconnected", msg)
})


module.exports = db;
