const express = require("express");
const {userAuth} = require("../middlewares/auth.js")
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest.js");
const User = require("../models/user.js");

// send connection request
requestRouter.post('/request/send/:status/:userId',userAuth,async(req,res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;


        const toExist = await User.findById(toUserId);
        if(!toExist){
            throw new Error('User doesnot exists!!!');
        }

        const status = req.params.status;

        const allowedUpdates = ["ignored","interested"];
        if(!allowedUpdates.includes(status)){
            throw new Error('Incorrect status type!!!')
        }

        const exisitingStatus = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId},
            ]
        })

        if(exisitingStatus){
            throw new Error('request already status!!!')
        }
        const connectionreq = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionreq.save();

        return res.status(200).send({
            "data":data,
            "message":"Connection request sent successfully!!",
        })

    }
    catch(error){
        return res.status(402).send({
            "error":error.message,
            "message":"Error aagaya bhai!!!"
        })
    }
})

module.exports = requestRouter;