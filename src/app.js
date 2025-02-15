const express = require("express");
const User = require("./models/user.js")
const app = express();

app.use(express.json());

const connectDB = require('../src/config/database.js')

connectDB().then(() => {
    console.log('DB Connected Successfully!!')
    app.listen(3000, () => {
        console.log("Server listening at port 3000!!")
    })
    
}).catch((error) => {
    console.log('DB Connection unsuccessfull!!')
})


//get user by id
app.get('/user',async (req,res) => {
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
        return res.status(401).send("error aagaya bhai!!")      
    }
})

// get all users
app.get('/feed',async (req,res) => {
    try{
        const user = await User.find({});

        if(user.length === 0) res.send("kuch nahi mila bhai!!")
        return res.send({
            user,
            "result":"mil gaya re"
        })
    }
    catch(error){
        return res.status(401).send("error aagaya bhai!!")      
    }
})

app.post("/signup",async (req,res) => {
    try{
        const {firstName,lastName,email,age,password} = req.body;

        const user = new User({firstName,lastName,email,age,password});
         await user.save();

         return res.send("hogaya save bhai!!!");
    }
    catch(error){
        console.log(error);
        return res.status(401).send("error aagaya bhai!!")
    }
})






