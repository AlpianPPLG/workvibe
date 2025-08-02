'use client';

import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, CheckCheck } from 'lucide-react';
import { MessageBubbleProps } from './types';

export function MessageBubble({
  message,
  showAvatar = true,
  showTime = true,
}: MessageBubbleProps) {
  const { content, isMine, timestamp, isRead } = message;

  return (
    <div
      className={cn(
        'flex gap-2 max-w-[80%]',
        isMine ? 'ml-auto' : 'mr-auto',
        isMine ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {showAvatar && !isMine && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src="/avatars/placeholder.jpg" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
      
      <div className="flex flex-col">
        <div
          className={cn(
            'rounded-2xl px-4 py-2',
            isMine
              ? 'bg-primary text-primary-foreground rounded-tr-none'
              : 'bg-muted rounded-tl-none',
            !showAvatar && (isMine ? 'rounded-tr-none' : 'rounded-tl-none')
          )}
        >
          <p className="text-sm">{content}</p>
        </div>
        
        {showTime && (
          <div className={cn(
            'flex items-center gap-1 text-xs mt-1',
            isMine ? 'justify-end' : 'justify-start',
            isMine ? 'text-muted-foreground' : 'text-muted-foreground/70'
          )}>
            <span>{format(timestamp, 'h:mm a')}</span>
            {isMine && (
              <span className="ml-1">
                {isRead ? (
                  <CheckCheck className="h-3 w-3 text-blue-500" />
                ) : (
                  <Check className="h-3 w-3" />
                )}
              </span>
            )}
          </div>
        )}
      </div>
      
      {showAvatar && isMine && (
        <div className="w-8"></div>
      )}
    </div>
  );
}
