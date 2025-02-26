const express = require("express");
const {userAuth} = require("../middlewares/auth.js");
const { validateEditProfileData, validatePasswordUpdateData } = require("../utils/validation.js");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");

// get my profile
profileRouter.get('/myProfile/view',userAuth,async(req,res) => {
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

//update profile
profileRouter.patch('/myProfile/edit',userAuth,async(req,res) => {
    try{
        const allowed = validateEditProfileData(req);
        if(!allowed){
            throw new Error("Edit not allowed!!!")
        }

        const currUser = req.user;
        Object.keys(req.body).forEach((key) => {
            currUser[key] = req.body[key]
        })

        await currUser.save()

        return res.status(200).send({
            "message":"hogaya update!!!"
        })
    }
    catch(error){
        return res.status(402).send({
            "error":error.message,
            "message":"error aagaya bhai!!!"
        })
    }
})

//updatepassword
profileRouter.patch('/myProfile/password/update',userAuth,async(req,res) => {
    try{
        validatePasswordUpdateData(req);

        const currUser = req.user;
        const currPassMatch = await bcrypt.compare(req.body.currentPassword,currUser.password);
        if(!currPassMatch){
            throw new Error('current Password does not match!!!')
        }

        const passwordHash = await bcrypt.hash(req.body.newPassword, 10);
        currUser.password = passwordHash;
        currUser.save()

        return res.status(200).send({
            "message":"password updated"
        })

    }
    catch(error){
        return res.status(402).send({
            "error":error.message,
            "message":"error aagaya bhai"
        })
    }
})


module.exports = profileRouter;