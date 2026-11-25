import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Users, Eye, Search } from "lucide-react";
import TeacherSidebar from "./TeacherSidebar";

// حالات الحضور وحالة الواجب والألوان الخاصة بها
const ATTENDANCE_META = {
  present: { label: "حاضر", bg: "rgba(0, 166, 62, 0.15)", color: "#00A63E" },
  absent: { label: "غائب", bg: "rgba(211, 47, 47, 0.15)", color: "#D32F2F" },
};

const HOMEWORK_META = {
  submitted: { label: "تم التسليم", bg: "rgba(18, 198, 176, 0.15)", color: "#12C6B0" },
  notSubmitted: { label: "لم يسلم", bg: "rgba(211, 47, 47, 0.15)", color: "#D32F2F" },
  noHomework: { label: "لا يوجد واجب", bg: "rgba(140, 145, 152, 0.15)", color: "#8C9198" },
};

// بيانات ستاتيك للحصص والدرجات الخاصة بالصورة
const MOCK_STUDENT_SESSIONS = [
  {
    id: 1,
    lessonName: "المصفوفات_2",
    date: "21 يونيو 2026",
    attendance: "present",
    homework: "submitted",
    grade: "19/20",
  },
  {
    id: 2,
    lessonName: "المصفوفات_1",
    date: "21 يونيو 2026",
    attendance: "absent",
    homework: "submitted",
    grade: "19/20",
  },
  {
    id: 3,
    lessonName: "المتتاليات",
    date: "21 يونيو 2026",
    attendance: "present",
    homework: "notSubmitted",
    grade: "--",
  },
  {
    id: 4,
    lessonName: "العدد الأولى",
    date: "21 يونيو 2026",
    attendance: "present",
    homework: "submitted",
    grade: "19/20",
  },
  {
    id: 5,
    lessonName: "الميل الحسابى",
    date: "21 يونيو 2026",
    attendance: "present",
    homework: "noHomework",
    grade: "--",
  },
];

const PER_PAGE = 6;

