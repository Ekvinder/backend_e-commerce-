const mongoose = require("mongoose")
const catgry = new mongoose.Schema({
    category:{
        type:String
    }
})

let mycatgryModal = new mongoose.model("category",catgry)
module.exports= mycatgryModal 