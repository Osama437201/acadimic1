import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import StudentSidebar from "../../components/StudentSidebar";

// ملاحظة: الصفحة دي استاتيك بالكامل (بيانات وهمية Placeholder) للعرض/التصميم فقط،
// لسه محتاجين نوصلها بالـ API الحقيقي بتاع حصص المجموعة (الجدول، الفلاتر، الترقيم...).

const GROUP_INFO = {
  name: "مجموعة الرياضيات A",
  description:
    "إدارة كاملة لحصص هذه المجموعة: الجدول، الحضور، الواجبات، والتقييمات في مكان واحد.",
};

const GROUP_STATS = [
  { id: "total", value: 12, label: "إجمالي الحصص", tone: "blue" },
  { id: "upcoming", value: 6, label: "الحصص القادمة", tone: "blue" },
  { id: "completed", value: 5, label: "الحصص المكتملة", tone: "blue" },
  { id: "missed", value: 1, label: "الحصص الملغاة", tone: "red" },
];

const STATUS_BADGE = {
  قادمة: { bg: "rgba(18, 60, 145, 0.1)", text: "#123C91" },
  "مباشرة الآن": { bg: "rgba(0, 166, 62, 0.15)", text: "#00A63E" },
  ملغاة: { bg: "rgba(211, 47, 47, 0.15)", text: "#D32F2F" },
  مكتملة: { bg: "#F3F4F6", text: "#575F69" },
};

const SESSIONS = [
  {
    id: 1,
    title: "المصفوفات_2",
    date: "السبت 21 يونيو 2026",
    time: "06:00 PM",
    duration: "45 دقيقة",
    status: "قادمة",
  },
  {
    id: 2,
    title: "المصفوفات_1",
    date: "غداً 18 يونيو 2026",
    time: "08:30 PM",
    duration: "40 دقيقة",
    status: "قادمة",
  },
  {
    id: 3,
    title: "التبديل والتوافيق",
    date: "اليوم 17 يونيو 2026",
    time: "06:00 PM",
    duration: "60 دقيقة",
    status: "مباشرة الآن",
  },
  {
    id: 4,
    title: "المتتاليات",
    date: "السبت 24 مايو 2026",
    time: "05:30 PM",
    duration: "50 دقيقة",
    status: "ملغاة",
  },
  {
    id: 5,
    title: "العدد الأول",
    date: "السبت 24 مايو 2026",
    time: "11:00 AM",
    duration: "40 دقيقة",
    status: "مكتملة",
  },
  {
    id: 6,
    title: "الميل الحسابي",
    date: "السبت 24 مايو 2026",
    time: "06:00 PM",
    duration: "60 دقيقة",
    status: "مكتملة",
  },
];

