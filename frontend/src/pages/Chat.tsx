import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User as UserIcon, Trash2, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: `Hello ${user ? user.name : 'there'}. I am your Silent Disease AI companion. I can help analyze your health risks.` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
        axios.get(`http://localhost:5000/api/chat/history?userId=${user._id}`)
            .then(res => {
                if (res.data && res.data.length > 0) {
                    // Map MongoDB messages to UI format
                    const history = res.data.map((msg: any) => ({
                        id: msg._id || Date.now() + Math.random(),
                        role: msg.role,
                        content: msg.content
                    }));
                    // Keep the welcome message if history is empty, otherwise replace/prepend
                    setMessages(history);
                }
            })
            .catch(err => console.error("Failed to load history", err));
    }
  }, [user]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Create context from last few messages
      const context = messages.slice(-5).map(m => ({ role: m.role, content: m.content }));
      
      const res = await axios.post('http://localhost:5000/api/chat/message', {
        message: input,
        context: context,
        userId: user?._id
      });

      const botMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: res.data.reply 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat Error", error);
      setMessages(prev => [...prev, { id: 'error', role: 'assistant', content: "I'm having trouble connecting to the server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!user || messages.length === 0) return;
    if (!confirm("Are you sure you want to clear the entire chat history?")) return;

    try {
        await axios.delete(`http://localhost:5000/api/chat/history?userId=${user._id}`);
        setMessages([
            { id: Date.now().toString(), role: 'assistant', content: `History cleared. I am ready to help you.` }
        ]);
    } catch (err) {
        console.error("Failed to clear history", err);
    }
  };

  const deleteMessage = async (msgId: string) => {
    if (!user) return;
    try {
        // Optimistic update
        setMessages(prev => prev.filter(m => m.id !== msgId));
        await axios.delete(`http://localhost:5000/api/chat/message/${msgId}?userId=${user._id}`);
    } catch (err) {
        console.error("Failed to delete message", err);
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col max-w-4xl mx-auto relative">
      <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 className="text-xl font-bold">AI Companion</h2>
          <Button variant="outline" size="sm" onClick={clearHistory} className="text-red-400 border-red-400/20 hover:bg-red-400/10">
              <Trash2 size={16} className="mr-2" /> Clear History
          </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}
          >
            <div className={`flex gap-3 max-w-[80%] items-start ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary' : 'bg-surface border border-white/10'}`}>
                {msg.role === 'user' ? <UserIcon size={16} /> : <Bot size={16} className="text-secondary" />}
              </div>
              
              <div className="relative">
                  <Card className={`!p-4 ${msg.role === 'user' ? '!bg-primary/20 !border-primary/20' : ''}`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </Card>
                  
                  {/* Delete Single Message Button */}
                  <button 
                    onClick={() => deleteMessage(msg.id)}
                    className={`absolute top-2 ${msg.role === 'user' ? '-left-8' : '-right-8'} p-1.5 text-gray-500 hover:text-red-400 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity`}
                    title="Delete message"
                  >
                      <X size={14} />
                  </button>
              </div>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
             <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-surface border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-secondary" />
                </div>
                <Card className="!p-4">
                  <div className="flex gap-1 h-5 items-center">
                    <motion.div className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity }} />
                    <motion.div className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                    <motion.div className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                  </div>
                </Card>
             </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-background/50 backdrop-blur-sm sticky bottom-0">
        <form onSubmit={sendMessage} className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your symptoms or ask about your risks..."
            className="flex-1 bg-surface border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-gray-500"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()} className="rounded-xl px-6">
            <Send size={20} />
          </Button>
        </form>
      </div>
    </div>
  );
};

