export interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
    status: 'online' | 'offline' | 'away' | 'busy';
    lastSeen?: string;
  };
  content: string;
  timestamp: Date;
  isRead: boolean;
  isMine: boolean;
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar: string;
    status: 'online' | 'offline' | 'away' | 'busy';
  }[];
  lastMessage: {
    content: string;
    timestamp: Date;
    senderId: string;
    isRead: boolean;
  };
  unreadCount: number;
}

export interface MessageInputProps {
  onSend: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export interface MessageBubbleProps {
  message: {
    content: string;
    isMine: boolean;
    timestamp: Date;
    isRead: boolean;
  };
  showAvatar?: boolean;
  showTime?: boolean;
}

export interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (id: string) => void;
  className?: string;
}

export interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  className?: string;
}
