const mongoose = require("mongoose")
const admin= new mongoose.Schema({
    Name:{
        type:String
    },
    Password:{
        type:String
    }
})
let adminmodal = new mongoose.model("adminyour",admin)
module.exports= adminmodal