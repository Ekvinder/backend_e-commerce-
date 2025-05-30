const mongoose = require("mongoose")
const userlogin = new mongoose.Schema({
    Name:{
        type:String
    },
    Password:{
        type:String
    },
    dob:{
        type:String
    },
    Email:{
        type:String
    },
    Phoneno:{
        type:String
    },
    Pincode:{
        type:String
    },
    City:{
        type:String
    },
   State:{
    type:String
   },
    streetAddress:{
        type:String
    },
   
    
})
let loginmodal = new mongoose.model("userlogin",userlogin)
module.exports = loginmodal