export default function StudentDetails() {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const totalPages = Math.ceil(MOCK_STUDENT_SESSIONS.length / PER_PAGE);

  const pagedSessions = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return MOCK_STUDENT_SESSIONS.slice(start, start + PER_PAGE);
  }, [page]);

  return (
    <div dir="rtl" className="h-screen w-full flex bg-[#F9F9FF] overflow-hidden font-ibm">
      {/* Sidebar */}
      <TeacherSidebar activeId="groups" />

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto px-8 py-8 flex flex-col gap-6">
        {/* Header Title */}
        <div className="flex flex-col gap-1 text-right">
          <h1 className="font-ibm font-semibold text-[24px] leading-[32px] text-[#123C91]">
            محمد أحمد
          </h1>
          <p className="font-ibm font-normal text-[16px] leading-[24px] text-[#575F69]">
            المستوى الثالث الثانوي
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-[#E5E5E5] p-6 flex items-center justify-start gap-4 h-[112px]">
            <div className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center p-2 bg-[rgba(18,198,176,0.1)]">
              <Users size={20} color="#12C6B0" />
            </div>
            <div className="flex flex-col items-start text-right">
              <span className="font-ibm font-semibold text-[24px] leading-[32px] text-[#1F2937]">
                22
              </span>
              <span className="font-ibm font-normal text-[14px] leading-[20px] text-[#575F69]">
                إجمالي الحصص
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#E5E5E5] p-6 flex items-center justify-start gap-4 h-[112px]">
            <div className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center p-2 bg-[rgba(0,166,62,0.15)]">
              <Users size={20} color="#00A63E" />
            </div>
            <div className="flex flex-col items-start text-right">
              <span className="font-ibm font-semibold text-[24px] leading-[32px] text-[#1F2937]">
                18
              </span>
              <span className="font-ibm font-normal text-[14px] leading-[20px] text-[#575F69]">
                عدد مرات الحضور
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#E5E5E5] p-6 flex items-center justify-start gap-4 h-[112px]">
            <div className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center p-2 bg-[rgba(211,47,47,0.15)]">
              <Users size={20} color="#D32F2F" />
            </div>
            <div className="flex flex-col items-start text-right">
              <span className="font-ibm font-semibold text-[24px] leading-[32px] text-[#1F2937]">
                4
              </span>
              <span className="font-ibm font-normal text-[14px] leading-[20px] text-[#575F69]">
                عدد مرات الغياب
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#E5E5E5] p-6 flex items-center justify-start gap-4 h-[112px]">
            <div className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center p-2 bg-[rgba(18,60,145,0.1)]">
              <Users size={20} color="#123C91" />
            </div>
            <div className="flex flex-col items-start text-right">
              <span className="font-ibm font-semibold text-[24px] leading-[32px] text-[#1F2937]">
                24/25
              </span>
              <span className="font-ibm font-normal text-[14px] leading-[20px] text-[#575F69]">
                الواجبات
              </span>
            </div>
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-lg border border-[#E5E5E5]">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C9198]" />
            <input
              type="text"
              placeholder="بحث عن حصة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pr-10 pl-4 bg-[#F9F9FF] border border-[#E5E5E5] rounded-lg text-sm font-ibm focus:outline-none focus:border-[#123C91]"
            />
          </div>
          <div className="flex items-center gap-3">
            <select className="h-10 px-4 bg-[#F9F9FF] border border-[#E5E5E5] rounded-lg text-sm font-ibm text-[#575F69] focus:outline-none">
              <option>جميع الحالات</option>
              <option>حاضر</option>
              <option>غائب</option>
            </select>
          </div>
        </div>

        {/* Sessions / Grades Table */}
        <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-[#E5E5E5] text-[#575F69] text-sm font-medium bg-[#F9F9FF]">
                <th className="py-4 px-6">اسم الحصة</th>
                <th className="py-4 px-6">التاريخ</th>
                <th className="py-4 px-6">الحضور</th>
                <th className="py-4 px-6">حالة الواجب</th>
                <th className="py-4 px-6">الدرجة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {pagedSessions.map((session) => {
                const att = ATTENDANCE_META[session.attendance];
                const hw = HOMEWORK_META[session.homework];
                return (
                  <tr
                    key={session.id}
                    className="hover:bg-gray-50 transition-colors text-sm font-ibm text-[#1F2937]"
                  >
                    <td className="py-4 px-6 font-medium">{session.lessonName}</td>
                    <td className="py-4 px-6 text-[#575F69]">{session.date}</td>
                    <td className="py-4 px-6">
                      <span
                        className="inline-flex items-center justify-center h-[24px] px-3 rounded-full text-xs font-bold"
                        style={{ backgroundColor: att.bg, color: att.color }}
                      >
                        {att.label}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className="inline-flex items-center justify-center h-[24px] px-3 rounded-full text-xs font-bold"
                        style={{ backgroundColor: hw.bg, color: hw.color }}
                      >
                        {hw.label}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-[#1F2937]">{session.grade}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-2 w-full">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="w-8 h-8 rounded-lg border border-[#E5E5E5] bg-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronIcon size={16} color="#575F69" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const isActive = p === page;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${
                    isActive
                      ? "bg-[#123C91] text-white border border-[#123C91]"
                      : "bg-white border border-[#E5E5E5] text-[#575F69] hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="w-8 h-8 rounded-lg border border-[#E5E5E5] bg-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronIcon size={16} color="#575F69" style={{ transform: "rotate(180deg)" }} />
            </button>
          </div>

          <span className="font-ibm text-sm font-normal text-[#8C9198]">
            عرض {pagedSessions.length} من اصل {MOCK_STUDENT_SESSIONS.length} حصة
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
function ChevronIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M11 17l-5-5 5-5" />
      <path d="M18 17l-5-5 5-5" />
    </svg>
  );
}