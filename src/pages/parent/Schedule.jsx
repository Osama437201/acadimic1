import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo-sidebar.svg";
import { getMySchedule } from "../../services/parentService";
import { getLocalizedName } from "../../utils/getLocalizedName";

/**
 * صفحة جدول حصص الأبناء.
 *
 * ✅ مربوطة فعليًا بـ GET /schedule/ (تم تأكيدها من بوستمان). الرد بيرجع
 * مصفوفة أيام الشهر الحالي، كل يوم فيه { date, dayName, lessons: [] }.
 *
 * ⚠️ نقط لسه معلّقة (اتأكدنا منها فعليًا مش تخمين):
 * - الـ endpoint مفيهوش query params لشهر/سنة، فبيرجع الشهر الحالي بس.
 *   زرار "الشهر اللي فات/الجاي" معطل حاليًا لحد ما الباك اند يضيف الدعم ده.
 * - كل الأيام راجعة "lessons": [] في كل الاختبارات لحد دلوقتي (مفيش ولا
 *   حصة واحدة حقيقية في النظام). يعني شكل بيانات "الحصة" (subject, teacher,
 *   time, duration, status) لسه غير مؤكد. لما تتوفر حصة حقيقية، ابعتها
 *   وهنظبط SessionCard على الحقول الصح.
 */

// ترتيب أعمدة الأسبوع زي التصميم (الجمعة يمين ... السبت شمال)
const WEEKDAYS_RTL = [
  "السبت",
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
];
// dayName زي ما بيرجع من الـ API (بالإنجليزي lowercase) لعمود العرض
const DAYNAME_TO_COLUMN = {
  saturday: 0,
  sunday: 1,
  monday: 2,
  tuesday: 3,
  wednesday: 4,
  thursday: 5,
  friday: 6,
};

const ARABIC_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

const STATUS_META = {
  upcoming: { label: "قادم", bg: "#F3F4F6", color: "#575F69" },
  completed: { label: "مكمل", bg: "#DCFCE7", color: "#16A34A" },
  cancelled: { label: "ملغي", bg: "#FEE2E2", color: "#DC2626" },
};

