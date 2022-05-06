const BlogSchema = require("../model/blogSchema");
const shortId = require('shortid') ;
const appRoot = require('app-root-path') ;
const sharp = require('sharp') ;

exports.showPost = async (req, res) => {
  // console.log('thisssss' , req.params);
  const errorArr = []
  try {
    const post = await BlogSchema.findById(req.params.id);
    // req.flash("success.msg", "درخواست شما با موفقیت انجام شد")
    // res.redirect("/dashboard")
  } catch (err) {
    // console.log(err);
    // err.inner.forEach(e => {
    //     errorArr.push({ name: e.path, message: e.message})
    // });
    //  res.render("./private/addPost", {
    //     pageTitle: "ساخت پست جدید",
    //     path: "/addpost",
    //     layout: "./layouts/dashlayout",
    //     fullname: req.user.fullname,
    //     errors : errorArr,
    //     message : req.flash("success.msg")
    // })
  }
}
exports.deletePost = async (req, res) => {
  try {
    await BlogSchema.findByIdAndRemove(req.params.id)
    req.flash("success,msg", "پست با موفقیت حذف شد")
    res.redirect("/dashboard")

  } catch (err) {
    console.log(err);
  }
}
exports.changePostStatus = async (req, res) => {
  try {
    const post = await BlogSchema.findById(req.params.id)
    if (post.status === "عمومی") {
      post.status = "خصوصی"
    } else if (post.status === "خصوصی") {
      post.status = "عمومی"
    }
    post.save()
    res.redirect("/dashboard")
  } catch (err) {
    console.log(err);
  }
}
exports.createPost = async (req, res) => {

  const thumbnail = req.files ? req.files.thumbnail : {}
  const fileName = `${shortId.generate()}_${thumbnail.name}`
  const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`
  const errorArr = []
  try {

    await BlogSchema.postValidation({
      ...req.body,
      thumbnail
    })

    await sharp(thumbnail.data)
      .jpeg({
        quality: 60
      })
      .toFile(uploadPath)
      .catch(err => console.log(err))

    await BlogSchema.create({
      ...req.body,
      user: req.user.id,
      thumbnail: fileName
    });
    req.flash("success.msg", "پست با موفقیت ساخته شد ")
    res.redirect("/dashboard")
  } catch (err) {
    console.log(err);
    err.inner.forEach(e => {
      errorArr.push({
        name: e.path,
        message: e.message
      })
    });
    res.render("./private/addPost", {
      pageTitle: "ساخت پست جدید",
      path: "/add-post",
      layout: "./layouts/dashlayout",
      fullname: req.user.fullname,
      errors: errorArr,
      message: req.flash("success.msg")
    })

  }
}
exports.editPosts = async (req, res) => {
  const errorArr = []
  const thumbnail = req.files ? req.files.thumbnail : {}
  const fileName = `${shortId.generate()}_${thumbnail.name}`
  const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`
  const post = await BlogSchema.findOne({
    _id: req.params.postId
  })
  try {
    if (!post) {

      return res.redirect("./errors/404")
    }
    if (!thumbnail.name) await BlogSchema.postValidation({
      ...req.body,
      thumbnail: {
        name: "placeHolder",
        size: 0,
        mimeType: 'image/png'
      }
    })
    else await BlogSchema.postValidation({
      ...req.body,
      thumbnail
    });
    if (post.user.toString() !== req.user.id) {
      return res.redirect("/dashboard")
    } else {
      if (thumbnail.name) {
        fs.unlink(`${appRoot}/public/uploads/thumbnails/${post.thumbnail}`, async (err) => {
          if (err) console.log(err);
          else
            await sharp(thumbnail.data)
            .jpeg({
              quality: 60
            })
            .toFile(uploadPath)
            .catch(err => console.log(err))
        })

      }
      const {
        status,
        body,
        title
      } = req.body
      post.title = title;
      post.body = body;
      post.status = status;
      post.thumbnail = thumbnail.name ? fileName : post.thumbnail
      await post.save()

      req.flash("success.msg", "درخواست شما با موفقیت ویرایش شد")
      res.redirect("/dashboard")
    }

  } catch (err) {
    console.log(err);
    err.inner.forEach(e => {
      errorArr.push({
        name: e.path,
        message: e.message
      })
    });
    res.render("./private/editPost", {
      pageTitle: "ویرایش پست ",
      path: "/edit-post",
      layout: "./layouts/dashlayout",
      fullname: req.user.fullname,
      errors: errorArr,
      message: req.flash("success.msg"),
      post,
      postId: req.params.postId,
    })

  }
}
