import { createContext, use, type ReactNode, useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

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
      onConnect: () => {
        setClient(stompClient);
        console.log('WebSocket connected');
      },
      onDisconnect: () => {
        setClient(null);
        console.log('WebSocket disconnected');
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
