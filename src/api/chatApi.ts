export interface ChatApiMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
  fileUrl?: string;
}

export async function getChatHistory(baseUrl: string, group: string, subGroup?: string): Promise<ChatApiMessage[]> {
  const params = new URLSearchParams({ group, ...(subGroup ? { subGroup } : {}) });
  const res = await fetch(`${baseUrl}/api/v1/chat/history?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to load history');
  const data = await res.json();
  return data.messages || [];
}

export async function sendChatMessage(
  baseUrl: string,
  group: string,
  subGroup: string | undefined,
  text: string,
  file?: File | null
): Promise<ChatApiMessage> {
  let res;
  if (file) {
    const formData = new FormData();
    formData.append('group', group);
    if (subGroup) formData.append('subGroup', subGroup);
    formData.append('text', text);
    formData.append('file', file);
    res = await fetch(`${baseUrl}/api/chat/message`, {
      method: 'POST',
      body: formData,
    });
  } else {
    res = await fetch(`${baseUrl}/api/v1/chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ group, subGroup, text }),
    });
  }
  if (!res.ok) throw new Error('Failed to send message');
  return await res.json();
}

/**
 * Create a WebSocket connection for chat.
 * @param baseUrl - The base HTTP URL (will be converted to ws/wss)
 * @param apiKey - API key for authentication
 * @param group - Chat group
 * @param subGroup - Chat sub-group (optional)
 * @param handlers - Event handlers: onOpen, onClose, onError, onMessage
 * @returns The WebSocket instance
 */
export function createChatWebSocket({
  baseUrl,
  apiKey,
  group,
  subGroup,
  onOpen,
  onClose,
  onError,
  onMessage,
}: {
  baseUrl: string;
  apiKey: string;
  group: string;
  subGroup?: string;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (ev: Event) => void;
  onMessage?: (data: any, raw: MessageEvent) => void;
}): WebSocket {
  const wsUrl = `${baseUrl.replace(/^http/, 'ws')}/ai-support?apiKey=${apiKey}&group=${group}${subGroup ? `&subGroup=${subGroup}` : ''}`;
  const ws = new WebSocket(wsUrl);
  if (onOpen) ws.onopen = onOpen;
  if (onClose) ws.onclose = onClose;
  if (onError) ws.onerror = onError;
  if (onMessage) {
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        onMessage(msg, event);
      } catch {
        onMessage(event.data, event);
      }
    };
  }
  return ws;
}

/**
 * Create a Socket.IO connection for chat.
 * @param baseUrl - The base HTTP URL
 * @param apiKey - API key for authentication
 * @param group - Chat group
 * @param subGroup - Chat sub-group (optional)
 * @param handlers - Event handlers: onConnect, onDisconnect, onMessage
 * @returns The Socket.IO client instance
 */
export function createChatSocketIO({
  baseUrl,
  apiKey,
  group,
  subGroup,
  onConnect,
  onDisconnect,
  onMessage,
}: {
  baseUrl: string;
  apiKey: string;
  group: string;
  subGroup?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onMessage?: (data: any) => void;
}) {
  // Dynamically import socket.io-client to avoid SSR issues
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { io } = require('socket.io-client');
  console.log(baseUrl)
  const socket = io(baseUrl, {
    query: {
      apiKey,
      group,
      ...(subGroup ? { subGroup } : {}),
    },
    transports: ['websocket'],
    withCredentials: true,
  });
  if (onConnect) socket.on('connect', onConnect);
  if (onDisconnect) socket.on('disconnect', onDisconnect);
  if (onMessage) socket.on('message', onMessage);
  return socket;
} 