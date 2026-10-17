import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Shield,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Terminal,
  User,
  Info,
} from 'lucide-react';
import { RiskFinding } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'sentinel';
  text: string;
  timestamp: string;
  groundedIn?: string[];
}

interface AiSecurityAnalystProps {
  initialPrompt?: string;
  focusedFinding?: RiskFinding | null;
}

export const AiSecurityAnalyst: React.FC<AiSecurityAnalystProps> = ({
  initialPrompt,
  focusedFinding,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      sender: 'sentinel',
      text: `Greetings, Alex. I am Sentinel, your AI Defensive Security Analyst. I am continuously monitoring your telemetry and incident containment progress. Your current posture score is 74/100 (Grade B, Moderate Risk), driven by 1 confirmed credential exposure in Naz.API. How can I assist your defense today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      groundedIn: ['Naz.API Telemetry', 'Incident Step 4 Pending', 'Score Model 74/100'],
    },
  ]);

  const [inputText, setInputText] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const promptSuggestions = [
    'Why am I at high risk?',
    'What should I secure first?',
    'Explain this security alert',
    'Draft an incident report summary',
  ];

  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isThinking) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsThinking(true);

    try {
      const res = await fetch('/api/ai/analyst', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'model', parts: m.text })),
        }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'sentinel',
        text: data.response || 'I analyzed your security telemetry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundedIn: data.groundedIn || ['Telemetry Evidence Engine'],
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('AI analyst query error:', err);
      const errorMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'sentinel',
        text: 'I encountered an issue querying the defensive analysis engine. Please try again in a moment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#162335]">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00f0a8]/10 border border-[#00f0a8]/30 text-[#00f0a8]">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold font-mono text-white">AI Security Analyst &quot;Sentinel&quot;</h1>
              <span className="rounded bg-[#00f0a8]/15 px-1.5 py-0.2 text-[10px] font-mono font-bold text-[#00f0a8]">
                GEMINI-3.8-FLASH GROUNDED
              </span>
            </div>
            <p className="text-xs text-[#94a3b8]">
              Empirically grounded defensive advisor. Never hallucinates CVEs or requests plaintext passwords.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-[#64748b]">
          <span className="h-2 w-2 rounded-full bg-[#00f0a8] animate-pulse" />
          <span>REAL-TIME TELEMETRY BOUND</span>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-[#1a273b] bg-[#0c121e] p-5 space-y-4 font-sans text-xs">
        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  isUser ? 'bg-[#38bdf8]/20 text-[#38bdf8]' : 'bg-[#00f0a8]/20 text-[#00f0a8]'
                }`}
              >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div className={`space-y-2 max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
                <div className="flex items-center space-x-2 text-[10px] font-mono text-[#64748b]">
                  <span>{isUser ? 'Alex Vance' : 'Sentinel Analyst'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`rounded-xl p-4 leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-[#152338] text-white border border-[#223755]'
                      : 'bg-[#080d16] text-[#cbd5e1] border border-[#162235]'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Grounding Evidence Chips */}
                {msg.groundedIn && msg.groundedIn.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="font-mono text-[9px] text-[#64748b] uppercase">Grounded in:</span>
                    {msg.groundedIn.map((chip, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-[#101927] px-2 py-0.5 font-mono text-[9px] text-[#38bdf8] border border-[#18263a]"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isThinking && (
          <div className="flex items-center space-x-3 text-xs text-[#64748b] font-mono">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00f0a8]/10 text-[#00f0a8]">
              <Bot className="h-4 w-4 animate-pulse" />
            </div>
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#00f0a8]" />
              <span>Evaluating telemetry and cross-referencing containment status...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] text-[#64748b] flex items-center space-x-1">
          <Sparkles className="h-3 w-3 text-[#00f0a8]" />
          <span>SUGGESTED QUESTIONS:</span>
        </span>
        {promptSuggestions.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={isThinking}
            className="rounded-full border border-[#1e2a3c] bg-[#0c1322] px-3 py-1 font-mono text-[11px] text-[#94a3b8] hover:border-[#38bdf8] hover:text-white transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center space-x-3"
      >
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Ask Sentinel to explain an alert, prioritize containment, or clarify zero-knowledge privacy..."
          disabled={isThinking}
          className="flex-1 rounded-xl border border-[#1b283d] bg-[#0c121e] px-4 py-3 text-xs text-white placeholder-[#64748b] focus:border-[#00f0a8] focus:outline-none font-sans"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isThinking}
          className="flex items-center justify-center rounded-xl bg-[#00f0a8] px-5 py-3 font-mono text-xs font-bold text-[#05080e] hover:bg-[#00f0a8]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#00f0a8]/10"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
