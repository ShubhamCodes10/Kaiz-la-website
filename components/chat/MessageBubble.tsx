import { type Message } from '@/store/chatStore';
import { Bot, User, Calendar } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

function CalendlyButton({ payload }: { payload: any }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-card-foreground/90 leading-relaxed">{payload.text}</p>
      <a
        href={payload.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-3 px-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-150 text-sm"
      >
        <Calendar className="w-4 h-4" />
        Schedule Your Call
      </a>
    </div>
  );
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  let content;
  let isCalendlyLink = false;

  if (message.role === 'assistant') {
    try {
      const parsedContent = JSON.parse(message.content);
      if (parsedContent.type === 'calendly-link') {
        isCalendlyLink = true;
        content = <CalendlyButton payload={parsedContent} />;
      } else {
        content = <p className="text-sm text-card-foreground leading-relaxed whitespace-pre-wrap">{message.content}</p>;
      }
    } catch (error) {
      content = <p className="text-sm text-card-foreground leading-relaxed whitespace-pre-wrap">{message.content}</p>;
    }
  } else {
    content = <p className="text-sm text-primary-foreground leading-relaxed whitespace-pre-wrap">{message.content}</p>;
  }

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 size-10 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center shadow-md">
          <Bot size={18} />
        </div>
      )}

      <div
        className={`group relative max-w-2xl ${
          isUser
            ? 'bg-primary text-primary-foreground shadow-sm hover:shadow-md'
            : 'bg-card text-card-foreground shadow-sm hover:shadow-md'
        } rounded-2xl p-4 transition-shadow duration-150`}
      >
        {content}

        <div className={`text-xs mt-3 opacity-60 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>

        {/* Floating tail effect */}
        <div
          className={`absolute top-4 w-3 h-3 rotate-45 ${
            isUser
              ? 'bg-primary -right-1.5'
              : 'bg-card -left-1.5'
          } shadow-md`}
        />
      </div>

      {isUser && (
        <div className="flex-shrink-0 size-10 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center shadow-md">
          <User size={18} />
        </div>
      )}
    </div>
  );
}