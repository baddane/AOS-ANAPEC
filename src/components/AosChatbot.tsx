import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Send, Sparkles, HelpCircle, MessageSquare, ArrowDown, User } from 'lucide-react';
import { UserProfile, Convention, PrestationRequest } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

interface AosChatbotProps {
  currentUser: UserProfile;
  conventions: Convention[];
  requests: PrestationRequest[];
}

export default function AosChatbot({ currentUser, conventions, requests }: AosChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewResponse, setHasNewResponse] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize with a warm greeting
  useEffect(() => {
    const welcomeMsg: Message = {
      id: 'welcome',
      sender: 'assistant',
      text: `Bonjour **${currentUser.prenom}** ! 👋\n\nJe suis **l'Assistant Social de l'AOS ANAPEC**. Je suis là pour vous conseiller sur vos avantages, expliquer nos conventions de partenariat ou vous guider dans vos demandes de prestations sociales.\n\nPosez-moi vos questions en français ou en arabe !`,
      timestamp: new Date()
    };
    setMessages([welcomeMsg]);
  }, [currentUser]);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  // Auto-glow prompt when user first completes active tasks
  useEffect(() => {
    if (!isOpen) {
      setHasNewResponse(true);
    }
  }, [requests.length]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare localized state history to feed the backend proxy
      const conversationHistory = messages.map((m) => ({
        role: m.sender,
        text: m.text
      }));
      conversationHistory.push({ role: 'user', text: textToSend });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: conversationHistory,
          userProfile: currentUser,
          conventions,
          requests
        })
      });

      if (!response.ok) {
        throw new Error("Impossible d'obtenir une réponse de l'assistant.");
      }

      const data = await response.json();

      const assistantMsg: Message = {
        id: Math.random().toString(36).substring(7),
        sender: 'assistant',
        text: data.reply || "Désolé, je n'ai pas pu former une réponse adaptée. Pouvez-vous reformuler ?",
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const errMsg: Message = {
        id: Math.random().toString(36).substring(7),
        sender: 'assistant',
        text: "Oups ! Je rencontre une petite difficulté technique de connexion à mon serveur. Veuillez vérifier si les services du serveur de l'Intranet sont fully fonctionnels.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipClick = (query: string) => {
    handleSend(query);
  };

  // Helper function to format basic markdown markers (** and list bullets) into clean UI structures
  const formatMessageText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      const parts: React.ReactNode[] = [];
      let currentLine = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      let match;
      let lastIndex = 0;
      
      const isBullet = line.trim().startsWith('-') || line.trim().startsWith('*');
      const contentText = isBullet ? line.trim().replace(/^[-*]\s*/, '') : line;

      while ((match = boldRegex.exec(contentText)) !== null) {
        if (match.index > lastIndex) {
          parts.push(contentText.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-bold text-slate-900">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < contentText.length) {
        parts.push(contentText.substring(lastIndex));
      }

      const finalRenderContent = parts.length > 0 ? parts : contentText;

      if (isBullet) {
        return (
          <li key={idx} className="list-disc ml-4 my-1 text-slate-700 leading-relaxed text-xs">
            {finalRenderContent}
          </li>
        );
      }

      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="min-h-[1.1em] my-1 text-slate-700 leading-relaxed text-xs">
          {finalRenderContent}
        </p>
      );
    });
  };

  const suggestedChips = [
    { label: "🚂 ONCF tarifs ?", text: "Quels sont les avantages ou remises avec l'ONCF ?" },
    { label: "🐑 Subvention Aïd ?", text: "Comment fonctionne l'aide financière exceptionnelle pour l'Aïd Al-Adha ?" },
    { label: "📂 Mes demandes ?", text: "Quel est l'état d'avancement de mes dossiers de prestations sociales ?" },
    { label: "💳 Prêt Social conditions ?", text: "Quelles sont les conditions pour obtenir un prêt social de l'AOS ?" }
  ];

  return (
    <>
      {/* 1. Floating round bubble toggle button with gentle notification badge */}
      <div className="fixed bottom-6 right-6 z-50 print:hidden">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setHasNewResponse(false);
          }}
          className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer ${
            isOpen ? 'bg-slate-900' : 'bg-brand-blue hover:bg-brand-blue-dark'
          }`}
          title="Assistant Social AOS"
        >
          {isOpen ? (
            <X className="w-6 h-6 animate-spin-once" />
          ) : (
            <div className="relative">
              <Bot className="w-6 h-6" />
              <Sparkles className="w-3.5 h-3.5 text-brand-gold absolute -top-2.5 -right-2.5 animate-bounce" />
              {hasNewResponse && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-brand-gold"></span>
                </span>
              )}
            </div>
          )}
        </button>
      </div>

      {/* 2. Floating Animated Chat Interface Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-24 right-6 w-[92vw] sm:w-[420px] h-[550px] bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 overflow-hidden flex flex-col justify-between print:hidden text-left"
          >
            {/* Header Area */}
            <div className="p-4 bg-brand-blue text-white flex justify-between items-center shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Bot className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Conseiller Social AOS</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[10px] text-slate-100">IA Gemini active en temps réel</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages Log Area */}
            <div 
              ref={chatContainerRef}
              className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 scrollbar-thin overflow-x-hidden"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[85%] ${
                    msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  {/* Left avatar icon */}
                  <div className={`p-1.5 h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                    msg.sender === 'user' ? 'bg-slate-200' : 'bg-brand-blue-light'
                  }`}>
                    {msg.sender === 'user' ? (
                      <User className="w-4 h-4 text-slate-600" />
                    ) : (
                      <Bot className="w-4 h-4 text-brand-blue" />
                    )}
                  </div>

                  {/* Bubble wrapper */}
                  <div className={`p-3 rounded-2xl ${
                    msg.sender === 'user' 
                      ? 'bg-brand-blue text-white rounded-tr-xs' 
                      : 'bg-white border border-slate-100 shadow-xs rounded-tl-xs'
                  }`}>
                    <div className={msg.sender === 'user' ? 'text-white' : 'text-slate-700'}>
                      {msg.sender === 'user' ? (
                        <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      ) : (
                        <div className="space-y-1">
                          {formatMessageText(msg.text)}
                        </div>
                      )}
                    </div>
                    {/* Timestamp element */}
                    <div className={`text-[8px] mt-1 text-right  ${
                      msg.sender === 'user' ? 'text-white/60' : 'text-slate-400/85'
                    }`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing loader component */}
              {isLoading && (
                <div className="flex gap-2.5 mr-auto max-w-[85%]">
                  <div className="p-1.5 h-7 w-7 rounded-lg bg-brand-blue-light flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-brand-blue" />
                  </div>
                  <div className="p-4 bg-white border border-slate-150/50 shadow-xs rounded-2xl rounded-tl-xs flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Question Pills Drawer */}
            <div className="px-3 py-2 border-t border-slate-100 bg-white flex flex-nowrap gap-1.5 overflow-x-auto shrink-0 scrollbar-none items-center shadow-inner select-none">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-0.5 shrink-0 select-none">
                <HelpCircle className="w-3 h-3" /> Idées :
              </span>
              {suggestedChips.map((chip, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleChipClick(chip.text)}
                  className="text-[10px] bg-slate-50 border border-slate-200/80 rounded-full px-2.5 py-1 text-slate-600 hover:text-brand-blue hover:bg-brand-blue-light hover:border-brand-blue/30 whitespace-nowrap transition-all lowercase italic font-sans"
                >
                  {errPhraseSlicer(chip.label)}
                </button>
              ))}
            </div>

            {/* Input Submission Area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez votre question sociale..."
                disabled={isLoading}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-1 focus:ring-brand-blue focus:bg-white transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`p-2.5 rounded-xl text-white transition-colors cursor-pointer ${
                  !input.trim() || isLoading
                    ? 'bg-slate-200 text-slate-400'
                    : 'bg-brand-blue hover:bg-brand-blue-dark'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Visual layout helper to clean label styles
function errPhraseSlicer(text: string): string {
  return text;
}
