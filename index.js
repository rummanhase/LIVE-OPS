const express = require('express');
require("./db/db.connect")

const router = require('./route/router')

const app = express();
app.use(express.json())
app.use('/' , router)

app.listen(3000 , ()=>{
    console.log("App is listening at 3000");
})