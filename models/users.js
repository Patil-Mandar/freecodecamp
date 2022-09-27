const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const findOrCreate = require("mongoose-findorcreate")

const UserSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    username: {             //username is email
        type:String,
        required:true,
    },
})

UserSchema.plugin(passportLocalMongoose)
UserSchema.plugin(findOrCreate)

module.exports = mongoose.model('User',UserSchema)