export default function Schedule() {
  const navigate = useNavigate();

  const [scheduleDays, setScheduleDays] = useState([]); // [{date, dayName, lessons}]
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchSchedule();
  }, []);

  async function fetchSchedule() {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await getMySchedule();
      const days = res?.data || [];
      setScheduleDays(days);
      // نختار تلقائيًا أول يوم فيه حصص، أو النهارده لو موجود، أو أول يوم في الرد
      const todayKey = new Date().toISOString().slice(0, 10);
      const dayWithLessons = days.find((d) => (d.lessons || []).length > 0);
      const todayEntry = days.find((d) => d.date === todayKey);
      setSelectedDate(
        dayWithLessons?.date || todayEntry?.date || days[0]?.date || null,
      );
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "حصل خطأ أثناء تحميل الجدول");
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(() => {
    const allLessons = scheduleDays.flatMap((d) => d.lessons || []);
    const completed = allLessons.filter((l) => l.status === "completed");
    const upcoming = allLessons.filter((l) => l.status === "upcoming");
    const totalMinutes = completed.reduce(
      (sum, l) => sum + (l.durationMinutes || 0),
      0,
    );
    return {
      totalHours: Math.round((totalMinutes / 60) * 10) / 10,
      completedCount: completed.length,
      upcomingCount: upcoming.length,
    };
  }, [scheduleDays]);

  // بناء شبكة الكالندر من بيانات الـ API الحقيقية (مش محسوبة يدويًا)
  const calendarWeeks = useMemo(() => {
    if (scheduleDays.length === 0) return [];

    const firstEntry = scheduleDays[0];
    const firstColumn = DAYNAME_TO_COLUMN[firstEntry.dayName] ?? 0;

    const cells = [];
    for (let i = 0; i < firstColumn; i++) {
      cells.push(null); // خانات فاضية قبل بداية الشهر
    }
    scheduleDays.forEach((day) => cells.push(day));
    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }
    return weeks;
  }, [scheduleDays]);

  const currentMonthLabel = useMemo(() => {
    if (scheduleDays.length === 0) return "";
    const d = new Date(scheduleDays[0].date);
    return `${ARABIC_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  }, [scheduleDays]);

  const selectedDay = scheduleDays.find((d) => d.date === selectedDate);
  const selectedDayLabel = useMemo(() => {
    if (!selectedDate) return "";
    const d = new Date(selectedDate);
    return `${WEEKDAYS_RTL[DAYNAME_TO_COLUMN[selectedDay?.dayName] ?? 0]} ${d.getDate()} ${ARABIC_MONTHS[d.getMonth()]}`;
  }, [selectedDate, selectedDay]);

  const navItems = [
    {
      id: "overview",
      label: "لوحة التحكم",
      icon: GridIcon,
      path: "/parent/dashboard",
    },
    {
      id: "children",
      label: "الأبناء",
      icon: UsersIcon,
      path: "/parent/children",
    },
    {
      id: "schedule",
      label: "الجدول",
      icon: CalendarIcon,
      path: "/parent/schedule",
    },
    {
      id: "messages",
      label: "الرسائل",
      icon: ChatIcon,
      path: "/parent/messages",
    },
    {
      id: "plans",
      label: "الخطط التعليمية",
      icon: CardIcon,
      path: "/parent/plans",
    },
    {
      id: "notifications",
      label: "الإشعارات",
      icon: BellIcon,
      path: "/parent/notifications",
    },
    {
      id: "settings",
      label: "الإعدادات",
      icon: GearIcon,
      path: "/parent/settings",
    },
  ];

  return (
    <div
      dir="rtl"
      className="h-screen w-full flex bg-[#F9F9FF] overflow-hidden font-tajawal"
    >
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
              const isActive = item.id === "schedule";
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
                  <item.icon
                    size={20}
                    color={isActive ? "#123C91" : "#FFFFFF"}
                  />
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
            جدول حصص ابنائك
          </h1>
          <p className="font-ibm font-normal text-base leading-6 text-[#575F69]">
            متابعة حصص ابنائك القادمة وسجل حصصهم السابقة
          </p>
        </div>

        {errorMsg && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-right">
            {errorMsg}
          </div>
        )}

        {/* كروت الإحصائيات */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={<CardIcon size={20} color="#12C6B0" />}
            iconBg="bg-[#12C6B0]/10"
            value={stats.upcomingCount}
            label="الحصص القادمة"
          />
          <StatCard
            icon={<CheckIcon size={20} color="#123C91" />}
            iconBg="bg-[#123C91]/10"
            value={stats.completedCount}
            label="الحصص المكتملة"
          />
          <StatCard
            icon={<ClockIcon size={20} />}
            iconBg="bg-[#12C6B0]/10"
            value={stats.totalHours}
            label="إجمالي الساعات"
          />
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-[#E5E5E5] flex items-center justify-center py-14">
            <span className="font-ibm text-sm text-[#8C9198]">
              جاري التحميل...
            </span>
          </div>
        ) : (
          <>
            {/* الكالندر */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="font-tajawal font-medium text-base text-[#1F2937]">
                  جدول الحصص
                </span>
                <div className="flex items-center gap-2">
                  {/* ⚠️ معطلة مؤقتًا: الـ API لسه مش بيدعم تحديد شهر/سنة */}
                  <button
                    type="button"
                    disabled
                    title="لسه غير مدعوم من الـ API"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#C7CBD1] cursor-not-allowed"
                  >
                    <ChevronRightIcon size={14} />
                  </button>
                  <span className="font-ibm font-medium text-sm text-[#1F2937]">
                    {currentMonthLabel}
                  </span>
                  <button
                    type="button"
                    disabled
                    title="لسه غير مدعوم من الـ API"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#C7CBD1] cursor-not-allowed"
                  >
                    <ChevronLeftIcon size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center">
                {WEEKDAYS_RTL.map((label) => (
                  <span
                    key={label}
                    className="font-ibm font-medium text-sm text-[#8C9198]"
                  >
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                {calendarWeeks.map((week, wIdx) => (
                  <div key={wIdx} className="grid grid-cols-7 gap-2">
                    {week.map((day, cIdx) => {
                      if (!day) return <div key={cIdx} className="h-11" />;
                      const isSelected = day.date === selectedDate;
                      const hasLessons = (day.lessons || []).length > 0;
                      const dayNum = new Date(day.date).getDate();
                      return (
                        <button
                          type="button"
                          key={day.date}
                          onClick={() => setSelectedDate(day.date)}
                          className={`h-11 rounded-lg flex flex-col items-center justify-center gap-0.5 font-ibm text-sm transition-colors text-[#1F2937]
                            ${isSelected ? "bg-[#123C91] text-white font-semibold" : "hover:bg-gray-50"}
                          `}
                        >
                          <span>{dayNum}</span>
                          {hasLessons && !isSelected && (
                            <span className="w-1 h-1 rounded-full bg-[#123C91]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* حصص اليوم المحدد */}
            {selectedDate && (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-ibm font-medium text-sm text-[#575F69]">
                    {(selectedDay?.lessons || []).length} حصة
                  </span>
                  <h3 className="font-tajawal font-medium text-base text-[#1F2937]">
                    حصص {selectedDayLabel}
                  </h3>
                </div>

                {(selectedDay?.lessons || []).length === 0 ? (
                  <div className="bg-white rounded-2xl border border-[#E5E5E5] flex flex-col items-center justify-center gap-2 py-10 text-center">
                    <CalendarIcon size={28} color="#C7CBD1" />
                    <p className="font-medium text-sm text-[#575F69]">
                      لا يوجد حصص في هذا اليوم
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedDay.lessons.map((lesson, idx) => (
                      <SessionCard key={lesson.id || idx} lesson={lesson} />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

/* ---------- كارت حصة واحدة ----------
   ⚠️ الحقول هنا (subjectName, teacherName, startTime, durationMinutes,
   studentName, status) مبنية على تخمين منطقي مش على رد حقيقي - لأن كل
   الحصص راجعة فاضية لحد دلوقتي. لما تتوفر حصة حقيقية، ابعتها وهنظبط
   الحقول دي على أسامي صحيحة. */
function SessionCard({ lesson }) {
  const meta = STATUS_META[lesson?.status] || STATUS_META.upcoming;
  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <span
          className="h-6 px-2 flex items-center rounded-full font-ibm font-medium text-xs"
          style={{ backgroundColor: meta.bg, color: meta.color }}
        >
          {meta.label}
        </span>
        <span className="font-tajawal font-medium text-base text-[#1F2937] text-right">
          {lesson?.subjectName || lesson?.subject?.name || "--"}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1 text-[#575F69]">
          <ClockIcon size={14} />
          <span className="font-ibm">
            {lesson?.startTime || "--"} - {lesson?.durationMinutes || "--"} د
          </span>
        </div>
        <div className="flex items-center gap-1 text-[#575F69]">
          <UsersIcon size={14} />
          <span className="font-ibm">{lesson?.studentName || "--"}</span>
        </div>
      </div>

      {lesson?.teacherName && (
        <div className="flex items-center gap-1 text-[#8C9198] text-xs">
          <UserAvatarIcon size={14} />
          <span className="font-ibm">{lesson.teacherName}</span>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, iconBg, value, label }) {
  return (
    <div className="bg-white rounded-lg border border-[#E5E5E5] p-6 flex items-start gap-4">
      <div
        className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center p-2.5 ${iconBg}`}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-ibm font-semibold text-2xl leading-8 text-[#1F2937]">
          {value}
        </span>
        <span className="font-ibm font-normal text-base leading-6 text-[#575F69]">
          {label}
        </span>
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
function ClockIcon(p) {
  return (
    <svg {...iconProps({ ...p, color: p.color || "#F97316" })}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </svg>
  );
}
function CheckIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
function ChevronRightIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
function ChevronLeftIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function UserAvatarIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  );
}
