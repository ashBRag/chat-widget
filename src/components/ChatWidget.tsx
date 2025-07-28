import React, { useState, useEffect, useRef} from 'react';
import MessageList, { Message } from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { getChatHistory, sendChatMessage, createChatSocketIO } from '../api/chatApi';

export interface ChatWidgetProps {
  apiKey: string;
  group: string;
  subGroup?: string;
  position?: 'bottom-right' | 'bottom-left';
  historyBaseUrl: string;
  chatBaseUrl: string;
  onMessageSent?: (message: string) => void;
  onError?: (error: Error) => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  apiKey,
  group,
  subGroup,
  position = 'bottom-right',
  historyBaseUrl,
  chatBaseUrl,
  onMessageSent,
  onError,
}) => {
  const [minimized, setMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const socketRef = useRef<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load chat history
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getChatHistory(historyBaseUrl, group, subGroup);
        setMessages(data);
        setErrorMsg(null);
      } catch (err: any) {
        setErrorMsg('Failed to load chat history.');
        onError?.(err);
      }
    };
    loadHistory();
    // eslint-disable-next-line
  }, [group, subGroup, historyBaseUrl]);

  // Socket.IO setup
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    socketRef.current = createChatSocketIO({
      baseUrl: chatBaseUrl,
      apiKey,
      group,
      subGroup,
      onConnect: () => setIsOnline(true),
      onDisconnect: () => setIsOnline(false),
      onMessage: (msg) => {
        if(msg.sender === "bot"){
          setIsTyping(false)
          console.log("typing false")
        }
        if(msg.sender === "user"){
          setIsTyping(true)
          console.log("typing true")
        }
        
        setMessages((prev) => [...prev, msg]);
      },
    });
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
    // eslint-disable-next-line
  }, [apiKey, group, subGroup, chatBaseUrl]);

  // Send message (and file)
  const handleSend = () => {
    if (!inputText.trim() || !socketRef.current || !isOnline) return;

    const message = {
      id: `msg-${Date.now()}`,
      content: inputText.trim(),
      sender: 'user',
      roomId: `${group}-${subGroup || 'default'}`,
      timestamp: Date.now(),
      type: 'user-message',
    };

    // Send via Socket.IO
    socketRef.current.emit('send-message', message);

    // Optimistically update UI
    setMessages(prev => [...prev, {
      id: message.id,
      text: message.content,
      sender: 'user',
      timestamp: message.timestamp,
    }]);

    setInputText('');
    //onMessageSent?.();
  };
  return (
    <div
      className={`fixed ${position === 'bottom-right' ? 'right-6' : 'left-6'} bottom-6 z-[1000] w-[350px] max-w-[95vw] ${minimized ? 'h-14' : 'h-[500px]'} shadow-2xl rounded-2xl bg-white dark:bg-zinc-900 flex flex-col transition-all duration-200 overflow-hidden`}
    >
      <div
        className="bg-gray-100 dark:bg-zinc-800 text-black dark:text-white px-4 py-3 font-semibold flex items-center justify-between cursor-pointer select-none"
        onClick={() => setMinimized((m) => !m)}
      >
        <span className="flex items-center">
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full mr-2 shadow ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}
          />
          <span className="text-sm">{isOnline ? 'Online' : 'Offline'}</span>
        </span>
        <span>{minimized ? '▲' : '▼'}</span>
      </div>
      {!minimized && (
        <>
          {errorMsg && (
            <div className="text-red-500 bg-red-50 p-2 rounded-lg m-2 text-sm">
              {errorMsg}
            </div>
          )}
          <MessageList messages={messages} />
          <TypingIndicator isTyping={isTyping} />
          <MessageInput onSend={handleSend} disabled={isTyping} value={inputText} setValue={setInputText} />
        </>
      )}
    </div>
  );
};

export default ChatWidget; 