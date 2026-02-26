'use client';

import { useChat } from '@/hooks/use-chat';
import { Chat } from '@/components/ui/chat';

export function ChatWithSuggestions() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    isLoading,
    stop,
    setMessages,
  } = useChat();

  return (
    <Chat
      messages={messages}
      input={input}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      isGenerating={isLoading}
      stop={stop}
      append={append}
      setMessages={setMessages}
      suggestions={[
        'Bạn có giày thể thao nào phù hợp cho chạy bộ không?',
        'Giày của bạn có size 42 không?',
        'Tôi muốn tìm giày da nam, bạn có gợi ý gì không?',
        'Chính sách đổi trả của cửa hàng như thế nào?',
        'Bạn có giày nữ màu đen không?',
      ]}
      className='h-full'
    />
  );
}
