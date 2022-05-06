const mongoose = require("mongoose");
const {
    schema
} = require("./secure/userValidation");
const bcrypt = require("bcryptjs")
const crypto = require("crypto");

const userSchema = new mongoose.Schema({

    fullname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,

    },
    password: {
        type: String,
        required: true,
        maxlength: 255,
        minlength: 5

    },
    createdDate: {
        type: Date,
        default: Date.now

    },
    // passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTimer: Date,

});
userSchema.statics.userValidation = (function (body) {
    return schema.validate(body, {
        abortEarly: false
    });
})

//HASH PASSWORD BEFOR SAVING ON DATABASE
userSchema.pre("save", function (next) {
    let user = this
    if (!user.isModified("password")) return next()

    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) next(err)
        user.password = hash
        next()
    })
});

// userSchema.methods.passwordChangedAfter = function (JWTTimestamp) {
//     if (this.passwordChangedAt) {
//         const changedTimestamp = parseInt(
//             this.passwordChangedAt.getTime() / 1000,
//             10
//         );

//         return JWTTimestamp < changedTimestamp;
//     }

//     // False means NOT changed
//     return false;
// };

userSchema.methods.setPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    console.log({
        resetToken
    }, this.passwordResetToken);

    this.passwordResetTimer = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model("User", userSchema)

module.exports = User