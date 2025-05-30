const express = require("express")
const productModal = require("../models/products")
const testcors = express.Router()



testcors.get("/cors",async (req,res) =>{
    let obj = await productModal.find()

    res.json(obj)
})
testcors.post("/postdatacors",(req,res) =>{
    console.log(req.body)
    res.send("done")
})

module.exports= testcors;