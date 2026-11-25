import React, { useState } from "react";
import TeacherSidebar from "./TeacherSidebar";

const filters = [
  { id: "all", label: "الكل" },
  { id: "parents", label: "أولياء الأمور" },
  { id: "groups", label: "المجموعات" },
  { id: "admin", label: "الإدارة" },
];

const conversations = [
  {
    id: 1,
    name: "أحمد علي",
    role: "الطالب: محمد",
    time: "10:45 ص",
    lastMessage: "شكراً جزيلاً على متابعتك. سأحرص...",
    unread: 2,
  },
  {
    id: 2,
    name: "خليل علاء",
    role: "الطالب: سامي",
    time: "10:45 ص",
    lastMessage: "تم استلام الواجب المنزلي بنجاح",
    unread: 2,
  },
  {
    id: 3,
    name: "سامي صلاح",
    role: "الطالب: محمد",
    time: "10:45 ص",
    lastMessage: "تم استلام الواجب المنزلي بنجاح",
    unread: 1,
  },
];

const initialMessages = [
  {
    id: 1,
    sender: "me",
    time: "10:32",
    text: "السلام عليكم، أنا المعلم عادل منصور، معلم الرياضيات لابنك محمد",
  },
  {
    id: 2,
    sender: "other",
    time: "10:35",
    text: "وعليكم السلام. تشرفنا. كيف حال أحمد في المادة؟",
  },
  {
    id: 3,
    sender: "me",
    time: "10:37",
    text: "الحمد لله، محمد يبلي بلاءً حسناً، لكن أنصح بالتركيز أكثر على الهندسة",
  },
  {
    id: 4,
    sender: "me",
    time: "10:37",
    text: 'من الأفضل مراجعة درس "التحويلات الهندسية" مع محمد لتحسين أدائه',
  },
  {
    id: 5,
    sender: "other",
    time: "10:42",
    text: "شكراً جزيلاً على متابعتك. سأحرص على مراجعة الهندسة معه",
  },
];

export default function TeacherMessages() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeConversationId, setActiveConversationId] = useState(1);
  const [messages] = useState(initialMessages);
  const [draft, setDraft] = useState("");

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId,
  );

  return (
    <div
      dir="rtl"
      className="h-screen w-full flex bg-[#F9F9FF] overflow-hidden font-ibm"
    >
      <TeacherSidebar activeId="messages" />

      <main className="flex-1 min-h-0 h-full overflow-hidden px-8 py-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-1 text-right">
          <h1 className="font-ibm font-semibold text-2xl leading-8 text-[#123C91]">
            مركز الرسائل
          </h1>
          <p className="font-ibm font-normal text-base leading-6 text-[#575F69]">
            التواصل مع أولياء الأمور و الإدارة و الطلاب
          </p>
        </div>

        {/* Body: conversations (right) + chat (left) */}
        <div className="flex-1 min-h-0 flex gap-4">
          {/* قائمة المحادثات - يمين */}
          <div className="w-[320px] shrink-0 bg-white rounded-2xl border border-[#E5E5E5] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden">
            <div className="px-4 pt-4 pb-3 flex flex-col gap-3 border-b border-[#F1F1F1]">
              <div className="flex items-center justify-between">
                <span className="font-ibm font-bold text-base text-[#1F2937]">
                  المحادثات
                </span>
                <button
                  type="button"
                  className="w-7 h-7 rounded-full bg-[#123C91] text-white flex items-center justify-center"
                >
                  <PlusIcon size={16} color="#fff" />
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث عن ولي أمر أو طالب أو مجموعة..."
                  className="w-full h-10 bg-[#F9FAFA] border border-[#E5E5E5] rounded-lg pr-4 pl-9 text-sm text-[#1F2937] placeholder-[#8C9198] outline-none focus:border-[#123C91] transition-all"
                />
                <SearchIcon
                  size={16}
                  color="#8C9198"
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto">
                {filters.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActiveFilter(f.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeFilter === f.id
                        ? "bg-[#123C91] text-white"
                        : "bg-[#F1F1F1] text-[#575F69] hover:bg-[#E5E5E5]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.map((c) => {
                const isActive = c.id === activeConversationId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveConversationId(c.id)}
                    className={`w-full text-right px-4 py-3 flex flex-col gap-1 border-b border-[#F1F1F1] transition-all ${
                      isActive ? "bg-[#EAF0FB]" : "hover:bg-[#F9FAFA]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-ibm font-semibold text-sm text-[#1F2937]">
                        {c.name}
                      </span>
                      <span className="text-xs text-[#8C9198]">{c.time}</span>
                    </div>
                    <span className="text-xs text-[#8C9198] bg-[#F1F1F1] w-fit px-2 py-0.5 rounded">
                      {c.role}
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-[#575F69] truncate">
                        {c.lastMessage}
                      </span>
                      {c.unread > 0 && (
                        <span className="shrink-0 w-5 h-5 rounded-full bg-[#123C91] text-white text-[11px] flex items-center justify-center">
                          {c.unread}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* نافذة المحادثة - شمال */}
          <div className="flex-1 min-w-0 bg-white rounded-2xl border border-[#E5E5E5] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 flex items-center gap-3 border-b border-[#F1F1F1]">
              <div className="w-9 h-9 rounded-full bg-[#123C91] text-white flex items-center justify-center font-semibold text-sm">
                {activeConversation?.name?.charAt(0)}
              </div>
              <span className="font-ibm font-semibold text-base text-[#1F2937]">
                {activeConversation?.name}
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[70%] flex flex-col gap-1 ${
                    m.sender === "me"
                      ? "self-start items-start"
                      : "self-end items-end"
                  }`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-6 ${
                      m.sender === "me"
                        ? "bg-[#123C91] text-white rounded-br-sm"
                        : "bg-[#F1F1F1] text-[#1F2937] rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                  <div className="flex items-center gap-1 px-1">
                    <span className="text-[11px] text-[#8C9198]">{m.time}</span>
                    {m.sender === "me" && (
                      <CheckDoubleIcon size={12} color="#8C9198" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="px-6 py-6 border-t border-[#E5E5E5] bg-white flex items-center gap-3">
              <div className="flex-1 h-12 flex items-center gap-2.5 rounded-lg border border-[#E5E5E5] bg-[#F9FAFA] px-4">
                <AttachIcon size={16} color="#8C9198" />
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="اكتب رسالتك هنا..."
                  className="flex-1 h-full bg-transparent text-right text-sm leading-4 text-[#1F2937] placeholder:text-[#1F2937]/50 outline-none font-ibm"
                />
              </div>
              <button
                type="button"
                className="w-[160px] h-10 shrink-0 rounded-lg bg-[#123C91] flex items-center justify-center gap-2 px-4 py-3"
              >
                <SendIcon size={16} color="#fff" />
                <span className="font-tajawal font-medium text-base leading-none text-white">
                  إرسال
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* Icons */
function PlusIcon({ size = 18, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function SearchIcon({ size = 18, color = "currentColor", className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function SendIcon({ size = 18, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}
function AttachIcon({ size = 18, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}
function CheckDoubleIcon({ size = 14, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 12 5 5L18 7" />
      <path d="m9 12 5 5L23 7" />
    </svg>
  );
}
