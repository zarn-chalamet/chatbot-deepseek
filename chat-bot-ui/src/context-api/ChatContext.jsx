import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const ChatContext = createContext();


export const ChatContextProvider = ({children}) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [chatList, setChatList] = useState([]);
    const [chatById, setChatById] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentUser,setCurrentUser] = useState(null);
    const [createdChatId,setCreatedChatId] = useState(null);

    const token = localStorage.getItem('token') || null;
    
    const getChatList = async () => {
        try {
            const {data} = await axios.get(backendUrl+"/api/v1/chat",{
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: "Bearer "+token,
                }
            });
            setChatList(data);
        } catch (error) {
            console.log(error);
        }
    }

    const getChatById = async (id) => {
        try {
            const {data} = await axios.get(backendUrl+"/api/v1/chat/"+id,{
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: "Bearer "+token,
                }
            });
            setChatById(data);
        } catch (error) {
            console.log(error);
        }
    }

    const sendMessageToAi = async (id,message) => {
        try {

            // Optimistically add your message to the chat
            const tempMessage = {
                id: Date.now(), // temporary id
                content: message,
                createdAt: new Date().toISOString(),
                role: "user",
                chatId: id
            };
        
            setChatById(prev => ({
                ...prev,
                chatMessages: [...(prev?.chatMessages || []), tempMessage]
            }));


            setIsGenerating(true);

            await axios.post(backendUrl+"/api/v1/chat/"+id,
                {
                    message
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: "Bearer "+token,
                    }
                });

            await getChatById(id);
          } catch (error) {
            console.log(error);
          } finally {
            setIsGenerating(false); // hide loading
          }
    }

    const createChat = async () => {
        try {
            const {data} = await axios.post(backendUrl+"/api/v1/chat",{},
                {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: "Bearer "+token,
                }
            });
            console.log(data);
            setCreatedChatId(data.id);
            await getChatList();
        } catch (error) {
            console.log(error);
        }
    }

    const deleteChatById = async (id) => {
        try {
            const response = await axios.delete(backendUrl+"/api/v1/chat/"+id,{
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: "Bearer "+token,
                }
            });
            console.log(response);
            await getChatList();
        } catch (error) {
            console.log(error);
        }
    }

    const updateChatTitle = async (id,newTitle) => {
        try {
            const response = await axios.put(backendUrl+"/api/v1/chat/"+id,
                {
                    newTitle
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: "Bearer "+token,
                    }
                });
            console.log(response);
            await getChatList();
        } catch (error) {
            console.log(error);
        }
    }

    const getCurrentUserData =  async () => {
        try {
            const {data} = await axios.get(backendUrl+"/api/v1/user/profile",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: "Bearer "+token,
                    }
                });
            setCurrentUser(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{

    },[])

    const value = {
        backendUrl,
        chatList,getChatList,
        chatById,getChatById,
        sendMessageToAi,
        isGenerating,
        createdChatId, createChat,
        deleteChatById,
        updateChatTitle,
        currentUser,getCurrentUserData
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}