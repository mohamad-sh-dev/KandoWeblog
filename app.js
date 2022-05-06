const path = require("path")

const express = require("express")
const exprLayyout = require("express-ejs-layouts")
const fileUpload = require('express-fileupload') ;
const dotEnv = require("dotenv")
const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const mongoose = require("mongoose")
const Flash = require('connect-flash')
const passport = require("passport")

const conectiondb =require("./config/database")

//dotEnv
dotEnv.config({
    path: "./config/config.env"
})

//database connection
conectiondb();


//passport 

require('./config/Passport.Strategy')

const app = express()

// view engine
app.use(exprLayyout)
app.set("view engine", "ejs")
app.set("views", "views")
app.set("layout","./layouts/mainlayout.ejs")

//end of engine

// file upload
app.use(fileUpload()) ;

//Parser
app.use(express.urlencoded({extended:false}))
app.use(express.json())


//session
app.use(session({
    secret : process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    unset: "destroy",
    store: new MongoStore({mongooseConnection:mongoose.connection}) 
}))

//Use Passport
app.use(passport.initialize())
app.use(passport.session())
//Flash 

app.use(Flash())


//static folders
app.use(express.static(path.join(__dirname, 'public')))


//Routes
app.use("/" ,require("./routes/mainRouts"),require("./routes/dashboardRoutes"),require("./routes/viewsRoutes"))
app.use("/user",require("./routes/userRoutes"))

//end of Routes

//404 route 
 app.use(require("./controller/errorsCotroller").get404)
  

const Port = process.env.PORT || 5000;
app.listen(Port, () => console.log(`Server Started in ${process.env.NODE_ENV} mode On Port ${Port}`))