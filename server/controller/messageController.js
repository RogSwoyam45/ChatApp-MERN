import Message from "../models/Message.js";
import User from "../models/Users.js";
import cloudinary from "../utils/cloudinary.js";
import { io, userSocketMap } from "../server.js";


export const getUsersForSidebar = async (req, res) =>{
    try {
        const userId = req.user._id;
        const filterdUsers = await User.find({ _id: { $ne: userId } }).select("-password");
        //count numbe rof messages not seen

        const unseenMessages = {}
        const promises = filterdUsers.map(async (User) => {
            const messages = await Message.find({
                senderId: User._id,
                recieverId: userId,
                seen: false
            })
            if(messages.length >0){
                unseenMessages[User._id] = messages.length;
            }
        });
        await Promise.all(promises);
        res.json({success: true, users: filterdUsers, unseenMessages})
        
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message});
    }
}


export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId:myId, recieverId:selectedUserId},
                {senderId:selectedUserId, recieverId:myId },
            ]
        })
        await Message.updateMany({senderId:selectedUserId, recieverId:myId},
            {seen:true});

        res.json({success: true, messages})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message});
    }
}



//api to mark message as seen using message id

export const markMessageAsSeen = async (req, res) => {
    try {
        const {id} = req.params;
        await Message.findByIdAndUpdate(id, {seen:true})
        res.json({success: true})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message});
    }
}

//Send message to selected user

export const sendMessages = async (req, res) => {
    try {
        const {text, image} = req.body;
        const recieverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;

        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            recieverId,
            text,
            image: imageUrl
        })

        //emit the new message to reciever socket
        const recieverSocketId = userSocketMap[recieverId];
        if(recieverSocketId){
            io.to(recieverSocketId).emit("newMessage" , newMessage)
        }
        res.json({success:true, newMessage});

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message});
    }
}