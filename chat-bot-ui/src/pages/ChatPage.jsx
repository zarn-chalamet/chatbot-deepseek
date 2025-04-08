import React, { useContext, useEffect, useRef, } from 'react'
import ChatInput from '../components/ChatInput'
import { useParams } from 'react-router-dom';
import { ChatContext } from '../context-api/ChatContext';
import MessageItem from '../components/MessageItem';

const ChatPage = () => {

    const {id} = useParams();
    const {chatById,getChatById,isGenerating} = useContext(ChatContext);

    const bottomRef = useRef(null);

    useEffect(()=>{
        getChatById(id);
    },[id])

    useEffect(() => {
        // Scroll to the bottom when messages change or AI is generating
        if (bottomRef.current) {
          bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatById?.chatMessages, isGenerating]);
    
  return (
    <div className={`flex flex-col justify-between ${ chatById && chatById.chatMessages && !chatById.chatMessages.length > 0 && `mt-32`}`}>
        <div className={`flex-1 p-4 overflow-y-auto max-h-[500px] bg-gray-50`}>
            {
                chatById && chatById.chatMessages &&chatById.chatMessages.length > 0 ?
                <div>
                    {
                        chatById.chatMessages.map((message,index) => (
                            <MessageItem key={index} message={message}/>
                        ))
                    }
                    <div ref={bottomRef} />
                    {isGenerating && (
                        <p className="italic text-gray-500 animate-pulse">AI is generating a response...</p>
                    )}
                </div>
                :
                <h2 className='text-center'>How can I help you</h2>
            }
        </div>

        <div>
            <ChatInput chatId={id}/>
        </div>
    </div>
  )
}

export default ChatPage