import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo-sidebar.svg";
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../services/parentService";

/**
 * صفحة الإشعارات - متصلة بالـ API الحقيقي.
 *
 * ⚠️ ملاحظة مهمة: GET /notifications بيرجع "data": [] فاضية دايمًا لحد
 * دلوقتي (زي ما حصل مع الاشتراكات)، يعني لسه معندناش رد حقيقي فيه بيانات
 * نتأكد بيه من أسماء الحقول (نوع الإشعار، حالة القراءة، التاريخ...).
 * الدالة normalizeNotification() تحت دي بتدوّر على أكتر من اسم محتمل لكل
 * حقل، وبترجع قيمة افتراضية آمنة بدل ما تكسر. لما يوصلنا أول إشعار حقيقي،
 * صحّح القراءة جوا الدالة دي بس.
 *
 * الـ endpoints المؤكدة من بوستمان:
 * - GET   /notifications              → { success, results, data: [] }
 * - PATCH /notifications/:id/read     → مفيش body، بيرجع { success }
 * - PATCH /notifications/read-all     → مفيش body، بيرجع { success: true }
 */

const CATEGORY_META = {
  system: { label: "النظام والإدارة", iconBg: "#FEE2E2", iconColor: "#DC2626" },
  academic: { label: "الأكاديمية", iconBg: "#DCFCE7", iconColor: "#16A34A" },
};

/**
 * بتحاول تخمّن نوع الإشعار (نظام/أكاديمية) من أكتر من اسم حقل محتمل.
 * ⚠️ القيم هنا تخمين لحد ما نشوف رد حقيقي - عدّلها وقتها.
 */
function resolveCategory(raw) {
  const value = (raw.category || raw.type || raw.notificationType || "")
    .toString()
    .toLowerCase();
  if (["system", "admin", "management", "نظام", "إدارة"].includes(value)) {
    return "system";
  }
  return "academic";
}

function timeAgo(dateValue) {
  if (!dateValue) return "--";
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return "--";

  const diffMs = Date.now() - d.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "الآن";
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  return `منذ ${days} يوم`;
}

/**
 * بتاخد عنصر الإشعار الخام من السيرفر وترجعه بشكل موحّد تستخدمه الصفحة.
 * عدّل أسماء الحقول (raw.xxx) هنا لو اتأكدت إن الباك اند بيسمّيها مختلف.
 */
function normalizeNotification(raw) {
  return {
    id: raw.id || raw._id,
    category: resolveCategory(raw),
    title: raw.title || raw.name || "--",
    message: raw.message || raw.body || raw.description || "",
    timeAgo: timeAgo(raw.createdAt || raw.date),
    isRead: raw.isRead ?? raw.read ?? false,
  };
}

