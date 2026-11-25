import React from "react";
import { useNavigate } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";

const stats = [
  {
    label: "إجمالي الاختبارات",
    value: 12,
    iconColor: "#12C6B0",
    bg: "#12C6B01A",
  },
  {
    label: "نشط",
    value: 1,
    iconColor: "#123C91",
    bg: "#EAF4FF",
  },
  {
    label: "مكتمل",
    value: 9,
    iconColor: "#00A63E",
    bg: "#00A63E26",
  },
  {
    label: "قيد التصحيح",
    value: 2,
    iconColor: "#F59E0B",
    bg: "#F59E0B26",
  },
];

const exams = [
  {
    id: 1,
    title: "حل المعادلات",
    group: "الرياضيات A",
    session: "المعادلات التربيعية",
    date: "21 يونيو 2026-7:00م",
    examStatus: "نشط",
    examStatusNote: "الوقت المتبقي 2ساعة",
    submitted: "24/28",
    correctionStatus: "قيد التصحيح",
  },
  {
    id: 2,
    title: "مسائل تطبيقية",
    group: "الرياضياتA",
    session: "الهندسة",
    date: "21 يونيو 2026-7:00م",
    examStatus: "مكتمل",
    submitted: "28/28",
    correctionStatus: "تم التصحيح",
  },
  {
    id: 3,
    title: "حل المعادلات",
    group: "الرياضيات C",
    session: "الجبر",
    date: "21 يونيو 2026-7:00م",
    examStatus: "مكتمل",
    submitted: "28/28",
    correctionStatus: "لم يبدأ التصحيح",
  },
  {
    id: 4,
    title: "مراجعة شاملة",
    group: "الرياضيات A",
    session: "--",
    date: "21 يونيو 2026-7:00م",
    examStatus: "مكتمل",
    submitted: "24/28",
    correctionStatus: "قيد التصحيح",
  },
  {
    id: 5,
    title: "حل المعادلات",
    group: "الرياضيات B",
    session: "المعادلات التربيعية",
    date: "21 يونيو 2026-7:00م",
    examStatus: "نشط",
    examStatusNote: "الوقت المتبقي 2ساعة",
    submitted: "24/28",
    correctionStatus: "لم يبدأ التصحيح",
  },
  {
    id: 6,
    title: "مسائل تطبيقية",
    group: "الرياضيات C",
    session: "المعادلات التربيعية_2",
    date: "21 يونيو 2026-7:00م",
    examStatus: "مكتمل",
    submitted: "20/28",
    correctionStatus: "تم التصحيح",
  },
];

const examStatusStyles = {
  نشط: "bg-[#123C91]/10 text-[#123C91]",
  مكتمل: "bg-[#E5E5E5] text-[#575F69]",
};

const correctionStatusStyles = {
  "تم التصحيح": "bg-[#12C6B0]/10 text-[#0E9C8A]",
  "قيد التصحيح": "bg-[#F59E0B]/10 text-[#B45309]",
  "لم يبدأ التصحيح": "bg-[#F3F4F6] text-[#575F69]",
};

