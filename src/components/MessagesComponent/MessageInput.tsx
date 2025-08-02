'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Paperclip, Smile, SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { MessageInputProps } from './types';

export function MessageInput({ onSend, placeholder = 'Type a message...', className }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      onSend(trimmedMessage);
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setMessage(target.value);
    
    // Auto-resize textarea
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 150)}px`;
  };

  return (
    <div className={cn('flex items-end gap-2 p-2 border-t bg-background', className)}>
      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
        <Paperclip className="h-4 w-4" />
        <span className="sr-only">Attach file</span>
      </Button>
      
      <div className="relative flex-1">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-[40px] max-h-[150px] resize-none pr-12"
          rows={1}
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 bottom-1.5 h-8 w-8 rounded-full"
        >
          <Smile className="h-4 w-4" />
          <span className="sr-only">Add emoji</span>
        </Button>
      </div>
      
      <Button 
        onClick={handleSend} 
        disabled={!message.trim()} 
        size="icon"
        className="h-10 w-10 rounded-full"
      >
        <SendHorizonal className="h-4 w-4" />
        <span className="sr-only">Send message</span>
      </Button>
    </div>
  );
}
