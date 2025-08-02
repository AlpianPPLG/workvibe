'use client';

import { useEffect, useRef } from 'react';
import { Message, MessageListProps } from './types';
import { MessageBubble } from './MessageBubble';
import { cn } from '@/lib/utils';

export function MessageList({ messages, currentUserId, className }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Group messages by date
  const groupMessagesByDate = (msgs: Message[]) => {
    const groups: Record<string, Message[]> = {};
    
    msgs.forEach((msg) => {
      const date = new Date(msg.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    
    return Object.entries(groups);
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className={cn('flex-1 overflow-y-auto p-4 space-y-6', className)}>
      {messageGroups.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messageGroups.map(([date, dateMessages]) => (
          <div key={date} className="space-y-4">
            <div className="relative flex justify-center">
              <span className="px-3 py-1 text-xs text-muted-foreground bg-muted rounded-full">
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            
            {dateMessages.map((message, index) => {
              const isMine = message.sender.id === currentUserId;
              const prevMessage = dateMessages[index - 1];
              const nextMessage = dateMessages[index + 1];
              
              // Show avatar only if it's the first message in a group from the same sender
              const showAvatar = !prevMessage || 
                prevMessage.sender.id !== message.sender.id || 
                new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() > 5 * 60 * 1000; // 5 minutes
              
              // Show time only if it's the last message in a group or there's a significant time gap
              const showTime = !nextMessage || 
                nextMessage.sender.id !== message.sender.id || 
                new Date(nextMessage.timestamp).getTime() - new Date(message.timestamp).getTime() > 5 * 60 * 1000; // 5 minutes
              
              return (
                <div key={message.id} className={cn('flex', isMine ? 'justify-end' : 'justify-start')}>
                  <MessageBubble
                    message={{
                      content: message.content,
                      isMine,
                      timestamp: message.timestamp,
                      isRead: message.isRead,
                    }}
                    showAvatar={showAvatar && !isMine}
                    showTime={showTime}
                  />
                </div>
              );
            })}
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
