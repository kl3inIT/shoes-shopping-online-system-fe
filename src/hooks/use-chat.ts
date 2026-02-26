import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { type Message } from '@/components/ui/chat-message';
import { sendChat } from '@/features/ai/api';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    []
  );

  const sendMessage = useCallback(
    async (question: string) => {
      if (!question.trim() || isLoading) return;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: question,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const chatData = await sendChat(question, { skipAuth: true });

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: chatData.output,
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        setError(
          t(
            'ai.chat.error.cannotConnect',
            'Không thể kết nối tới chatbot. Vui lòng thử lại.'
          )
        );
        console.error('Chat error:', err);

        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: t(
            'ai.chat.error.generic',
            'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.'
          ),
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, t]
  );

  const append = useCallback(
    (message: { role: 'user'; content: string }) => {
      setInput('');
      void sendMessage(message.content);
    },
    [sendMessage]
  );

  const handleSubmit = useCallback(
    async (
      event?: { preventDefault?: () => void },
      _options?: { experimental_attachments?: FileList }
    ) => {
      event?.preventDefault?.();

      const question = input.trim();
      setInput('');
      if (!question) return;
      await sendMessage(question);
    },
    [input, sendMessage]
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
