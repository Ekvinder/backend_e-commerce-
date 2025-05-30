const express = require("express")
const frontEnd = express.Router()
const session = require("express-session")
const loginmodal = require("../models/userlogin")
const productModal = require("../models/products")
const { default: mongoose } = require("mongoose")
const myUserModel = require("../models/adminuser")
const adminmodal = require("../models/adminyour")
const frontEndCart = require("../models/frontEndCart")
var nodemailer = require("nodemailer")
const orderModel = require("../models/order")
const stripe = require("stripe")(
    "sk_test_51QISBgDxMdd0OOSnDBTk4OyzdX9QrM3KqPY2KuRiGjVMSH3airoSpHBCyhhGTYPb0nh4VjnBJxjJEXDxDgPnISv600I5CXkIdI"
);


const frontEndSessionChecker = (req, res, next) => {
    if (req.session.userId) {
        next()
    } else {
        res.redirect("/userlogin")
    }

}
// nodemailer


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ekvinderkaursaini@gmail.com',
        pass: 'pbmg ozdc qfqd vrnz'
    }
});
frontEnd.get("/forgetpassword", (req, res) => {
    let checkFrontEndLogin = req.session.userId ? true : false;
    res.render("forgetpassword", { checkFrontEndLogin })
})

frontEnd.post("/forgetpassword", async (req, res) => {
    let user = await loginmodal.findOne({ Email: req.body.Email });

    console.log(user)
    if (user) {
        req.session.Email = req.body.Email
        var otp = Math.floor(Math.random() * 6000).toString();
        req.session.otp = otp
        var mailOptions = {
            from: 'ekvinderkaursaini@gmail.com',
            to: req.body.Email,
            subject: 'Sending Email using Node.js',
            text: otp

        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                next()
            }
        });

        res.redirect("otpPage")
    }
})

frontEnd.get("/otpPage", (req, res) => {
    let checkFrontEndLogin = req.session.userId ? true : false;
    res.render("otpPage", { checkFrontEndLogin })
})

frontEnd.post("/otpPage", (req, res) => {

    let userOTP = req.body.otp
    let storeOTP = req.session.otp
    console.log(userOTP, storeOTP)

    if (userOTP && userOTP == storeOTP) {
        req.session.otpverified = true
        res.redirect("resetPassword")
    }
    else {
        // req.session.errormessage = "invalid OTP"
        res.redirect("otpPage")
    }

})

frontEnd.get("/resetPassword", (req, res) => {
    let checkFrontEndLogin = req.session.userId ? true : false;
    res.render("resetPassword", { checkFrontEndLogin })
})

frontEnd.post("/resetPassword", async (req, res) => {
    if (!req.session.otpverified) {
        // req.session.errormessage = "OTP verfication required"
        res.redirect("forgetpassword")
    } else {
        await loginmodal.findOneAndUpdate({ Email: req.session.Email }, { Password: req.body.Password })
    }

    req.session.otpverified = false
    res.redirect("userlogin")
})


frontEnd.get("/", async (req, res) => {
    let checkFrontEndLogin = req.session.userId ? true : false;
    let products = await productModal.find().limit(3)
    res.render("home", {products, checkFrontEndLogin })
})

frontEnd.get("/about", (req, res) => {
    let checkFrontEndLogin = req.session.userId ? true : false;
    res.render("about", { checkFrontEndLogin })
})

frontEnd.get("/glasses", async (req, res) => {
    let products = await productModal.find()
    let checkFrontEndLogin = req.session.userId ? true : false;
    res.render("glasses", { products, checkFrontEndLogin })
})

frontEnd.get("/shop/:id", async (req, res) => {
    let product = await productModal.findOne({ _id: req.params.id })
    let checkFrontEndLogin = req.session.userId ? true : false;
    res.render("shop", { product, checkFrontEndLogin })
})


frontEnd.get("/contact", (req, res) => {
    let checkFrontEndLogin = req.session.userId ? true : false;
    res.render("contact", { checkFrontEndLogin })
})



frontEnd.get("/Dashboard2", frontEndSessionChecker, async (req, res) => {
    let user = await loginmodal.findOne({ _id: req.session.userId })
    let checkFrontEndLogin = req.session.userId ? true : false;
    let orders = await orderModel.find({userId:req.session.userId})
    res.render("Dashboard2", { user, orders:orders ,checkFrontEndLogin })
})

// frontEnd.get("/getorder",(req,res) =>{

// })


frontEnd.get("/cart", frontEndSessionChecker, async (req, res) => {
    let checkFrontEndLogin = req.session.userId ? true : false;
    let cartProducts = await frontEndCart.find({ userId: req.session.userId })
    
    let total = 0
    cartProducts.map((k) => {
        total += k.quantity * k.product.Discount
    })
    res.render("cart", { checkFrontEndLogin, cartProducts, total })
})



frontEnd.get("/userlogin", (req, res, next) => {
    if (req.session.userId) {
        res.redirect("/Dashboard2")
    } else {
        next()
    }
}, (req, res) => {

    let checkFrontEndLogin = req.session.userId ? true : false;
    res.render("userlogin", { checkFrontEndLogin })
})


