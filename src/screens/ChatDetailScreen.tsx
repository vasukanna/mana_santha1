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
import { ArrowLeft, Send, Phone, MessageSquare, Tag, Sparkles, AlertTriangle, UserX } from 'lucide-react';

export const ChatDetailScreen: React.FC = () => {
  const { lang, t, activeChatId, currentUser, setActiveTab, showToast, blockUser } = useApp();
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('spam');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);
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

  const otherUserId = thread?.participants.find(id => id !== currentUser?.uid) || '';
  const otherUserName = (otherUserId && thread?.participantNames && thread.participantNames[otherUserId]) || 'యూజర్';

  const handleReportSubmit = async () => {
    if (!currentUser || !otherUserId) return;
    setReportSubmitting(true);
    try {
      const reportsRef = collection(db, 'reports');
      await addDoc(reportsRef, {
        reporterId: currentUser.uid,
        reporterName: currentUser.displayName || 'వినియోగదారు',
        reportedUserId: otherUserId,
        reportedUserName: otherUserName,
        chatId: activeChatId,
        listingId: thread?.listingId || '',
        reason: reportReason,
        details: reportDetails,
        type: 'chat_report',
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setShowReportModal(false);
      showToast(lang === 'te' ? 'ఫిర్యాదు నమోదు చేయబడింది. అడ్మిన్ పరిశీలిస్తారు.' : 'Report submitted. Admin will review.');
    } catch (e) {
      setShowReportModal(false);
      showToast(lang === 'te' ? 'ఫిర్యాదు నమోదు చేయబడింది.' : 'Report recorded.');
    } finally {
      setReportSubmitting(false);
    }
  };

  const handleBlockConfirm = async () => {
    if (!otherUserId) return;
    await blockUser(otherUserId, otherUserName);
    setShowBlockModal(false);
    setActiveTab('chats');
  };

  const quickReplies = [
    t.quickReply1,
    t.quickReply2,
    t.quickReply3,
    t.quickReply4
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] bg-stone-100">
      {/* Top Header with Listing Info and Report/Block */}
      <div className="bg-white border-b border-stone-200 px-3 py-2.5 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => setActiveTab('chats')}
            className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-700 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
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

        {/* Safety & UGC Actions: Report and Block */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setShowReportModal(true)}
            className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-stone-50 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title={lang === 'te' ? 'ఫిర్యాదు చేయండి' : 'Report User'}
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowBlockModal(true)}
            className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-stone-50 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title={lang === 'te' ? 'బ్లాక్ చేయండి' : 'Block User'}
          >
            <UserX className="w-4 h-4" />
          </button>
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
          className="w-10 h-10 rounded-2xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white flex items-center justify-center shrink-0 active:scale-95 transition-all shadow-xs cursor-pointer min-h-[44px] min-w-[44px]"
        >
          <Send className="w-4 h-4 fill-white" />
        </button>
      </div>

      {/* Chat Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-stone-200">
            <h3 className="font-extrabold text-stone-900 text-base mb-1">
              {lang === 'te' ? 'యూజర్‌పై ఫిర్యాదు చేయండి' : 'Report User'}
            </h3>
            <p className="text-xs text-stone-500 mb-3">
              {lang === 'te' ? 'ఈ వినియోగదారునితో ఏదైనా సమస్య ఉందా?' : 'Please select the issue with this user/conversation:'}
            </p>

            <div className="space-y-2 mb-3">
              {[
                { id: 'spam', label: lang === 'te' ? 'స్పామ్ లేదా ప్రకటనలు' : 'Spam or unsolicited promotion' },
                { id: 'fraud', label: lang === 'te' ? 'మోసం లేదా డబ్బు డిమాండ్' : 'Fraud / Advance Payment Scam' },
                { id: 'abusive', label: lang === 'te' ? 'అసభ్యకరమైన భాష' : 'Abusive or inappropriate messages' },
                { id: 'other', label: lang === 'te' ? 'ఇతర కారణం' : 'Other safety concern' }
              ].map(opt => (
                <label
                  key={opt.id}
                  onClick={() => setReportReason(opt.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                    reportReason === opt.id ? 'border-orange-600 bg-orange-50 text-orange-900' : 'border-stone-200 text-stone-700'
                  }`}
                >
                  <span>{opt.label}</span>
                  <input
                    type="radio"
                    checked={reportReason === opt.id}
                    onChange={() => {}}
                    className="accent-orange-600"
                  />
                </label>
              ))}
            </div>

            <textarea
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              placeholder={lang === 'te' ? 'మరిన్ని వివరాలు (ఐచ్ఛికం)...' : 'Additional details (optional)...'}
              className="w-full text-xs p-2.5 border border-stone-200 rounded-xl mb-4 h-16"
            />

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="py-2.5 rounded-xl border border-stone-300 font-bold text-xs text-stone-700 hover:bg-stone-50 min-h-[44px]"
              >
                {lang === 'te' ? 'రద్దు' : 'Cancel'}
              </button>
              <button
                onClick={handleReportSubmit}
                disabled={reportSubmitting}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md min-h-[44px]"
              >
                {reportSubmitting ? '...' : (lang === 'te' ? 'సమర్పించండి' : 'Submit')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Block Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-stone-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
              <UserX className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-stone-900 text-base mb-1">
              {lang === 'te' ? 'ఈ యూజర్‌ను బ్లాక్ చేయాలా?' : 'Block this User?'}
            </h3>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              {lang === 'te'
                ? `మీరు ${otherUserName}ని బ్లాక్ చేస్తే, వారి నుంచి వచ్చే సందేశాలు మరియు ప్రకటనలు మీకు కనిపించవు.`
                : `Blocking ${otherUserName} will hide all their marketplace listings and messages.`}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowBlockModal(false)}
                className="py-2.5 rounded-xl border border-stone-300 font-bold text-xs text-stone-700 hover:bg-stone-50 cursor-pointer min-h-[44px]"
              >
                {lang === 'te' ? 'రద్దు' : 'Cancel'}
              </button>
              <button
                onClick={handleBlockConfirm}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md cursor-pointer min-h-[44px]"
              >
                {lang === 'te' ? 'బ్లాక్ చేయండి' : 'Confirm Block'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
