require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();
const URL = process.env.MONGO_URL;

// Connect to MongoDB
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected to database"))
  .catch(err => console.error("MongoDB connection error:", err));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: "my secret key",
  saveUninitialized: true,
  resave: false
}));
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// Set EJS as template engine
app.set("view engine", "ejs");
app.set("views", "./views"); // تأكد إن ملفات EJS في مجلد views

// Static files
app.use(express.static("uploads"));

// Routes
app.use("", require("./routes/route")); // تأكد إن المسار للـ routes صح

// Export as Serverless Function
module.exports = app;