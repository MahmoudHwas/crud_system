require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const app = express();
var bodyParser = require('body-parser');
const URL = process.env.MONGO_URL;

mongoose.connect(URL).then(() => {
    console.log("connected to database");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false
}));
app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

// set template engine
app.set("view engine", 'ejs');
app.use(express.static("uploads"));
app.use("", require("./routes/route"));

module.exports = app;