const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // 암호화 툴
const saltRounds = 10; // 암호화를 위한 변수
const jwt = require("jsonwebtoken"); // For create token

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true,
        unique: 1,
    },
    password: {
        type: String,
        minlength: 5,
    },
    lastname: {
        type: String,
        maxlength: 50,
    },
    role: {
        type: Number,
        default: 0,
    },
    image: String,
    token: {
        type: String,
    },
    tokenExp: {
        type: Number,
    },
});

userSchema.pre("save", function (next) {
    // Don't use arrow function when you use .pre
    var user = this;

    // Encrypt password when change password
    if (user.isModified("password")) {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) return next(err);
            // Hashing password
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err);
                // Update password to encrypt password
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
    // Compare DB password & user type password
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err), cb(null, isMatch);
    });
};

userSchema.methods.generateToken = function (cb) {
    var user = this;

    // Generate token use "jsonwebtoken"
    var token = jwt.sign(user._id.toHexString(), "secretToken");

    user.token = token;
    user.save((err, user) => {
        if (err) return cb(err);
        cb(null, user);
    });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
