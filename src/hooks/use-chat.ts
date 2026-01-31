import { useState, useCallback } from 'react';
import { type Message } from '@/components/ui/chat-message';
import apiClient from '@/features/apiClient';

interface ChatRequest {
  question: string;
  provider?: 'chatgpt' | 'gemini';
}

interface ChatResponse {
  provider: string;
  answer: string;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    []
  );

  const append = useCallback((message: { role: 'user'; content: string }) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message.content,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
  }, []);

  const handleSubmit = useCallback(
    async (
      event?: { preventDefault?: () => void },
      _options?: { experimental_attachments?: FileList }
    ) => {
      event?.preventDefault?.();

      if (!input.trim() || isLoading) return;

      const question = input.trim();
      setInput('');
      setError(null);

      // Thêm user message vào UI ngay lập tức
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: question,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await apiClient.post<ChatResponse>(
          '/chat',
          {
            question,
            provider: 'chatgpt',
          } as ChatRequest,
          {
            skipAuth: true, // Chat endpoint là public
          }
        );

        // Thêm assistant message
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response.data.answer,
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        setError('Không thể kết nối tới chatbot. Vui lòng thử lại.');
        console.error('Chat error:', err);

        // Thêm error message
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading]
  );

  const stop = useCallback(() => {
    setIsLoading(false);
  }, []);

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    isLoading,
    error,
    stop,
    setMessages,
  };
}
