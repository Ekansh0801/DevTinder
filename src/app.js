const express = require("express");
const app = express();
const cookieParser = require("cookie-parser")
app.use(express.json());
app.use(cookieParser())

const connectDB = require('../src/config/database.js');


const authRouter = require('./routes/auth.js')
const profileRouter = require('./routes/profile.js')
const requestRouter = require('./routes/requests.js');
const userRouter = require("./routes/user.js");

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);


connectDB().then(() => {
    console.log('DB Connected Successfully!!')
    app.listen(3000, () => {
        console.log("Server listening at port 3000!!")
    })
    
}).catch((error) => {
    console.log('DB Connection unsuccessfull!!')
})







