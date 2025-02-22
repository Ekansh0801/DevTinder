const express = require("express");
const User = require("./models/user.js")
const app = express();
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cookieParser())

const connectDB = require('../src/config/database.js');
const { validateSignupData,validateLoginData } = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const { userAuth } = require("./middlewares/auth.js");

connectDB().then(() => {
    console.log('DB Connected Successfully!!')
    app.listen(3000, () => {
        console.log("Server listening at port 3000!!")
    })
    
}).catch((error) => {
    console.log('DB Connection unsuccessfull!!')
})


//get user by id
app.get('/getUser',userAuth,async (req,res) => {
    try{
        const {email} = req.body;
        const user = await User.find({email});

        if(user.length === 0) res.send("kuch nahi mila bhai!!")
        return res.send({
            user,
            "result":"mil gaya re"
        })
    }
    catch(error){
        return res.status(401).send({
            "error":error.message,
            message:"error aagaya bhai!!!"
        })      
    }
})

// get all users
app.get('/feed',userAuth,async (req,res) => {
    try{
        const user = await User.find({});

        if(user.length === 0) res.send("kuch nahi mila bhai!!")
        return res.send({
            user,
            "result":"mil gaya re"
        })
    }
    catch(error){
        return res.status(401).send({
            "error":error.message,
            "message":"error aagaya bhai!!"
        })      
    }
})

// get my profile
app.get('/myProfile',userAuth,async(req,res) => {
    try{

        const user = req.user;

        if(!user){
            throw new Error('User nahi mila bohot dhoondhliya!!')
        }

        return res.status(200).send({
            "user":user,
            "message":"yele bhai teri profile!!"
        })
    }
    catch(error){
        return res.status(402).send({
            "error":error.message,
            "message":"error aagaya bhai!!!"
        })
    }
})

// signup
app.post("/signup",async (req,res) => {
    try{
        
        const {firstName,lastName,email,age,password} = req.body;
        //valiation 
        validateSignupData(req);
        //encrypting password
        const passwordHash = await bcrypt.hash(password, 10);



        const user = new User({firstName,lastName,email,age,password:passwordHash});
         await user.save();

         return res.send("hogaya save bhai!!!");
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
app.post("/login",async (req,res) => {
    try{
        const {email,password} = req.body;
        validateLoginData(req);
    
        const user = await User.findOne({email});
        if(!user){
            throw new Error('Invalid Credentials!!!')
        }  

        const passwordMatch = user.verifyPassword;

        if(!passwordMatch){
            throw new Error('Invalid Credentials!!!')
        }

        const token = await user.getJWT();
        // console.log(token);

        // make a token
        res.cookie("token",token,{expires:new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}).send({
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

// update data of exisiting users
app.patch('/updateUser/:userId',userAuth, async (req, res) => {
    try {
        const userId = req.params?.userId;
        const data = req.body;
        // console.log(data);

        const allowedUpdates = ["photoUrl", "about", "gender", "age", "skills"];
        const isUpdateAllowed = Object.keys(data).every((k) => (
            allowedUpdates.includes(k)
        ));

        if (!isUpdateAllowed) {
            throw new Error("update not allowed!!");
        }

        if(data?.skills > 10){
            throw new Error("skills can not be more than 10!!!")
        }

        const user = await User.findByIdAndUpdate(userId, data, {
            returnDocument: "after",
            runValidators: true
        });

        if (!user) {
            throw new Error("User not found");
        }

        return res.status(200).json({
            message: "Data updated successfully",
            user
        });
    } catch (error) {
        console.error("Update error:", error);  // Log the full error details
        return res.status(400).json({
            "error": error.message || "An error occurred during the update",
            "message": "Error updating user"
        });
    }
});

// send connection request
app.post('/sendConnectionRequest',userAuth,async(req,res) => {
    try{
        const user = req.user;
        res.send(user.firstName + ' ' + user.lastName + ' sent a connection request!!!')
    }
    catch(error){
        return req.status(402).send({
            "error":error.message,
            "message":"Error aagaya bhai!!!"
        })
    }
})
