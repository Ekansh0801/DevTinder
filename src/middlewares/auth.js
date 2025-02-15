const isAdmin = (req,res,next) => {
    console.log("Authenication checked!!!")
    const token = "swati";

    if(token !== "swati"){
        return res.status(401).send("unauthorized access!!!");
    }
    else{
        next();
    }
};


const isUser = (req,res,next) => {
    console.log("Authenication checked!!!")
    const token = "swati";

    if(token !== "swati"){
        return res.status(401).send("unauthorized access!!!");
    }
    else{
        next();
    }
};

module.exports = { isAdmin,isUser }