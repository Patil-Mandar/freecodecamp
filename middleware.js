module.exports.isLogedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error','You need to Log In first!')
        return res.redirect('/signIn')
    }
    next()
}
