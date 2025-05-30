const express = require("express")
const adminRouter = express.Router()
const myUserModel = require("../models/adminuser")
const mycatgryModal = require("../models/category")
const productModal = require("../models/products")
const adminmodal = require("../models/adminyour")
const session = require("express-session")
const path = require("path");
const multer = require("multer");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + ".jpg");
    },
});

// Define maximum upload file size (1 MB)
const maxSize = 1 * 1000 * 1000;

// Configure Multer
const upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb(
            "Error: File upload only supports the following filetypes - " + filetypes
        );
    },
}).single("img");









adminRouter.get("/adminDashboard", function (req, res) {
    res.render("admin/dashboard");
});

adminRouter.post("/postproduct", function (req, res) {
    upload(req, res, function (err) {
        if (err) {

            res.send(err);
            console.log(err);
        } else {

            let finalData = { ...req.body, img: req.file.filename }
            const register = new productModal(finalData)
            register.save()
            res.redirect("/dashboard")

        }
    });
});



adminRouter.get("/dashboard", (req, res) => {
    res.render("admin/dashboard")
})



adminRouter.get("/regForm", (req, res) => {
    res.render("admin/regForm")

})

adminRouter.get("/alldata", async (req, res) => {
    let d = await myUserModel.find();
    res.render("admin/alldata", { d: d })
})

adminRouter.post("/postdata", (req, res) => {
    const submitUser = new myUserModel(req.body)

    submitUser.save()
    res.redirect("/getuser?msg=add")

    console.log(req.body)
})


adminRouter.post("/admin", (req, res) => {
    myUserModel.findOne({ Name: req.body.Name, Password: req.body.Password }).then((user) => {
        if (user === null) {
            console.log("login failed")
            return res.redirect("/admin")
        }
        req.session.uid = user._id
        console.log(user)
        res.redirect("/dashboard")
    })
        .catch((err) => {
            console.error("Login Error:", err);
            res.status(500).send("Internal Server Error");
        })

})
adminRouter.get('/getsession', (req, res) => {
    res.send("my session data " + req.session.uid)
});

adminRouter.get('/adminLogout', (req, res) => {
    req.session.destroy()
    res.redirect('/adminLogin')
})



adminRouter.get("/getuser", (req, res) => {
    myUserModel.find().then(d => {
        res.render("admin/alldata", { d: d, msg: req.query.msg })
        console.log(d)
    })
})

adminRouter.get("/userdetail/:id", (req, res) => {
    myUserModel.findOne({ _id: req.params.id }).then(d => {
        res.render("admin/detail", { d: d })
        console.log(d)
    })
})
adminRouter.get("/updateUser/:id", (req, res) => {
    myUserModel.findOne({ _id: req.params.id }).then(d => {
        res.render("admin/editUser", { d: d })
    })
})
adminRouter.get("/deleteUser/:id", (req, res) => {
    myUserModel.findByIdAndDelete(req.params.id).then(d => {
        if (d) {
            res.redirect("/getuser")
        }
        else {
            console.log("user not found")
        }
    })
})

adminRouter.post("/updated/:id", (req, res) => {
    console.log(req.body)
    myUserModel.findByIdAndUpdate(req.params.id, req.body).then(d => {
        if (d) {
            res.redirect("/getuser")
        }
        else {
            console.log("user not found")
        }
    })
})



// category infomation------------------------------>
adminRouter.get("/categoryform",async (req, res) => {
    let category = await mycatgryModal.find()
    res.render("admin/categoryform" ,{ category: category })
})



adminRouter.post("/postcatgry", (req, res) => {
    const categoryId = new mycatgryModal(req.body)
    categoryId.save()
    res.redirect("/categoryform")
    console.log(req.body)
})



adminRouter.get("/catrydetail/:id", (req, res) => {
    mycatgryModal.findOne({ _id: req.params.id }).then(a => {
        res.render("admin/catrydetail", { a: a })
        console.log(a)
    })
})

adminRouter.get("/deletecatrgy/:id", (req, res) => {
    mycatgryModal.findByIdAndDelete(req.params.id).then(a => {
        if (a) {
            res.redirect("/categoryform")
        }
        else {
            console.log("category not fund")
        }
    })
})

adminRouter.post("/updatecategory",async (req,res)=>{
    console.log(req.body)
  await mycatgryModal.findOneAndUpdate({_id:req.body.perviousCategory},{category:req.body.updatedCategory})
  res.redirect("/categoryform")
})

// products detail-------------------------------------->
adminRouter.get("/productfrm", async (req, res) => {
    let category = await mycatgryModal.find();
    res.render("admin/productfrm", { category: category });
    console.log(category);
})
adminRouter.get("/allproducts", async (req, res) => {
    let b = await productModal.find()
    res.render("admin/allproducts", { b: b })
})

adminRouter.post('/postProduct', (req, res) => {
    const register = new productModal(req.body)
    register.save()
    res.redirect("/getproduct")
    console.log(req.body)
})

adminRouter.get("/getproduct", (req, res) => {
    productModal.find().then(b => {
        res.render("admin/allproducts", { b: b })
        console.log(b)
    })
})
adminRouter.get("/productdetail/:id", (req, res) => {
    productModal.findOne({ _id: req.params.id }).then(b => {
        res.render("admin/productdetail", { b: b })
        console.log(b)
    })
})
adminRouter.get("/updateproduct/:id", async(req, res) => {
    let category = await mycatgryModal.find()
    productModal.findOne({ _id: req.params.id }).then(b => {
        res.render("admin/editproduct", { b: b , category:category})
    })
})

adminRouter.get("/deleteproduct/:id", (req, res) => {
    productModal.findByIdAndDelete(req.params.id).then(b => {
        if (b) {
            res.redirect("/getproduct")
        }
        else {
            console.log("product not found")
        }
    })
})

adminRouter.post("/updatedp/:id", (req, res) => {
    console.log(req.body)
    productModal.findByIdAndUpdate(req.params.id, req.body).then(b => {
        if (b) {
            res.redirect("/allproducts")
        }
        else (
            console.log("product not found")
        )
    })
})

module.exports = adminRouter

