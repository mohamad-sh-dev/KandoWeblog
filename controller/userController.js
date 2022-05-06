const passport = require("passport");
const User = require("../model/userSchema");
const fetch = require("node-fetch");
const Email = require("../utils/mailer");
const crypto = require("crypto");
const yup = require("yup");
const captchaPng = require('captchapng')


let CAPTCHA_NUMBER ;

exports.handelLogin = async (req, res, next) => {
  //CHECK reCAPTCHA
  if (!req.body["g-recaptcha-response"]) {
    req.flash("error", "تایید کنید که یک ربات نیستید!");
    return res.redirect("/user/login");
  }

  //REQUEST TO GOOGLE reCAPTCHA API
  const secretKey = process.env.CAPTCHA_SECRET;
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body["g-recaptcha-response"]}
    &remoteip=${req.connection.remoteAddress}`;

  const response = await fetch(verifyUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded; charset = utf-8",
    },
  });

  const json = await response.json();
  //CHECK IF RESPONSE IS TRUE & AUTHENTICATION
  if (json.success) {
    passport.authenticate("local", {
      failureRedirect: "/user/login",
      failureFlash: true,
    })(req, res, next);
  } else {
    req.flash("error", "مشکلی وجود دارد لطفا دوباره تلاش کنید");
    res.redirect("user/login");
  }
};
exports.rememberMe = (req, res) => {
  if (req.body.remember) {
    req.session.cookie.maxAge = 43200000;
  } else {
    req.session.cookie.expire = null;
  }
  res.redirect("/dashboard");
};
exports.creatUser = async (req, res) => {
  const errors = [];
  //CHECK VALIDATION
  try {
    await User.userValidation(req.body);
    const {
      fullname,
      email,
      password
    } = req.body;
    const AvailebaleUser = await User.findOne({
      email,
    }); //CHECK EMAIL
    if (AvailebaleUser) {
      errors.push({
        message: "ایمیل از قبل موجود می باشد",
      });
      return res.render("register", {
        pageTitle: "ثبت نام کاربر جدید",
        path: "/register",
        errors,
      });
    }

    const newUser = await User.create({
      fullname,
      email,
      password,
    });
    const url = `${req.protocol}://${req.get("host")}/register`;
    await new Email(newUser, url).sendWelcome(
      "welcome",
      "welcome to our weblog"
    );
    req.flash("success.msg", "ثبت نام شما با موفقیت انجام شد");
    res.redirect("/user/login");
  } catch (err) {
    console.log(err);
    err.inner.forEach((e) => {
      errors.push({
        name: e.path,
        message: e.message,
      });
    });
    return res.render("register", {
      pageTitle: "ثبت نام کاربر جدید",
      path: "/register",
      errors,
    });
  }
};
exports.logout = (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/");
};
exports.forgotPassword = async (req, res) => {
  let {
    email
  } = req.body;
  let user;
  try {
    user = await User.findOne({
      email,
    });

    if (!user) {
      req.flash(
        "error",
        "حسابی با ایمیل وارد شده وجود ندارد لطفا ابتدا ثبت نام کنید"
      );
      res.redirect("/register");
    }
    passwordResetToken = user.setPasswordResetToken();
    await user.save({
      validateBeforeSave: false,
    });
    let resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/user/getResetPassword/${passwordResetToken}`;
    await new Email(user, resetUrl).sendResetPassword();

    req.flash("success.msg", "لینک بازنشانی رمز عبور به ایمیل شما ارسال شد");
    res.redirect("/user/login");
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetTimer = undefined;
    await user.save({
      validateBeforeSave: false,
    });
    res.redirect("./errors/500");
  }
};
exports.resetPassword = async (req, res) => {
  const resetToken = req.params.resetToken;
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTimer: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      req.flash("error", "کاربری وجود ندارد و یا لینک مورد نظر منقضی شده است");
      return res.redirect("/user/login");
    }
    user.password = req.body.newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTimer = undefined;
    await user.save();
    req.flash(
      "success.msg",
      "رمز عبور شما با موفقیت تغییر یافت،لطفا مجددا وارد شوید"
    );
    res.redirect("/user/login");
  } catch (err) {
    console.log(err);
    res.redirect("errors/500");
  }
};
exports.getForgotPassword = (req, res) => {
  res.render("./security/forgotPassword", {
    pageTitle: "بازنشانی رمز عبور ",
    path: "/getForgotPassword",
    layout: "./layouts/mainlayout",
    message: req.flash("success.msg") || [],
    messages: [],
    error: req.flash("error"),
  });
};
exports.getResetPassword = (req, res) => {
  res.render("./security/resetPassword", {
    pageTitle: "بازنشانی رمز عبور",
    path: "/getResetPassword",
    layout: "./layouts/mainlayout",
    message: req.flash("success.msg") || [],
    messages: [],
    resetToken: req.params.resetToken,
    error: req.flash("error"),
  });
};
exports.contactUsHandler = async (req, res) => {
  const errors = [];
  const {
    name,
    email,
    phoneNumber,
    message,
    captcha
  } = req.body;
  try {
    const schema = yup.object().shape({
      name: yup
        .string()
        .required("نام الزامی میباشد")
        .min(3, "نام و نام خانوادگی نباید کمتر از سه حرف باشد")
        .max(255, "نام و نام خانوادگی نباید بیشتر از 255 حرف باشد"),
      email: yup
        .string("لطفا ایمیل خود را بررسی کنید")
        .email("ایمیل معتبر نمیباشد")
        .required("ایمیل الزامی میباشد"),
      message: yup.string().required("متن پیام الزامی میباشد"),
    });

    await schema.validate(req.body, {
      abortEarly: false
    })
    if (captcha.toString() !== CAPTCHA_NUMBER.toString()) {
      errors.push({
        name : 'captcha' , 
        message : 'کد امنیتی صحیح نمیباشد'
      })
      return res.render("./home/contact.ejs", {
        pageTitle: "تماس با ما",
        layout: "./layouts/mainlayout",
        path: "/contact-us",
        user: undefined,
        error: [],
        message: [],
        messages: [],
        errors
      }); 
    }
      await new Email({
        firstName: name,
        email,
        phoneNumber,
        message,
      }).sendContactUsEmail();
    req.flash("sucsess.msg", "پیام شما با موفقیت ارسال شد")
    res.render("./home/contact.ejs", {
      pageTitle: "تماس با ما",
      layout: "./layouts/mainlayout",
      path: "/contact-us",
      user: undefined,
      error: req.flash("error"),
      message: req.flash("sucsess.msg"),
      messages: [],
      errors
    });
  } catch (err) {
    err.inner.forEach((e) => {
      errors.push({
        name: e.path,
        message: e.message,
      });
    });
    res.render("./home/contact.ejs", {
      pageTitle: "تماس با ما",
      layout: "./layouts/mainlayout",
      path: "/contact-us",
      user: undefined,
      error: [],
      message: [],
      messages: [],
      errors
    });
  }
};
exports.getCaptchaPng = (req, res) => {
  CAPTCHA_NUMBER = parseInt(Math.random() * 9000 + 1000);
  const captcha = new captchaPng(80, 30, CAPTCHA_NUMBER);
  captcha.color(80, 80, 80, 0)
  captcha.color(80, 80, 80, 255)

  const img = captcha.getBase64()
  const imgBase64 = new Buffer(img, "base64");
  res.send(imgBase64);
};