frontEnd.post("/userLogin", async (req, res) => {
    let user = await loginmodal.findOne({ Email: req.body.Email, Password: req.body.Password })
    if (user != null) {
        req.session.userId = user._id
        res.redirect("/Dashboard2")
    } else {
        res.redirect("/userlogin?msg=PasswordNotCorrect")
    }

})

frontEnd.get("/regForm2", (req, res, next) => {
    if (req.session.userId) {
        res.redirect("/Dashboard2")
    } else {
        next()
    }
}, (req, res) => {
    let checkFrontEndLogin = req.session.userId ? true : false;
    res.render("regForm2", { checkFrontEndLogin })
})

frontEnd.post("/postData", (req, res) => {
    const register = new loginmodal(req.body)
    register.save()
    res.redirect("/userlogin")
})

frontEnd.post("/updateProfile/:id", async (req, res) => {
    console.log(req.body);

    await loginmodal.findOneAndUpdate({ _id: req.session.userId }, req.body)
    res.redirect("/Dashboard2")
})

//post = req.body
//get = res.session.id
// get =/:id = parameter


frontEnd.get("/addToCart/:id", frontEndSessionChecker, async (req, res, next) => {
    let product = await productModal.findOne({ _id: req.params.id })
    let checkProductpresent = await frontEndCart.findOne({ userId: req.session.userId, product: product })
     console.log(checkProductpresent)
    if (checkProductpresent) {
        let quantity = checkProductpresent.quantity + 1
        await frontEndCart.findOneAndUpdate({ userId: req.session.userId, product: product }, { quantity: quantity })
        res.redirect("/glasses")
    } else {
        next()
    }
}, async (req, res) => {
    let product = await productModal.findOne({ _id: req.params.id })
    let obj = new frontEndCart({
        userId: req.session.userId,
        product: product,
        quantity: 1,
    })
    obj.save()
    res.redirect("/cart")
})


frontEnd.get("/deleteFromCart/:id", frontEndSessionChecker, async (req, res) => {
    await frontEndCart.findOneAndDelete({ _id: req.params.id })
    res.redirect("/cart")
})

frontEnd.get("/addQuantity/:id", frontEndSessionChecker, async (req, res) => {
    let product = await productModal.findOne({ _id: req.params.id })
    let cart = await frontEndCart.findOne({ userId: req.session.userId, product: product })
    await frontEndCart.findOneAndUpdate({ userId: req.session.userId, product: product }, {
        quantity: cart.quantity + 1
    })
    res.redirect("/cart")
})
frontEnd.get("/removeQuantity/:id", frontEndSessionChecker, async (req, res) => {
    let product = await productModal.findOne({ _id: req.params.id })
    let cart = await frontEndCart.findOne({ userId: req.session.userId, product: product })
    await frontEndCart.findOneAndUpdate({ userId: req.session.userId, product: product }, {
        quantity: cart.quantity - 1
    })
    res.redirect("/cart")
})


frontEnd.get("/checkoutpage", frontEndSessionChecker, async (req, res) => {
    let checkFrontEndLogin = req.session.userId ? true : false;

     let cartProducts = await frontEndCart.find({ userId: req.session.userId })
    
      
    let total = 0
    cartProducts.map((k) => {
        total += k.quantity * k.product.Discount
    })
    res.render("checkoutpage", { checkFrontEndLogin, cartProducts, total })
})

frontEnd.post('/create-checkout-session', async (req, res) => {
    let data = await frontEndCart.find({ userId: req.session.userId })
    
    let proARR = [];
    data.map((k) => {
        let pro = {

            price_data: {
                currency: 'INR',
                product_data: {
                    name: k.product.Name,
                },
                unit_amount: k.product.Discount * 100,
            },
            quantity: k.quantity,
        }
        proARR.push(pro);
        console.log(proARR);

    })

    const session = await stripe.checkout.sessions.create({
        line_items: proARR,
        mode: 'payment',
        success_url: 'http://localhost:1111/successPage',
        cancel_url: 'http://localhost:1111',
    });

    res.redirect(303, session.url);
    
})

frontEnd.get("/successPage",async (req, res) => {
    let checkFrontEndLogin = req.session.userId ? true : false;
    let cartProducts = await frontEndCart.find({ userId: req.session.userId })
    let order = new orderModel({userId :req.session.userId , Product: cartProducts ,date : new Date() ,status:"ordered"})
      order.save()
      res.render("successPage",{ checkFrontEndLogin})
})
  




frontEnd.get("/userLogout", (req, res) => {
    req.session.destroy()
    res.redirect("/")
})

frontEnd.get("/adminLogin", (req, res) => {
    res.render("admin/login")
})

frontEnd.post("/postAdmin", async (req, res) => {
    let admin = await adminmodal.findOne({ Name: req.body.Name, Password: req.body.Password })
    console.log(admin);

    if (admin != null) {
        req.session.uid = admin._id
        res.redirect("/adminDashboard")
    } else {
        res.redirect("/adminLogin?msg=passwordIncorrect")
    }

})





module.exports = frontEnd

