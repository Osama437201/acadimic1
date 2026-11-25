import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo-sidebar.svg";
import addChildIllustration from "../../assets/add-child-illustration.svg";
import {
  getMyStudents,
  getStudentsStatistics,
  getMyNotifications,
} from "../../services/parentService";
import { getSubjectsByGrade } from "../../services/lookupService";
import { getLocalizedName } from "../../utils/getLocalizedName";

/**
 * لوحة تحكم ولي الأمر.
 * قائمة الأبناء دلوقتي متصلة بالـ API الحقيقي (GET /parents/students).
 *
 * ⚠️ الإحصائيات العلوية (متوسط الحضور، ساعات الدراسة) وقائمة الإشعارات
 * لسه بترجع بيانات فاضية من getStudentsStatistics/getMyNotifications
 * (endpoints لسه ما اتأكدناش من شكل ردها). لما تتأكد شكل الرد، حدّث
 * الدالتين دول في parentService.js زي ما عملنا مع getMyStudents.
 */
export default function ParentDashboard() {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const parentName = storedUser?.fullName?.split(" ")?.[0] || "";

  const [children, setChildren] = useState([]);
  const [stats, setStats] = useState({
    avgAttendance: null,
    lessonsThisMonth: null,
    studyHours: null,
    childrenCount: null,
  });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const [studentsRes, statsRes, notifsRes] = await Promise.all([
          getMyStudents(),
          getStudentsStatistics(),
          getMyNotifications(),
        ]);

        const studentsList = studentsRes?.data || [];
        setChildren(studentsList);

        const s = statsRes?.data || {};
        setStats({
          avgAttendance: s.averageAttendance ?? null,
          lessonsThisMonth: s.totalLessonsThisMonth ?? null,
          studyHours: s.totalStudyHours ?? null,
          childrenCount: s.totalStudents ?? studentsList.length ?? null,
        });

        setNotifications(notifsRes?.data || []);
      } catch (err) {
        setErrorMsg(
          err.response?.data?.message || "حصل خطأ أثناء تحميل بيانات لوحة التحكم"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

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
              aria-label="طي القائمة"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors shrink-0"
            >
              <ChevronIcon size={16} color="#FFFFFF" />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = item.id === "overview";
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 h-10 w-[224px] px-2 rounded-lg transition-colors text-base font-ibm font-medium
                    ${isActive
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
          <h1 className="font-ibm font-semibold text-2xl leading-8 text-[#123C91]">
            مرحباً بك{parentName ? ` يا ${parentName}` : ""}
          </h1>
          <p className="font-ibm font-normal text-base leading-6 text-[#575F69]">
            هنا يمكنك متابعة رحلة تعلم أبنائك لحظة بلحظة.
          </p>
        </div>

        {errorMsg && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-right">
            {errorMsg}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl border border-[#E5E5E5] flex items-center justify-center py-14">
            <span className="font-ibm text-sm text-[#8C9198]">جاري التحميل...</span>
          </div>
        ) : children.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5E5E5] flex flex-col items-center justify-center gap-4 py-14 px-6 text-center">
            <div className="w-[300px] h-[136px] flex items-center justify-center">
              <img
                src={addChildIllustration}
                alt="لا يوجد أبناء مضافين"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col gap-1 items-center">
              <h2 className="font-ibm font-medium text-xl leading-8 text-[#1F2937] text-center">
                لم تقم بإضافة أي أبناء بعد
              </h2>
              <p className="font-ibm font-normal text-base leading-6 text-[#575F69] text-right max-w-[434px]">
                أضف أبناءك لبدء متابعة الحصص والواجبات والتقييمات والجدول الدراسي.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/parent/children/add")}
              className="mt-2 flex items-center justify-center gap-2 w-[160px] h-12 px-6 rounded-lg
                         bg-[#123C91] hover:bg-[#0e2f73] transition-colors
                         font-tajawal font-medium text-base leading-[22px] text-white"
            >
              إضافة ابن
            </button>
          </div>
        ) : null}

        {/* كروت الإحصائيات */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<UsersIcon size={20} color="#12C6B0" strokeWidth={1.5} />}
            iconBg="bg-[#12C6B0]/10"
            value={stats.childrenCount ?? "--"}
            label="عدد الأبناء"
          />
          <StatCard
            icon={<ClockIcon size={20} color="#123C91" />}
            iconBg="bg-[#12C6B0]/10"
            value={stats.studyHours ?? "--"}
            label="ساعات الدراسة"
          />
          <StatCard
            icon={<BookIcon size={20} />}
            iconBg="bg-[#12C6B0]/10"
            value={stats.lessonsThisMonth ?? "--"}
            label="الدروس هذا الشهر"
          />
          <StatCard
            icon={<TrendIcon size={20} />}
            iconBg="bg-[#12C6B0]/10"
            value={stats.avgAttendance != null ? `${stats.avgAttendance}%` : "--"}
            label="متوسط الحضور"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* نظرة عامة على الأبناء - مطابقة لمواصفات الفيجما بالظبط */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="font-tajawal font-medium text-base leading-4 text-[#1F2937] text-right">
                  نظرة عامة على الأبناء
                </h3>
                <p className="font-ibm font-normal text-base leading-6 text-[#8C9198] text-right">
                  الأداء والتقدم الدراسي
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/parent/children")}
                className="font-ibm font-medium text-sm text-[#1F2937] shrink-0"
              >
                عرض الكل
              </button>
            </div>

            {children.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 py-8 text-center">
                <CalendarIcon size={28} color="#C7CBD1" />
                <p className="font-medium text-sm text-[#575F69]">لا يوجد أبناء حالياً</p>
                <p className="font-ibm text-xs text-[#8C9198] max-w-[260px]">
                  أضف أبناءك أولاً لعرض الأداء والتقدم الدراسي لأبنائك.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {children.map((child) => (
                  <ChildOverviewCard key={child.id} child={child} />
                ))}
              </div>
            )}
          </div>

          {/* الإشعارات - مطابقة لمواصفات الفيجما بالظبط */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="font-tajawal font-medium text-base leading-4 text-[#1F2937] text-right">
                الإشعارات الأخيرة
              </h3>
              <button
                type="button"
                onClick={() => navigate("/parent/notifications")}
                className="font-ibm font-medium text-sm text-[#1F2937] shrink-0"
              >
                عرض الكل
              </button>
            </div>

            {notifications.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 py-8 text-center">
                <BellIcon size={28} color="#C7CBD1" />
                <p className="font-medium text-sm text-[#575F69]">لا توجد إشعارات حالياً</p>
                <p className="font-ibm text-xs text-[#8C9198] max-w-[260px]">
                  ستظهر هنا إشعارات الخاصة بأبنائك.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {notifications.map((n, idx) => (
                  <NotificationItem key={n.id || idx} notification={n} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- عنصر إشعار واحد - مطابق لمواصفات الفيجما ---------- */
function NotificationItem({ notification }) {
  // ⚠️ أسماء الحقول دي افتراضية لحد ما نتأكد من شكل رد /notifications الحقيقي
  // (لسه ما جربناش إشعار فيه بيانات فعلية). عدّل الأسماء هنا لما تبعتلي مثال حقيقي.
  const title = notification?.message || notification?.title || "-";
  const timeAgo = notification?.timeAgo || notification?.createdAt || "";

  return (
    <div
      className="flex items-center gap-2 bg-white rounded-lg overflow-hidden border-r-0"
      style={{ borderLeft: "4px solid #12C6B0" }}
    >
      <div className="w-10 h-10 shrink-0 rounded-lg bg-[#12C6B0]/10 flex items-center justify-center m-2.5">
        <BellIcon size={20} color="#12C6B0" />
      </div>
      <div className="flex flex-col gap-1 py-2 pr-2">
        <span className="font-ibm font-normal text-sm leading-4 text-[#575F69] text-right">
          {title}
        </span>
        {timeAgo && (
          <span className="font-ibm font-normal text-xs leading-4 text-[#8C9198] text-right">
            {timeAgo}
          </span>
        )}
      </div>
    </div>
  );
}
function ChildOverviewCard({ child }) {
  const fullName = child?.user?.fullName || "-";
  const gradeName = getLocalizedName(child?.grade?.name);
  const score = typeof child?.averageScore === "number" ? child.averageScore : null;
  const initial = fullName.trim().charAt(0) || "?";

  const [subjectNames, setSubjectNames] = useState([]);

  // بنجيب أسماء المواد الحقيقية (مش IDs) بنفس أسلوب Step4Review
  useEffect(() => {
    let cancelled = false;
    const gradeId = child?.grade?.id;
    const preferredIds = child?.preferredSubjects || [];

    if (!gradeId || preferredIds.length === 0) {
      setSubjectNames([]);
      return;
    }

    getSubjectsByGrade(gradeId)
      .then((allSubjects) => {
        if (cancelled) return;
        const matched = allSubjects
          .filter((s) => preferredIds.includes(s._id || s.id))
          .map((s) => getLocalizedName(s.name) || getLocalizedName(s.title));
        setSubjectNames(matched);
      })
      .catch((err) => {
        console.error("خطأ في جلب أسماء المواد للطالب:", err);
      });

    return () => {
      cancelled = true;
    };
  }, [child?.grade?.id, child?.preferredSubjects]);

  return (
    <div className="w-full bg-white border border-[#E5E5E5] rounded-2xl p-4 flex flex-col gap-4">
      {/* رأس الكارت: أفتار + الاسم والصف */}
      <div className="flex items-center gap-3">
        {/*
          ⚠️ مواصفات الفيجما فيها كمان مربع تيل صغير (40x40) وأيقونة صغيرة جوه
          الدايرة الكحلي - المحتوى بتاعهم مش واضح 100% من اللقطات (شكل الأيقونة
          مش مقروء). عملت الأفتار بالدايرة الكحلي + حرف الاسم الأول اللي واضح
          تماماً من المواصفات. لو حابب تضيف الشكل الإضافي، ابعتلي لقطة أوضح له.
        */}
        <div className="w-12 h-12 shrink-0 rounded-full bg-[#123C91] flex items-center justify-center">
          <span className="font-ibm font-semibold text-lg leading-none text-white">{initial}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-tajawal font-medium text-lg leading-6 text-[#1F2937] text-right">
            {fullName}
          </span>
          <span className="font-ibm font-normal text-sm leading-5 text-[#575F69] text-right">
            {gradeName || "-"}
          </span>
        </div>
      </div>

      {/* شريط نسبة الحضور/الأداء */}
      {score != null && (
        <div className="flex flex-col gap-1">
          <div className="w-full h-2 rounded-lg bg-[#F3F4F6] overflow-hidden">
            <div
              className="h-full bg-[#123C91] rounded-lg"
              style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-ibm font-semibold text-sm leading-6 text-[#1F2937]">{score}%</span>
            {/*
              ⚠️ التصميم بيسمي الليبل ده "نسبة الحضور"، لكن أقرب حقل حقيقي عندنا
              دلوقتي هو averageScore (متوسط الدرجات) مش نسبة حضور فعلية لكل طالب
              على حدة. سيبت النص زي التصميم بالظبط، لو الباك اند ضاف حقل حضور
              حقيقي لكل طالب، استبدل child.averageScore بيه هنا.
            */}
            <span className="font-ibm font-normal text-sm leading-5 text-[#575F69]">نسبة الحضور</span>
          </div>
        </div>
      )}

      {/* وسوم المواد */}
      {subjectNames.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {subjectNames.map((name, idx) => (
            <span
              key={idx}
              className="h-6 px-2 flex items-center rounded-full border border-[#E5E5E5] bg-white font-ibm font-medium text-xs text-[#1F2937]"
            >
              {name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- كروت الإحصائيات ---------- */
function StatCard({ icon, iconBg, value, label }) {
  return (
    <div className="bg-white rounded-lg border border-[#E5E5E5] p-6 flex items-start gap-4">
      <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center p-2.5 ${iconBg}`}>
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-ibm font-semibold text-2xl leading-8 text-[#1F2937]">{value}</span>
        <span className="font-ibm font-normal text-base leading-6 text-[#575F69]">{label}</span>
      </div>
    </div>
  );
}

/* ---------- أيقونات ---------- */
function iconProps({ size = 18, color = "currentColor", strokeWidth = 1.8 }) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
}
function GridIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </svg>
  );
}
function UsersIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17.5" cy="9" r="2.6" />
      <path d="M21.5 20c0-2.6-1.9-4.8-4.4-5.4" />
    </svg>
  );
}
function CalendarIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}
function ChatIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M21 12a8 8 0 1 1-3.4-6.5L21 4l-1 4.6A7.96 7.96 0 0 1 21 12z" />
    </svg>
  );
}
function CardIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <rect x="2.5" y="5" width="19" height="14" rx="2.2" />
      <path d="M2.5 10h19" />
    </svg>
  );
}
function BellIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}
function GearIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.4-2-3.4-2.3.9a7.7 7.7 0 0 0-2.6-1.5L14 2.5h-4l-.5 2.6a7.7 7.7 0 0 0-2.6 1.5l-2.3-.9-2 3.4 2 1.4a7.6 7.6 0 0 0 0 3l-2 1.4 2 3.4 2.3-.9c.77.66 1.65 1.17 2.6 1.5L10 21.5h4l.5-2.6a7.7 7.7 0 0 0 2.6-1.5l2.3.9 2-3.4-2-1.4z" />
    </svg>
  );
}
function LogoutIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}
function ChevronIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M11 17l-5-5 5-5" />
      <path d="M18 17l-5-5 5-5" />
    </svg>
  );
}
function TrendIcon(p) {
  return (
    <svg {...iconProps({ ...p, color: p.color || "#12B981" })}>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  );
}
function BookIcon(p) {
  return (
    <svg {...iconProps({ ...p, color: p.color || "#123C91" })}>
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5" />
      <path d="M4 4.5v17" />
    </svg>
  );
}
function ClockIcon(p) {
  return (
    <svg {...iconProps({ ...p, color: p.color || "#F97316" })}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </svg>
  );
}