const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose")


const userSchema=new Schema({
    email:{
        type:String,
        required:true
    },firstname:{
        type:String,
        required:true
    },lastname:{
        type:String,
        required:true
    },countrycode:{
        type:Number,
        required:true
    },number:{
        type:Number,
        required:true
    },dob:{
        type:Date,
        required:true
    },gender:{
        type:String,
        required:true
    },password:{
        type:String,
        required:true
    }
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);

