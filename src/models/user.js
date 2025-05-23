const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("email invalid" + value)
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error('weak password!!!')
            }
        }
    },
    age:{
        type:Number,
    },
    gender:{
        type:String,
        enum:{
            values:["male","female","others"],
            message:`{VALUE} not a valid gender!!!`
        }
        // validate(value){
        //     if(!["male","female","others"].includes(value)){
        //         throw new Error ("gender data not valid!!!")
        //     }
        // }
    },
    photoUrl:{
        type:String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error('photo url not valid!!!')
            }
        },
        default:"https://i.pinimg.com/736x/c8/ec/05/c8ec0552d878e70bd29c25d0957a6faf.jpg"

    },
    about:{
        type:String,
        default:"This is default about of the user!!!"
    },
    skills:{
        type:[String],
    }
},{timestamps:true})


userSchema.methods.getJWT = async function(){

    const token = await jwt.sign({userId:this._id},"Swati@0108",{expiresIn:'7d'});
    return token;
}

userSchema.methods.verifyPassword = async function(password) {
    const passwordMatch = await bcrypt.compare(password,this.password);
    return passwordMatch;
}


const User = mongoose.model("User",userSchema);
module.exports = User;