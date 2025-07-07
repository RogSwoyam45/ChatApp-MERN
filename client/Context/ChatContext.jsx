import { createContext, useContext, useEffect } from "react";
import { AuthContext } from './AuthContext';
import toast from "react-hot-toast";
import axios from "axios";



export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])
    const [selectedUsers, setSelectedUsers] = useState(null)
    const [unseenMessages, setUnseenMessages] = useState({})
    
    const {socket , io } =useContext(AuthContext)

    //side bar users
    const getUsers = async () => {
        try {
            const {data} = await axios.get('/api/messages/users');
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //funstion to get messages for selected users
    const getMessages = async (userId) => {
        try {
            const {data} = await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //function to send message to selected user

    const sendMessage = async (messageData) => {
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if(data.success){
                sendMessage((prevMessage) => [... prevMessage, data.newMessage])
            }
            else{
                    toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //function to subscribe message for selected user
    
    const subscribeToMessages = async ( ) => {
        if(!socket){
            return;
        }

        socket.on("newMessage", (newMessage) =>{
            if(selectedUsers && newMessage.senderId === selectedUsers._id){
                newMessage.seen = true;
                setMessages((prevMessage) => [...prevMessage,newMessage]); 
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }
            else{
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages, [newMessage.senderId] :
                    prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }

    //function to unsubscribe from messages
    const unsubscribeFromMessages = () => {
        if(socket){
            socket.off("newMessage")
        }
    }
    
    useEffect(() => {
      subscribeToMessages();

    
      return () => {
        unsubscribeFromMessages();
      }
    }, [socket, selectedUsers])
    

    const value = {
        messages, users, selectedUsers, getUsers, setMessages, sendMessage, setSelectedUsers, unseenMessages, setUnseenMessages
    } 


    return (

        

        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}