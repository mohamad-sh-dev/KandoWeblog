const { Router } = require("express");

const userController = require("../controller/userController");
const { authUser } = require("../middlewares/authUser");

const router = new Router()

// Desc: User Authentiction 
// Route: post /user/login
router.post("/login", userController.handelLogin, userController.rememberMe)

// Desc: logout 
// Route: get /user/logout
router.get("/logout", authUser, userController.logout)

// Desc: handle users 
// Route: post /user/register
router.post("/register", userController.creatUser)

// Desc: handle forgotPassword
// Route: post /user/forgotPasswrod
router.post("/forgotPassword", userController.forgotPassword);

// Desc: handle resetPassword
// Route: post /user/resetPasswrod
router.post("/resetPassword/:resetToken", userController.resetPassword);

// Desc: handle contact us
// Route: post /user/contact-us
router.post("/contact-us", userController.contactUsHandler);


module.exports = router