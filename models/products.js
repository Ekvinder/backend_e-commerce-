const mongoose = require("mongoose")
const products= new mongoose.Schema({
    Name :{
        type:String
    },
    Description:{
        type:String
    },
    Price:{
        type:Number
    },
    Discount:{
        type:Number
    },
    category:{
        type:String
    },
    img:{
        type:String
    }
})

let productModal = new mongoose.model("products",products)
module.exports = productModal