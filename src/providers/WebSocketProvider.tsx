import { Client } from '@stomp/stompjs';
import { createContext, use, type ReactNode, useEffect, useState } from 'react';
import SockJS from 'sockjs-client';

type WebSocketContextValue = Client | null;

export const WebSocketContext = createContext<WebSocketContextValue>(null);

interface WebSocketProviderProps {
  children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [client, setClient] = useState<Client | null>(null);
  const wsBaseUrl =
    import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8088';

  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(`${wsBaseUrl}/ws`),
      reconnectDelay: 5000,
      debug: (str) => console.log('[STOMP]', str),
      onConnect: () => {
        console.log('WS connected');
        setClient(stompClient);
      },
      onDisconnect: () => {
        console.log('WS disconnected');
        setClient(null);
      },
      onStompError: (frame) => {
        console.error('STOMP error', frame);
        setClient(null);
      },
      onWebSocketError: (event) => {
        console.error('WebSocket error', event);
      },
      onWebSocketClose: (event) => {
        console.error('WebSocket close', event);
      },
    });

    stompClient.activate();

    return () => {
      void stompClient.deactivate();
      setClient(null);
    };
  }, [wsBaseUrl]);

  return <WebSocketContext value={client}>{children}</WebSocketContext>;
}

export function useWebSocketClient() {
  return use(WebSocketContext);
}
