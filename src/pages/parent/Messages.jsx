import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo-sidebar.svg";
// ⚠️ لسه معندناش endpoints مؤكدة للشات بالبيانات الفعلية (كل ردود
// Get My Rooms / Get All Chatrooms رجعت فاضية - مفيش أي room حقيقي في
// النظام لحد دلوقتي). لما يتوفر room حقيقي، هنضيف الدوال دي في
// chatService.js ونستبدل الـ mock تحت.
// import { getMyRooms, getRoomMessages, sendMessage } from "../../services/chatService";

/**
 * صفحة الرسائل (مركز الرسائل) - نسخة مبدئية (UI أولي) قريبة من التصميم
 * اللي اتبعت. مبنية على بيانات mock لحد ما نتأكد من شكل API الشات.
 *
 * ✅ ترتيب الأعمدة: قائمة المحادثات على اليمين (ضيقة، جنب السايد بار)،
 * ومنطقة الشات على الشمال (واسعة) - مؤكد من التصميم.
 *
 * ⚠️ أسئلة معلّقة لازم تتجاوب من الباك اند قبل الربط الفعلي:
 * - إيه شكل رد "room" واحدة؟ (participant name/role, lastMessage,
 *   unreadCount, lastMessageTime)
 * - إيه شكل رد "رسالة" واحدة جوه الـ room؟ (sender, text, timestamp, isRead)
 * - هل الرسايل الجديدة بتوصل realtime عن طريق Socket.io، ولا REST + polling؟
 * - هل فلترة "الكل / المعلمون / الإدارة" بتتعمل من الـ API ولا client-side؟
 */

const FILTERS = [
  { id: "all", label: "الكل" },
  { id: "teachers", label: "المعلمون" },
  { id: "admin", label: "الإدارة" },
];

/**
 * ⚠️ MOCK DATA - استبدلها برد getMyRooms() الحقيقي.
 */
function buildMockConversations() {
  return [
    {
      id: "c1",
      name: "عادل منصور",
      role: "teacher",
      roleLabel: "معلم الرياضيات",
      lastMessage: "شكراً جزيلاً على متابعتك. سأحرص...",
      lastMessageTime: "10:45 ص",
      unreadCount: 2,
    },
    {
      id: "c2",
      name: "خالد علاء",
      role: "teacher",
      roleLabel: "معلم الجغرافيا",
      lastMessage: "تم استلام الواجب المنزلي بنجاح",
      lastMessageTime: "10:45 ص",
      unreadCount: 2,
    },
    {
      id: "c3",
      name: "سامي محمد",
      role: "teacher",
      roleLabel: "معلم اللغة العربية",
      lastMessage: "تم استلام الواجب المنزلي بنجاح",
      lastMessageTime: "10:45 ص",
      unreadCount: 1,
    },
  ];
}

/**
 * ⚠️ MOCK DATA - استبدلها برد getRoomMessages(roomId) الحقيقي.
 * key = conversation id
 */
function buildMockMessages() {
  return {
    c1: [
      { id: "m1", fromMe: false, text: "السلام عليكم، أنا المعلم عادل منصور، معلم الرياضيات لابنك محمد", time: "10:32" },
      { id: "m2", fromMe: true, text: "وعليكم السلام، تشرفنا. كيف حال محمد في المادة؟", time: "10:35", read: true },
      { id: "m3", fromMe: false, text: "الحمد لله، محمد يبلي بلاءً حسناً. لكن أنصح بالتركيز أكثر على الهندسة", time: "10:37" },
      { id: "m4", fromMe: false, text: 'من الأفضل مراجعة درس "التحويلات الهندسية" مع محمد لتحسين أدائه', time: "10:37" },
      { id: "m5", fromMe: true, text: "شكراً جزيلاً على متابعتك. سأحرص على مراجعة الهندسة معه", time: "10:42", read: true },
    ],
    c2: [],
    c3: [],
  };
}

