"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot } from 'lucide-react';

interface Message {
  id: number;
  type: 'bot' | 'user';
  text: string;
  time: string;
}

const quickReplies = [
  "What is PaintForge?",
  "Show planned RaaS pricing",
  "How does the pilot program work?",
  "What are the engineering targets?",
  "How does the ROI model work?",
  "How do I apply?",
];

const botResponses: Record<string, string> = {
  "What is PaintForge?":
    "PaintForge is an autonomous wall-and-ceiling painting platform currently in development. We're engineering a mobile robot with an airless spray kit and closed-loop thickness control, and recruiting GTA contractors as design partners for 2026 pilot deployments. No units are in the field yet \u2014 that's what the pilot program is for.",
  "Show planned RaaS pricing":
    "Planned Robot-as-a-Service pricing: Launch tier targets $4,900/robot/month, Scale tier (3 robots) targets $13,900/month, Enterprise is custom. These are target prices for pilot and early production units \u2014 founding design partners lock in preferred rates. Full details on the Pricing page.",
  "How does the pilot program work?":
    "We're selecting a small cohort of GTA contractors for 2026 pilots. Design partners get first access to pilot units, preferred pricing locked in, and direct input into the product. In return, we ask for real job-site access and structured feedback. Apply via the form on the homepage.",
  "What are the engineering targets?":
    "Design targets for pilot units: roughly 4\u00d7 the output of a manual crew, \u00b12 mil coating thickness tolerance via closed-loop control, and 1,000+ sqft per coat per day per robot. These are engineering targets, not measured field results \u2014 pilots exist to validate them.",
  "How does the ROI model work?":
    "The calculator on the homepage models your project using published Ontario labor rates and our engineering targets. It estimates fleet size, timeline compression, and labor savings. Every number is a modeled estimate \u2014 the methodology and assumptions are documented on the Resources page.",
  "How do I apply?":
    "Use the 'Apply as a Design Partner' form on the homepage \u2014 tell us about your upcoming projects (sqft, timelines, current painting challenges). We reply to every serious inquiry by email, typically within 1\u20132 business days.",
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      text: "Hi, I'm the PaintForge assistant. I can explain what we're building, our 2026 GTA pilot program, planned pricing, and how the ROI model works. What would you like to know?",
      time: '',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(2);

  const timeNow = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const addMessage = (text: string, type: 'bot' | 'user') => {
    const newMessage: Message = {
      id: nextId.current++,
      type,
      text,
      time: timeNow(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    addMessage(messageText, 'user');
    setInputValue('');

    // Simulate smart bot response
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      
      let response = "Good question — I don't have a scripted answer for that. The best next step is the pilot application form on the homepage; a real person reads every inquiry and will reply by email.";

      // Keyword matching against scripted answers
      const lowerText = messageText.toLowerCase();
      if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('raas')) {
        response = botResponses["Show planned RaaS pricing"];
      } else if (lowerText.includes('pilot') || lowerText.includes('partner') || lowerText.includes('program')) {
        response = botResponses["How does the pilot program work?"];
      } else if (lowerText.includes('target') || lowerText.includes('spec') || lowerText.includes('speed') || lowerText.includes('mil')) {
        response = botResponses["What are the engineering targets?"];
      } else if (lowerText.includes('roi') || lowerText.includes('savings') || lowerText.includes('calculator')) {
        response = botResponses["How does the ROI model work?"];
      } else if (lowerText.includes('apply') || lowerText.includes('demo') || lowerText.includes('book') || lowerText.includes('talk') || lowerText.includes('contact')) {
        response = botResponses["How do I apply?"];
      } else if (lowerText.includes('what is') || lowerText.includes('who are') || lowerText.includes('about')) {
        response = botResponses["What is PaintForge?"];
      }

      addMessage(response, 'bot');
    }, 850);
  };

  const handleQuickReply = (reply: string) => {
    addMessage(reply, 'user');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const response = botResponses[reply] || "Great question. Let me pull the latest data on that for you...";
      addMessage(response, 'bot');
    }, 750);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-[60] w-14 h-14 rounded-full bg-[#0A2540] text-white flex items-center justify-center shadow-2xl hover:bg-[#FF6B35] transition-all active:scale-95 ${!isOpen ? 'chat-launcher-breathe' : ''}`}
        aria-label="Open PaintForge Assistant"
      >
        {/* Soothing expanding pulse rings — hidden while the panel is open */}
        {!isOpen && (
          <>
            <span className="chat-launcher-ring absolute inset-0 rounded-full bg-[#FF6B35]" />
            <span className="chat-launcher-ring chat-launcher-ring-delayed absolute inset-0 rounded-full bg-[#FF6B35]" />
          </>
        )}
        <span className="relative">{isOpen ? <X size={22} /> : <Bot size={24} />}</span>
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-[5.5rem] right-4 sm:bottom-24 sm:right-8 z-[70] w-[calc(100vw-2rem)] max-w-[380px] h-[min(560px,calc(100dvh-7.5rem))] bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl flex flex-col overflow-hidden chatbot-panel"
          >
            {/* Header */}
            <div className="bg-[#0A2540] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold tracking-tight">PaintForge Assistant</div>
                  <div className="text-[10px] text-white/60 flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse" /> Online • Powered by InteriorFinish AI
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F8FAFC] text-sm">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : ''}`}>
                  <div className={`chat-message ${msg.type}`}>
                    {msg.text}
                    <div className="text-[10px] opacity-50 mt-1 text-right">{msg.time}</div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-[#64748B] pl-1">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-[#94A3B8] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-[#94A3B8] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-[#94A3B8] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs">Assistant is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-4 pt-3 pb-2 bg-white border-t">
              <div className="text-[10px] uppercase tracking-widest text-[#64748B] mb-2 px-1">Quick questions</div>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickReply(reply)}
                    className="quick-reply text-xs"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about robotic painting, pricing, or GTA projects..."
                className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-4 py-3 text-sm placeholder:text-[#94A3B8] focus:outline-none focus:border-[#FF6B35]"
              />
              <button 
                onClick={() => handleSend()} 
                disabled={!inputValue.trim()}
                className="w-11 h-11 flex-shrink-0 rounded-2xl bg-[#0A2540] text-white flex items-center justify-center disabled:opacity-40 active:scale-95 transition"
              >
                <Send size={18} />
              </button>
            </div>

            <div className="text-center text-[10px] text-[#94A3B8] pb-3">Scripted demo assistant. For real answers, apply via the pilot form \u2014 we reply by email.</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
