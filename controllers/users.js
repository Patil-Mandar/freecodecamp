const User = require('../models/users.js')


module.exports.renderSignInPage = (req,res)=>{
    res.render('signIn')
}

module.exports.signIn = (req,res)=>{
    const returnToUrl = '/'
    req.flash('success','Welcome back!!')
    res.redirect(returnToUrl)
}

module.exports.renderSignUpPage = (req,res)=>{
    res.render('signUp')
}

module.exports.signout = (req,res)=>{
    req.logout(function(err) {
        if (err) { console.log(err) }
        res.redirect('/');
    });
}

module.exports.signUp = async (req,res)=>{
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
}