export default function Messages() {
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [messagesByConv, setMessagesByConv] = useState({});
  const [activeConvId, setActiveConvId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConvId, messagesByConv]);

  async function fetchConversations() {
    setLoading(true);
    setErrorMsg("");
    try {
      // ⚠️ TODO: استبدل ده بالنداء الحقيقي لما يتوفر room حقيقي في النظام:
      // const res = await getMyRooms();
      // setConversations(res?.data || []);
      await new Promise((r) => setTimeout(r, 300));
      const convs = buildMockConversations();
      setConversations(convs);
      setMessagesByConv(buildMockMessages());
      setActiveConvId(convs[0]?.id || null);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "حصل خطأ أثناء تحميل المحادثات");
    } finally {
      setLoading(false);
    }
  }

  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "teachers" && c.role === "teacher") ||
        (activeFilter === "admin" && c.role === "admin");
      const matchesSearch = c.name.toLowerCase().includes(search.trim().toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [conversations, activeFilter, search]);

  const activeConversation = conversations.find((c) => c.id === activeConvId);
  const activeMessages = messagesByConv[activeConvId] || [];

  const handleSend = () => {
    if (!draft.trim() || !activeConvId) return;
    // ⚠️ TODO: استبدل ده بنداء sendMessage(activeConvId, draft) الحقيقي
    const newMsg = {
      id: `local-${Date.now()}`,
      fromMe: true,
      text: draft.trim(),
      time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };
    setMessagesByConv((prev) => ({
      ...prev,
      [activeConvId]: [...(prev[activeConvId] || []), newMsg],
    }));
    setDraft("");
  };

  const navItems = [
    { id: "overview", label: "لوحة التحكم", icon: GridIcon, path: "/parent/dashboard" },
    { id: "children", label: "الأبناء", icon: UsersIcon, path: "/parent/children" },
    { id: "schedule", label: "الجدول", icon: CalendarIcon, path: "/parent/schedule" },
    { id: "messages", label: "الرسائل", icon: ChatIcon, path: "/parent/messages" },
    { id: "plans", label: "الخطط التعليمية", icon: CardIcon, path: "/parent/plans" },
    { id: "notifications", label: "الإشعارات", icon: BellIcon, path: "/parent/notifications" },
    { id: "settings", label: "الإعدادات", icon: GearIcon, path: "/parent/settings" },
  ];

  return (
    <div dir="rtl" className="h-screen w-full flex bg-[#F9F9FF] overflow-hidden font-tajawal">
      <aside className="hidden md:flex flex-col justify-between w-64 h-full shrink-0 bg-[#1F2937] px-4 py-6 border-l border-black/10 shadow-[0_0_2px_0_rgba(0,0,0,0.25)]">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <img src={logo} alt="الأكاديمية" className="w-[176px] h-8" />
            <button
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors shrink-0"
            >
              <ChevronIcon size={16} color="#FFFFFF" />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = item.id === "messages";
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 h-10 w-[224px] px-2 rounded-lg transition-colors text-base font-ibm font-medium ${
                    isActive
                      ? "bg-white border-r-4 border-[#12C6B0] text-[#123C91]"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  <item.icon size={20} color={isActive ? "#123C91" : "#FFFFFF"} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }}
          className="flex items-center gap-2 h-9 w-[224px] px-2 rounded-lg text-white/90 hover:bg-white/10 transition-colors text-base font-ibm font-medium"
        >
          <LogoutIcon size={20} color="#FFFFFF" />
          تسجيل الخروج
        </button>
      </aside>

      <main className="flex-1 h-full overflow-hidden px-8 py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-1 shrink-0">
          <h1 className="font-ibm font-semibold text-2xl leading-8 text-[#123C91]">
            مركز الرسائل
          </h1>
          <p className="font-ibm font-normal text-base leading-6 text-[#575F69]">
            التواصل مع المعلمين و الإدارة حول أبنائك
          </p>
        </div>

        {errorMsg && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-right shrink-0">
            {errorMsg}
          </div>
        )}

        {/*
          ⚠️ ترتيب مهم: قائمة المحادثات (360px) مكتوبة أولًا في الكود عشان
          تظهر على اليمين (جنب السايد بار)، ومنطقة الشات (1fr) مكتوبة تانيًا
          عشان تظهر على الشمال (المساحة الأوسع). ده اتأكد من التصميم الفعلي.
        */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4">
          {/* قائمة المحادثات - يمين */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] flex flex-col overflow-hidden order-1">
            <div className="flex flex-col gap-3 p-4 border-b border-[#E5E5E5]">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  title="محادثة جديدة"
                  className="w-8 h-8 rounded-full bg-[#123C91] hover:bg-[#0e2f73] text-white flex items-center justify-center transition-colors"
                >
                  <PlusIcon size={16} />
                </button>
                <h3 className="font-tajawal font-medium text-base text-[#1F2937]">المحادثات</h3>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحث عن معلم او ابن..."
                  className="w-full h-10 border border-[#E5E5E5] rounded-lg pr-9 pl-3 bg-[#F9FAFA] text-sm text-[#1F2937] text-right focus:outline-none focus:border-[#1E3A8A] transition-colors"
                />
                <SearchIcon size={15} color="#8C9198" className="absolute right-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActiveFilter(f.id)}
                    className={`h-8 px-3 rounded-lg font-ibm font-medium text-xs transition-colors ${
                      activeFilter === f.id
                        ? "bg-[#123C91] text-white"
                        : "bg-[#F3F4F6] text-[#575F69] hover:bg-gray-200"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="py-10 text-center text-sm text-[#8C9198]">جاري التحميل...</div>
              ) : filteredConversations.length === 0 ? (
                <div className="py-10 text-center text-sm text-[#8C9198]">لا توجد محادثات</div>
              ) : (
                filteredConversations.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conversation={conv}
                    isActive={conv.id === activeConvId}
                    onClick={() => setActiveConvId(conv.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* منطقة المحادثة - شمال */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] flex flex-col overflow-hidden order-2">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <span className="font-ibm text-sm text-[#8C9198]">جاري التحميل...</span>
              </div>
            ) : !activeConversation ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
                <ChatIcon size={28} color="#C7CBD1" />
                <p className="font-medium text-sm text-[#575F69]">اختر محادثة لعرضها</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 p-4 border-b border-[#E5E5E5]">
                  <div className="w-9 h-9 shrink-0 rounded-full bg-[#123C91] flex items-center justify-center text-white font-semibold text-sm">
                    {activeConversation.name.trim().charAt(0)}
                  </div>
                  <span className="font-tajawal font-medium text-base text-[#1F2937]">
                    {activeConversation.name} ({activeConversation.roleLabel})
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                  {activeMessages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                      <span className="font-ibm text-sm text-[#8C9198]">
                        لا توجد رسائل بعد، ابدأ المحادثة
                      </span>
                    </div>
                  ) : (
                    activeMessages.map((msg) => (
                      <MessageBubble key={msg.id} message={msg} />
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="flex items-center gap-2 p-4 border-t border-[#E5E5E5]">
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!draft.trim()}
                    className="h-11 px-5 rounded-lg bg-[#123C91] hover:bg-[#0e2f73] disabled:opacity-50 text-white font-ibm font-medium text-sm flex items-center gap-2 transition-colors shrink-0"
                  >
                    إرسال
                    <SendIcon size={16} />
                  </button>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="اكتب رسالتك هنا..."
                      className="w-full h-11 border border-[#E5E5E5] rounded-lg px-4 pl-10 bg-[#F9FAFA] text-sm text-[#1F2937] text-right focus:outline-none focus:border-[#1E3A8A] transition-colors"
                    />
                    <button
                      type="button"
                      title="إرفاق ملف"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C9198] hover:text-[#575F69]"
                    >
                      <PaperclipIcon size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- عنصر محادثة في القائمة الجانبية ---------- */
function ConversationItem({ conversation, isActive, onClick }) {
  const initial = conversation.name.trim().charAt(0);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-start gap-3 p-4 border-b border-[#F3F4F6] text-right transition-colors ${
        isActive ? "bg-[#F3F6FF]" : "hover:bg-gray-50"
      }`}
    >
      <div className="w-10 h-10 shrink-0 rounded-full bg-[#123C91] flex items-center justify-center text-white font-semibold text-sm">
        {initial}
      </div>
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-ibm text-xs text-[#8C9198] shrink-0">{conversation.lastMessageTime}</span>
          <span className="font-tajawal font-medium text-sm text-[#1F2937] truncate">
            {conversation.name} ({conversation.roleLabel})
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          {conversation.unreadCount > 0 && (
            <span className="w-5 h-5 shrink-0 rounded-full bg-[#123C91] text-white text-[10px] font-bold flex items-center justify-center">
              {conversation.unreadCount}
            </span>
          )}
          <span className="font-ibm text-xs text-[#575F69] truncate">{conversation.lastMessage}</span>
        </div>
      </div>
    </button>
  );
}

