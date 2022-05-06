exports.get404 = (req ,res) =>{
    res.render("errors/404",{
        pageTitle:"Page Not Found",
        path:"/404"
    })
}
exports.get500 = (req,res) =>{
    res.render("errors/500",{
        pageTitle:"خطا",
        path:"/404"
    })
    
}

