import React from 'react'

const MessageItem = ({message}) => {

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

  return (
    <div
        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mt-2`}
        >
        <div className={`
            max-w-xs md:max-w-md lg:max-w-xl p-3 rounded-lg shadow
            ${message.role === 'user' 
            ? 'bg-blue-500 text-white rounded-br-none' 
            : 'bg-white text-gray-800 rounded-bl-none'}
        `}>
            <p className="text-sm">{message.content}</p>
            <p className="text-xs text-right mt-1 opacity-70">
            {formatDate(message.createdAt)}
            </p>
        </div>
    </div>
  )
}

export default MessageItem