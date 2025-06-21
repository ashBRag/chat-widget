import React, { useState, useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import MessageList, { Message } from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

export interface ChatWidgetProps {
  apiKey: string;
  group: string;
  subGroup?: string;
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
  background: ${(props) => props.theme.background};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: height 0.2s;
`;

const Header = styled.div`
  background: ${(props) => props.theme.header};
  color: ${(props) => props.theme.headerText};
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
  background: ${(props) => (props.online ? props.theme.statusOnline : props.theme.statusOffline)};
  box-shadow: 0 0 2px #0002;
  vertical-align: middle;
`;

const BotIcon = styled.span`
  display: flex;
  align-items: center;
  margin-right: 8px;
  svg {
    width: 20px;
    height: 20px;
    fill: #2563eb;
  }
`;

const ChatWidget: React.FC<ChatWidgetProps> = ({
  apiKey,
  group,
  subGroup,
  position = 'bottom-right',
  baseUrl,
  onMessageSent,
  onError,
}) => {
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  const theme = useTheme();

  // Load chat history
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const params = new URLSearchParams({ group, ...(subGroup ? { subGroup } : {}) });
        const res = await fetch(`${baseUrl}/api/chat/history?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to load history');
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err: any) {
        onError?.(err);
      }
    };
    loadHistory();
    // eslint-disable-next-line
  }, [group, subGroup, baseUrl]);

  // WebSocket setup
  useEffect(() => {
    const wsUrl = `${baseUrl.replace(/^http/, 'ws')}/chat?apiKey=${apiKey}&group=${group}${subGroup ? `&subGroup=${subGroup}` : ''}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    ws.onopen = () => setIsOnline(true);
    ws.onclose = () => setIsOnline(false);
    ws.onerror = () => setIsOnline(false);
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        setMessages((prev) => [...prev, msg]);
      } catch {
        // fallback: treat as plain text
        setMessages((prev) => [...prev, { id: Date.now().toString(), text: event.data, sender: 'bot', timestamp: Date.now() }]);
      }
    };
    return () => ws.close();
    // eslint-disable-next-line
  }, [apiKey, group, subGroup, baseUrl]);

  // Send message (and file)
  const handleSend = async (text: string, file?: File | null) => {
    try {
      let sentMsg: Message | null = null;
      if (file) {
        const formData = new FormData();
        formData.append('group', group);
        if (subGroup) formData.append('subGroup', subGroup);
        formData.append('text', text);
        formData.append('file', file);
        const res = await fetch(`${baseUrl}/api/chat/message`, {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) throw new Error('Failed to send message');
        sentMsg = await res.json();
      } else {
        const res = await fetch(`${baseUrl}/api/chat/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ group, subGroup, text }),
        });
        if (!res.ok) throw new Error('Failed to send message');
        sentMsg = await res.json();
      }
      if (sentMsg) setMessages((prev) => [...prev, sentMsg]);
      onMessageSent?.(text);
      // Also send over WebSocket
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(sentMsg));
      }
    } catch (err: any) {
      onError?.(err);
    }
  };

  return (
    <WidgetContainer minimized={minimized} position={position} theme={theme}>
      <Header onClick={() => setMinimized((m) => !m)} theme={theme}>
        <span>
          <StatusDot online={isOnline} theme={theme} />
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
  );
};

export default ChatWidget; 