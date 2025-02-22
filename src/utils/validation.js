const validator = require('validator');

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

const validateLoginData = (req) => {
    const {email,password} = req.body;
    if(!validator.isEmail(email)){
        throw new Error('Invalid Email!!')
    }

    if(password.length === 0){
        throw new Error('Password Missing!!');
    }
}

module.exports = { validateSignupData,validateLoginData };