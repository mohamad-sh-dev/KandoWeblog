exports.authUser = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next()
    }
    req.flash("reLogin.msg","لطفا وارد حساب کاربری خود شوید")
    res.redirect("/user/login")
}
