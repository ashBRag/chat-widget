import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

interface MessageListProps {
  messages: Message[];
}

const List = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f3f4f6;
  display: flex;
  flex-direction: column;
`;

const Bubble = styled.div<{ isUser: boolean }>`
  max-width: 70%;
  margin-bottom: 12px;
  align-self: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
  background: ${(props) => (props.isUser ? '#2563eb' : '#e5e7eb')};
  color: ${(props) => (props.isUser ? '#fff' : '#111')};
  border-radius: 18px;
  padding: 10px 16px;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`;

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <List ref={listRef}>
      {messages.map((msg) => (
        <Bubble key={msg.id} isUser={msg.sender === 'user'}>
          {msg.text}
        </Bubble>
      ))}
    </List>
  );
};

export default MessageList; 