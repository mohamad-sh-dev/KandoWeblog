const {Router} = require("express");
const adminController = require("../controller/adminController")

const router = new Router ()

//desc: handle search
//route: /search
router.post("/search",adminController.handleSearch);

module.exports = router