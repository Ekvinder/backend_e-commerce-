const mongoose = require("mongoose")
const carts = new mongoose.Schema({

    userId:{
        type:String
    },
    product:{
        type:Object
    },
    quantity:{
        type:Number
    }

})
let frontEndCart = new mongoose.model("carts",carts)
module.exports = frontEndCart