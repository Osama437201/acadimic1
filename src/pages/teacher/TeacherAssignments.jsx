import React from "react";
import { useNavigate } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";

/**
 * TeacherAssignments
 * نسخة استاتيكية مبدئية من صفحة "الواجبات" — بيانات ثابتة حاليًا
 * لحد ما نربطها بالباك إند.
 */
export default function TeacherAssignments() {
  const navigate = useNavigate();

  // بيانات ثابتة (Static) للجدول
  const assignments = [
    {
      title: "حل المعادلات",
      group: "رياضيات A",
      session: "المعادلات التربيعية",
      dueDate: "21 يونيو 2026",
      status: "نشط",
      timeRemaining: "الوقت المتبقي 2 ساعة",
      submitted: "24/28",
      correction: "قيد التصحيح",
    },
    {
      title: "مسائل تطبيقية",
      group: "رياضيات A",
      session: "الهندسة",
      dueDate: "21 يونيو 2026",
      status: "منتهي",
      submitted: "28/28",
      correction: "تم التصحيح",
    },
    {
      title: "حل المعادلات",
      group: "رياضيات C",
      session: "الجبر",
      dueDate: "21 يونيو 2026",
      status: "منتهي",
      submitted: "28/28",
      correction: "لم يبدأ التصحيح",
    },
    {
      title: "مراجعة شاملة",
      group: "رياضيات A",
      session: "--",
      dueDate: "21 يونيو 2026",
      status: "منتهي",
      submitted: "24/28",
      correction: "قيد التصحيح",
    },
    {
      title: "حل المعادلات",
      group: "رياضيات B",
      session: "المعادلات التربيعية",
      dueDate: "21 يونيو 2026",
      status: "نشط",
      timeRemaining: "الوقت المتبقي 2 ساعة",
      submitted: "24/28",
      correction: "لم يبدأ التصحيح",
    },
    {
      title: "مسائل تطبيقية_2",
      group: "رياضيات C",
      session: "المعادلات التربيعية_2",
      dueDate: "21 يونيو 2026",
      status: "منتهي",
      submitted: "20/28",
      correction: "تم التصحيح",
    },
  ];

  const tableHeaders = [
    "عنوان الواجب",
    "المجموعة",
    "الحصة",
    "موعد التسليم",
    "حالة الواجب",
    "تم التسليم",
    "حالة التصحيح",
    "الإجراءات",
  ];

  // فهارس الأعمدة اللي محاذاتها "وسط" حسب التصميم
  const centeredHeaderIndexes = [3, 7]; // موعد التسليم + الإجراءات

  return (
    <div
      dir="rtl"
      className="h-screen w-full flex bg-[#F9F9FF] overflow-hidden font-ibm"
    >
      {/* Sidebar مشترك */}
      <TeacherSidebar activeId="assignments" />

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto px-8 py-8 flex flex-col gap-6">
        {/* Header + زر إضافة واجب */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1 text-right">
            <h1 className="font-ibm font-semibold text-2xl leading-8 text-[#123C91]">
              الواجبات
            </h1>
            <p className="font-ibm text-base text-[#575F69]">
              إدارة ومتابعة جميع الواجبات في جميع المجموعات.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/teacher/assignments/create")}
            className="flex items-center justify-center gap-2 w-40 h-12 px-6 rounded-lg bg-[#123C91] text-white hover:bg-[#0d2d6c] transition-colors cursor-pointer"
          >
            <PlusIcon size={18} color="#FFFFFF" />
            <span
              className="text-base font-medium leading-[22px]"
              style={{ fontFamily: "'Tajawal', sans-serif" }}
            >
              إضافة واجب
            </span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 flex items-center gap-4 shadow-[0px_0px_4px_rgba(0,0,0,0.12)]">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(18, 198, 176, 0.1)" }}
            >
              <DocIcon size={22} color="#12C6B0" />
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-2xl font-semibold text-[#1F2937]">12</span>
              <span className="text-sm font-normal text-[#575F69]">
                إجمالي الواجبات
              </span>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 flex items-center gap-4 shadow-[0px_0px_4px_rgba(0,0,0,0.12)]">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#EAF4FF" }}
            >
              <DocIcon size={22} color="#123C91" />
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-2xl font-semibold text-[#1F2937]">8</span>
              <span className="text-sm font-normal text-[#575F69]">نشطة</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 flex items-center gap-4 shadow-[0px_0px_4px_rgba(0,0,0,0.12)]">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#DCFCE7" }}
            >
              <DocIcon size={22} color="#16A34A" />
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-2xl font-semibold text-[#1F2937]">4</span>
              <span className="text-sm font-normal text-[#575F69]">
                تم تصحيحها
              </span>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 flex items-center gap-4 shadow-[0px_0px_4px_rgba(0,0,0,0.12)]">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#FEF3C7" }}
            >
              <DocIcon size={22} color="#D97706" />
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-2xl font-semibold text-[#1F2937]">2</span>
              <span className="text-sm font-normal text-[#575F69]">
                قيد التصحيح
              </span>
            </div>
          </div>
        </div>

        {/* الجدول (الفلاتر + الجدول جوه نفس الكارد الأبيض) */}
        {/* Radius 8px + Border 1px #E5E5E5 + Shadow (X0 Y0 Blur4 Spread0 #000000 12%) حسب التصميم */}
        <div className="bg-white rounded-lg border border-[#E5E5E5] shadow-[0px_0px_4px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden">
          {/* Filters (Frame: Fill 1136, h-88, border-bottom, padding24, gap16) */}
          <div className="flex items-center gap-4 h-[88px] px-6 border-b border-[#E5E5E5]">
            {/* البحث */}
            <div className="flex items-center gap-2 flex-[1.8] h-12 bg-[#F9FAFA] border border-[#E5E5E5] rounded-lg px-3">
              <SearchIcon size={17} color="#1F2937" />
              <input
                type="text"
                placeholder="بحث عن واجب..."
                className="flex-1 bg-transparent outline-none text-sm text-[#575F69] placeholder:text-[#575F69] text-right"
              />
            </div>

            {/* فلتر الحالات */}
            <button
              type="button"
              className="flex items-center justify-between flex-1 h-12 bg-[#F9FAFA] border border-[#E5E5E5] rounded-lg px-4 text-sm text-[#575F69] whitespace-nowrap"
            >
              جميع الحالات
              <ChevronDownIcon size={24} color="#575F69" />
            </button>

            {/* فلتر المجموعات */}
            <button
              type="button"
              className="flex items-center justify-between flex-1 h-12 bg-[#F9FAFA] border border-[#E5E5E5] rounded-lg px-4 text-sm text-[#575F69] whitespace-nowrap"
            >
              جميع المجموعات
              <ChevronDownIcon size={24} color="#575F69" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              {/* Header: bg #F9FAFA, Height Hug(48px) => padding 16px */}
              <thead>
                <tr className="bg-[#F9FAFA] border-b border-[#E5E5E5]">
                  {tableHeaders.map((h, i) => (
                    <th
                      key={i}
                      className={`px-4 py-4 text-sm font-medium text-[#575F69] whitespace-nowrap ${
                        centeredHeaderIndexes.includes(i)
                          ? "text-center"
                          : "text-right"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {assignments.map((row, index) => (
                  // Row (component "assignment"): Height Hug(92px)
                  // Padding top24 / right16 / bottom24 / left16, Border-Top 1px #E5E5E5
                  <tr
                    key={index}
                    className="border-t border-[#E5E5E5] first:border-t-0 hover:bg-[#F9F9FF] transition-colors"
                  >
                    {/* عنوان الواجب: Tajawal / 500 / 18px / lh20 / #1F2937 */}
                    <td
                      className="px-4 py-6 text-[18px] leading-5 font-medium text-[#1F2937] whitespace-nowrap"
                      style={{ fontFamily: "'Tajawal', sans-serif" }}
                    >
                      {row.title}
                    </td>

                    {/* المجموعة: IBM Plex Sans Arabic / 400 / 16px / lh24 / #575F69 */}
                    <td className="px-4 py-6 text-base leading-6 text-[#575F69] whitespace-nowrap">
                      {row.group}
                    </td>

                    {/* الحصة: 16px / lh24 */}
                    <td className="px-4 py-6 text-base leading-6 text-[#575F69] whitespace-nowrap">
                      {row.session}
                    </td>

                    {/* موعد التسليم: 16px / lh24 / center */}
                    <td className="px-4 py-6 text-base leading-6 text-[#575F69] text-center whitespace-nowrap">
                      {row.dueDate}
                    </td>

                    {/* حالة الواجب + النص الفرعي (الوقت المتبقي) تحت الـ badge مباشرة */}
                    <td className="px-4 py-6 text-center whitespace-nowrap">
                      <div className="flex flex-col items-center gap-1">
                        <StatusBadge status={row.status} />
                        {row.timeRemaining && (
                          <span className="text-sm leading-4 text-[#575F69] text-center">
                            {row.timeRemaining}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-6 text-base leading-6 text-[#575F69] text-center whitespace-nowrap">
                      {row.submitted}
                    </td>

                    <td className="px-4 py-6 text-center whitespace-nowrap">
                      <CorrectionBadge status={row.correction} />
                    </td>

                    {/* الإجراءات: زرار 32x32 / radius8 / padding4 / navigate لصفحة معلومات الواجب */}
                    <td className="px-4 py-6 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/teacher/assignments/${index}`)
                        }
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#F1F1F1] transition-colors"
                      >
                        <EyeIcon size={20} color="#575F69" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E5E5]">
            <span className="text-sm text-[#575F69]">عرض 6 من اصل 12 واجب</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="w-8 h-8 rounded-lg border border-[#E5E5E5] flex items-center justify-center hover:bg-[#F9F9FF]"
              >
                <ChevronRightIcon size={16} color="#1F2937" />
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg border border-[#E5E5E5] text-sm font-medium text-[#575F69] flex items-center justify-center hover:bg-[#F9F9FF]"
              >
                2
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-[#123C91] text-white text-sm font-medium flex items-center justify-center"
              >
                1
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg border border-[#E5E5E5] flex items-center justify-center hover:bg-[#F9F9FF]"
              >
                <ChevronLeftIcon size={16} color="#1F2937" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- Badges ---------- */
// شكل Pill (radius 999) + padding top4/right16/bottom4/left16 + خط Bold 12px/lh16
function StatusBadge({ status }) {
  const styles =
    status === "نشط"
      ? { bg: "#EAF4FF", color: "#123C91" } // Soft Sky Blue / Deep Royal Blue
      : { bg: "#F3F4F6", color: "#6B7280" };

  return (
    <span
      className="inline-flex items-center justify-center px-4 py-1 rounded-full text-xs font-bold leading-4 whitespace-nowrap"
      style={{ backgroundColor: styles.bg, color: styles.color }}
    >
      {status}
    </span>
  );
}

function CorrectionBadge({ status }) {
  const map = {
    "قيد التصحيح": { bg: "rgba(245, 158, 11, 0.15)", color: "#F59E0B" }, // add/pending 15%
    "تم التصحيح": { bg: "rgba(22, 163, 74, 0.15)", color: "#16A34A" },
    "لم يبدأ التصحيح": { bg: "#F3F4F6", color: "#6B7280" },
  };
  const styles = map[status] || { bg: "#F3F4F6", color: "#6B7280" };

  return (
    <span
      className="inline-flex items-center justify-center px-4 py-1 rounded-full text-xs font-bold leading-4 whitespace-nowrap"
      style={{ backgroundColor: styles.bg, color: styles.color }}
    >
      {status}
    </span>
  );
}

/* ---------- الأيقونات المستخدمة (SVG) ---------- */
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

function PlusIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function DocIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M7 3h7l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14 3v4h4" />
      <path d="M9 13h6M9 17h4" />
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

function ChevronDownIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M6 9l6 6 6-6" />
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

function EyeIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
