import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";

/**
 * صفحة "الحصص / تفاصيل المجموعة"
 */

const STATUS_META = {
  upcoming: { label: "قادمة", bg: "#EAF4FF", color: "#123C91" },
  live: { label: "مباشرة الآن", bg: "#DCFCE7", color: "#16A34A" },
  cancelled: { label: "ملغاة", bg: "#FEE2E2", color: "#DC2626" },
  done: { label: "منتهية", bg: "#F1F1F5", color: "#575F69" },
};

const MOCK_SESSIONS = [
  {
    id: 12,
    title: "مراجعة عامة 2",
    date: "الجمعة 20 أبريل 2026",
    startTime: "03:00 PM",
    duration: "90 دقيقة",
    attendance: "--",
    absence: "--",
    status: "upcoming",
  },
  {
    id: 11,
    title: "مراجعة عامة 1",
    date: "الجمعة 25 أبريل 2026",
    startTime: "03:00 PM",
    duration: "90 دقيقة",
    attendance: "--",
    absence: "--",
    status: "upcoming",
  },
  {
    id: 10,
    title: "الأعداد المركبة",
    date: "الأحد 28 أبريل 2026",
    startTime: "06:30 PM",
    duration: "60 دقيقة",
    attendance: "--",
    absence: "--",
    status: "upcoming",
  },
  {
    id: 9,
    title: "الهندسة الفراغية",
    date: "الثلاثاء 05 مايو 2026",
    startTime: "07:00 PM",
    duration: "45 دقيقة",
    attendance: "25",
    absence: "0",
    status: "done",
  },
  {
    id: 8,
    title: "التفاضل والتكامل",
    date: "الخميس 07 مايو 2026",
    startTime: "05:00 PM",
    duration: "60 دقيقة",
    attendance: "23",
    absence: "1",
    status: "done",
  },
  {
    id: 7,
    title: "الدوال المثلثية",
    date: "الأحد 10 مايو 2026",
    startTime: "04:00 PM",
    duration: "50 دقيقة",
    attendance: "20",
    absence: "2",
    status: "done",
  },
  {
    id: 6,
    title: "الميل الحسابي",
    date: "السبت 24 مايو 2026",
    startTime: "06:00 PM",
    duration: "60 دقيقة",
    attendance: "22",
    absence: "0",
    status: "done",
  },
  {
    id: 5,
    title: "العدد الأول",
    date: "السبت 24 مايو 2026",
    startTime: "11:00 AM",
    duration: "40 دقيقة",
    attendance: "19",
    absence: "3",
    status: "done",
  },
  {
    id: 4,
    title: "المتتاليات",
    date: "السبت 24 مايو 2026",
    startTime: "05:30 PM",
    duration: "50 دقيقة",
    attendance: "--",
    absence: "--",
    status: "cancelled",
  },
  {
    id: 3,
    title: "التباديل والتوافيق",
    date: "اليوم 17 يونيو 2026",
    startTime: "06:00 PM",
    duration: "60 دقيقة",
    attendance: "21",
    absence: "1",
    status: "live",
  },
  {
    id: 2,
    title: "المصفوفات_1",
    date: "غداً 18 يونيو 2026",
    startTime: "08:30 PM",
    duration: "40 دقيقة",
    attendance: "--",
    absence: "--",
    status: "upcoming",
  },
  {
    id: 1,
    title: "المصفوفات_2",
    date: "السبت 21 يونيو 2026",
    startTime: "06:00 PM",
    duration: "45 دقيقة",
    attendance: "--",
    absence: "--",
    status: "upcoming",
  },
];

const PER_PAGE = 6;

