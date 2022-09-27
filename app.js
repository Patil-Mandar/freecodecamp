require('dotenv').config()
const express = require('express')
const path = require('path')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const session = require('express-session')
const flash = require('connect-flash')


const User = require('./models/users.js')
const ExpressError = require('./utils/expressError.js')
const users = require('./controllers/users.js')
const {renderCourses,renderHomePage} = require('./controllers/index.js')

mongoose.connect('mongodb://localhost:27017/Freecodecamp')    
    .then(data => console.log("Database connected"))
    .catch(err => console.log("Database connection failed"))

const app = express()

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))


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
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    async function (accessToken, refreshToken, profile, cb) {
        await User.findOrCreate(
            {
                googleId: profile.id,
                name: profile.displayName,
                username: profile.emails[0].value
            },
            function (err, user) {
                return cb(err, user);
            })
    }
))
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

app.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)
app.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),(req, res) => {
    req.flash('success', 'LogedIn Successfully!')
    res.redirect('/courses');
})

app.get('/signIn',users.renderSignInPage)
app.post('/signIn',passport.authenticate('local',{failureFlash:true,failureRedirect:'/signIn'}),users.signIn)

app.get('/signUp',users.renderSignUpPage)
app.post('/signUp', users.signUp)

app.get('/signOut', users.signout)

app.get('/courses',renderCourses)

app.get('/', renderHomePage)

app.all('*',(req,res)=>{
    throw new ExpressError(`Page not found`,404)
})

//Basic error handler
app.use((err,req,res,next)=>{
    const {statusCode=500} = err   //gave some default values
    if(!err.message) err.message = "Something went wrong"
    res.status(statusCode).render('error',{err})
})

const port = process.env.PORT || '3000'
app.listen(port,() => {
    console.log(`Connnected to Port ${port}`)
})
