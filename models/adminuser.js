const mongoose =require("mongoose")
const userSchema = new mongoose.Schema({
    FirstName:{
        type:String
    },
    LastName:{
        type:String
    },
    Email:{
        type:String
    },
    dob :{
        type:String
    },
    Phoneno:{
        type:Number
    },
    Password:{
        type:String
    }
})

let myUserModel= new mongoose.model("user",userSchema)
module.exports = myUserModel