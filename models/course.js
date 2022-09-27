const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true,
    },
    duration: {             //username is email
        type:Number,
        required:true,
    },
})

module.exports = mongoose.model('Course',CourseSchema)