const mongoose = require("mongoose")
const order = new mongoose.Schema({

    userId:{
        type:String
    },
       Product:{
        type:Object
    },
    date: String,
    status :String,
})

let  orderModel = new mongoose.model("order",order)
module.exports = orderModel