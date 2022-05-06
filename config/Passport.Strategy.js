const passport = require("passport")
const {
    Strategy
} = require("passport-local")
const bcrypt = require("bcryptjs")

const User = require("../model/userSchema")

passport.use(new Strategy({ usernameField: "email"}, async (email, password, done) => {

    try {
        const user = await User.findOne({
            email
        });
        if (!user) {
            return done(null, false, {
                message: "کاربری با این ایمیل وجود ندارد"
            })
        }

        const PassMatch = await bcrypt.compare(password, user.password)
        if (PassMatch) {
            return done(null, user)
        } else {
            return done(null, false, {
                message: "نام کاربری یا کلمه عبور صحیح نمیباشد"
            })
        }

    } catch (err) {
        console.log(err);
    }
}))

passport.serializeUser((user, done) => {
    done(null, user)
})
passport.deserializeUser((id, done,)=>{
    User.findById(id,(err , user)=>{

        done(err,user)
    })
})