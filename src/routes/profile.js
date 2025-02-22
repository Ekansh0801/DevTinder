const express = require("express");
const {userAuth} = require("../middlewares/auth.js")
const profileRouter = express.Router();

// get my profile
profileRouter.get('/myProfile',userAuth,async(req,res) => {
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

// update data of exisiting users
profileRouter.patch('/updateUser/:userId',userAuth, async (req, res) => {
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

module.exports = profileRouter;