'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatWithSuggestions } from '@/components/ChatWithSuggestions';
import { cn } from '@/lib/utils';

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 sm:hidden'
          onClick={() => setIsOpen(false)}
          aria-hidden='true'
        />
      )}

      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size='lg'
          className={cn(
            'fixed bottom-4 right-4 z-50 h-16 w-16 rounded-full shadow-2xl',
            'bg-gradient-to-br from-primary to-primary/80',
            'hover:from-primary/90 hover:to-primary/70',
            'hover:scale-110 active:scale-105',
            'transition-all duration-300 ease-out',
            'border-2 border-primary/20',
            'sm:bottom-6 sm:right-6',
            'animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4'
          )}
        >
          <MessageCircle className='h-7 w-7 drop-shadow-sm' />
          <span className='sr-only'>Mở chat</span>
          {/* Pulse animation */}
          <span className='absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75' />
        </Button>
      )}

      {/* Chat Panel */}
      <div
        className={cn(
          'fixed z-50 flex flex-col bg-card shadow-2xl transition-all duration-300 ease-out',
          'backdrop-blur-xl border',
          // Mobile: full screen
          'bottom-0 right-0 h-[calc(100vh-3rem)] w-full rounded-t-2xl border-t border-x',
          // Desktop: fixed size ở góc với rounded corners đẹp hơn
          'sm:bottom-6 sm:right-6 sm:h-[600px] sm:w-[420px] sm:max-w-[calc(100vw-3rem)] sm:rounded-2xl sm:border',
          isOpen
            ? 'translate-y-0 opacity-100 pointer-events-auto scale-100'
            : 'translate-y-4 opacity-0 pointer-events-none scale-95'
        )}
      >
        {/* Header với gradient đẹp hơn */}
        <div className='relative flex items-center justify-between border-b bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 sm:rounded-t-2xl'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-md'>
              <MessageCircle className='h-5 w-5 text-primary-foreground' />
            </div>
            <div>
              <h3 className='font-semibold text-foreground'>Trợ lý AI</h3>
              <p className='text-xs text-muted-foreground'>
                Luôn sẵn sàng hỗ trợ
              </p>
            </div>
          </div>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setIsOpen(false)}
            className='h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors'
          >
            <X className='h-4 w-4' />
            <span className='sr-only'>Đóng chat</span>
          </Button>
        </div>

        {/* Chat Content */}
        <div className='flex-1 overflow-hidden bg-background/50'>
          <ChatWithSuggestions />
        </div>
      </div>
    </>
  );
}
