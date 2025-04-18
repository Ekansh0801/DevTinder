const express = require("express");
const app = express();
const cookieParser = require("cookie-parser")
const cors = require("cors");
const http = require("http");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser())

const connectDB = require('../src/config/database.js');


const authRouter = require('./routes/auth.js')
const profileRouter = require('./routes/profile.js')
const requestRouter = require('./routes/requests.js');
const userRouter = require("./routes/user.js");
const initializeSocket = require("./utils/socket.js");

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);

const server = http.createServer(app)

initializeSocket(server);


connectDB().then(() => {
    console.log('DB Connected Successfully!!')
    server.listen(3000, () => {
        console.log("Server listening at port 3000!!")
    })
    
}).catch((error) => {
    console.log('DB Connection unsuccessfull!!')
})







