const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async(req,res,next) => {
    try{
        //read the cookie from req cookies
        const cookie = req.cookies;
        const {token} = cookie;
        if(!token){
            return res.status(401).send({
                "message":"please login!!!"
            })
        }
        //validate the token

        const isTokenValid = jwt.verify(token,"Swati@0108");
        const {userId} = isTokenValid;

        //find the user
        const user = await User.findById(userId);

        if(!user){
            throw new Error('User not Found!!!')
        }
        
        req.user = user;

        next();
    }
    catch(error){
        return res.status(402).send({
            "error":error.message,
            "message":"error aagaya bhai!!!"
        })
    }
}

module.exports = { userAuth };