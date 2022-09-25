const express = require('express')
const path = require('path')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/Freecodecamp')    
    .then(data => console.log("Database connected"))
    .catch(err => console.log("Database connection failed"))

const app = express()

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))


app.use('/signIn',(req,res)=>{
    res.render('signIn')
})

app.use('/courses',(req,res)=>{
    res.render('courses')
})

app.use('/',(req,res)=>{
    res.render('home')
})

const port = process.env.PORT || '3000'
app.listen(port,() => {
    console.log(`Connnected to Port ${port}`)
})
