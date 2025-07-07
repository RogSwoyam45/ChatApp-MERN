import express from 'express';
import "dotenv/config";
import cors from 'cors'
import http from 'http'
import { connectDB } from './utils/db';
import userRouter from './Routes/UserRoutes';
import messageRouter from './Routes/messageRoutes';
import { Server } from 'socket.io';


const app = express();
const server = http.createServer(app);

//intialize socket.io server
export const io = new Server(server,{
    cors:{origin:"*"}
})

//store online user
export const userSocketMap = {}; //{userId:socketID}

//Socket.io connection handler
io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User connected ", userId);

    if(userId) userSocketMap[userId] = socket.id;

    //emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", ()=>{
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})


connectDB();

//Middleware

app.use(express.json({limit: "4mb"}));
app.use(cors());

app.use("/api/status" , (req,res) => {
    res.send("server is live");
})
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

if(process.env.NODE_ENV !== "production"){
     server.listen(process.env.PORT || 5000, () => {
        console.log("server is running on PORT" + (process.env.PORT || 5000))
        });   
}

export default server;