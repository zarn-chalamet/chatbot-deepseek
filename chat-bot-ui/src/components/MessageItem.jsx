import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiClipboard } from 'react-icons/fi'

const MessageItem = ({ message }) => {
//   const formatDate = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

const formatDate = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
  
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
  
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    });
  };
  

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
        console.log(error);
    }
  };

  const renderContent = () => {
    const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeRegex.exec(message.content)) !== null) {
      const [fullMatch, lang = 'javascript', code] = match;
      const startIndex = match.index;

      // Text before the code block
      if (startIndex > lastIndex) {
        parts.push(
          <p key={`text-${lastIndex}`} className="text-gray-800">
            {message.content.slice(lastIndex, startIndex)}
          </p>
        );
      }

      // Code block with copy button
      parts.push(
        <div key={`code-${startIndex}`} className="relative group">
          <button
            onClick={() => handleCopy(code.trim())}
            className="absolute top-2 right-2 z-10 bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 text-xs rounded transition-opacity"
          >
            <FiClipboard/>
          </button>
          <SyntaxHighlighter
            language={lang}
            style={oneDark}
            wrapLongLines
            customStyle={{ borderRadius: '0.5rem', paddingTop: '2.5rem', paddingBottom: '1rem' }}
            className="text-sm"
          >
            {code.trim()}
          </SyntaxHighlighter>
        </div>
      );

      lastIndex = match.index + fullMatch.length;
    }

    // Text after the last code block
    if (lastIndex < message.content.length) {
      parts.push(
        <p key={`text-${lastIndex}`} className="text-gray-800">
          {message.content.slice(lastIndex)}
        </p>
      );
    }

    return parts.length > 0 ? parts : <p className="text-gray-800">{message.content}</p>;
  };

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mt-2`}>
      <div
        className={`
          max-w-xs md:max-w-md lg:max-w-xl p-4 rounded-xl shadow
          ${message.role === 'user'
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-white text-gray-900 rounded-bl-none'}
        `}
      >
        <div className="space-y-3 text-sm">{renderContent()}</div>
        <p className="text-xs text-right mt-2 opacity-60">{formatDate(message.createdAt)}</p>
      </div>
    </div>
  );
};

export default MessageItem;
