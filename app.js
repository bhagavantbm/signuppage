const mongoose=require("mongoose");
const express=require("express");
const app=express();
const session=require("express-session");
const passport=require("passport")
const Localstratergy=require("passport-local")
const flash=require("connect-flash");
const User=require("./models/user/login")
const userRoute=require("./routes/user")
const ejs=require("ejs");
const ejsmate = require("ejs-mate");
const path=require("path");
const { error } = require("console");


main().then(()=>{console.log("connection to DB successfull")})
.catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/user');
}
app.set("view engine","ejs")
app.use(express.urlencoded({ extended: true }));
app.set("views",path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsmate);

require('dotenv').config();


// Use the environment variable for MongoDB connection

const sessionoperatores = {
    secret: 'mymsg' ,
    resave:false,
    saveUninitialized:true,
    cookie:{
      expiers:Date.now()+7*24*60*60*1000,
      maxAge: 7*24*60*60*1000, 
      httpOnly:true
    }
}

app.use(session(sessionoperatores))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


passport.use(new Localstratergy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// app.get("/demouser",async(req,res)=>{
//     let fakeusr=new User({
//         email:"virat@gmail.com",
//         username:"bhagat99"
//     })
//    let registeruser= await User.register(fakeusr,"hello");
//    console.log(registeruser)
//    res.send(registeruser)
// })


  
  app.get("/", (req, res) => {
    res.redirect("index") 
});






app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error")
  res.locals.currUser=req.user;
  next();
})

app.use("/",userRoute)

app.listen("9090",(req,res)=>{
    console.log("listening to port 9090");
})
