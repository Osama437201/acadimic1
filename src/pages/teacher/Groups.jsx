import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, BookOpen } from "lucide-react";
import TeacherSidebar from "./TeacherSidebar";

// حالات المجموعات والألوان الخاصة بها
const STATUS_META = {
  active: { label: "نشطة", bg: "rgba(0, 166, 62, 0.15)", color: "#00A63E" },
  suspended: {
    label: "معلقة",
    bg: "rgba(211, 47, 47, 0.15)",
    color: "#D32F2F",
  },
  registration: {
    label: "قيد التسجيل",
    bg: "rgba(245, 158, 11, 0.15)",
    color: "#F59E0B",
  },
};

// بيانات ستاتيك للمجموعات
const MOCK_GROUPS = [
  {
    id: 1,
    title: "مجموعة الرياضيات A",
    gradeSubject: "الصف الثالث الثانوي • الرياضيات",
    studentsText: "22 / 30 طالباً",
    infoText: "الحصة القادمة غداً",
    status: "active",
  },
  {
    id: 2,
    title: "مجموعة الرياضيات B",
    gradeSubject: "الصف الثالث الثانوي • الرياضيات",
    studentsText: "22 / 30 طالباً",
    infoText: "هذه المجموعة غير نشطة حالياً",
    status: "suspended",
  },
  {
    id: 3,
    title: "مجموعة الرياضيات C",
    gradeSubject: "الصف الثالث الثانوي • الرياضيات",
    studentsText: "22 / 30 طالباً",
    infoText: "التسجيل مفتوح",
    status: "registration",
  },
  {
    id: 4,
    title: "مجموعة الرياضيات A",
    gradeSubject: "الصف الثالث الثانوي • الرياضيات",
    studentsText: "22 / 30 طالباً",
    infoText: "الحصة القادمة غداً",
    status: "active",
  },
  {
    id: 5,
    title: "مجموعة الرياضيات A",
    gradeSubject: "الصف الثالث الثانوي • الرياضيات",
    studentsText: "22 / 30 طالباً",
    infoText: "الحصة القادمة غداً",
    status: "active",
  },
  {
    id: 6,
    title: "مجموعة الرياضيات A",
    gradeSubject: "الصف الثالث الثانوي • الرياضيات",
    studentsText: "22 / 30 طالباً",
    infoText: "الحصة القادمة غداً",
    status: "active",
  },
];

const PER_PAGE = 6;

