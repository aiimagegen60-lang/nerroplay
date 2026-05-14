
import React from 'react';
import { ChatMessage } from '../../types/chat.types';
import { NerroAvatarAnim } from './NerroAvatarAnim';
import { User, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const MessageBubble = ({ message }: { message: ChatMessage }) => {
  const isNerro = message.role === 'nerro';
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex w-full mb-6 ${isNerro ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isNerro ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`mt-1 ${isNerro ? 'mr-3' : 'ml-3'}`}>
          {isNerro ? (
            <NerroAvatarAnim size="small" isThinking={message.isStreaming} />
          ) : (
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-black">
              <User size={18} />
            </div>
          )}
        </div>

        <div className={`relative group p-4 rounded-2xl ${
          isNerro 
            ? 'bg-surface border border-border-glass rounded-bl-none border-l-4 border-l-primary/60' 
            : 'bg-primary/10 border border-primary/20 rounded-br-none text-text-primary'
        }`}>
          <div className="prose prose-invert prose-sm max-w-none">
            {message.imageUrl && (
              <div className="mb-4 rounded-xl overflow-hidden border border-border-glass">
                <img src={message.imageUrl} alt="Attached" className="max-w-full h-auto" />
              </div>
            )}
            <div className="markdown-body">
                <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
            {message.isStreaming && (
              <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse vertical-middle" />
            )}
          </div>

          {!message.isStreaming && message.content && (
            <button 
              onClick={handleCopy}
              className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-surface/50 border border-border-glass opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface"
            >
              {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-text-muted" />}
            </button>
          )}

          <div className={`text-[10px] uppercase tracking-widest font-mono mt-2 opacity-30 ${isNerro ? 'text-left' : 'text-right'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};
