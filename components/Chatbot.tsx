"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, ArrowRight } from 'lucide-react';

interface Message {
  id: number;
  type: 'bot' | 'user';
  text: string;
  time: string;
}

const quickReplies = [
  "Show RaaS pricing",
  "How does bundling with DryForge work?",
  "Spray path optimization explained",
  "ROI for 80,000 sqft commercial project",
  "Edge cutting & masking process",
  "Book a live demo with sales",
];

const botResponses: Record<string, string> = {
  "Show RaaS pricing": "Our RaaS starts at $4,900/robot/month for the Launch tier (1 robot). Scale tier (3 robots) is $13,900/mo. Enterprise is custom. Bundling with DryForge saves you an additional 18% on both subscriptions + unified fleet management. Want me to open the full pricing page?",
  "How does bundling with DryForge work?": "You get one shared mobile base platform. Swap the painting end-effector for the drywall sander in under 15 minutes. Same InteriorFinish OS dashboard, same operators trained on both, one contract, and 18% discount on the combined monthly RaaS. Most GTA contractors running both finish full interiors 4–6 weeks faster.",
  "Spray path optimization explained": "Our vision system (4K + depth) scans the room in ~25 minutes and builds a precise digital twin. The AI then generates optimal spray paths that maximize coverage while minimizing overspray by up to 87%. It accounts for corners, reveals, HVAC, and even suggests back-roll passes for texture matching. You approve the plan in the app before the robot starts.",
  "ROI for 80,000 sqft commercial project": "For an 80k sqft, 3-coat commercial job with an 8-painter crew, our calculator shows you'd need ~3 robots, cut the timeline from ~42 days to 18 days, and save approximately $162k in direct labor while paying back the fleet in under 5 months. Toggle the bundling option for even better numbers.",
  "Edge cutting & masking process": "The robot uses a servo gun for precise edge work and has an optional secondary roller arm for back-rolling. Masking is still done by your crew (or we can quote automated masking add-on). The robot handles 92% of the flat field spraying autonomously with perfect mil consistency (±2 mil).",
  "Book a live demo with sales": "Perfect. I'll connect you with our Ontario deployment team. What's the best email and a good time this week? (Or click 'Talk to an Expert' in the header for the full form.)",
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      text: "Hi, I'm the PaintForge Assistant. I know everything about robotic painting, RaaS pricing, DryForge bundling, and GTA project deployments. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const addMessage = (text: string, type: 'bot' | 'user') => {
    const newMessage: Message = {
      id: Date.now(),
      type,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
      
      let response = "Thanks for your question. Our team would be happy to dive deeper into that. Would you like me to connect you with a PaintForge deployment specialist in the GTA?";
      
      // Smart matching
      const lowerText = messageText.toLowerCase();
      if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('raas')) {
        response = botResponses["Show RaaS pricing"];
      } else if (lowerText.includes('bundle') || lowerText.includes('dryforge')) {
        response = botResponses["How does bundling with DryForge work?"];
      } else if (lowerText.includes('spray path') || lowerText.includes('optimization') || lowerText.includes('ai path')) {
        response = botResponses["Spray path optimization explained"];
      } else if (lowerText.includes('roi') || lowerText.includes('80,000') || lowerText.includes('savings')) {
        response = botResponses["ROI for 80,000 sqft commercial project"];
      } else if (lowerText.includes('edge') || lowerText.includes('mask') || lowerText.includes('detail')) {
        response = botResponses["Edge cutting & masking process"];
      } else if (lowerText.includes('demo') || lowerText.includes('book') || lowerText.includes('talk')) {
        response = botResponses["Book a live demo with sales"];
      } else if (lowerText.includes('how many') || lowerText.includes('robots needed')) {
        response = "It depends on your sqft and timeline. Use the interactive ROI calculator on this page — it will instantly recommend the optimal fleet size and show your exact payback period.";
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
        className="fixed bottom-8 right-8 z-[60] w-14 h-14 rounded-full bg-[#0A2540] text-white flex items-center justify-center shadow-2xl hover:bg-[#FF6B35] transition-all active:scale-95"
        aria-label="Open PaintForge Assistant"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-24 right-8 z-[70] w-[380px] h-[560px] bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl flex flex-col overflow-hidden chatbot-panel"
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

            <div className="text-center text-[10px] text-[#94A3B8] pb-3">This is a demo assistant. Real responses from our team in &lt; 2 min during business hours.</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
