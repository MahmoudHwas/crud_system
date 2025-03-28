const express = require("express");
const router = express.Router();
const User = require("../models/users")
const multer = require("multer")
const fs = require("fs")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads"); // حفظ الصور داخل مجلد public
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

const upload = multer({ storage: storage }).single("image");

// insert user into databse
router.post('/add', upload ,  (req, res) => {
    const user = new User({
        id: req.body.id + 1,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename
    })
  
     user.save().then((data)=> {
        if(data){
            req.session.message = {
              type: "success",
               message: "user Added successfully"
            };
            res.redirect("/") 
          
        } else {
              return res.json({message : err.message, type: "danger"})
        }
    });
     
})


// get All Users
router.get("/", async (req, res) => {
    const allUssers = await User.find();
    if(!allUssers) {
        res.status(400).json({message: "no users found"})
    } else {
        res.render("index", {
            title: "Home Page",
            users: allUssers
        })
    } 
})

router.get("/add", (req, res) => {
    res.render("add_users", {title: "Add-User"})
})

// edit user

router.get("/edit/:id", async (req, res) => {
    let id = req.params.id;    
    const user = await User.findById(id)
    if(!user) {
        res.redirect("/")
    } else {
        res.render("edit_users", {
            title: "Edit User",
            user: user
        })
    }

 })

 // update user
 router.post("/update/:id", upload, async (req, res) => {
    let id = req.params.id;   
    let new_image = '';
    if(req.file) {
        new_image = req.file.filename;
        try {
            fs.unlinkSync('./uploads/'+req.body.old_image )
        } catch (err) {
            console.log(err);
            
        }

    } else {
        new_image = req.body.old_image 
    }
    const user = await User.findByIdAndUpdate(id, {$set:{
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: new_image

    }})

    if(!user) {
        res.status(400).json({message : "theres no data"})
    } else {
        req.session.message = {
            type: "success",
             message: "user updated successfully"
          };
        res.redirect("/")
    }
 })

 // delete user 
 router.get("/delete/:id" , async (req, res) => {
    let id = req.params.id;
 
    
        User.findByIdAndDelete(id).then((result) => {
        if(result.image != '') {
            try {
                fs.unlinkSync("./uploads/"+result.image)
            } catch(err) {
                console.log(err);
            }
         }
         if(result){
            req.session.message = {
                type: "danger",
                 message: "user deleted successfully"
              };
          
            res.redirect("/")
         } else {
            res.json({message: "no data found", type: "danger"})
         }  
     })

 })

module.exports = router
