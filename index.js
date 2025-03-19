require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose")
const session = require("express-session")
const app = express();
var bodyParser = require('body-parser')
const PORT = process.env.PORT || 4000
const URL = process.env.MONGO_URL

// mongoose.connect(URL).then((req, res) => {
//     console.log("connected yo database")

// })
async function connectToDB() {
    let conn;
    if (!conn) {
      conn = await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to database");
    }
    return conn;
  }
  connectToDB()
// middlewares

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

// set template engine
app.set("view engine", 'ejs')
app.use(express.static("uploads"))
app.use("", require("./routes/route"))
app.listen(PORT, () => {

    console.log(`SERVER WORK ON PORT localhost:${PORT}`);
    
})




