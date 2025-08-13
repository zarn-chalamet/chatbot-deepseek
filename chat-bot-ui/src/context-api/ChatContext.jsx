import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();


export const ChatContextProvider = ({children}) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [chatList, setChatList] = useState([]);
    const [chatById, setChatById] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentUser,setCurrentUser] = useState(null);
    const [createdChatId,setCreatedChatId] = useState(null);

    const {accessToken, authReady} = useContext(AuthContext);

    
    const getChatList = async () => {
        if (!accessToken) return; 
        try {
            const {data} = await axios.get(backendUrl+"/api/v1/chat",{
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: "Bearer "+accessToken,
                }
            });
            setChatList(data);
        } catch (error) {
            console.log(error);
        }
    }

    const getChatById = async (id) => {
        if (!accessToken) return; 
        try {
            const {data} = await axios.get(backendUrl+"/api/v1/chat/"+id,{
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: "Bearer "+accessToken,
                }
            });
            setChatById(data);
        } catch (error) {
            console.log(error);
        }
    }

    const sendMessageToAi = async (id,message) => {
        try {
            if (!accessToken) return; 
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
                        Authorization: "Bearer "+accessToken,
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
        if (!accessToken) return; 
        try {
            const {data} = await axios.post(backendUrl+"/api/v1/chat",{},
                {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: "Bearer "+accessToken,
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
        if (!accessToken) return; 
        try {
            const response = await axios.delete(backendUrl+"/api/v1/chat/"+id,{
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: "Bearer "+accessToken,
                }
            });
            console.log(response);
            await getChatList();
        } catch (error) {
            console.log(error);
        }
    }

    const updateChatTitle = async (id,newTitle) => {
        if (!accessToken) return; 
        try {
            const response = await axios.put(backendUrl+"/api/v1/chat/"+id,
                {
                    newTitle
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: "Bearer "+accessToken,
                    }
                });
            console.log(response);
            await getChatList();
        } catch (error) {
            console.log(error);
        }
    }

    const getCurrentUserData =  async () => {
        if (!accessToken) return; 
        try {
            const {data} = await axios.get(backendUrl+"/api/v1/user/profile",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: "Bearer "+accessToken,
                    }
                });
            setCurrentUser(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (!authReady || !accessToken) return;

        getChatList();
        getCurrentUserData();
    }, [authReady, accessToken]);

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