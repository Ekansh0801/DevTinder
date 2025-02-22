const express = require("express");
const {userAuth} = require("../middlewares/auth.js")
const requestRouter = express.Router();

// send connection request
requestRouter.post('/sendConnectionRequest',userAuth,async(req,res) => {
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

module.exports = requestRouter;