export default function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all | system | academic | unread

  useEffect(() => {
    let cancelled = false;

    async function loadNotifications() {
      setLoading(true);
      setError(null);
      try {
        const res = await getMyNotifications();
        if (cancelled) return;
        setNotifications((res.data || []).map(normalizeNotification));
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadNotifications();
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    return {
      system: notifications.filter((n) => n.category === "system").length,
      academic: notifications.filter((n) => n.category === "academic").length,
      unread: notifications.filter((n) => !n.isRead).length,
      all: notifications.length,
    };
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (filter === "all") return notifications;
    if (filter === "unread") return notifications.filter((n) => !n.isRead);
    return notifications.filter((n) => n.category === filter);
  }, [notifications, filter]);

  // ⚠️ endpoint "وضع علامة كمقروء" اللي اتأكد من بوستمان مخصوص لـ
  // "قراءة" بس (مفيش PATCH لإرجاعه لغير مقروء). عشان كده الزرار هنا بيبعت
  // للسيرفر بس لما الإشعار يكون لسه مش مقروء؛ التبديل العكسي بيفضل محلي
  // فقط لحد ما يبقى فيه endpoint مقابل من الباك اند.
  async function toggleRead(notification) {
    if (notification.isRead) {
      // مفيش endpoint "unread" حاليًا - نغيّرها محليًا بس كعرض بصري
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: false } : n))
      );
      return;
    }

    // تحديث متفائل (optimistic) فورًا، ثم تأكيد مع السيرفر
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
    );
    try {
      await markNotificationRead(notification.id);
    } catch (err) {
      // فشل التحديث - نرجّع الحالة زي ما كانت
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: false } : n))
      );
    }
  }

  async function handleMarkAllRead() {
    const previous = notifications;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await markAllNotificationsRead();
    } catch (err) {
      setNotifications(previous);
    }
  }

  const navItems = [
    { id: "overview", label: "لوحة التحكم", icon: GridIcon, path: "/parent/dashboard" },
    { id: "children", label: "الأبناء", icon: UsersIcon, path: "/parent/children" },
    { id: "schedule", label: "الجدول", icon: CalendarIcon, path: "/parent/schedule" },
    { id: "messages", label: "الرسائل", icon: ChatIcon, path: "/parent/messages" },
    { id: "plans", label: "الخطط التعليمية", icon: CardIcon, path: "/parent/plans" },
    { id: "notifications", label: "الإشعارات", icon: BellIcon, path: "/parent/notifications" },
    { id: "settings", label: "الإعدادات", icon: GearIcon, path: "/parent/settings" },
  ];

  const filterTabs = [
    { id: "all", label: "الكل", icon: BellIcon, count: counts.all },
    { id: "system", label: "النظام والإدارة", icon: GearIcon, count: counts.system },
    { id: "academic", label: "الأكاديمية", icon: CardIcon, count: counts.academic },
    { id: "unread", label: "غير مقروءة", icon: BellIcon, count: counts.unread },
  ];

  const statCards = [
    { label: "إجمالي الإشعارات", value: counts.all, iconBg: "#EAF4FF", iconColor: "#123C91", icon: BellIcon },
    { label: "غير مقروءة", value: counts.unread, iconBg: "#EAF4FF", iconColor: "#123C91", icon: BellIcon },
    { label: "إشعارات أكاديمية", value: counts.academic, iconBg: "#DCFCE7", iconColor: "#16A34A", icon: CardIcon },
    { label: "إشعارات النظام والإدارة", value: counts.system, iconBg: "#FEE2E2", iconColor: "#DC2626", icon: GearIcon },
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
              const isActive = item.id === "notifications";
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

      <main className="flex-1 h-full overflow-y-auto px-8 py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="font-ibm font-semibold text-2xl leading-8 text-right text-[#123C91]">
            الإشعارات
          </h1>
          <p className="font-ibm font-normal text-base leading-6 text-right text-[#575F69]">
            متابعة جميع التحديثات والتنبيهات المهمة
          </p>
        </div>

        {/* كروت الإحصائيات */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-lg border border-[#E5E5E5] p-6 flex items-center gap-4"
            >
              <div
                className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: card.iconBg }}
              >
                <card.icon size={18} color={card.iconColor} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-ibm font-semibold text-2xl leading-8 text-[#1F2937]">{card.value}</span>
                <span className="font-ibm font-normal text-base leading-6 text-center text-[#575F69]">{card.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* قائمة الإشعارات */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1">
              <h2 className="font-ibm font-semibold text-lg text-[#1F2937]">جميع الإشعارات</h2>
              <p className="font-ibm text-sm text-[#8C9198]">تصفية وإدارة الإشعارات حسب النوع</p>
            </div>
            {counts.unread > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="shrink-0 font-ibm text-sm font-medium text-[#123C91] hover:underline"
              >
                تحديد الكل كمقروء
              </button>
            )}
          </div>

          {/* تابات الفلترة */}
          <div className="flex flex-wrap items-center gap-2">
            {filterTabs.map((tab) => {
              const isActive = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={`flex items-center gap-2 h-9 px-3 rounded-lg font-ibm text-sm font-medium transition-colors border ${
                    isActive
                      ? "bg-[#123C91] border-[#123C91] text-white"
                      : "bg-white border-[#E5E5E5] text-[#575F69] hover:bg-[#F9FAFA]"
                  }`}
                >
                  <tab.icon size={15} color={isActive ? "#FFFFFF" : "#8C9198"} />
                  {tab.label}
                  <span
                    className={`text-xs rounded-full px-1.5 ${
                      isActive ? "bg-white/20 text-white" : "bg-[#F1F1F5] text-[#575F69]"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* الإشعارات */}
          <div className="flex flex-col gap-3">
            {error ? (
              <div className="bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] rounded-lg p-4 flex items-center justify-between font-ibm text-sm">
                <span>حصل خطأ أثناء تحميل الإشعارات. حاول تاني.</span>
                <button type="button" onClick={() => window.location.reload()} className="underline font-medium">
                  إعادة المحاولة
                </button>
              </div>
            ) : loading ? (
              <div className="py-14 text-center text-sm text-[#8C9198] font-ibm">جاري تحميل الإشعارات...</div>
            ) : filteredNotifications.length === 0 ? (
              <div className="py-14 text-center text-sm text-[#8C9198] font-ibm">لا يوجد إشعارات مطابقة</div>
            ) : (
              filteredNotifications.map((n) => (
                <NotificationRow key={n.id} notification={n} onToggleRead={() => toggleRead(n)} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- صف إشعار واحد ---------- */
function NotificationRow({ notification, onToggleRead }) {
  const meta = CATEGORY_META[notification.category] || CATEGORY_META.academic;

  return (
    <div
      className={`rounded-xl p-4 flex items-start gap-3 border transition-colors ${
        notification.isRead ? "bg-white border-[#E5E5E5]" : "bg-[#EEF4FF] border-[#DCE7FF]"
      }`}
    >
      <div
        className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center"
        style={{ backgroundColor: meta.iconBg }}
      >
        <BellIcon size={17} color={meta.iconColor} />
      </div>

      <div className="flex-1 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <span className="font-ibm font-semibold text-sm text-[#1F2937]">{notification.title}</span>
          <button
            type="button"
            onClick={onToggleRead}
            className="flex items-center gap-1.5 shrink-0 font-ibm text-xs text-[#8C9198] hover:text-[#575F69] transition-colors"
          >
            {notification.isRead ? <EyeOffIcon size={14} /> : <EyeIcon size={14} color="#123C91" />}
            <span className={notification.isRead ? "" : "text-[#123C91]"}>
              {notification.isRead ? "وضع كغير مقروءة" : "وضع علامة كمقروءة"}
            </span>
          </button>
        </div>
        <p className="font-tajawal text-sm text-[#575F69] leading-6">{notification.message}</p>
        <span className="font-ibm text-xs text-[#8C9198]">{notification.timeAgo}</span>
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
function EyeIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function EyeOffIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.9 17.9A10.4 10.4 0 0 1 12 20c-7 0-11-8-11-8a18.4 18.4 0 0 1 4.2-5.2M9.9 4.2A10.6 10.6 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.2 3.1M14.1 14.1a3 3 0 1 1-4.2-4.2" />
      <path d="M1 1l22 22" />
    </svg>
  );
}