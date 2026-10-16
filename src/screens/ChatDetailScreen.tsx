import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../firebase';
import {
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { ChatThread, ChatMessage } from '../types';
import { ArrowLeft, Send, Phone, MessageSquare, Tag, Sparkles } from 'lucide-react';

export const ChatDetailScreen: React.FC = () => {
  const { lang, t, activeChatId, currentUser, setActiveTab, showToast } = useApp();
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat thread details & messages
  useEffect(() => {
    if (!activeChatId) return;

    // Load thread doc
    const threadRef = doc(db, 'chats', activeChatId);
    const unsubThread = onSnapshot(threadRef, (snap) => {
      if (snap.exists()) {
        setThread({ id: snap.id, ...(snap.data() as Omit<ChatThread, 'id'>) });
      }
    });

    // Load messages subcollection
    const messagesCol = collection(db, 'chats', activeChatId, 'messages');
    const q = query(messagesCol, orderBy('createdAt', 'asc'), limit(100));

    const unsubMessages = onSnapshot(q, (snap) => {
      const msgs: ChatMessage[] = [];
      snap.forEach((d) => {
        msgs.push({ id: d.id, ...(d.data() as Omit<ChatMessage, 'id'>) });
      });
      setMessages(msgs);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => {
      unsubThread();
      unsubMessages();
    };
  }, [activeChatId]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !activeChatId || !currentUser) return;

    setSending(true);
    try {
      const messagesCol = collection(db, 'chats', activeChatId, 'messages');
      const newMsg = {
        chatId: activeChatId,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'రైతు',
        text,
        createdAt: new Date().toISOString()
      };

      await addDoc(messagesCol, newMsg);

      // Update thread lastMessage
      const threadRef = doc(db, 'chats', activeChatId);
      await updateDoc(threadRef, {
        lastMessage: text,
        lastMessageAt: new Date().toISOString()
      });

      setInputText('');
    } catch (error) {
      console.error('Error sending message:', error);
      // Local optimistic fallback if offline
      setMessages(prev => [
        ...prev,
        {
          id: 'local_' + Date.now(),
          chatId: activeChatId,
          senderId: currentUser.uid,
          senderName: currentUser.displayName || 'రైతు',
          text,
          createdAt: new Date().toISOString()
        }
      ]);
      setInputText('');
    } finally {
      setSending(false);
    }
  };

  const quickReplies = [
    t.quickReply1,
    t.quickReply2,
    t.quickReply3,
    t.quickReply4
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] bg-stone-100">
      {/* Top Header with Listing Info */}
      <div className="bg-white border-b border-stone-200 px-3 py-2.5 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => setActiveTab('chats')}
            className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {thread?.listingImage && (
            <img
              src={thread.listingImage}
              alt=""
              className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
            />
          )}

          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-extrabold text-stone-900 truncate">
              {thread?.listingTitle || 'Chat'}
            </h2>
            {thread?.listingPrice && (
              <div className="text-[11px] font-bold text-orange-600">
                ₹{thread.listingPrice.toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {messages.length === 0 ? (
          <div className="text-center py-10 px-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 mx-auto flex items-center justify-center mb-2">
              <MessageSquare className="w-6 h-6" />
            </div>
            <p className="text-xs text-stone-500 font-medium">
              {lang === 'te'
                ? 'మీరు అమ్మకందారుతో నేరుగా చాట్ చేయవచ్చు. దిగువన ఉన్న త్వరిత బటన్లను వాడండి.'
                : 'Direct conversation started. Use quick reply buttons below.'}
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser?.uid;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-xs ${
                    isMe
                      ? 'bg-orange-600 text-white rounded-tr-xs'
                      : 'bg-white text-stone-800 border border-stone-200 rounded-tl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-[9px] text-stone-400 mt-0.5 px-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Responses Bar */}
      <div className="bg-white/80 backdrop-blur-xs border-t border-stone-200/80 px-2 py-1.5 overflow-x-auto flex items-center gap-1.5 shrink-0 scrollbar-none">
        {quickReplies.map((reply, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(reply)}
            className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 border border-stone-200 text-stone-700 text-[11px] font-semibold whitespace-nowrap active:scale-95 transition-all cursor-pointer"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input Field Bar */}
      <div className="bg-white border-t border-stone-200 p-2.5 flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder={t.typeMessage}
          className="flex-1 bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || sending}
          className="w-10 h-10 rounded-2xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white flex items-center justify-center shrink-0 active:scale-95 transition-all shadow-xs cursor-pointer"
        >
          <Send className="w-4 h-4 fill-white" />
        </button>
      </div>
    </div>
  );
};
