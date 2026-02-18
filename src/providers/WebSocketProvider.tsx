import {
  createContext,
  useContext,
  type ReactNode,
  useEffect,
  useState,
} from 'react';
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
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
      onConnect: () => {
        // eslint-disable-next-line no-console
        console.log('WebSocket connected');
      },
      onDisconnect: () => {
        // eslint-disable-next-line no-console
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

  return (
    <WebSocketContext.Provider value={client}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketClient() {
  return useContext(WebSocketContext);
}
