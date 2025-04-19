const socket = require("socket.io")
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
return crypto
.createHash("sha256")
.update([userId, targetUserId].sort().join("$"))
.digest("hex");
};

const initializeSocket = (server) => {

    
    
    const io = socket(server,{
        cors:{
            origin:"http://localhost:5173"
        }
    })
    
    io.on("connection",(socket) => {
        //Handle events

        socket.on("joinChat",({firstName,userId,targetUserId}) => {
            const room = getSecretRoomId(userId, targetUserId)
            console.log(firstName + " joined room", room)
            socket.join(room)
        })
        socket.on("sendMessage",async({ firstName, lastName, userId, targetUserId, text }) => {

            const roomId = getSecretRoomId(userId, targetUserId)
            // console.log(firstName + " " + text)
            
            try {
                let chat = await Chat.findOne({ participants: { $all: [userId, targetUserId] } });
                if(!chat){
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: [],
                    });
                }

                chat.messages.push({
                    senderId: userId,
                    text: text,
                });
                await chat.save();

            } catch (error) {
                console.log(error)
            }
            io.to(roomId).emit("messageReceived", {firstName,text})
        })
        socket.on("disconnect", () =>{

        })
        
    })
}


module.exports = initializeSocket;