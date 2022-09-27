const Course = require('../models/course.js')

module.exports.renderCourses = async (req,res)=>{
    const courses = await Course.find({})
    res.render('courses',{courses})
}

module.exports.renderHomePage = (req,res)=>{
    res.render('home')
}