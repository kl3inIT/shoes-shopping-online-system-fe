/* eslint-disable react-refresh/only-export-components */
import { createContext, use, type ReactNode, useEffect, useState } from 'react';
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

  const WS_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8088';
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const socket = new SockJS(`${WS_BASE_URL}/ws`);

    const stompClient = new Client({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setClient(stompClient);
    stompClient.activate();

    return () => {
      void stompClient.deactivate();
      setClient(null);
    };
  }, []);

  return <WebSocketContext value={client}>{children}</WebSocketContext>;
}

export function useWebSocketClient() {
  return use(WebSocketContext);
}
