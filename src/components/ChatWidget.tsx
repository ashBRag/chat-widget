import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { Message } from './MessageList';

export interface ChatWidgetProps {
  apiKey: string;
  group: string;
  subGroup?: string;
  theme?: object;
  position?: 'bottom-right' | 'bottom-left';
  baseUrl: string;
  onMessageSent?: (message: string) => void;
  onError?: (error: Error) => void;
}

const WidgetContainer = styled.div<{ minimized: boolean; position: string }>`
  position: fixed;
  ${(props) =>
    props.position === 'bottom-right'
      ? 'right: 24px;'
      : 'left: 24px;'}
  bottom: 24px;
  z-index: 1000;
  width: 350px;
  max-width: 95vw;
  height: ${(props) => (props.minimized ? '56px' : '500px')};
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
  border-radius: 16px;
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: height 0.2s;
`;

const Header = styled.div`
  background: #2563eb;
  color: #fff;
  padding: 12px 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const StatusDot = styled.span<{ online: boolean }>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
  background: ${props => (props.online ? '#22c55e' : '#ef4444')};
  box-shadow: 0 0 2px #0002;
  vertical-align: middle;
`;

const ChatWidget: React.FC<ChatWidgetProps> = ({
  apiKey,
  group,
  subGroup,
  theme = {},
  position = 'bottom-right',
  baseUrl,
  onMessageSent,
  onError,
}) => {
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! How can I help you?', sender: 'bot', timestamp: Date.now() },
    { id: '2', text: 'Hi! I have a question.', sender: 'user', timestamp: Date.now() },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const handleSend = (text: string) => {
    const newMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: Date.now(),
    };
    setMessages((msgs) => [...msgs, newMsg]);
    onMessageSent?.(text);
    // Simulate bot typing
    setIsTyping(true);
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { id: (Date.now() + 1).toString(), text: 'This is a bot reply!', sender: 'bot', timestamp: Date.now() },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <ThemeProvider theme={theme}>
      <WidgetContainer minimized={minimized} position={position}>
        <Header onClick={() => setMinimized((m) => !m)}>
          <span>
            <StatusDot online={isOnline} />
            <span style={{ fontSize: 14 }}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </span>
          <span>{minimized ? '▲' : '▼'}</span>
        </Header>
        {!minimized && (
          <>
            <MessageList messages={messages} />
            <TypingIndicator isTyping={isTyping} />
            <MessageInput onSend={handleSend} disabled={isTyping} />
          </>
        )}
      </WidgetContainer>
    </ThemeProvider>
  );
};

export default ChatWidget; 