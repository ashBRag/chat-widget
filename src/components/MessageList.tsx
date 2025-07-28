import React, { useRef, useEffect } from 'react';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={listRef}
      className="flex-1 overflow-y-auto p-4 bg-white dark:bg-zinc-900 flex flex-col"
    >
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex items-center mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {msg.sender === 'bot' && (
            <span className="flex items-center mr-2">
              <img
                src={process.env.PUBLIC_URL + '/icons/robot.png'}
                alt="Bot"
                className="w-6 h-6 bg-white rounded-full shadow object-cover"
              />
            </span>
          )}
          <div
            className={`max-w-[70%] mb-1 rounded-2xl px-4 py-2 text-base shadow ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white self-end'
                : 'bg-gray-100 dark:bg-zinc-800 text-black dark:text-gray-100 self-start'
            }`}
          >
            {msg.text}
          </div>
          {msg.sender === 'user' && (
            <span className="flex items-center ml-2">
              <svg viewBox="0 0 32 32" className="w-6 h-6 fill-blue-600 bg-white rounded-full shadow">
                <circle cx="16" cy="12" r="6" />
                <ellipse cx="16" cy="24" rx="8" ry="5" />
              </svg>
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageList; 