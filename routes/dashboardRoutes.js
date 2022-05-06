const {Router} = require("express");

const {authUser} = require("../middlewares/authUser")
const adminController = require("../controller/adminController")
const blogsController = require("../controller/blogsController")

const router = new Router();

//desc: addPost page
//route: post /addPost
router.post("/dashboard/addPost",authUser,blogsController.createPost)

//desc: edit post 
//route: post /editPost
router.post("/dashboard/editPost/:postId",authUser,blogsController.editPosts)


//desc: upload image 
//route: post /uploadImage
router.post("/dashboard/uploadImage",authUser,adminController.uploadImage)


//desc: delete post
//route: get /deletePost
router.get("/dashboard/delete/:id",authUser,blogsController.deletePost)

//desc: change post status
//route: get /Change Status
router.get("/dashboard/status/:id",authUser,blogsController.changePostStatus)


//desc: handle dashboard search
//route: /dashboard/search
router.post("/dashboard/search",authUser , adminController.handleSearch);

module.exports = router