const mongoose = require('mongoose');

const model ={}

const userSchema = new mongoose.Schema({
    email:String,
    pass:String
})

model.userModel= mongoose.model('users' , userSchema)

module.exports = model