const express = require('express');
const app = express();
const db = require('./db')
const bodyParser = require('body-parser');
app.use(bodyParser.json())
require('dotenv').config();
const PORT = process.env.PORT
const {jwtAuthMiddleware} = require('./jwt');


app.get("/",(req, res, next)=>{
    console.log("Server Started!")
    res.send("Hello")
})
// Importing User Routes
const userRoutes = require('./routes/userRoutes')
app.use("/user",userRoutes)
// Importing Candidate Routes
const candidateRoute = require('./routes/candidateRoute')
app.use("/candidate",candidateRoute)

app.listen(PORT,
    console.log("Voting App Started!")
)