export default function StudentGroupSessions() {
  const navigate = useNavigate();
  const { groupId } = useParams();

  return (
    <div
      dir="rtl"
      className="h-screen w-full flex overflow-hidden bg-[#F9FAFA]"
    >
      <StudentSidebar activeId="groups" />

      <main className="flex-1 h-full overflow-y-auto p-5 lg:p-8 flex flex-col gap-5">
        {/* رأس المجموعة + الإحصائيات */}
        <section className="w-full bg-white rounded-2xl p-6 flex flex-col gap-6 border border-[#E5E5E5]">
          <div className="flex flex-col gap-1 text-right">
            <h2 className="font-tajawal font-semibold text-[24px] leading-[32px] text-[#123C91]">
              {GROUP_INFO.name}
            </h2>
            <p className="font-ibm text-[16px] leading-[24px] text-[#575F69]">
              {GROUP_INFO.description}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {GROUP_STATS.map((s) => (
              <div
                key={s.id}
                className="flex items-center rounded-xl border border-[#E5E5E5] bg-white p-4 lg:p-5 gap-4 shadow-[0_0_4px_rgba(0,0,0,0.03)]"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor:
                      s.tone === "red"
                        ? "rgba(211, 47, 47, 0.1)"
                        : "rgba(18, 60, 145, 0.1)",
                  }}
                >
                  {s.tone === "red" ? (
                    <ThumbsDownIcon size={18} color="#D32F2F" />
                  ) : (
                    <ThumbsUpIcon size={18} color="#123C91" />
                  )}
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <span className="font-tajawal font-semibold text-[22px] leading-[30px] text-[#1F2937]">
                    {s.value}
                  </span>
                  <span className="font-ibm text-[14px] leading-[20px] font-normal text-[#575F69]">
                    {s.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* جدول الحصص */}
        <section className="w-full bg-white border border-[#E5E5E5] rounded-2xl flex flex-col">
          {/* شريط الفلاتر والبحث */}
          <div className="flex items-center gap-3 h-[88px] px-6 border-b border-[#E5E5E5]">
            {/* حقل البحث */}
            <div className="flex items-center gap-2 h-[48px] px-3 rounded-lg border border-[#E5E5E5] bg-[#F9FAFA] font-ibm text-sm text-[#575F69] flex-1 min-w-0 focus-within:border-[#123C91] transition-colors">
              <SearchIcon size={17} color="#1F2937" />
              <input
                type="text"
                placeholder="بحث عن حصة..."
                className="bg-transparent border-none outline-none w-full text-[#1F2937] placeholder-[#575F69] text-[14px]"
              />
            </div>

            {/* الفلاتر */}
            <button
              type="button"
              className="flex items-center justify-between gap-3 h-[48px] w-[180px] shrink-0 px-4 rounded-lg border border-[#E5E5E5] bg-[#F9FAFA] font-ibm text-[14px] leading-4 text-[#1F2937] hover:border-[#123C91] transition-colors"
            >
              <span>جميع الحالات</span>
              <ChevronDownIcon size={18} color="#1F2937" />
            </button>
            <button
              type="button"
              className="flex items-center justify-between gap-3 h-[48px] w-[180px] shrink-0 px-4 rounded-lg border border-[#E5E5E5] bg-[#F9FAFA] font-ibm text-[14px] leading-4 text-[#1F2937] hover:border-[#123C91] transition-colors"
            >
              <span>جميع الأوقات</span>
              <ChevronDownIcon size={18} color="#1F2937" />
            </button>
          </div>

          {/* الجدول */}
          <div className="border border-[#E5E5E5] rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-right border-collapse min-w-[900px] table-fixed">
              <colgroup>
                <col className="w-[160px]" /> {/* عنوان الحصة */}
                <col className="w-[202px]" /> {/* التاريخ */}
                <col className="w-[130px]" /> {/* الوقت */}
                <col className="w-[110px]" /> {/* المدة */}
                <col className="w-[110px]" /> {/* الحالة */}
                <col className="w-[138px]" /> {/* الإجراءات */}
              </colgroup>
              <thead>
                <tr className="bg-[#F9FAFA] border-b border-[#E5E5E5]">
                  <th className="font-ibm font-medium text-[14px] leading-4 text-[#575F69] py-4 px-4">
                    عنوان الحصة
                  </th>
                  <th className="font-ibm font-medium text-[14px] leading-4 text-[#575F69] py-4 px-4">
                    التاريخ
                  </th>
                  <th className="font-ibm font-medium text-[14px] leading-4 text-[#575F69] py-4 px-4">
                    الوقت
                  </th>
                  <th className="font-ibm font-medium text-[14px] leading-4 text-[#575F69] py-4 px-4">
                    المدة
                  </th>
                  <th className="font-ibm font-medium text-[14px] leading-4 text-[#575F69] py-4 px-4">
                    الحالة
                  </th>
                  <th className="font-ibm font-medium text-[14px] leading-4 text-[#575F69] py-4 px-4">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {SESSIONS.map((session) => (
                  <tr
                    key={session.id}
                    onClick={() =>
                      navigate(
                        `/student/groups/${groupId || "1"}/sessions/${session.id}`,
                      )
                    }
                    className="border-t border-[#E5E5E5] first:border-t-0 cursor-pointer hover:bg-[#F9FAFA] transition-colors"
                  >
                    <td className="py-6 px-4">
                      <span className="font-tajawal font-medium text-[18px] leading-5 text-[#1F2937]">
                        {session.title}
                      </span>
                    </td>
                    <td className="py-6 px-4">
                      <span className="font-ibm font-normal text-[16px] leading-6 text-[#575F69]">
                        {session.date}
                      </span>
                    </td>
                    <td className="py-6 px-4">
                      <span className="font-ibm font-normal text-[16px] leading-6 text-[#575F69]">
                        {session.time}
                      </span>
                    </td>
                    <td className="py-6 px-4">
                      <span className="font-ibm font-normal text-[16px] leading-6 text-[#575F69]">
                        {session.duration}
                      </span>
                    </td>
                    <td className="py-6 px-4">
                      <StatusBadge status={session.status} />
                    </td>
                    <td className="py-6 px-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(
                            `/student/groups/${groupId || "1"}/sessions/${session.id}`,
                          );
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                        title="عرض التفاصيل"
                      >
                        <EyeIcon size={18} color="#575F69" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-6 pb-6 px-4 border-t border-[#E5E5E5]">
            <span className="font-ibm text-sm text-[#8C9198]">
              عرض 6 من أصل 12 حصة
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <ChevronRightIcon size={16} color="#575F69" />
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-[#123C91] text-white font-ibm text-sm flex items-center justify-center"
              >
                1
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg border border-[#E5E5E5] text-[#575F69] font-ibm text-sm flex items-center justify-center hover:bg-gray-50"
              >
                2
              </button>
              <button
                type="button"
                className="p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <ChevronLeftIcon size={16} color="#575F69" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ---------- عناصر مساعدة ---------- */

function StatusBadge({ status }) {
  const { bg, text } = STATUS_BADGE[status] || STATUS_BADGE["قادمة"];
  return (
    <span
      className="inline-flex items-center justify-center rounded-lg font-ibm text-xs font-semibold py-1 px-2.5"
      style={{ backgroundColor: bg, color: text }}
    >
      {status}
    </span>
  );
}

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
function ThumbsUpIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M7 10v11" />
      <path d="M17.5 10H21a1 1 0 0 1 1 1.2l-1.6 8A2 2 0 0 1 18.5 21H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h2.5" />
      <path d="M7 10l4.5-7a2 2 0 0 1 2.5.5 3.5 3.5 0 0 1 .5 3.5L13 10h4.5" />
    </svg>
  );
}
function ThumbsDownIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M17 14V3" />
      <path d="M6.5 14H3a1 1 0 0 1-1-1.2l1.6-8A2 2 0 0 1 5.5 3H20a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-2.5" />
      <path d="M17 14l-4.5 7a2 2 0 0 1-2.5-.5 3.5 3.5 0 0 1-.5-3.5L11 14H6.5" />
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
function SearchIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-3.5-3.5" />
    </svg>
  );
}
function EyeIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
