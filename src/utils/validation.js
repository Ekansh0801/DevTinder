const validator = require('validator');

// signup data
const validateSignupData = (req) =>{
    const {firstName,lastName,email,password} = req.body;
    
    if(!firstName || !lastName){
        throw new Error('Full Name required!!!');
    }

    if(!validator.isEmail(email)){
        throw new Error('emailID not valid!!!');
    }

    if(!validator.isStrongPassword(password)){
        throw new Error('Password not strong!!!');
    }

} ;

// login data
const validateLoginData = (req) => {
    const {email,password} = req.body;
    if(!validator.isEmail(email)){
        throw new Error('Invalid Email!!')
    }

    if(password.length === 0){
        throw new Error('Password Missing!!');
    }
}

// edit profile data
const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName","lastName","email","age","gender","photoUrl","about","skills"]

    const isUpdateAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field))

    return isUpdateAllowed;
}

const validatePasswordUpdateData = (req) => {
    const {currentPassword,newPassword,confirmNewPassword} = req.body;
    if(currentPassword.length === 0 || newPassword.length === 0 ||confirmNewPassword.length === 0){
        throw new Error('All Fields Required!!!')
    }

    if(newPassword !== confirmNewPassword){
        throw new Error('newPassword and confirmNewPassword must be same!!!');
    }

    if(currentPassword === newPassword){
        throw new Error('current and new Password cant be same')
    }

    if(!validator.isStrongPassword(newPassword)){
        throw new Error('new Password not strong!!!');
    }

}

module.exports = { validateSignupData,validateLoginData,validateEditProfileData,validatePasswordUpdateData };