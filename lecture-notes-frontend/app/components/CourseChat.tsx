'use client';
import { useState, FormEvent, useRef, useEffect } from 'react';
import { apiFetch } from '../lib/apiClient';
import { ChatMessage, ChatCitation } from '../types/database';
import CitationChip from './CitationChip';

export default function CourseChat({ courseId }: { courseId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const question = input.trim();
    if (!question || sending) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: question,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setSending(true);

    try {
      const result = await apiFetch<{ answer: string; citations: ChatCitation[] }>(
        `/api/chat/course/${courseId}`,
        {
          method: 'POST',
          body: JSON.stringify({ question }),
        }
      );

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.answer,
        citations: result.citations,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "Sorry, I couldn't process that question. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl flex flex-col h-[600px]">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="font-semibold text-text-primary">Ask about this course</h2>
        <p className="text-text-muted text-sm">Answers are sourced across all your uploaded lectures.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-center px-8">
            <p className="text-text-muted text-sm">
              Ask something like "What did the teacher say about normalization&?" — it'll search every lecture in this course.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
              <div
                className={`rounded-2xl px-4 py-2.5 text-sm ${
                  msg.role === 'user'
                    ? 'bg-accent text-white'
                    : 'bg-surface-alt text-text-primary border border-border'
                }`}
              >
                {msg.content}
              </div>
              {msg.citations && msg.citations.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {msg.citations.map((c, i) => (
                    <CitationChip key={i} citation={c} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="bg-surface-alt border border-border rounded-2xl px-4 py-2.5 text-sm text-text-muted">
              Thinking...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-4 border-t border-border flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about this course..."
          className="flex-1 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="bg-accent hover:bg-accent-hover text-white rounded-xl px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
        >
          Ask
        </button>
      </form>
    </div>
  );
}