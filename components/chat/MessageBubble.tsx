import { type Message } from '@/store/chatStore';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 size-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
          <Bot size={20} />
        </div>
      )}

      <div
        className={`p-3 rounded-lg max-w-lg relative ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-card text-card-foreground border border-border'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <p className={`text-xs mt-1.5 opacity-70 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 size-8 rounded-full bg-foreground text-background flex items-center justify-center">
          <User size={20} />
        </div>
      )}
    </div>
  );
}