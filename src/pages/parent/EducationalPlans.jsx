import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo-sidebar.svg";
import {
  getMyStudents,
  getMyStudentsSubscriptions,
} from "../../services/parentService";

/**
 * صفحة الخطط التعليمية - متصلة بالـ API الحقيقي.
 *
 * شكل الرد الفعلي لـ GET /parents/students/subscriptions (وكمان
 * GET /subscriptions) بيرجّع "subscription doc" مش "باقة واحدة" مباشرة:
 *
 * {
 *   student: null | { ... } | "id",   // ⚠️ رجع null في الاختبار حتى لو
 *                                      //    اتبعت student id وقت الإنشاء
 *   parent, createdBy, status, createdAt, updatedAt,
 *   items: [
 *     {
 *       id, subject, type, classroom, teacher,
 *       package: { name, sessions, id },
 *       totalSessions, usedSessions, remainingSessions,
 *       price, discount, finalPrice, status, isEnded, createdAt, updatedAt
 *     }
 *   ]
 * }
 *
 * يعني ممكن subscription واحد يحتوي أكتر من "باقة/مادة" (item) - فكل
 * item بيتحول لصف في جدول السجل. البيانات الحقيقية للباقة (اسمها، عدد
 * الحصص، السعر، الحالة) موجودة جوا كل item مش على مستوى الـ subscription.
 *
 * ⚠️ نقطة لازم تتأكدوا منها مع الباك اند: student رجع null في الرد رغم
 * إنه اتبعت في الـ Create. من غير ما يترجع صح (سواء id أو object فيه
 * الاسم)، مش هنقدر نعرف الاشتراك ده بتاع أي ابن، فكروت الأبناء والفلتر
 * بالاسم هيفضلوا فاضيين. الكود تحت بيتعامل مع الحالة دي بأمان (بيعرض
 * "--" أو بيسيب الكارت مش ظاهر) لحد ما يتصلح.
 */

const STATUS_META = {
  active: { label: "نشط", bg: "#DCFCE7", color: "#16A34A" },
  ending_soon: { label: "ينتهي قريبًا", bg: "#FEE2E2", color: "#DC2626" },
  pending: { label: "قيد المراجعة", bg: "#FEF3C7", color: "#D97706" },
  expired: { label: "منتهية", bg: "#FEE2E2", color: "#DC2626" },
};

/**
 * لو الحصص المتبقية قليلة (اتنين أو أقل) وحالة الاشتراك "active"، بنعرضها
 * كـ "ينتهي قريبًا" بدل "نشط" (زي التصميم). عدّل الحد (threshold) ده لو
 * الباك اند بيرجّع حالة مخصوصة لـ "ينتهي قريبًا" بدل ما نحسبها إحنا.
 */
const ENDING_SOON_THRESHOLD = 2;

function normalizeStatus(rawStatus, remainingSessions) {
  const s = (rawStatus || "").toString().trim().toLowerCase();

  if (["expired", "ended", "finished", "منتهية", "منتهي"].includes(s)) {
    return "expired";
  }
  if (["pending", "review", "قيد المراجعة"].includes(s)) {
    return "pending";
  }
  if (["active", "نشط"].includes(s) || !s) {
    if (
      typeof remainingSessions === "number" &&
      remainingSessions <= ENDING_SOON_THRESHOLD &&
      remainingSessions > 0
    ) {
      return "ending_soon";
    }
    return "active";
  }
  // أي status جديد أو غير متوقع من الباك اند بنرجعه "pending" افتراضيًا
  // بدل ما نكسر الفلتر أو نظهره غلط كـ "نشط".
  return "pending";
}

/**
 * بتاخد "student" الخام من الـ subscription doc (ممكن يبقى null، أو id
 * نصي، أو object فيه بيانات كاملة) وترجع { studentId, studentName }.
 */
function resolveStudentRef(rawStudent) {
  if (!rawStudent) return { studentId: null, studentName: null };
  if (typeof rawStudent === "string") {
    return { studentId: rawStudent, studentName: null };
  }
  return {
    studentId: rawStudent.id || rawStudent._id || null,
    studentName: rawStudent.user?.name || rawStudent.name || null,
  };
}

