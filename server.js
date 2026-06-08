require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

const authRoutes =
    require("./routes/auth");

const app = express();

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(express.static("public"));

app.use("/auth", authRoutes);

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );
});

const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `Running on port ${PORT}`
    );
});