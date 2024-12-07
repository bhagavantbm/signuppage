const express=require("express")
const router=express.Router();
const User=require("../models/user/login");
const passport = require("passport");

router.get("/index",(req,res)=>{
    res.render("../views/user/index.ejs")
})

router.get("/home", (req, res) => {
    res.render("../views/user/home.ejs");
  });


//sigup Route
router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs")
})


//post signup route
router.post("/signup",async(req,res)=>{
    let{username,email,password,firstname,lastname,gender,dob,number,countrycode}=req.body;
    let newUser=new User({email,username,firstname,lastname,password,gender,dob,number,countrycode});
   let registeruser= await User.register(newUser,password)
   console.log(registeruser)
   req.flash("success","user registered successfully")
   res.redirect('index')

})

//login Route
router.get("/login",(req,res)=>{
    res.render("user/login.ejs")
})


//post login route
router.post("/login",passport.authenticate("local",{ failureRedirect: '/login' ,failureFlash:true}),async(req,res)=>{
    let{username}=req.body;
    console.log(username)
    req.flash("success",`Welcome ${username} to My website`)
    res.redirect('home')
})


module.exports=router;