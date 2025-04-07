import React, { useState } from 'react'
import ChatInput from '../components/ChatInput'

const ChatPage = () => {

    const [messages, setMessages] = useState([]);
    
  return (
    <div className={`flex flex-col justify-between ${!messages.length > 0 && `mt-32`}`}>
        <div className={`p-4 bg-gray-50 `}>
            {
                messages.length > 0 ?
                <div>
                    Here is the message list
                </div>
                :
                <h2 className='text-center'>How can I help you</h2>
            }
        </div>

        <div>
            <ChatInput/>
        </div>
    </div>
  )
}

export default ChatPage