export default function GroupDetails() {
  const navigate = useNavigate();

  const { groupId } = useParams();

  const [sessions] = useState(MOCK_SESSIONS);
  const [timeFilter, setTimeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const stats = useMemo(() => {
    const cancelledCount = sessions.filter(
      (s) => s.status === "cancelled",
    ).length;
    const doneCount = sessions.filter((s) => s.status === "done").length;
    const upcomingCount = sessions.filter(
      (s) => s.status === "upcoming" || s.status === "live",
    ).length;

    return [
      {
        label: "إجمالي الحصص",
        value: sessions.length,
        iconBg: "#EAFBF7",
        iconColor: "#0D9488",
        icon: VideoIcon,
      },
      {
        label: "الحصص القادمة",
        value: upcomingCount,
        iconBg: "#EAF4FF",
        iconColor: "#123C91",
        icon: CalendarCardIcon,
      },
      {
        label: "الحصص المكتملة",
        value: doneCount,
        iconBg: "#F1F1F5",
        iconColor: "#575F69",
        icon: CheckCircleCardIcon,
      },
      {
        label: "الحصص الملغاة",
        value: cancelledCount,
        iconBg: "#FEE2E2",
        iconColor: "#DC2626",
        icon: XCircleCardIcon,
      },
    ];
  }, [sessions]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredSessions = useMemo(() => {
    let result = sessions.filter((s) => {
      if (search && !s.title.includes(search)) return false;
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (
        timeFilter === "upcoming" &&
        s.status !== "upcoming" &&
        s.status !== "live"
      )
        return false;
      if (
        timeFilter === "past" &&
        s.status !== "done" &&
        s.status !== "cancelled"
      )
        return false;
      return true;
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [sessions, search, timeFilter, statusFilter, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(filteredSessions.length / PER_PAGE));
  const pagedSessions = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filteredSessions.slice(start, start + PER_PAGE);
  }, [filteredSessions, page]);

  return (
    <div
      dir="rtl"
      className="h-screen w-full flex bg-[#F9F9FF] overflow-hidden font-ibm"
    >
      {/* الشريط الجانبي Sidebar */}
      <TeacherSidebar activeId="groups" />

      {/* المحتوى الرئيسي Main Content */}
      <main className="flex-1 h-full overflow-y-auto px-8 py-8 flex flex-col gap-6">
        {/* الهيدر والعنوان */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1 text-right">
            <h1 className="font-ibm font-semibold text-2xl leading-8 text-[#123C91]">
              مجموعة الرياضيات A
            </h1>
            <p className="font-ibm text-base text-[#575F69]">
              إدارة كاملة لحصص هذه المجموعة: الجدول، الحضور، الواجبات،
              والتقييمات في مكان واحد.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                navigate(`/teacher/groups/${groupId}/lessons/create-session`)
              }
              className="h-11 px-5 rounded-lg bg-[#123C91] text-white font-ibm font-medium text-sm hover:bg-[#0F2F73] transition-colors"
            >
              إنشاء حصة جديدة
            </button>
            <button
              type="button"
              onClick={() =>
                navigate(`/teacher/groups/${groupId}/schedule/create`)
              }
              className="h-11 px-5 rounded-lg border border-[#E5E5E5] text-[#1F2937] font-ibm font-medium text-sm hover:bg-[#F9F9FF] transition-colors bg-white"
            >
              إنشاء جدول
            </button>
          </div>
        </div>

        {/* كروت الإحصائيات (النصوص يمين والأيقونة يسار) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((card) => (
            <div
              key={card.label}
              className="bg-white p-[24px] rounded-[8px] border border-[#E5E5E5] flex flex-col items-start justify-center shadow-sm"
              style={{ height: "112px" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-[32px] h-[32px] rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: card.iconBg,
                    color: card.iconColor,
                  }}
                >
                  <card.icon size={16} color={card.iconColor} />
                </div>
                <span className="font-ibm text-[24px] leading-[32px] font-semibold text-[#1F2937]">
                  {card.value}
                </span>
              </div>

              <span className="font-ibm text-[16px] leading-[24px] text-[#575F69] mt-1 text-right">
                {card.label}
              </span>
            </div>
          ))}
        </div>

        {/* أدوات البحث والفلترة */}
        <div
          className="flex items-center gap-4 bg-white rounded-2xl px-6 border-b border-[#E5E5E5]"
          style={{
            height: "88px",
            boxShadow: "0px 0px 4px 0px rgba(0,0,0,0.12)",
          }}
        >
          {/* حقل البحث */}
          <div className="flex-1 relative h-12">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="بحث عن حصة..."
              className="w-full h-12 pr-10 pl-4 rounded-lg border border-[#E5E5E5] bg-[#F9FAFA] font-ibm text-sm text-[#1F2937] placeholder:text-[#575F69] outline-none"
            />
            <SearchIcon
              size={17}
              color="#1F2937"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            />
          </div>

          {/* فلتر الحالة */}
          <div className="relative w-[280px] h-12 shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="appearance-none w-full h-12 pr-4 pl-9 rounded-lg border border-[#E5E5E5] bg-[#F9FAFA] font-ibm text-sm text-[#1F2937] outline-none cursor-pointer"
            >
              <option value="all">جميع الحالات</option>
              <option value="upcoming">قادمة</option>
              <option value="live">مباشرة الآن</option>
              <option value="done">منتهية</option>
              <option value="cancelled">ملغاة</option>
            </select>
            <ChevronDownIcon
              size={12}
              color="#575F69"
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          </div>

          {/* فلتر الوقت */}
          <div className="relative w-[280px] h-12 shrink-0">
            <select
              value={timeFilter}
              onChange={(e) => {
                setTimeFilter(e.target.value);
                setPage(1);
              }}
              className="appearance-none w-full h-12 pr-4 pl-9 rounded-lg border border-[#E5E5E5] bg-[#F9FAFA] font-ibm text-sm text-[#1F2937] outline-none cursor-pointer"
            >
              <option value="all">جميع الأوقات</option>
              <option value="upcoming">القادمة</option>
              <option value="past">السابقة</option>
            </select>
            <ChevronDownIcon
              size={12}
              color="#575F69"
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          </div>
        </div>

        {/* جدول الحصص */}
        <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-[#F9FAFA] border-b border-[#E5E5E5]">
                <th
                  onClick={() => handleSort("title")}
                  className="font-ibm text-xs font-medium text-[#8C9198] px-4 py-3 cursor-pointer select-none hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span>عنوان الحصة</span>
                    <SortIcon size={12} color="#8C9198" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("date")}
                  className="font-ibm text-xs font-medium text-[#8C9198] px-4 py-3 cursor-pointer select-none hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span>التاريخ</span>
                    <SortIcon size={12} color="#8C9198" />
                  </div>
                </th>
                <th className="font-ibm text-xs font-medium text-[#8C9198] px-4 py-3">
                  الوقت
                </th>
                <th className="font-ibm text-xs font-medium text-[#8C9198] px-4 py-3">
                  المدة
                </th>
                <th className="font-ibm text-xs font-medium text-[#8C9198] px-4 py-3">
                  حضور
                </th>
                <th className="font-ibm text-xs font-medium text-[#8C9198] px-4 py-3">
                  غياب
                </th>
                <th
                  onClick={() => handleSort("status")}
                  className="font-ibm text-xs font-medium text-[#8C9198] px-4 py-3 cursor-pointer select-none hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span>الحالة</span>
                    <SortIcon size={12} color="#8C9198" />
                  </div>
                </th>
                <th className="font-ibm text-xs font-medium text-[#8C9198] px-4 py-3">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {pagedSessions.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-8 font-ibm text-sm text-[#8C9198]"
                  >
                    لا توجد حصص مطابقة
                  </td>
                </tr>
              ) : (
                pagedSessions.map((s) => {
                  const status = STATUS_META[s.status] || null;
                  return (
                    <tr
                      key={s.id}
                      className="border-b border-[#F1F1F5] last:border-0 hover:bg-[#F9FAFA] transition-colors"
                    >
                      <td className="font-ibm text-sm font-medium text-[#1F2937] px-4 py-3">
                        {s.title}
                      </td>
                      <td className="font-ibm text-sm text-[#575F69] px-4 py-3">
                        {s.date}
                      </td>
                      <td className="font-ibm text-sm text-[#575F69] px-4 py-3">
                        {s.startTime}
                      </td>
                      <td className="font-ibm text-sm text-[#575F69] px-4 py-3">
                        {s.duration}
                      </td>
                      <td className="font-ibm text-sm text-[#575F69] px-4 py-3">
                        {s.attendance}
                      </td>
                      <td className="font-ibm text-sm text-[#575F69] px-4 py-3">
                        {s.absence}
                      </td>
                      <td className="px-4 py-3">
                        {status ? (
                          <span
                            className="h-6 px-2.5 inline-flex items-center rounded-full font-ibm text-xs font-medium"
                            style={{
                              backgroundColor: status.bg,
                              color: status.color,
                            }}
                          >
                            {status.label}
                          </span>
                        ) : (
                          <span className="font-ibm text-sm text-[#8C9198]">
                            --
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/teacher/groups/sessions/${s.id}`, {
                                state: { session: s },
                              })
                            }
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F1F1F5] transition-colors"
                          >
                            <EyeIcon size={20} color="#575F69" />
                          </button>
                          <button
                            type="button"
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F1F1F5] transition-colors"
                          >
                            <PencilIcon size={20} color="#123C91" />
                          </button>
                          <button
                            type="button"
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#FEE2E2] transition-colors"
                          >
                            <TrashIcon size={20} color="#DC2626" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredSessions.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-8 h-8 rounded-lg border border-[#E5E5E5] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F9F9FF] transition-colors"
              >
                <ChevronRightIcon size={14} color="#575F69" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg font-ibm text-sm font-medium transition-colors ${
                    p === page
                      ? "bg-[#123C91] text-white"
                      : "text-[#575F69] hover:bg-[#F1F1F5]"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="w-8 h-8 rounded-lg border border-[#E5E5E5] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F9F9FF] transition-colors"
              >
                <ChevronLeftIcon size={14} color="#575F69" />
              </button>
            </div>

            <span className="font-ibm text-sm text-[#8C9198]">
              عرض {pagedSessions.length} من اصل {filteredSessions.length} حصة
            </span>
          </div>
        )}
      </main>
    </div>
  );
}

/* ---------- أيقونات SVG ---------- */
function iconProps({
  size = 18,
  color = "currentColor",
  strokeWidth = 1.8,
  className = "",
}) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
  };
}

function CalendarCardIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
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
function ChevronRightIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
function EyeIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  );
}
function PencilIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M4 20l4.2-.9L19 8.3a2 2 0 0 0 0-2.8l-.5-.5a2 2 0 0 0-2.8 0L5 15.8 4 20z" />
      <path d="M14 6.5l3 3" />
    </svg>
  );
}
function TrashIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0h10l-.8 12.2a2 2 0 0 1-2 1.8H8.8a2 2 0 0 1-2-1.8L6 7z" />
    </svg>
  );
}
function SearchIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}
function VideoIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <rect x="2" y="6" width="14" height="12" rx="2.5" />
      <path d="M16 10.5l6-4v11l-6-4" />
    </svg>
  );
}
function CheckCircleCardIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="8 12.5 11 15.5 16 9" />
    </svg>
  );
}
function XCircleCardIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}
function SortIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
    </svg>
  );
}
function ChevronDownIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}