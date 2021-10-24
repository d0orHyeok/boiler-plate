const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { User } = require("./models/User");
const config = require("./config/key");

const app = express();
const port = 3000;

// application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// aplication/json
app.use(express.json());
// Use cookieParser
app.use(cookieParser());

// Connect DB
mongoose
    .connect(config.mongoURI)
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.send("Hello World!!!");
});

// Register
app.post("/register", (req, res) => {
    // 회원 가입에 필요한 정보를 client에서 가져오면 DB에 넣어준다.
    const user = new User(req.body);
    user.save((err, userInfo) => {
        if (err) {
            return res.json({ success: false, err });
        }
        return res.status(200).json({ success: true });
    });
});

// Login
app.post("/login", (req, res) => {
    // Find requset email on DB
    User.findOne({ email: req.body.email }, (err, user) => {
        // Can't find user
        if (!user) {
            return res.json({
                loginSuccess: false,
                mesage: "제공된 이메일에 해당하는 유저가 없습니다.",
            });
        }
        // If email in DB, check password
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });
            }
        });
        // Create token when password checked
        user.generateToken((err, user) => {
            if (err) return res.status(400).send(err);

            // Save token at cookie
            res.cookie("x_auth", user.token)
                .status(200)
                .json({ loginSuccess: true, userId: user._id });
        });
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
