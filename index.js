require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 4000;
const URL = process.env.MONGO_URL;

// اتصال MongoDB قابل لإعادة الاستخدام
let conn;
async function connectToDB() {
  if (!conn) {
    conn = await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected to database");
  }
  return conn;
}

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
  })
);
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// Set template engine
app.set("view engine", "ejs");
app.use(express.static("uploads"));
app.use("", require("./routes/route"));

// Serverless Function لـ Vercel
module.exports = async (req, res) => {
  try {
    await connectToDB(); // الاتصال بـ MongoDB
    app(req, res); // تمرير الـ Request لـ Express
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).send("Internal Server Error");
  }
};