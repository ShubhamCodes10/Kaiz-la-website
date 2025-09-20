import { type Message } from '@/store/chatStore';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

function CalendlyButton({ payload }: { payload: any }) {
  return (
    <>
      <p className="text-sm mb-3">{payload.text}</p>
      <a
        href={payload.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-sm text-center"
      >
        Schedule Your Call
      </a>
    </>
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
        content = <p className="text-sm whitespace-pre-wrap">{message.content}</p>;
      }
    } catch (error) {
      content = <p className="text-sm whitespace-pre-wrap">{message.content}</p>;
    }
  } else {
    content = <p className="text-sm whitespace-pre-wrap">{message.content}</p>;
  }

  return (
    <div className={`flex items-start gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
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
        {content}

        <p className={`text-xs mt-1.5 opacity-70 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {isUser && (
        <div className="flex-shrink-0 size-8 rounded-full bg-foreground text-background flex items-center justify-center">
          <User size={20} />
        </div>
      )}
    </div>
  );
}