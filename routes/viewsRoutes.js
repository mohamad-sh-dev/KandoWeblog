const {Router} = require("express");


const {authUser} = require('../middlewares/authUser');
const userController = require("../controller/userController");
const blogsController = require("../controller/blogsController")
const viewsController = require('../controller/viewsController');


const router = new Router()

// Desc: register page 
// Route: get /user/register
router.get("/user/register", viewsController.register)

// Desc: login page 
// Route: get /user/login
router.get("/user/login", viewsController.login)

//Desc : MainPage
//Rout : get "/"
router.get("/",viewsController.getIndex)

//desc: dashboard page
//route: get /dashboard
router.get("/dashboard",authUser,viewsController.getdashbord)

//Desc : getSinglePost
//Rout : get "/singlePost"
router.get("/singlePost/:id",viewsController.getSinglePost);

//Desc : coatact-us
//Rout : get "/contact-us"
router.get("/contact-us",viewsController.getContactUs);

// Desc: get ForgotPassword Page
// Route: post /user/getForgotPassword
router.get("/user/getForgotPassword", userController.getForgotPassword );


// Desc: handle forgotPassword
// Route: post /user/forgotPasswrod
router.get("/user/getResetPassword/:resetToken", userController.getResetPassword );

// Desc: handle captchaPng
// Route: post /user/captcha.png
router.get("/user/captcha.png", userController.getCaptchaPng);

//desc: addPost page
//route: get /addPost
router.get("/dashboard/add-post",authUser,viewsController.getAddPost)

//desc: editPost page
//route: get /editPost
router.get("/dashboard/edit-post/:postId",authUser,viewsController.getEditPost)

//desc: get single user post page
//route: post /dashboard/post
router.get("/dashboard/post/:id",authUser,viewsController.getSingleUserPost)

module.exports = router