/**
 * subscription doc واحد ممكن يحتوي أكتر من item (باقة/مادة). الدالة دي
 * بتفرد كل item لصف مستقل يتعرض في جدول السجل.
 */
function normalizeSubscriptionItems(rawSub) {
  const { studentId, studentName } = resolveStudentRef(rawSub.student);
  const items = Array.isArray(rawSub.items) ? rawSub.items : [];

  return items.map((item) => {
    const remainingSessions = item.remainingSessions ?? null;
    const status = normalizeStatus(item.status || rawSub.status, remainingSessions);

    return {
      id: item.id || item._id,
      subscriptionId: rawSub.id || rawSub._id,
      studentId,
      // لو الاسم مش راجع من الـ API، بنسيبه "--" بدل ما نخترعه. تقدر
      // تحاول تطابقه لاحقًا مع قايمة getMyStudents() لو studentId موجود.
      studentName: studentName || "--",
      planName: item.package?.name || "--",
      totalSessions: item.totalSessions ?? item.package?.sessions ?? "--",
      usedSessions: item.usedSessions ?? "--",
      remainingSessions: remainingSessions ?? "--",
      // مفيش حقل "مدة الاشتراك" في الرد الحالي (الباقة معروضة بعدد حصص
      // بس، مش بمدة). حاطين شهر كافتراض لحد ما تتأكدوا من الباك اند لو
      // فيه حقل زمني مختلف (مثلاً على مستوى package).
      durationMonths: item.durationMonths || 1,
      startDate: formatDate(item.createdAt || rawSub.createdAt),
      amount:
        item.finalPrice != null
          ? `EGP ${item.finalPrice}`
          : item.price != null
          ? `EGP ${item.price}`
          : "--",
      status,
    };
  });
}

function formatDate(value) {
  if (!value) return "--";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "--";
  return d.toLocaleDateString("en-GB"); // DD/MM/YYYY
}

/**
 * بترتيب الأولويات لاختيار الاشتراك اللي هيتعرض في كارت الابن فوق، لو
 * عنده أكتر من اشتراك في السجل (بنفضّل نعرض الأحدث/الأهم).
 */
const STATUS_PRIORITY = { ending_soon: 0, active: 1, pending: 2, expired: 3 };

function pickCardSubscription(subs) {
  return [...subs].sort((a, b) => {
    const p = STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status];
    if (p !== 0) return p;
    return new Date(b.startDate) - new Date(a.startDate);
  })[0];
}