export default function TeacherExams() {
  const navigate = useNavigate();

  return (
    <div
      dir="rtl"
      className="h-screen w-full flex bg-[#F9F9FF] overflow-hidden font-ibm"
    >
      <TeacherSidebar activeId="exams" />

      {/* تم إضافة pb-12 هنا لضمان وجود مساحة كافية بالأسفل لتظهر جميع العناصر والباجيشن بوضوح */}
      <main className="flex-1 min-h-0 h-full overflow-y-auto px-8 py-8 pb-12 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1 text-right">
            <h1 className="font-ibm font-semibold text-2xl leading-8 text-[#123C91]">
              إدارة الاختبارات
            </h1>
            <p className="font-ibm font-normal text-base leading-6 text-[#575F69]">
              إنشاء اختبارات MCQ مع تحديد المجموعة والحصة
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/teacher/exams/create")}
            className="h-12 px-6 rounded-lg bg-[#123C91] text-white flex items-center justify-center gap-2 font-tajawal font-medium text-base leading-[22px] whitespace-nowrap hover:bg-[#0d2d6c] transition-all"
          >
            إنشاء اختبار جديد
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
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
          {/* Search Input */}
          <div className="relative flex-1 w-full h-12 bg-[#F9FAFA] border border-[#E5E5E5] rounded-lg px-4 flex items-center gap-3">
            <SearchIcon size={18} color="#1F2937" />
            <input
              type="text"
              placeholder="بحث عن اختبار..."
              className="w-full bg-transparent text-sm text-[#1F2937] placeholder-[#575F69] outline-none"
            />
          </div>

          {/* Status Select Dropdown */}
          <div className="relative w-full md:w-[280px] h-12 bg-[#F9FAFA] border border-[#E5E5E5] rounded-lg px-4 flex items-center justify-between cursor-pointer">
            <select className="w-full bg-transparent text-[#1F2937] text-sm outline-none cursor-pointer appearance-none">
              <option>جميع الحالات</option>
            </select>
            <ChevronDownIcon
              size={20}
              color="#1F2937"
              className="pointer-events-none"
            />
          </div>

          {/* Group Select Dropdown */}
          <div className="relative w-full md:w-[280px] h-12 bg-[#F9FAFA] border border-[#E5E5E5] rounded-lg px-4 flex items-center justify-between cursor-pointer">
            <select className="w-full bg-transparent text-[#1F2937] text-sm outline-none cursor-pointer appearance-none">
              <option>جميع المجموعات</option>
            </select>
            <ChevronDownIcon
              size={20}
              color="#1F2937"
              className="pointer-events-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden shadow-[0px_4px_0px_0px_rgba(0,0,0,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F9FAFA] border-b border-[#E5E5E5] text-[#575F69] text-xs">
                  <th className="text-right font-medium px-4 py-3">
                    عنوان الاختبار
                  </th>
                  <th className="text-right font-medium px-4 py-3">المجموعة</th>
                  <th className="text-right font-medium px-4 py-3">الحصة</th>
                  <th className="text-right font-medium px-4 py-3">
                    موعد الاختبار
                  </th>
                  <th className="text-right font-medium px-4 py-3">
                    حالة الإختبار
                  </th>
                  <th className="text-right font-medium px-4 py-3">
                    تم التسليم
                  </th>
                  <th className="text-right font-medium px-4 py-3">
                    حالة التصحيح
                  </th>
                  <th className="text-right font-medium px-4 py-3">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-[#F1F1F1] last:border-0 hover:bg-[#F9FAFA] transition-colors"
                  >
                    <td className="px-4 py-4 font-medium text-[#1F2937]">
                      {exam.title}
                    </td>
                    <td className="px-4 py-4 text-[#575F69]">{exam.group}</td>
                    <td className="px-4 py-4 text-[#575F69]">{exam.session}</td>
                    <td className="px-4 py-4 text-[#575F69] whitespace-nowrap">
                      {exam.date}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${examStatusStyles[exam.examStatus]}`}
                        >
                          {exam.examStatus}
                        </span>
                        {exam.examStatusNote && (
                          <span className="text-[11px] text-[#575F69] font-normal whitespace-nowrap">
                            {exam.examStatusNote}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[#575F69]">
                      {exam.submitted}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${correctionStatusStyles[exam.correctionStatus]}`}
                      >
                        {exam.correctionStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => navigate(`/teacher/exams/${exam.id}`)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#575F69] hover:bg-[#F1F1F1] transition-colors"
                      >
                        <EyeIcon size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-4 border-t border-[#E5E5E5]">
            <span className="text-xs text-[#8C9198]">
              عرض 6 من اصل 12 اختبار
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#575F69] hover:bg-[#F1F1F1] transition-colors"
              >
                <ChevronRightIcon size={16} />
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#123C91] text-white text-sm font-medium"
              >
                1
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#575F69] hover:bg-[#F1F1F1] transition-colors text-sm font-medium"
              >
                2
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#575F69] hover:bg-[#F1F1F1] transition-colors"
              >
                <ChevronLeftIcon size={16} />
              </button>
            </div>
          </div>
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
function EyeIcon({ size = 18, color = "currentColor" }) {
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
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
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
function ChevronRightIcon({ size = 16, color = "currentColor" }) {
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
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
function ChevronLeftIcon({ size = 16, color = "currentColor" }) {
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
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
