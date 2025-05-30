const express = require("express")
const jwtRouter = express.Router()
let jwt = require("jsonwebtoken")
const {LocalStorage} = require('node-localstorage')
const localstorage = new LocalStorage("./scratch")
let secretKey = "qwerf";

localstorage.setItem('ekvinder','hello world')
console.log(localstorage.getItem('ekvinder'))

jwtRouter.get("/jwt",(req,res) =>{
  let payload = {
    name:"vhliun",
    age:"56"
  };
  let token = jwt.sign(payload,secretKey);

    console.log(jwt)
    localstorage.setItem('token',token)
    res.send(token)
    
})
jwtRouter.get("/checktoken",(req,res)=>{
    let token = localstorage.getItem('token');

    let result =  jwt.verify(token,secretKey)
    res.json(result)

})


module.exports = jwtRouter