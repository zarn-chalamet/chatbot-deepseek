import React from 'react'
import { useNavigate } from 'react-router-dom';

const ChatItem = ({chat}) => {
  const navigate = useNavigate();
  console.log(chat);
  return (
    <div className="flex-1 overflow-y-auto space-y-2 text-sm" onClick={()=>navigate("/chat/"+chat.id)}>
        <div className="bg-gray-800 hover:bg-gray-700 p-2 rounded-md cursor-pointer text-white">
            {chat.title}
        </div>
    </div>
  )
}

export default ChatItem