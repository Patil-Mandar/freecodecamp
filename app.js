const express = require('express')
const path = require('path')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')


const User = require('./models/users.js')


mongoose.connect('mongodb://localhost:27017/Freecodecamp')    
    .then(data => console.log("Database connected"))
    .catch(err => console.log("Database connection failed"))

const app = express()

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

// const store = MongoStore.create({
//     mongoUrl: 'mongodb://localhost:27017/Freecodecamp',
//     secret:'Dont look here its a secret',
//     touchAfter: 24*60*60
// })
// store.on('error',e => {
//     console.log('Session Error!!!',e)
// })

app.use(express.urlencoded({ extended: true }))


//session config
const sessionConfig = {
    // store,
    name: 'SeeKersSession',
    secret: 'Dont look here its a secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//middleware for flashing all msg
app.use((req,res,next)=>{
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')       //this will send success to all the rendering requests
    res.locals.warning = req.flash('warning')
    res.locals.error = req.flash('error')
    next()
})

app.get('/signIn',(req,res)=>{
    res.render('signIn')
})

app.post('/signIn',passport.authenticate('local',{failureFlash:true,failureRedirect:'/signIn'}),(req,res)=>{
    const returnToUrl = '/'
    req.flash('success','Welcome back!!')
    res.redirect(returnToUrl)
})

app.get('/signUp',(req,res)=>{
    res.render('signUp')
})

app.get('/signOut', (req,res)=>{
    req.logout(function(err) {
        if (err) { console.log(err) }
        res.redirect('/');
    });
})

app.post('/signUp',async (req,res)=>{
    try {
        const { username, name, password } = req.body   //here username is email
        const user = new User({ username, name })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash('success', 'Registered Successfully!')
            res.redirect('/courses')
        })
    } catch (e) {
        console.log(e)
        req.flash('error', e.message)
        res.redirect('/signUp')
    }
})

app.get('/courses',(req,res)=>{
    res.render('courses')
})

app.get('/',(req,res)=>{
    res.render('home')
})

const port = process.env.PORT || '3000'
app.listen(port,() => {
    console.log(`Connnected to Port ${port}`)
})
