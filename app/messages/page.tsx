"use client";

import { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import ActionDropdown from "../components/ActionDropdown";
import AppSelect from "../components/forms/AppSelect";
import {
  Image,
  FileText,
  FileSpreadsheet,
  File,
  X,
  SquarePen,
  Search,
  MessageSquareDashed,
  ArrowLeft,
  Phone,
  Video,
  Download,
  Paperclip,
  Send,
  MessageSquare,
} from "lucide-react";

interface Conversation {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread: number;
}

interface Message {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
}

const initialConversations: Conversation[] = [
  { id: "c1", name: "Eleanor Pemberton", preview: "Is the penthouse still available?", time: "10:32 AM", unread: 2 },
  { id: "c2", name: "Marcus Thorne", preview: "Contract documents are ready.", time: "9:15 AM", unread: 0 },
  { id: "c3", name: "Sarah Jenkins", preview: "Can we reschedule the viewing?", time: "Yesterday", unread: 1 },
  { id: "c4", name: "Julian Rossi", preview: "Thank you for the update!", time: "Yesterday", unread: 0 },
  { id: "c5", name: "David Brooks", preview: "Interested in the commercial lot.", time: "Mon", unread: 0 },
  { id: "c6", name: "Amelia Foster", preview: "Looking forward to the tour!", time: "Sun", unread: 0 },
  { id: "c7", name: "Nathan Clarke", preview: "Please send the documents.", time: "Sat", unread: 3 },
  { id: "c8", name: "Olivia Bennett", preview: "Deal confirmed ✅", time: "Fri", unread: 0 },
];

const messageThreads: Record<string, Message[]> = {
  c1: [
    { id: "m1", sender: "them", text: "Hi Jetnetix, is the Skyline Penthouse still available for viewing this weekend?", time: "10:28 AM" },
    { id: "m2", sender: "me", text: "Yes Eleanor! It's still available. Would Saturday at 2 PM work for you?", time: "10:30 AM" },
    { id: "m3", sender: "them", text: "Is the penthouse still available?", time: "10:32 AM" },
  ],
  c2: [
    { id: "m1", sender: "them", text: "I've reviewed the contract terms. Everything looks good on my end.", time: "9:10 AM" },
    { id: "m2", sender: "me", text: "Great! I'll send the final documents for signature today.", time: "9:12 AM" },
    { id: "m3", sender: "them", text: "Contract documents are ready.", time: "9:15 AM" },
  ],
  c3: [{ id: "m1", sender: "them", text: "Can we reschedule the viewing to next Tuesday instead?", time: "Yesterday" }],
  c4: [
    { id: "m1", sender: "me", text: "Your financing pre-approval has been received. We're good to proceed!", time: "Yesterday" },
    { id: "m2", sender: "them", text: "Thank you for the update!", time: "Yesterday" },
  ],
  c5: [{ id: "m1", sender: "them", text: "Interested in the commercial lot. Can you send the floor plans?", time: "Mon" }],
  c6: [{ id: "m1", sender: "them", text: "Looking forward to the property tour this weekend!", time: "Sun" }],
  c7: [
    { id: "m1", sender: "them", text: "Hi, can you please send the property brochure and floor plan?", time: "Sat" },
    { id: "m2", sender: "them", text: "Also need the title deed copy.", time: "Sat" },
    { id: "m3", sender: "them", text: "Please send the documents.", time: "Sat" },
  ],
  c8: [
    { id: "m1", sender: "me", text: "The sale is confirmed! Congratulations on your new property.", time: "Fri" },
    { id: "m2", sender: "them", text: "Deal confirmed ✅", time: "Fri" },
  ],
};

const contactOptions = [
  "Eleanor Pemberton",
  "Marcus Thorne",
  "Sarah Jenkins",
  "Julian Rossi",
  "David Brooks",
  "Sarah Miller",
  "James Wilson",
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileIcon({ type }: { type: string }) {
  if (type.startsWith("image/")) return <Image className="w-[20px] h-[20px] text-primary" />;
  if (type === "application/pdf") return <FileText className="w-[20px] h-[20px] text-error" />;
  if (type.includes("word")) return <File className="w-[20px] h-[20px] text-primary" />;
  if (type.includes("sheet") || type.includes("excel")) return <FileSpreadsheet className="w-[20px] h-[20px] text-tertiary" />;
  return <Paperclip className="w-[20px] h-[20px] text-on-surface-variant" />;
}

function NewMessageModal({
  onClose,
  onSend,
}: {
  onClose: () => void;
  onSend: (recipient: string, message: string) => void;
}) {
  const [recipient, setRecipient] = useState(contactOptions[0]);
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    onSend(recipient, message.trim());
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10">
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
          <div>
            <h2 className="text-headline-md font-bold text-on-surface">New Message</h2>
            <p className="text-body-sm text-on-surface-variant mt-0.5">Start a conversation with a client or team member.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors">
            <X className="w-[20px] h-[20px] text-on-surface-variant" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">To</label>
            <AppSelect instanceId="message-recipient" isSearchable value={recipient}
              onChange={(v) => setRecipient(v ?? contactOptions[0] ?? "")}
              options={contactOptions.map((name) => ({ value: name, label: name }))} />
          </div>
          <div>
            <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Message</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none placeholder:text-outline"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-outline-variant rounded-lg text-label-md hover:bg-surface-container-low transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2.5 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:opacity-90 transition-all">
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState<string | null>("c1");
  const [searchQuery, setSearchQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [threads, setThreads] = useState(messageThreads);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredConversations = conversations.filter(
    (c) =>
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeConv = conversations.find((c) => c.id === activeId);
  const activeMessages = activeId ? threads[activeId] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId, activeMessages.length]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setAttachedFile(file);
    e.target.value = "";
  }

  function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() && !attachedFile) return;
    if (!activeId) return;

    const time = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    if (attachedFile) {
      const fileMsg: Message = {
        id: `msg-${Date.now()}-file`,
        sender: "me",
        text: draft.trim() || "",
        time,
        fileName: attachedFile.name,
        fileSize: formatFileSize(attachedFile.size),
        fileType: attachedFile.type,
      };
      setThreads((prev) => ({
        ...prev,
        [activeId]: [...(prev[activeId] || []), fileMsg],
      }));
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId ? { ...c, preview: `📎 ${attachedFile.name}`, time: "Just now" } : c
        )
      );
      setAttachedFile(null);
      setDraft("");
      return;
    }

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "me",
      text: draft.trim(),
      time,
    };
    setThreads((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), newMsg],
    }));
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, preview: draft.trim(), time: "Just now" }
          : c
      )
    );
    setDraft("");
  }

  function handleNewMessage(recipient: string, message: string) {
    const existing = conversations.find((c) => c.name === recipient);
    const time = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "me",
      text: message,
      time,
    };

    if (existing) {
      setActiveId(existing.id);
      setThreads((prev) => ({
        ...prev,
        [existing.id]: [...(prev[existing.id] || []), newMsg],
      }));
      setConversations((prev) =>
        prev.map((c) =>
          c.id === existing.id ? { ...c, preview: message, time: "Just now" } : c
        )
      );
      return;
    }

    const newId = `c-${Date.now()}`;
    setConversations((prev) => [
      { id: newId, name: recipient, preview: message, time: "Just now", unread: 0 },
      ...prev,
    ]);
    setThreads((prev) => ({ ...prev, [newId]: [newMsg] }));
    setActiveId(newId);
  }

  return (
    <>
      <Header title="Messages" subtitle="Communicate with your team and clients" />

      {showNewMessage && (
        <NewMessageModal
          onClose={() => setShowNewMessage(false)}
          onSend={handleNewMessage}
        />
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
        onChange={handleFileChange}
      />

      <main className="p-container-margin flex-1 flex flex-col">
        <div className="flex flex-col justify-center items-center">
          {/* Top bar with New Message button */}
          <div className="flex w-full max-w-[1000px] justify-end items-center gap-4 mb-4">
            <button
              type="button"
              onClick={() => setShowNewMessage(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:opacity-90 active:scale-95 transition-all shadow-[0px_1px_3px_rgba(0,0,0,0.04)]"
            >
              <SquarePen className="w-[20px] h-[20px]" />
              New Message
            </button>
          </div>

          {/* Main Chat Container */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden shadow-[0px_1px_3px_rgba(0,0,0,0.04),_0px_10px_15px_-3px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row w-full max-w-[1000px] h-[calc(100dvh-14rem)] min-h-[520px]">

            {/* ── Left: Conversations Sidebar ── */}
            <div className={`w-full lg:w-[300px] border-b lg:border-b-0 lg:border-r border-outline-variant/30 bg-surface-bright flex flex-col shrink-0 ${activeId ? "hidden lg:flex" : "flex"}`}>
              {/* Sidebar header */}
              <div className="px-4 py-3 border-b border-outline-variant/30">
                <p className="text-label-sm font-bold text-on-surface mb-2">
                  Conversations
                  <span className="ml-2 bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {conversations.filter(c => c.unread > 0).length > 0
                      ? `${conversations.reduce((acc, c) => acc + c.unread, 0)} unread`
                      : `${conversations.length} chats`}
                  </span>
                </p>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-[18px] h-[18px]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search messages..."
                    className="w-full pl-9 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              {/* Scrollable conversation list */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-0.5">
                {filteredConversations.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <MessageSquareDashed className="w-[36px] h-[36px] text-outline mb-2" />
                    <p className="text-body-sm text-on-surface-variant">No conversations found</p>
                  </div>
                )}
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => setActiveId(conv.id)}
                    className={`w-full p-3 rounded-xl flex items-start gap-3 cursor-pointer transition-all text-left ${activeId === conv.id
                      ? "bg-primary/8 border border-primary/20 shadow-sm"
                      : "hover:bg-surface-container-low border border-transparent"
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${activeId === conv.id ? "bg-primary text-on-primary" : "bg-primary-fixed text-primary"}`}>
                      {conv.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className={`text-label-md truncate font-semibold ${activeId === conv.id ? "text-primary" : "text-on-surface"}`}>{conv.name}</h4>
                        <span className="text-[10px] text-outline shrink-0 ml-2">{conv.time}</span>
                      </div>
                      <p className="text-body-sm text-on-surface-variant truncate">{conv.preview}</p>
                    </div>
                    {conv.unread > 0 && activeId !== conv.id && (
                      <span className="w-5 h-5 bg-primary text-on-primary rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {conv.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Right: Chat Panel ── */}
            {activeConv ? (
              <div className="flex-1 flex flex-col min-w-0 min-h-0">
                {/* Chat header */}
                <div className="px-4 sm:px-5 py-3 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low/30 gap-2 shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => setActiveId(null)}
                      className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface-variant shrink-0"
                      aria-label="Back to conversations"
                    >
                      <ArrowLeft className="w-[20px] h-[20px]" />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-sm text-on-primary shrink-0">
                      {activeConv.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-label-md font-bold text-on-surface">{activeConv.name}</h3>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                        <p className="text-[11px] text-tertiary font-medium">Online</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button type="button" className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors" title="Call">
                      <Phone className="w-[18px] h-[18px]" />
                    </button>
                    <button type="button" className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors" title="Video Call">
                      <Video className="w-[18px] h-[18px]" />
                    </button>
                    <ActionDropdown
                      buttonClassName="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors"
                      items={[
                        { label: "View Profile", icon: "person" },
                        { label: "Archive Chat", icon: "archive" },
                        { label: "Mute Notifications", icon: "notifications_off" },
                        { label: "Delete Conversation", icon: "delete", danger: true },
                      ]}
                    />
                  </div>
                </div>

                {/* Scrollable messages area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-3 bg-surface-container-low/10">
                  {activeMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                      {msg.sender === "them" && (
                        <div className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-[10px] text-primary shrink-0 mr-2 mt-1">
                          {activeConv.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                      )}
                      <div className="max-w-[70%]">
                        {/* File attachment bubble */}
                        {msg.fileName && (
                          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl mb-1 ${msg.sender === "me"
                            ? "bg-primary/80 text-on-primary rounded-br-md"
                            : "bg-surface-container-lowest border border-outline-variant/20 text-on-surface rounded-bl-md"
                          }`}>
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${msg.sender === "me" ? "bg-white/20" : "bg-surface-container-low"}`}>
                              <FileIcon type={msg.fileType ?? ""} />
                            </div>
                            <div className="min-w-0">
                              <p className={`text-label-sm font-semibold truncate ${msg.sender === "me" ? "text-on-primary" : "text-on-surface"}`}>{msg.fileName}</p>
                              <p className={`text-[11px] ${msg.sender === "me" ? "text-on-primary/70" : "text-outline"}`}>{msg.fileSize}</p>
                            </div>
                            <button type="button" className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-lg ${msg.sender === "me" ? "hover:bg-white/20" : "hover:bg-surface-container-high"} transition-colors`} title="Download">
                              <Download className={`w-[16px] h-[16px] ${msg.sender === "me" ? "text-on-primary" : "text-on-surface-variant"}`} />
                            </button>
                          </div>
                        )}
                        {/* Text bubble */}
                        {msg.text && (
                          <div className={`px-4 py-3 rounded-2xl ${msg.sender === "me"
                            ? "bg-primary text-on-primary rounded-br-md"
                            : "bg-surface-container-lowest border border-outline-variant/20 text-on-surface rounded-bl-md"
                          }`}>
                            <p className="text-body-md leading-relaxed">{msg.text}</p>
                            <p className={`text-[11px] mt-1 ${msg.sender === "me" ? "text-on-primary/70" : "text-outline"}`}>{msg.time}</p>
                          </div>
                        )}
                        {/* Timestamp when only file */}
                        {msg.fileName && !msg.text && (
                          <p className={`text-[11px] mt-1 px-1 ${msg.sender === "me" ? "text-right text-outline" : "text-outline"}`}>{msg.time}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t border-outline-variant/30 shrink-0">
                  {/* Attached file preview */}
                  {attachedFile && (
                    <div className="mx-4 mt-3 flex items-center gap-3 px-3 py-2.5 bg-primary/5 border border-primary/20 rounded-xl">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <FileIcon type={attachedFile.type} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-label-sm font-semibold text-on-surface truncate">{attachedFile.name}</p>
                        <p className="text-[11px] text-outline">{formatFileSize(attachedFile.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachedFile(null)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant shrink-0"
                        aria-label="Remove attachment"
                      >
                        <X className="w-[16px] h-[16px]" />
                      </button>
                    </div>
                  )}
                  <form onSubmit={sendMessage} className="p-3 flex items-end gap-2">
                    {/* Attach file button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container-high transition-colors text-on-surface-variant shrink-0"
                      title="Attach file"
                      aria-label="Attach file"
                    >
                      <Paperclip className="w-[20px] h-[20px]" />
                    </button>
                    <input
                      type="text"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!draft.trim() && !attachedFile}
                      className="w-10 h-10 flex items-center justify-center bg-primary text-on-primary rounded-xl hover:opacity-90 transition-all disabled:opacity-50 shrink-0"
                      aria-label="Send message"
                    >
                      <Send className="w-[18px] h-[18px]" />
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <MessageSquare className="w-[40px] h-[40px] text-primary" />
                </div>
                <h3 className="text-headline-md font-headline-md text-on-surface mb-3">Select a Conversation</h3>
                <p className="text-body-md text-on-surface-variant max-w-sm leading-relaxed">
                  Choose a conversation from the sidebar or click <strong>New Message</strong> to start chatting.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
