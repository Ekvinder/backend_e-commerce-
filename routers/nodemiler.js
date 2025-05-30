const express = require("express")
const testnodemailer = express.Router()

var nodemailer = require("nodemailer")



var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ekvinderkaursaini@gmail.com',
      pass: 'pbmg ozdc qfqd vrnz'
    }
  });
  
let ramdomNUm = (Math.floor(Math.random()*6000).toString()); 


testnodemailer.get("/nhome",(req,res) =>{
    res.render("nodemailerform")

})



testnodemailer.post("/nhome",(req,res)=>{
  
    var mailOptions = {
        from: 'ekvinderkaursaini@gmail.com',
        to: req.body.email,
        subject: 'Sending Email using Node.js',
        text: ramdomNUm
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

})

module.exports= testnodemailer;