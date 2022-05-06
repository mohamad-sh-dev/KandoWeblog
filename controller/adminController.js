const BlogSchema = require("../model/blogSchema")
const {
    convertDate
} = require("../utils/jalali")
const {
    truncate
} = require("../utils/truncate")
const multer = require("multer");
const path = require("path");
const uuid = require("uuid").v4
const {
    get500
} = require("../controller/errorsCotroller");
const sharp = require('sharp');


exports.uploadImage = (req, res) => {
    // console.log(req);
    // const file = req.files[0];
    const uploadDestination = `.${path.sep}public${path.sep}uploads`
    const fileFilter = function (req, file, cb) {
        if (file.mimetype === 'image/jpeg') {
            cb(null, true)
        } else {
            cb('فرمت فایل نا معتبر است!')
        }
    }

    const upload = multer({
        limits: {
            fileSize: 4000000
        },
        // dest: 'uploads/',
        // storage,
        fileFilter
    }).single('image')

    upload(req, res, async (err) => {
        if (err) {
            res.send(err)
        } else {
            console.log(req.file);
            if (req.file) {
                const fileName = `${uuid()}-${req.file.originalname}`
                await sharp(req.file.buffer).jpeg({
                    quality: 60
                }).toFile(
                    `./public/uploads/${fileName}`
                ).then(() => {
                    console.log('image uploaded successfully')
                }).catch((err) => {
                    console.log('there is problem with upload image', err)
                });

                res.status(200).send('آپلود عکس با موفقیت انجام شد')
            } else {
                res.send('لطفا عکسی را برای بارگذاری انتخاب کنید')
            }
        }
    })
}
exports.handleDashboardSearch = async (req, res) => {
    const page = +req.query.page || 1
    const postPerPage = 2
    try {
        const numberOfPosts = await BlogSchema.find({
            user: req.user.id,
            $text: {
                $search: req.body.search
            }
        }).countDocuments()
        const Blogs = await BlogSchema.find({
                user: req.user.id,
                $text: {
                    $search: req.body.search
                }

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
exports.handleSearch = async (req, res) => {
    const page = +req.query.page || 1;
    const postPerPage = 5;
    try {
        const numberOfPosts = await BlogSchema.find({
            status: "public",
            $text: {
                $search: req.body.search
            }
        }).countDocuments();
        let posts = await BlogSchema.find({
                status: "public",
                $text: {
                    $search: req.body.search
                }
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
            pageTitle: "نتایج جستجو",
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
}