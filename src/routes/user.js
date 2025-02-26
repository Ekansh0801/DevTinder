const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const req = require("express/lib/request");
const userRouter = express.Router();

const USER_SAFE_DATA = ["firstName","lastName","gender","age","about","skills"];

//get all the pending connection request of loggedin user
userRouter.get('/user/requests/received',userAuth,async(req,res) => {
    try{
        const currUserId = req.user._id;

        const connectionRequests = await ConnectionRequest.find({
            toUserId:currUserId,
            status:"interested"
        }).populate("fromUserId",USER_SAFE_DATA)

        return res.status(200).send({
            "data":connectionRequests,
            "message":"Ye dekh bhai!!!"
        })
    }
    catch(error){
        return res.status(402).send({
            "error":error.message,
            "message":"error aagaya bhai!!!"
        })
    }
})

// get all connections
userRouter.get('/user/connections',userAuth,async(req,res) => {
    try{
        const currUserId = req.user._id;

        const connections = await ConnectionRequest.find({
            $or:[
                {fromUserId:currUserId, status:"accepted"},
                {toUserId:currUserId, status:"accepted"}
            ]
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA)

        const data = connections.map((row) => {
            if(row.fromUserId.equals(currUserId)){
                return row.toUserId;
            }
            else{
                return row.fromUserId;
            }
    })
        return res.status(200).send({
            "data":data,
            "message":"Ye le bhai!!!"
        })


    }
    catch(error){
        return res.status(402).send({
            "error":error.message,
            "message":"error aagaya bhai!!!"
        })
    }
})

module.exports = userRouter