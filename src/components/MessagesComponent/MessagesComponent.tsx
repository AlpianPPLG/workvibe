'use client';

import { useState, useCallback, useMemo } from 'react';
import { Message, Conversation } from './types';
import { ConversationList } from './ConversationList';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, Plus, MoreVertical, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

// Mock data - in a real app, this would come from an API
const mockConversations: Conversation[] = [
  {
    id: '1',
    participants: [
      {
        id: '2',
        name: 'Sarah Johnson',
        avatar: '/avatars/sarah.jpg',
        status: 'online',
      },
    ],
    lastMessage: {
      content: 'Hey, how are you doing?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      senderId: '2',
      isRead: false,
    },
    unreadCount: 2,
  },
  {
    id: '2',
    participants: [
      {
        id: '3',
        name: 'Alex Chen',
        avatar: '/avatars/alex.jpg',
        status: 'away',
      },
    ],
    lastMessage: {
      content: 'The meeting is scheduled for tomorrow at 2 PM',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      senderId: '3',
      isRead: true,
    },
    unreadCount: 0,
  },
  {
    id: '3',
    participants: [
      {
        id: '4',
        name: 'Team Standup',
        avatar: '',
        status: 'offline',
      },
    ],
    lastMessage: {
      content: 'Maria: I\'ll be a few minutes late',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      senderId: '4',
      isRead: true,
    },
    unreadCount: 0,
  },
];

// Mock messages for the selected conversation
const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '101',
      sender: {
        id: '2',
        name: 'Sarah Johnson',
        avatar: '/avatars/sarah.jpg',
        status: 'online',
      },
      content: 'Hey there!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      isRead: true,
      isMine: false,
    },
    {
      id: '102',
      sender: {
        id: '1',
        name: 'You',
        avatar: '/avatars/me.jpg',
        status: 'online',
      },
      content: 'Hi Sarah! How are you doing?',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      isRead: true,
      isMine: true,
    },
    {
      id: '103',
      sender: {
        id: '2',
        name: 'Sarah Johnson',
        avatar: '/avatars/sarah.jpg',
        status: 'online',
      },
      content: 'I\'m doing great, thanks for asking! How about you?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isRead: true,
      isMine: false,
    },
    {
      id: '104',
      sender: {
        id: '2',
        name: 'Sarah Johnson',
        avatar: '/avatars/sarah.jpg',
        status: 'online',
      },
      content: 'Did you get a chance to look at the project proposal?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      isRead: false,
      isMine: false,
    },
  ],
};

export function MessagesComponent() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // In a real app, this would be fetched from your auth context
  const currentUser = {
    id: '1',
    name: 'You',
    avatar: '/avatars/me.jpg',
    status: 'online' as const,
  };

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return mockConversations;
    
    const query = searchQuery.toLowerCase();
    return mockConversations.filter(conv => 
      conv.participants.some(p => 
        p.name.toLowerCase().includes(query) ||
        conv.lastMessage.content.toLowerCase().includes(query)
      )
    );
  }, [searchQuery]);

  const selectedConversation = useMemo(() => {
    if (!selectedConversationId) return null;
    return mockConversations.find(conv => conv.id === selectedConversationId) || null;
  }, [selectedConversationId]);

  const currentMessages = useMemo(() => {
    if (!selectedConversationId) return [];
    return mockMessages[selectedConversationId] || [];
  }, [selectedConversationId]);

  const handleSendMessage = useCallback((content: string) => {
    if (!selectedConversationId) return;
    
    // In a real app, this would send the message to your backend
    console.log('Sending message:', content);
    
    // Update the last message in the conversation
    const updatedConversation = mockConversations.find(c => c.id === selectedConversationId);
    if (updatedConversation) {
      updatedConversation.lastMessage = {
        content,
        timestamp: new Date(),
        senderId: currentUser.id,
        isRead: false,
      };
    }
  }, [currentUser.id, selectedConversationId]);

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    // Mark messages as read when conversation is selected
    const conversation = mockConversations.find(c => c.id === id);
    if (conversation) {
      conversation.unreadCount = 0;
    }
    // Close mobile menu on mobile
    setIsMobileMenuOpen(false);
  };

  // Auto-select first conversation if none is selected
  if (!selectedConversationId && filteredConversations.length > 0) {
    setSelectedConversationId(filteredConversations[0].id);
  }

  return (
    <div className="flex h-[calc(100vh-64)] bg-background rounded-lg border overflow-hidden">
      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-20"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-4 w-4" />
      </Button>
      
      {/* Sidebar */}
      <div 
        className={cn(
          'w-full md:w-80 border-r bg-background flex flex-col transition-all duration-300 ease-in-out',
          isMobileMenuOpen ? 'block absolute left-0 top-0 h-full z-10' : 'hidden md:flex',
        )}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Messages</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search conversations..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <ConversationList
          conversations={filteredConversations}
          selectedConversationId={selectedConversationId || undefined}
          onSelectConversation={handleSelectConversation}
          className="flex-1 overflow-y-auto"
        />
      </div>
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full">
        {selectedConversation ? (
          <>
            {/* Chat header */}
            <div className="border-b p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={selectedConversation.participants[0].avatar} 
                      alt={selectedConversation.participants[0].name} 
                    />
                    <AvatarFallback>
                      {selectedConversation.participants[0].name
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={cn(
                      'absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-background',
                      selectedConversation.participants[0].status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    )}
                  />
                </div>
                <div>
                  <h3 className="font-medium">
                    {selectedConversation.participants[0].name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedConversation.participants[0].status === 'online' 
                      ? 'Online' 
                      : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Messages */}
            <MessageList 
              messages={currentMessages} 
              currentUserId={currentUser.id} 
              className="flex-1"
            />
            
            {/* Message input */}
            <MessageInput 
              onSend={handleSendMessage}
              placeholder="Type a message..."
              className="border-t"
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2 max-w-sm">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-medium">No conversation selected</h3>
              <p className="text-sm text-muted-foreground">
                Select a conversation or start a new one to begin messaging.
              </p>
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                New Message
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
