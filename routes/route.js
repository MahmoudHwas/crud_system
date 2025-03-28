const express = require("express");
const router = express.Router();
const User = require("../models/users");
const multer = require("multer");

// استخدام Memory Storage بدل Disk Storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image');

// إضافة User
router.post('/add', upload, (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: req.file ? req.file.buffer.toString('base64') : '' // حفظ الصورة كـ Base64
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

router.get("/", async (req, res) => {
    try {
      console.log("GET / called");
      const allUsers = await User.find();
      res.render("index", {
        title: "Home Page",
        users: allUsers || [] // لو مافيش Users، ابعت Array فاضي
      });
    } catch (err) {
      console.error("Error in GET /:", err.message);
      res.status(500).send("Something went wrong: " + err.message);
    }
  });

router.get("/add", (req, res) => {
  res.render("add_users", { title: "Add-User" });
});

// تعديل User
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

router.post("/update/:id", upload, async (req, res) => {
  let id = req.params.id;   
  let new_image = req.body.old_image; // الصورة القديمة كـ Base64
  if (req.file) {
    new_image = req.file.buffer.toString('base64'); // تحديث الصورة الجديدة
  }
  const user = await User.findByIdAndUpdate(id, {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: new_image
  });
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

// حذف User
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