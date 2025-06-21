import React, { useRef, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    background: string;
    header: string;
    headerText: string;
    bubbleUser: string;
    bubbleBot: string;
    bubbleUserText: string;
    bubbleBotText: string;
    inputBg: string;
    inputBorder: string;
    inputText: string;
    statusOnline: string;
    statusOffline: string;
  }
}

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
  background: ${(props) => props.theme.background};
  display: flex;
  flex-direction: column;
`;

const Bubble = styled.div<{ isUser: boolean }>`
  max-width: 70%;
  margin-bottom: 4px;
  align-self: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
  background: ${(props) => (props.isUser ? props.theme.bubbleUser : props.theme.bubbleBot)};
  color: ${(props) => (props.isUser ? props.theme.bubbleUserText : props.theme.bubbleBotText)};
  border-radius: 18px;
  padding: 10px 16px;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`;

const BotIcon = styled.span`
  display: flex;
  align-items: center;
  margin-right: 8px;
  margin-top: 0;
  img {
    width: 22px;
    height: 22px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 1px 4px #0001;
    object-fit: cover;
  }
`;

const UserIcon = styled.span`
  display: flex;
  align-items: center;
  margin-left: 8px;
  svg {
    width: 22px;
    height: 22px;
    fill: #2563eb;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 1px 4px #0001;
  }
`;

const MessageRow = styled.div<{ isUser: boolean }>`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  flex-direction: ${(props) => (props.isUser ? 'row' : 'row')};
  justify-content: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
`;

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <List ref={listRef} theme={theme}>
      {messages.map((msg) => (
        <MessageRow key={msg.id} isUser={msg.sender === 'user'}>
          {msg.sender === 'bot' && (
            <BotIcon>
              <img src={process.env.PUBLIC_URL + '/icons/robot.png'} alt="Bot" />
            </BotIcon>
          )}
          <Bubble isUser={msg.sender === 'user'} theme={theme}>
            {msg.text}
          </Bubble>
          {msg.sender === 'user' && (
            <UserIcon>
              <svg viewBox="0 0 32 32">
                <circle cx="16" cy="12" r="6" />
                <ellipse cx="16" cy="24" rx="8" ry="5" />
              </svg>
            </UserIcon>
          )}
        </MessageRow>
      ))}
    </List>
  );
};

export default MessageList; 