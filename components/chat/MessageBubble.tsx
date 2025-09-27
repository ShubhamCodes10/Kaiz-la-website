import { type Message } from '@/store/chatStore';
import { Bot, User, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageBubbleProps {
  message: Message;
}

function CalendlyButton({ payload }: { payload: any }) {
  const handleSuggestedReply = (text: string) => {
    document.dispatchEvent(new CustomEvent('set-chat-input', { detail: text }));
  };

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
      <div className="flex items-center gap-2 pt-2 border-t border-border/50">
        <span className="text-md text-muted-foreground">Finished scheduling? Click here:</span>
        <button onClick={() => handleSuggestedReply('Scheduled')} className="text-md font-semibold text-primary text-secondary cursor-pointer hover:underline">Scheduled</button>
      </div>
    </div>
  );
}

function getMarkdownComponents() {
  return {
    ul: ({ children }: any) => (
      <ul className="space-y-2 my-4 pl-0 list-none">
        {children}
      </ul>
    ),
    li: ({ children }: any) => (
      <li className="flex items-start gap-2 text-sm">
        <span className="text-primary mt-1.5 text-xs">•</span>
        <div className="flex-1 leading-relaxed">{children}</div>
      </li>
    ),
    p: ({ children }: any) => (
      <p className="text-sm leading-relaxed mb-3 last:mb-0">
        {children}
      </p>
    ),
    hr: () => (
      <hr className="my-3 border-border/20 border-dashed" />
    ),
    strong: ({ children }: any) => (
      <strong className="font-semibold text-card-foreground">
        {children}
      </strong>
    ),
    code: ({ children }: any) => (
      <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
        {children}
      </code>
    ),
    pre: ({ children }: any) => (
      <pre className="bg-muted p-3 rounded-lg overflow-x-auto text-xs">
        {children}
      </pre>
    )
  };
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  let content;

  if (message.role === 'assistant') {
    try {
      const parsedContent = JSON.parse(message.content);
      if (parsedContent.type === 'calendly-link') {
        content = <CalendlyButton payload={parsedContent} />;
      } else {
        content = <p className="text-sm text-card-foreground leading-relaxed whitespace-pre-wrap">{message.content}</p>;
      }
    } catch (error) {
      content = (
        <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-card-foreground prose-p:text-card-foreground prose-p:leading-relaxed prose-strong:text-card-foreground prose-li:text-card-foreground prose-ul:my-3 prose-li:my-1">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={getMarkdownComponents()}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      );
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
        } rounded-2xl p-5 transition-shadow duration-150`}
      >
        {content}
        <div className={`text-xs mt-4 opacity-60 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
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