/* ---------- فقاعة رسالة ---------- */
function MessageBubble({ message }) {
  return (
    <div className={`flex ${message.fromMe ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 flex flex-col gap-1 ${
          message.fromMe ? "bg-[#123C91] text-white" : "bg-[#F3F4F6] text-[#1F2937]"
        }`}
      >
        <span className="font-ibm text-sm leading-6 text-right">{message.text}</span>
        <div className={`flex items-center gap-1 justify-end ${message.fromMe ? "text-white/70" : "text-[#8C9198]"}`}>
          <span className="font-ibm text-[10px]">{message.time}</span>
          {message.fromMe && <CheckIcon size={12} color={message.read ? "#5EEAD4" : "currentColor"} />}
        </div>
      </div>
    </div>
  );
}

/* ---------- أيقونات ---------- */
function iconProps({ size = 18, color = "currentColor", strokeWidth = 1.8 }) {
  return {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round",
  };
}
function GridIcon(p) { return (<svg {...iconProps(p)}><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" /></svg>); }
function UsersIcon(p) { return (<svg {...iconProps(p)}><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17.5" cy="9" r="2.6" /><path d="M21.5 20c0-2.6-1.9-4.8-4.4-5.4" /></svg>); }
function CalendarIcon(p) { return (<svg {...iconProps(p)}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>); }
function ChatIcon(p) { return (<svg {...iconProps(p)}><path d="M21 12a8 8 0 1 1-3.4-6.5L21 4l-1 4.6A7.96 7.96 0 0 1 21 12z" /></svg>); }
function CardIcon(p) { return (<svg {...iconProps(p)}><rect x="2.5" y="5" width="19" height="14" rx="2.2" /><path d="M2.5 10h19" /></svg>); }
function BellIcon(p) { return (<svg {...iconProps(p)}><path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9z" /><path d="M10 19a2 2 0 0 0 4 0" /></svg>); }
function GearIcon(p) { return (<svg {...iconProps(p)}><circle cx="12" cy="12" r="3.2" /><path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.4-2-3.4-2.3.9a7.7 7.7 0 0 0-2.6-1.5L14 2.5h-4l-.5 2.6a7.7 7.7 0 0 0-2.6 1.5l-2.3-.9-2 3.4 2 1.4a7.6 7.6 0 0 0 0 3l-2 1.4 2 3.4 2.3-.9c.77.66 1.65 1.17 2.6 1.5L10 21.5h4l.5-2.6a7.7 7.7 0 0 0 2.6-1.5l2.3.9 2-3.4-2-1.4z" /></svg>); }
function LogoutIcon(p) { return (<svg {...iconProps(p)}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></svg>); }
function ChevronIcon(p) { return (<svg {...iconProps(p)}><path d="M11 17l-5-5 5-5" /><path d="M18 17l-5-5 5-5" /></svg>); }
function SearchIcon({ size = 18, color = "currentColor", className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}
function PlusIcon(p) { return (<svg {...iconProps(p)}><path d="M12 5v14M5 12h14" /></svg>); }
function SendIcon(p) { return (<svg {...iconProps(p)}><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></svg>); }
function PaperclipIcon(p) { return (<svg {...iconProps(p)}><path d="M21.4 11.5l-9.2 9.2a5.5 5.5 0 0 1-7.8-7.8l9.2-9.2a3.7 3.7 0 0 1 5.2 5.2l-9.2 9.2a1.8 1.8 0 0 1-2.6-2.6l8.5-8.5" /></svg>); }
function CheckIcon(p) { return (<svg {...iconProps(p)}><path d="M20 6L9 17l-5-5" /></svg>); }