const express=  require("express")
const app  = express()
const mongoose = require('mongoose');
const session= require('express-session')
const cors = require('cors');
let adminr = require("./routers/admin");
const nodemailer = require("./routers/nodemiler");
const frontEnd = require("./routers/frontEnd");
const paymentRoute = require("./routers/payment");
const jwtRouter = require("./routers/jwt");
const testcors = require("./routers/cors");



app.set("view engine", "ejs")
app.set("views","./views")
app.use(express.urlencoded({ extended: false}))

app.use(session({
    secret: 'myfirstsession',
    resave: false,
    saveUninitialized: false,
 }));

//mongodb collection
mongoose.connect('mongodb://localhost:27017/mydb')


const db = mongoose.connection;
db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});
db.once('open', () => {
    console.log('Connected to MongoDB');
});
db.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
});






// after npm install body-parser
bodyParser = require('body-parser');

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));


let corsOption = {
  origin : "*",
  allowedHeaders : ["content-Type"],
  Credential:true,
  optionsSuccessStatus: 200
}
app.use(cors(corsOption))

const sessionCheckerforadmin =(req,res,next)=>{
    if(req.session.uid){
      next()
    }else{
      res.redirect("/adminLogin")
    }
  } 

app.use(express.static("public"));
app.use("/",frontEnd)
app.use("/",paymentRoute)
app.use("/", nodemailer)
app.use("/",jwtRouter)
app.use("/",testcors)
app.use("/",sessionCheckerforadmin,adminr)


app.listen(1234,console.log("server running"))
