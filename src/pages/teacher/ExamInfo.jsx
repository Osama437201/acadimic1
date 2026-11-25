import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";

// بيانات استاتيك لحد ما يبقى فيه API — تقدر تربطها بـ examId لاحقًا
const examData = {
  title: "حل المعادلات",
  stats: [
    {
      label: "إجمالي التسليمات",
      value: 12,
      iconColor: "#0E9C8A",
      bg: "#12C6B01A",
    },
    {
      label: "مكتمل",
      value: 7,
      iconColor: "#123C91",
      bg: "#EAF4FF",
    },
    {
      label: "لم يؤد الاختبار",
      value: 2,
      iconColor: "#DC2626",
      bg: "#FEE2E2",
    },
  ],
  students: [
    { name: "ريم سعد", score: 20, total: 25, status: "أكمل الاختبار" },
    { name: "محمد احمد", score: 18, total: 25, status: "أكمل الاختبار" },
    { name: "شهد عادل", score: 17, total: 25, status: "أكمل الاختبار" },
    { name: "صلاح علي", score: 22, total: 25, status: "أكمل الاختبار" },
    { name: "سمير السيد", score: null, total: null, status: "لم يؤد الاختبار" },
    { name: "عبدالحميد محمد", score: 18, total: 20, status: "أكمل الاختبار" },
    { name: "ملك محمد", score: null, total: null, status: "لم يؤد الاختبار" },
  ],
};

const statusStyles = {
  "أكمل الاختبار": "bg-[#EAF4FF] text-[#123C91]",
  "لم يؤد الاختبار": "bg-[#D32F2F]/15 text-[#D32F2F]",
};

export default function ExamInfo() {
  const navigate = useNavigate();
  const { examId } = useParams();

  return (
    <div
      dir="rtl"
      className="h-screen w-full flex bg-[#F9F9FF] overflow-hidden font-ibm"
    >
      <TeacherSidebar activeId="exams" />

      <main className="flex-1 min-h-0 h-full overflow-y-auto px-8 py-8 pb-12 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1 text-right">
            <h1 className="font-ibm font-semibold text-2xl leading-8 text-[#123C91]">
              {examData.title}
            </h1>
            <p className="font-ibm font-normal text-base leading-6 text-[#575F69]">
              إدارة ومتابعة اختبارات الطلاب ونتائجهم
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {examData.stats.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-lg border border-[#E5E5E5] p-6 flex items-center justify-start gap-3 shadow-[0px_4px_0px_0px_rgba(0,0,0,0.04)]"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: s.bg }}
              >
                <ExamIcon size={20} color={s.iconColor} />
              </div>
              <div className="flex flex-col items-start gap-1">
                <span className="font-ibm font-semibold text-2xl leading-8 text-[#1F2937]">
                  {s.value}
                </span>
                <span className="font-ibm font-normal text-base leading-6 text-[#575F69]">
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col md:flex-row items-center gap-4 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.12)]">
          <div className="relative flex-1 w-full h-12 bg-[#F9FAFA] border border-[#E5E5E5] rounded-lg px-4 flex items-center gap-3">
            <SearchIcon size={18} color="#1F2937" />
            <input
              type="text"
              placeholder="بحث عن طالب..."
              className="w-full bg-transparent text-sm text-[#1F2937] placeholder-[#575F69] outline-none"
            />
          </div>

          <div className="relative w-full md:w-[280px] h-12 bg-[#F9FAFA] border border-[#E5E5E5] rounded-lg px-4 flex items-center justify-between cursor-pointer">
            <select className="w-full bg-transparent text-[#1F2937] text-sm outline-none cursor-pointer appearance-none">
              <option>جميع الحالات</option>
              <option>أكمل الاختبار</option>
              <option>لم يؤد الاختبار</option>
            </select>
            <ChevronDownIcon
              size={20}
              color="#1F2937"
              className="pointer-events-none"
            />
          </div>
        </div>

        {/* Students list */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-4 shadow-[0px_4px_0px_0px_rgba(0,0,0,0.04)]">
          {examData.students.map((st) => (
            <div
              key={st.name}
              className="w-full flex items-center justify-between rounded-lg border border-[#E5E5E5] p-4 hover:bg-[#F9FAFA] transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#EAF4FF] text-[#1F2937] text-sm font-medium shrink-0">
                  {st.name.charAt(0)}
                </div>
                <span className="font-ibm font-medium text-sm leading-4 text-[#1F2937] text-right">
                  {st.name}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`px-4 py-1 rounded-full text-xs font-medium leading-4 whitespace-nowrap ${statusStyles[st.status]}`}
                >
                  {st.status}
                </span>
                {st.score !== null && (
                  <span
                    className="font-ibm font-bold text-base leading-6"
                    style={{
                      color:
                        st.score / st.total >= 0.75 ? "#00A63E" : "#123C91",
                    }}
                  >
                    {st.score}/{st.total}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

/* Helper Icons */
function ExamIcon({ size = 18, color = "currentColor" }) {
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
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M9 9l1.8 1.8L14.5 7.3" />
      <path d="M8 15h8" />
    </svg>
  );
}
function SearchIcon({ size = 18, color = "currentColor" }) {
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
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}
function ChevronDownIcon({
  size = 20,
  color = "currentColor",
  className = "",
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
