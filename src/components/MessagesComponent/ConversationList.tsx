'use client';

import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ConversationListProps } from './types';

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  className,
}: ConversationListProps) {
  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatLastMessageTime = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return format(messageDate, 'h:mm a');
    } else if (messageDate > new Date(today.setDate(today.getDate() - 7))) {
      return format(messageDate, 'EEE');
    } else {
      return format(messageDate, 'MM/dd/yyyy');
    }
  };

  return (
    <div className={cn('flex flex-col h-full overflow-y-auto', className)}>
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Messages</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => {
          const otherParticipant = conversation.participants[0]; // Assuming 1:1 chat for now
          const isActive = conversation.id === selectedConversationId;
          
          return (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={cn(
                'flex items-center p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors',
                isActive && 'bg-muted/30',
                conversation.unreadCount > 0 && 'bg-blue-50 dark:bg-blue-900/20'
              )}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={otherParticipant.avatar} alt={otherParticipant.name} />
                  <AvatarFallback>{getInitials(otherParticipant.name)}</AvatarFallback>
                </Avatar>
                <span
                  className={cn(
                    'absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-background',
                    otherParticipant.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                  )}
                />
              </div>
              
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium truncate">{otherParticipant.name}</h3>
                  <span className="text-xs text-muted-foreground">
                    {formatLastMessageTime(conversation.lastMessage.timestamp)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                    {conversation.lastMessage.senderId === 'me' 
                      ? `You: ${conversation.lastMessage.content}` 
                      : conversation.lastMessage.content}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs">
                      {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
