const express = require("express");
const app = express();
const port = 3000;

const mongoose = require("mongoose");
mongoose
    .connect("mongodb+srv://d0or:kk3746@react.1bm8l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
