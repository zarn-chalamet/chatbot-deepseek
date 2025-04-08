import React, { useContext, useState } from 'react'
import { FiSend } from "react-icons/fi";
import { ChatContext } from '../context-api/ChatContext';

const ChatInput = ({chatId}) => {

    const {sendMessageToAi} = useContext(ChatContext);
    const [message, setMessage] = useState("");

    const sendMessage = () => {
      if (message.trim()) {
        sendMessageToAi(chatId, message);
        setMessage(""); // Clear input
      }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
    };

  return (
    <div className="w-full border-t border-gray-200 px-4 py-3 bg-white flex items-end gap-3">
      <textarea
        rows={1}
        className="w-full resize-none border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={sendMessage}
        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition mb-1"
      >
        <FiSend size={20} />
      </button>
    </div>
  )
}

export default ChatInput