export default function EducationalPlans() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [studentFilter, setStudentFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [studentsRes, subsRes] = await Promise.all([
          getMyStudents(),
          getMyStudentsSubscriptions(),
        ]);
        if (cancelled) return;

        setStudents(studentsRes.data || []);
        setHistory((subsRes.data || []).flatMap(normalizeSubscriptionItems));
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  // كروت باقات الأبناء: لكل طالب من getMyStudents() نجيبله أحدث/أهم اشتراك
  // من السجل، بالمطابقة على studentId (أو الاسم كـ fallback). لو معندوش
  // أي اشتراك، ميظهرش ليه كارت.
  // ⚠️ المطابقة دي مش هتشتغل صح لحد ما الباك اند يرجّع "student" فعلي في
  // رد الاشتراكات (دلوقتي بيرجع null) - راجع الملاحظة فوق في أول الملف.
  const childrenPlans = useMemo(() => {
    return students
      .map((student) => {
        const studentId = student.id || student._id;
        const studentSubs = history.filter(
          (h) => h.studentId === studentId || h.studentName === student.user?.name || h.studentName === student.name
        );
        if (studentSubs.length === 0) return null;

        const chosen = pickCardSubscription(studentSubs);
        return {
          studentId,
          studentName: student.user?.name || student.name || chosen.studentName,
          gradeName: student.grade?.name || student.gradeName || "--",
          status: chosen.status,
          planName: chosen.planName,
          totalSessions: chosen.totalSessions,
          remainingSessions: chosen.remainingSessions,
        };
      })
      .filter(Boolean);
  }, [students, history]);

  const studentNameOptions = useMemo(
    () => [...new Set(history.map((h) => h.studentName).filter((n) => n && n !== "--"))],
    [history]
  );

  const filteredHistory = useMemo(() => {
    return history.filter((h) => {
      const matchesStatus = statusFilter === "all" || h.status === statusFilter;
      const matchesStudent = studentFilter === "all" || h.studentName === studentFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        h.studentName.toLowerCase().includes(q) ||
        h.planName.toLowerCase().includes(q);
      return matchesStatus && matchesStudent && matchesSearch;
    });
  }, [history, statusFilter, studentFilter, search]);

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
              const isActive = item.id === "plans";
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
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="font-ibm font-semibold text-2xl leading-8 text-[#123C91]">
              الخطط التعليمية
            </h1>
            <p className="font-ibm text-base text-[#575F69]">
              قم بمتابعة وتجديد باقات تعليم أبنائك في مكان واحد
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/parent/children/add")}
            className="h-11 px-5 rounded-lg bg-[#123C91] text-white font-ibm font-medium text-sm hover:bg-[#0e2f73] transition-colors"
          >
            إضافة ابن
          </button>
        </div>

        {error && (
          <div className="bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] rounded-lg p-4 flex items-center justify-between font-ibm text-sm">
            <span>حصل خطأ أثناء تحميل بيانات الاشتراكات. حاول تاني.</span>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="underline font-medium"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* كروت باقات الأبناء */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <UsersIcon size={16} color="#575F69" />
            <span className="font-ibm font-medium text-sm text-[#575F69]">باقة الأبناء</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : childrenPlans.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 text-center text-sm text-[#8C9198] font-ibm">
              لا يوجد اشتراكات نشطة لأبنائك حاليًا
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {childrenPlans.map((plan) => (
                <ChildPlanCard key={plan.studentId} plan={plan} />
              ))}
            </div>
          )}
        </div>

        {/* الفلاتر */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 border border-[#E5E5E5] rounded-lg px-3 bg-white text-sm text-[#1F2937] focus:outline-none"
          >
            <option value="all">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="pending">قيد المراجعة</option>
            <option value="expired">منتهية</option>
            <option value="ending_soon">ينتهي قريبًا</option>
          </select>

          <select
            value={studentFilter}
            onChange={(e) => setStudentFilter(e.target.value)}
            className="h-11 border border-[#E5E5E5] rounded-lg px-3 bg-white text-sm text-[#1F2937] focus:outline-none"
          >
            <option value="all">جميع الأبناء</option>
            {studentNameOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن ابن أو باقة"
              className="w-full h-11 border border-[#E5E5E5] rounded-lg pr-9 pl-3 bg-[#F9FAFA] text-sm text-[#1F2937] text-right focus:outline-none focus:border-[#1E3A8A] transition-colors"
            />
            <SearchIcon size={15} color="#8C9198" className="absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* جدول سجل الاشتراكات */}
        <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
          {loading ? (
            <div className="py-14 text-center text-sm text-[#8C9198] font-ibm">جاري تحميل السجل...</div>
          ) : filteredHistory.length === 0 ? (
            <div className="py-14 text-center text-sm text-[#8C9198]">لا يوجد سجل اشتراكات مطابق</div>
          ) : (
            <table className="w-full text-right">
              <thead>
                <tr>
                  <th className="py-3 px-4 font-ibm font-medium text-sm text-[#575F69] text-right">الابن</th>
                  <th className="py-3 px-4 font-ibm font-medium text-sm text-[#575F69] text-center">الباقة</th>
                  <th className="py-3 px-4 font-ibm font-medium text-sm text-[#575F69] text-center">إجمالي الحصص</th>
                  <th className="py-3 px-4 font-ibm font-medium text-sm text-[#575F69] text-center">المستلم</th>
                  <th className="py-3 px-4 font-ibm font-medium text-sm text-[#575F69] text-center">المتبقي</th>
                  <th className="py-3 px-4 font-ibm font-medium text-sm text-[#575F69] text-center">مدة الاشتراك</th>
                  <th className="py-3 px-4 font-ibm font-medium text-sm text-[#575F69] text-center">تاريخ البدء</th>
                  <th className="py-3 px-4 font-ibm font-medium text-sm text-[#575F69] text-center">المبلغ</th>
                  <th className="py-3 px-4 font-ibm font-medium text-sm text-[#575F69] text-center">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((row) => (
                  <tr key={row.id} className="border-t border-[#E5E5E5]">
                    <td className="py-4 px-4 font-tajawal font-medium text-sm text-[#1F2937] text-right">
                      {row.studentName}
                    </td>
                    <td className="py-4 px-4 font-ibm text-sm text-[#575F69] text-center">{row.planName}</td>
                    <td className="py-4 px-4 font-ibm text-sm text-[#575F69] text-center">
                      {row.totalSessions === "--" ? "--" : `${row.totalSessions} حصص`}
                    </td>
                    <td className="py-4 px-4 font-ibm text-sm text-[#575F69] text-center">
                      {row.usedSessions === "--" ? "--" : `${row.usedSessions} حصص`}
                    </td>
                    <td className="py-4 px-4 font-ibm font-medium text-sm text-[#123C91] text-center">
                      {row.remainingSessions === "--" ? "--" : `${row.remainingSessions} حصص`}
                    </td>
                    <td className="py-4 px-4 font-ibm text-sm text-[#575F69] text-center">
                      {row.durationMonths} {row.durationMonths === 1 ? "شهر" : "أشهر"}
                    </td>
                    <td className="py-4 px-4 font-ibm text-sm text-[#575F69] text-center">{row.startDate}</td>
                    <td className="py-4 px-4 font-ibm text-sm text-[#575F69] text-center">{row.amount}</td>
                    <td className="py-4 px-4 text-center">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

/* ---------- كارت باقة ابن واحد ---------- */
function ChildPlanCard({ plan }) {
  const meta = STATUS_META[plan.status] || STATUS_META.active;
  const initial = (plan.studentName || "").trim().charAt(0) || "؟";
  const accentColor = plan.status === "ending_soon" ? "#DC2626" : "#12C6B0";

  return (
    <div
      className="bg-white rounded-2xl p-4 flex flex-col gap-4 border-r-4"
      style={{ borderRightColor: accentColor, border: "1px solid #E5E5E5", borderRightWidth: 4, borderRightColor: accentColor }}
    >
      <div className="flex items-start justify-between">
        <span
          className="h-6 px-2 flex items-center rounded-full font-ibm font-medium text-xs"
          style={{ backgroundColor: meta.bg, color: meta.color }}
        >
          {meta.label}
        </span>
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end">
            <span className="font-tajawal font-medium text-sm text-[#1F2937]">{plan.studentName}</span>
            <span className="font-ibm text-xs text-[#8C9198]">{plan.gradeName}</span>
          </div>
          <div className="w-9 h-9 shrink-0 rounded-full bg-[#123C91] flex items-center justify-center text-white font-semibold text-sm">
            {initial}
          </div>
        </div>
      </div>

      <div className="bg-[#F9FAFA] rounded-lg p-3 flex items-center justify-between">
        <div className="flex flex-col items-end gap-1">
          <span className="font-ibm text-xs text-[#8C9198]">
            {plan.remainingSessions === "--" ? "--" : `باقي ${plan.remainingSessions} حصص`}
          </span>
          <span className="font-ibm font-medium text-sm text-[#1F2937]">{plan.planName}</span>
        </div>
        <span className="font-ibm text-xs text-[#8C9198]">الباقة الحالية</span>
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 flex flex-col gap-4 border border-[#E5E5E5] animate-pulse">
      <div className="flex items-start justify-between">
        <div className="h-6 w-16 rounded-full bg-[#E5E5E5]" />
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end gap-2">
            <div className="h-3 w-20 bg-[#E5E5E5] rounded" />
            <div className="h-2 w-24 bg-[#E5E5E5] rounded" />
          </div>
          <div className="w-9 h-9 rounded-full bg-[#E5E5E5]" />
        </div>
      </div>
      <div className="h-14 bg-[#F9FAFA] rounded-lg" />
    </div>
  );
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.active;
  return (
    <span
      className="h-6 px-3 inline-flex items-center rounded-full font-ibm font-bold text-xs"
      style={{ backgroundColor: meta.bg, color: meta.color }}
    >
      {meta.label}
    </span>
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