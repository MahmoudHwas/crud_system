const express = require("express");
const router = express.Router();
const User = require("../models/users");
// const multer = require("multer");
const fs = require("fs");

// var storage = multer.diskStorage({...});
// var upload = multer({ storage: storage }).single('image');

// إضافة User بدون صورة مؤقتًا
router.post('/add', (req, res) => { // حذف upload من هنا
  const user = new User({
    id: req.body.id + 1,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    // image: req.file.filename // نلغي الصورة دلوقتي
  });

  user.save().then((data) => {
    if (data) {
      req.session.message = {
        type: "success",
        message: "user Added successfully"
      };
      res.redirect("/");
    } else {
      return res.json({ message: "Error adding user", type: "danger" });
    }
  });
});

// باقي الـ Routes زي ما هي
router.get("/", async (req, res) => {
  const allUsers = await User.find();
  if (!allUsers) {
    res.status(400).json({ message: "no users found" });
  } else {
    res.render("index", {
      title: "Home Page",
      users: allUsers
    });
  } 
});

router.get("/add", (req, res) => {
  res.render("add_users", { title: "Add-User" });
});

router.get("/edit/:id", async (req, res) => {
  let id = req.params.id;    
  const user = await User.findById(id);
  if (!user) {
    res.redirect("/");
  } else {
    res.render("edit_users", {
      title: "Edit User",
      user: user
    });
  }
});

router.post("/update/:id", (req, res) => { // حذف upload من هنا
  let id = req.params.id;   
  User.findByIdAndUpdate(id, {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    // image: new_image // نلغي الصورة دلوقتي
  }).then((user) => {
    if (!user) {
      res.status(400).json({ message: "theres no data" });
    } else {
      req.session.message = {
        type: "success",
        message: "user updated successfully"
      };
      res.redirect("/");
    }
  });
});

router.get("/delete/:id", async (req, res) => {
  let id = req.params.id;
  User.findByIdAndDelete(id).then((result) => {
    if (result) {
      req.session.message = {
        type: "danger",
        message: "user deleted successfully"
      };
      res.redirect("/");
    } else {
      res.json({ message: "no data found", type: "danger" });
    }  
  });
});

module.exports = router;