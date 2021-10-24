const express = require("express");
const app = express();
const port = 3000;
const { User } = require("./models/User");
const config = require("./config/key");

// application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// aplication/json
app.use(express.json());

const mongoose = require("mongoose");
mongoose
    .connect(config.mongoURI)
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.send("Hello World!!!");
});

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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
