import { createContext, use, type ReactNode, useEffect, useState } from 'react';
// eslint-disable-next-line import/no-duplicates
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

type WebSocketContextValue = Client | null;

export const WebSocketContext = createContext<WebSocketContextValue>(null);

interface WebSocketProviderProps {
  children: ReactNode;
}

/**
 * WebSocketProvider
 * - Khởi tạo kết nối SockJS + STOMP tới backend
 * - Cung cấp `Client` của `@stomp/stompjs` qua React context
 */
export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');

    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('WebSocket connected');
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
      },
    });

    // Lưu client để các component dùng subscribe/send
    setClient(stompClient);
    stompClient.activate();

    return () => {
      stompClient.deactivate();
      setClient(null);
    };
  }, []);

  return <WebSocketContext value={client}>{children}</WebSocketContext>;
}

export function useWebSocketClient() {
  return use(WebSocketContext);
}
