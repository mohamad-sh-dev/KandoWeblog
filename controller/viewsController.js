const BlogSchema = require("../model/blogSchema")
const {
    convertDate
} = require("../utils/jalali")
const {
    truncate
} = require("../utils/truncate")
const {
    get500
} = require("../controller/errorsCotroller");


exports.register = (req, res) => {
    res.render("register", {
        pageTitle: "ثبت نام کاربر جدبد",
        path: "/register",
        layout: "./layouts/mainlayout",
    });
};
exports.login = (req, res) => {
    res.render("login2", {
        pageTitle: "ورود",
        path: "/login",
        layout: "./layouts/mainlayout",
        message: req.flash("success.msg"),
        messages: req.flash("reLogin.msg"),
        error: req.flash("error"),
    });
};
exports.getdashbord = async (req, res) => {
    const page = +req.query.page || 1
    const postPerPage = 2
    try {
        const numberOfPosts = await BlogSchema.find({
            user: req.user.id
        }).countDocuments()
        const Blogs = await BlogSchema.find({
            user: req.user.id
        })
            .skip((page - 1) * postPerPage)
            .limit(postPerPage)
        res.render('./private/dashBlog', {
            pageTitle: "بخش مدیریت",
            path: "/dashboard",
            layout: "./layouts/dashlayout",
            fullname: req.user.fullname,
            Blogs,
            convertDate,
            message: req.flash("success.msg"),
            currentPage: page,
            nextPage: page + 1,
            previousPage: page - 1,
            hasNextPage: postPerPage * page < numberOfPosts,
            hasPreviousPage: page > 1,
            lastPage: Math.ceil(numberOfPosts / postPerPage)
        })

    } catch (err) {
        console.log(err);
        get500(req, res)
    }
}
exports.getmainPage = async (req, res) => {

    res.render("blog", {
        pageTitle: "وبلاگ من",
        path: "/",
        layout: "./layouts/mainlayout"

    })

}
exports.getEditPost = async (req, res) => {
    try {
        const post = await BlogSchema.findOne({
            _id: req.params.postId
        })
        if (!post) {
            return res.redirect('/errors/404')
        }
        if (post.user.toString() !== req.user.id) {
            return res.redirect('/dashboard')
        } else {
            console.log(post.user.toString())
            console.log(req.user.id)
            res.render("./private/editPost", {
                pageTitle: "ویرایش پست",
                path: "/edit-post",
                layout: "./layouts/dashlayout",
                fullname: req.user.fullname,
                postId: req.params.postId,
                post,
                message: []
            })
        }
    } catch (err) {
        console.log(err);
        get500(req, res)
    }
}
exports.getSingleUserPost = async (req, res) => {
    try {
        const post = await BlogSchema.findOne({
            _id: req.params.postId
        })
        if (!post) {
            return res.redirect('/errors/404')
        }
        if (post.user.toString() !== req.user.id) {
            return res.redirect('/dashboard')
        } else {
            res.render("./private/userPost", {
                pageTitle: post.title,
                path: "/dashboard/post",
                layout: "./layouts/dashlayout",
                fullname: req.user.fullname,
                postId: req.params.postId,
                post
            })
        }
    } catch (err) {
        console.log(err);
        get500(req, res)
    }
}
exports.getSingleUserPost = async (req, res) => {
    try {
        const post = await BlogSchema.findOne({
            _id: req.params.postId
        })
        if (!post) {
            return res.redirect('/errors/404')
        }
        if (post.user.toString() !== req.user.id) {
            return res.redirect('/dashboard')
        } else {
            res.render("./private/userPost", {
                pageTitle: post.title,
                path: "/dashboard/post",
                layout: "./layouts/dashlayout",
                fullname: req.user.fullname,
                postId: req.params.postId,
                post
            })
        }
    } catch (err) {
        console.log(err);
        get500(req, res)
    }
}
exports.getEditPost = async (req, res) => {
    try {
        const post = await BlogSchema.findOne({
            _id: req.params.postId
        })
        if (!post) {
            return res.redirect('/errors/404')
        }
        if (post.user.toString() !== req.user.id) {
            return res.redirect('/dashboard')
        } else {
            console.log(post.user.toString())
            console.log(req.user.id)
            res.render("./private/editPost", {
                pageTitle: "ویرایش پست",
                path: "/edit-post",
                layout: "./layouts/dashlayout",
                fullname: req.user.fullname,
                postId: req.params.postId,
                post,
                message: []
            })
        }
    } catch (err) {
        console.log(err);
        get500(req, res)
    }
}
exports.getIndex = async (req, res) => {



    const page = +req.query.page || 1;
    const postPerPage = 5;
    try {
        const numberOfPosts = await BlogSchema.find({
            status: "public",
        }).countDocuments();
        let posts = await BlogSchema.find({
            status: "public",
        })
            .sort({
                createdAt: "desc",
            })
            .skip((page - 1) * postPerPage)
            .limit(postPerPage)
            .populate({
                path: "user",
            });
        res.render("./home/index", {
            pageTitle: "وبلاگ",
            layout: "./layouts/mainlayout",
            path: "/",
            posts,
            user: req.user ? req.user : undefined,
            convertDate,
            truncate,
            currentPage: page,
            nextPage: page + 1,
            previousPage: page - 1,
            hasNextPage: postPerPage * page < numberOfPosts,
            hasPreviousPage: page > 1,
            lastPage: Math.ceil(numberOfPosts / postPerPage),
        });
    } catch (err) {
        console.log(err);
        res.render("errors/500");
    }
};
exports.getSinglePost = async (req, res) => {
    try {
        let post = await BlogSchema.findById(req.params.id).populate({
            path: "user",
        });
        if (post) {
            res.render("./home/singlePost", {
                pageTitle: post.title,
                layout: "./layouts/mainlayout",
                path: "/singlePost",
                post,
                user: req.user ? req.user : undefined,
                convertDate,
            });
        } else {
            res.render("errors/404");
        }
    } catch (err) {
        console.log(err);
        res.render("errors/500");
    }
};
exports.getContactUs = async (req, res) => {
    try {
        res.render("./home/contact.ejs", {
            pageTitle: "تماس با ما",
            layout: "./layouts/mainlayout",
            path: "/contact-us",
            user: undefined,
            message: req.flash("success.msg"),
            messages: req.flash("reLogin.msg"),
            error: req.flash("error"),
        });
    } catch (err) {
        console.log(err);
        res.render("errors/500");
    }
};
exports.getAddPost = (req, res) => {
    res.render("./private/addPost", {
        pageTitle: "ساخت پست جدید",
        path: "/add-post",
        layout: "./layouts/dashlayout",
        fullname: req.user.fullname,
        message: req.flash("failur.msg")

    })
}