export default function TeacherGroups() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  // إحصائيات ببيانات وأيقونات الفيجما المضبوطة
  const stats = [
    {
      label: "إجمالي المجموعات",
      value: 12,
      iconBg: "rgba(18, 198, 176, 0.1)",
      iconColor: "#12C6B0",
      icon: StatGridIcon,
    },
    {
      label: "مجموعات نشطة",
      value: 6,
      iconBg: "rgba(0, 166, 62, 0.15)",
      iconColor: "#00A63E",
      icon: StatCheckIcon,
    },
    {
      label: "مجموعات معلقة",
      value: 3,
      iconBg: "rgba(211, 47, 47, 0.15)",
      iconColor: "#D32F2F",
      icon: StatBoxIcon,
    },
    {
      label: "قيد التسجيل",
      value: 3,
      iconBg: "rgba(245, 158, 11, 0.15)",
      iconColor: "#F59E0B",
      icon: StatClockIcon,
    },
  ];

  const totalPages = Math.ceil(MOCK_GROUPS.length / PER_PAGE);
  const pagedGroups = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return MOCK_GROUPS.slice(start, start + PER_PAGE);
  }, [page]);

  return (
    <div
      dir="rtl"
      className="h-screen w-full flex bg-[#F9F9FF] overflow-hidden font-ibm"
    >
      {/* Sidebar */}
      <TeacherSidebar activeId="groups" />

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto px-8 py-8 flex flex-col gap-6">
        {/* Header Title */}
        <div className="flex flex-col gap-1 text-right">
          <h1 className="font-ibm font-semibold text-[24px] leading-[32px] text-[#123C91]">
            مجموعاتك التعليمية
          </h1>
          <p className="font-ibm font-normal text-[16px] leading-[24px] text-[#575F69]">
            استعرض جميع مجموعاتك الدراسية، ونظّم الحصص والمهام والاختبارات،
            وتابع مستوى الطلاب وإنجازاتهم بكل سهولة.
          </p>
        </div>

        {/* Stats Cards - المحاذاة جهة اليمين بالكامل */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-lg border border-[#E5E5E5] p-6 flex items-center justify-start gap-4 h-[112px]"
            >
              <div
                className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center p-2"
                style={{ backgroundColor: card.iconBg }}
              >
                <card.icon size={20} color={card.iconColor} />
              </div>
              <div className="flex flex-col items-start text-right">
                <span className="font-ibm font-semibold text-[24px] leading-[32px] text-[#1F2937]">
                  {card.value}
                </span>
                <span className="font-ibm font-normal text-[16px] leading-[24px] text-[#575F69]">
                  {card.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Groups Grid - الكروت بالهيكل المحدد */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pagedGroups.map((group) => {
            const status = STATUS_META[group.status];
            return (
              <div
                key={group.id}
                className="w-full min-h-[280px] bg-[#FFFFFF] rounded-[16px] border border-[#E5E5E5] p-6 flex flex-col justify-between gap-4 font-ibm shadow-sm"
              >
                <div className="flex flex-col gap-3">
                  {/* Badge */}
                  <div className="flex justify-start">
                    <div
                      className="h-[24px] px-[16px] py-[4px] rounded-[999px] flex items-center justify-center"
                      style={{ backgroundColor: status.bg }}
                    >
                      <span
                        className="text-[12px] font-bold leading-[16px] text-center"
                        style={{ color: status.color }}
                      >
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="flex flex-col gap-1 text-right">
                    <h3 className="text-[16px] font-medium leading-[24px] text-[#1F2937]">
                      {group.title}
                    </h3>
                    <p className="text-[14px] font-normal leading-[16px] text-[#575F69]">
                      {group.gradeSubject}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-0 border-b border-[#E5E5E5] my-1" />

                  {/* Details */}
                  <div className="flex flex-col gap-2.5 text-right">
                    <div className="flex items-center gap-2">
                      <Users className="w-[16px] h-[16px] text-[#123C91] stroke-[1.08]" />
                      <span className="text-[14px] font-normal leading-[16px] text-[#575F69]">
                        {group.studentsText}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-[16px] h-[16px] text-[#123C91] stroke-[1.08]" />
                      <span className="text-[14px] font-normal leading-[16px] text-[#575F69]">
                        {group.infoText}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() =>
                      navigate(`/teacher/groups/${group.id}/lessons`)
                    }
                    className="flex-1 h-[40px] bg-[#123C91] text-white text-[14px] font-medium rounded-[8px] hover:bg-[#0f327a] transition-colors flex items-center justify-center"
                  >
                    الحصص
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/teacher/groups/${group.id}/students`)
                    }
                    className="flex-1 h-[40px] bg-white border border-[#E5E5E5] text-[#575F69] text-[14px] font-medium rounded-[8px] hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    الطلاب
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* التصفح والترقيم Pagination - مظبوط على Figma بالظبط */}
        <div className="flex items-center justify-between pt-4 w-full">
          {/* أزرار الصفحات والأسهم على اليسار */}
          <div className="flex items-center gap-2">
            {/* سهم السابق */}
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="w-8 h-8 rounded-lg border border-[#E5E5E5] bg-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 shrink-0"
            >
              <ChevronIcon size={16} color="#575F69" />
            </button>

            {/* أرقام الصفحات */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const isActive = p === page;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium flex items-center justify-center transition-colors shrink-0 ${
                    isActive
                      ? "bg-[#123C91] text-white border border-[#123C91]"
                      : "bg-white border border-[#E5E5E5] text-[#575F69] hover:bg-gray-50"
                  }`}
                >
                  <span className="leading-none pt-[1px]">{p}</span>
                </button>
              );
            })}

            {/* سهم التالي */}
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="w-8 h-8 rounded-lg border border-[#E5E5E5] bg-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 shrink-0"
            >
              <ChevronIcon
                size={16}
                color="#575F69"
                style={{ transform: "rotate(180deg)" }}
              />
            </button>
          </div>

          {/* نص عدد العناصر على اليمين */}
          <span className="font-ibm text-sm font-normal text-[#8C9198] leading-none">
            عرض {pagedGroups.length} من اصل {MOCK_GROUPS.length} مجموعة
          </span>
        </div>
      </main>
    </div>
  );
}

/* ---------- SVG Helper Components ---------- */
function iconProps({ size = 18, color = "currentColor", style }) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style,
  };
}

function StatGridIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function StatCheckIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </svg>
  );
}
function StatBoxIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M21 8H3V6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2z" />
      <path d="M4 8v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V8" />
      <path d="M10 12h4" />
    </svg>
  );
}
function StatClockIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
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