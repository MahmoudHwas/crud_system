require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose")
const session = require("express-session")
const app = express();
const bodyParser = require('body-parser')
const path = require("path");

const PORT = process.env.PORT || 4000
const URL = process.env.MONGO_URL

mongoose.connect(URL).then(() => {
    console.log("Connected to database")
}).catch(err => {
    console.error("Database connection error:", err);
});


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false
}))
app.use((req, res, next) => {
    res.locals.message = req.session.message
    delete req.session.message
    next()
})

// Set template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));app.use("", require("./routes/route"))

app.get("/api/health", (req, res) => {
    res.json({ status: "Server is running" })
})

app.listen(PORT, () => {
    console.log(`SERVER WORKING ON PORT localhost:${PORT}`);
})
