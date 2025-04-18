const express = require("express");
const bcrypt = require("bcrypt");
const { validateSignupData, validateLoginData } = require("../utils/validation");
const User = require("../models/user");
const authRouter = express.Router();

// signup
authRouter.post("/signup",async (req,res) => {
    try{
        
        const {firstName,lastName,email,password} = req.body;
        //valiation 
        validateSignupData(req);
        //encrypting password
        const passwordHash = await bcrypt.hash(password, 10);



        const user = new User({firstName,lastName,email,password:passwordHash});
         const savedUser = await user.save();

         const token = await savedUser.getJWT();
         // console.log(token);
 
         // make a token
         res.cookie("token",token,{expires:new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}).send({
             "data": savedUser,
             "message":"Signup Succesfull!!!"
         })
    }
    catch(error){
        // console.log(error);
        return res.status(400).send({
            "error":error.message,
            "message":"error aa gaya bhai!!!"
        })
    }
})


//login
authRouter.post("/login",async (req,res) => {
    try{
        const {email,password} = req.body;
        validateLoginData(req);
    
        const user = await User.findOne({email});
        if(!user){
            throw new Error('Invalid Credentials!!!')
        }  

        const passwordMatch = await user.verifyPassword(password);

        if(!passwordMatch){
            throw new Error('Invalid Credentials!!!')
        }

        const token = await user.getJWT();
        // console.log(token);

        // make a token
        res.cookie("token",token,{expires:new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}).send({
            user,
            "message":"Login Succesfull!!!"
        })
        // add the token to cookie and send it back to user
    }
    catch(error){
        return res.status(401).send({
            "error":error.message,
            "message":"error aagaya bhai!!"
        })
    }

})

//logout
authRouter.post("/logout",async(req,res) => {
    try{
    res.cookie("token",null,{
        expires:new Date(Date.now())
    });

    res.status(200).send({
        "message":"logout hogaya bhai!!"
    })
}
catch(error){
    return res.status(402).send({
        "error":error.message,
        "message":"error aagaya bhai!!!",
    })
}
})
module.exports = authRouter;