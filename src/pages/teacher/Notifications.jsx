import React, { useState } from "react";
import TeacherSidebar from "./TeacherSidebar";

const stats = [
  {
    id: "total",
    label: "إجمالي الإشعارات",
    value: 10,
    icon: "bell",
    color: "#059669",
    bg: "#E7F7F1",
  },
  {
    id: "unread",
    label: "غير مقروءة",
    value: 3,
    icon: "bell",
    color: "#D97706",
    bg: "#FEF3E2",
  },
  {
    id: "academic",
    label: "إشعارات أكاديمية",
    value: 4,
    icon: "cap",
    color: "#123C91",
    bg: "#EAF0FB",
  },
  {
    id: "system",
    label: "إشعارات النظام والإدارة",
    value: 3,
    icon: "bell",
    color: "#123C91",
    bg: "#EAF0FB",
  },
];

const filters = [
  { id: "all", label: "الكل" },
  { id: "unread", label: "غير مقروءة" },
  { id: "academic", label: "الأكاديمية" },
  { id: "system", label: "النظام والإدارة" },
];

const initialNotifications = [
  {
    id: 1,
    title: "غياب طالب",
    description:
      "تغيب الطالب أحمد محمد عن حصص الرياضيات اليوم. يُرجى متابعة حالته الدراسية.",
    time: "منذ 5 دقائق",
    type: "academic",
    icon: "bell",
    color: "#123C91",
    read: false,
  },
  {
    id: 2,
    title: "تحويل مستحقات مالية",
    description:
      "تم تحويل مبلغ 1,250 جنيه مصري إلى رصيدك بنجاح. يُرجى مراجعة محفظتك للاطلاع على تفاصيل العملية.",
    time: "منذ ساعة",
    type: "system",
    icon: "bell",
    color: "#123C91",
    read: false,
  },
  {
    id: 3,
    title: "تنبيه بخصوص مجموعة متوقفة",
    description:
      "تم إيقاف إحدى مجموعاتك التعليمية مؤقتًا لحين مراجعة بعض البيانات من قبل الإدارة.",
    time: "منذ 3 أيام",
    type: "system",
    icon: "gear",
    color: "#8C9198",
    read: true,
  },
  {
    id: 4,
    title: "درس قادم",
    description:
      "لديك درس رياضيات غداً الساعة 2:00 م مع مجموعة الصف الثالث الإعدادي.",
    time: "منذ 5 أيام",
    type: "academic",
    icon: "cap",
    color: "#8C9198",
    read: true,
  },
];

export default function TeacherNotifications() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [notifications, setNotifications] = useState(initialNotifications);

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    );
  };

  const filtered = notifications.filter((n) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !n.read;
    return n.type === activeFilter;
  });

  return (
    <div
      dir="rtl"
      className="h-screen w-full flex bg-[#F9F9FF] overflow-hidden font-ibm"
    >
      <TeacherSidebar activeId="notifications" />

      <main className="flex-1 min-h-0 h-full overflow-y-auto px-8 py-8 pb-12 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-1 text-right">
          <h1 className="font-ibm font-semibold text-2xl leading-8 text-[#123C91]">
            الإشعارات
          </h1>
          <p className="font-ibm font-normal text-base leading-6 text-[#575F69]">
            متابعة جميع التحديثات والتنبيهات المهمة
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-[#E5E5E5] px-5 py-4 gap-5 flex items-center  shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)]"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: s.bg }}
              >
                <StatIcon type={s.icon} size={18} color={s.color} />
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="font-ibm font-bold text-2xl leading-8 text-[#1F2937]">
                  {s.value}
                </span>
                <span className="font-ibm font-normal text-sm leading-5 text-[#575F69] whitespace-nowrap">
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* List container */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)] flex flex-col">
          <div className="px-6 pt-5 pb-4 flex flex-col gap-3 border-b border-[#F1F1F1] text-right">
            <div>
              <h2 className="font-ibm font-bold text-lg text-[#1F2937]">
                جميع الإشعارات
              </h2>
              <p className="font-ibm font-normal text-sm text-[#8C9198]">
                تصفية وإدارة الإشعارات حسب النوع
              </p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFilter(f.id)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === f.id
                      ? "bg-[#123C91] text-white"
                      : "bg-[#F1F1F1] text-[#575F69] hover:bg-[#E5E5E5]"
                  }`}
                >
                  <BellIcon
                    size={14}
                    color={activeFilter === f.id ? "#fff" : "#575F69"}
                  />
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 p-4">
            {filtered.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-4 rounded-lg border p-4 transition-all ${
                  !n.read
                    ? "bg-[#EAF4FF] border-[#E5E5E5]"
                    : "bg-white border-[#E5E5E5]"
                }`}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: !n.read ? "#DCE6F7" : "#F1F1F1" }}
                >
                  <StatIcon type={n.icon} size={16} color={n.color} />
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-1 text-right">
                  <span className="font-ibm font-semibold text-[15px] text-[#1F2937]">
                    {n.title}
                  </span>
                  <p className="font-ibm font-normal text-sm leading-5 text-[#575F69]">
                    {n.description}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-[#8C9198] whitespace-nowrap">
                      {n.time}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleRead(n.id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-[#575F69] hover:text-[#123C91] transition-colors"
                    >
                      {n.read ? (
                        <EyeOffIcon size={14} color="currentColor" />
                      ) : (
                        <EyeIcon size={14} color="currentColor" />
                      )}
                      {n.read ? "وضع علامة كغير مقروءة" : "وضع علامة كمقروءة"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatIcon({ type, size, color }) {
  if (type === "cap") return <CapIcon size={size} color={color} />;
  if (type === "gear") return <GearIcon size={size} color={color} />;
  return <BellIcon size={size} color={color} />;
}

/* Icons */
function BellIcon({ size = 18, color = "currentColor" }) {
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
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
function CapIcon({ size = 18, color = "currentColor" }) {
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
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
    </svg>
  );
}
function GearIcon({ size = 18, color = "currentColor" }) {
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
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}
function EyeIcon({ size = 14, color = "currentColor" }) {
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
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function EyeOffIcon({ size = 14, color = "currentColor" }) {
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
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <path d="M6.61 6.61C3.87 8.42 2 11 2 12s4 8 11 8a9.14 9.14 0 0 0 5.39-1.61" />
      <path d="M2 2l20 20" />
    </svg>
  );
}
