import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";

/**
 * AssignmentInfo
 * صفحة "معلومات الواجب" — بتفتح لما المعلم يدوس على أيقونة العين
 * جوه جدول الواجبات. نسخة استاتيكية مبدئية (بيانات ثابتة) لحد ما
 * نربطها بالباك إند باستخدام assignmentId من الـ route. *
 */
export default function AssignmentInfo() {
  const navigate = useNavigate();
  const { assignmentId } = useParams();

  // بيانات ثابتة (Static) للصفحة
  const assignmentTitle = "حل المعادلات";
  const assignmentSubtitle = "إدارة ومتابعة واجبات الطلاب وتصحيحها.";

  const stats = [
    {
      label: "إجمالي التسليمات",
      value: 24,
      bg: "rgba(18, 198, 176, 0.1)",
      iconColor: "#12C6B0",
    },
    { label: "تم تصحيحها", value: 22, bg: "#DCFCE7", iconColor: "#16A34A" },
    { label: "قيد التصحيح", value: 2, bg: "#FEF3C7", iconColor: "#D97706" },
  ];

  const students = [
    { name: "ريم سعد", submitted: true, corrected: true, grade: "18/20" },
    { name: "محمد احمد", submitted: true, corrected: true, grade: "15/20" },
    { name: "عبدالحميد محمد", submitted: true, corrected: false },
    { name: "صلاح علي", submitted: true, corrected: false },
    { name: "شهد عادل", submitted: true, corrected: false },
    { name: "سمر السيد", submitted: false },
    { name: "ملك محمد", submitted: false },
  ];

  return (
    <div
      dir="rtl"
      className="h-screen w-full flex bg-[#F9F9FF] overflow-hidden font-ibm"
    >
      {/* نفس السلايد بار المشترك، مع تفعيل عنصر "الواجبات" */}
      <TeacherSidebar activeId="assignments" />

      <main className="flex-1 min-h-0 h-full overflow-y-auto px-8 py-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-1 text-right">
          <h1 className="font-ibm font-semibold text-2xl leading-8 text-[#123C91]">
            {assignmentTitle}
          </h1>
          <p className="font-ibm text-base text-[#575F69]">
            {assignmentSubtitle}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-[#E5E5E5] p-6 flex items-center gap-4 shadow-[0px_0px_4px_rgba(0,0,0,0.12)]"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: s.bg }}
              >
                <DocIcon size={22} color={s.iconColor} />
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="text-2xl font-semibold text-[#1F2937]">
                  {s.value}
                </span>
                <span className="text-sm font-normal text-[#575F69]">
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* الفلاتر — كارد منفصل بحدوده الخاصة فوق قائمة الطلاب */}
        <div className="bg-white rounded-lg border border-[#E5E5E5] shadow-[0px_0px_4px_rgba(0,0,0,0.12)] flex items-center gap-4 h-[88px] px-6">
          {/* البحث: Width Fill(792px) / Radius8 / Padding12 / Gap8 */}
          <div className="flex items-center gap-2 flex-[792] h-12 bg-[#F9FAFA] border border-[#E5E5E5] rounded-lg px-3">
            <SearchIcon size={17} color="#1F2937" />
            <input
              type="text"
              placeholder="بحث عن طالب..."
              className="flex-1 bg-transparent outline-none text-sm text-[#575F69] placeholder:text-[#575F69] text-right"
            />
          </div>

          {/* فلتر الحالات: Width Fill(280px) / Radius8 / Padding16 */}
          <button
            type="button"
            className="flex items-center justify-between flex-[280] h-12 bg-[#F9FAFA] border border-[#E5E5E5] rounded-lg px-4 text-sm text-[#1F2937] whitespace-nowrap"
          >
            جميع الحالات
            <ChevronDownIcon size={24} color="#575F69" />
          </button>
        </div>

        {/* قائمة الطلاب — كارد أبيض: Radius16 / Border E5E5E5 / Padding24 / Gap16 */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-[0px_0px_4px_rgba(0,0,0,0.12)] flex flex-col gap-4 p-6">
          {students.map((st, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 border border-[#E5E5E5] rounded-lg px-4 py-4"
            >
              {/* اسم الطالب + الأفاتار */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#EAF4FF] shrink-0">
                  <span className="text-sm font-medium leading-4 text-[#1F2937]">
                    {st.name.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-medium leading-4 text-[#1F2937] whitespace-nowrap">
                  {st.name}
                </span>
              </div>

              {/* الحالة + الدرجة/الإجراء */}
              <div className="flex items-center gap-3">
                {st.submitted ? (
                  <>
                    <span className="inline-flex items-center justify-center px-4 py-1 rounded-full text-xs font-medium leading-4 bg-[#EAF4FF] text-[#123C91] whitespace-nowrap">
                      تم التسليم
                    </span>

                    {st.corrected ? (
                      <>
                        <span className="text-base font-bold leading-6 text-[#00A63E] whitespace-nowrap">
                          {st.grade}
                        </span>
                        <button
                          type="button"
                          className="w-20 h-8 flex items-center justify-center gap-2 rounded-lg border border-[#E5E5E5] text-sm font-medium text-[#575F69] hover:bg-[#F9F9FF] transition-colors whitespace-nowrap"
                        >
                          تعديل
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="w-20 h-8 flex items-center justify-center gap-2 rounded-lg bg-[#123C91] text-white text-xs font-medium hover:bg-[#0d2d6c] transition-colors whitespace-nowrap"
                      >
                        تصحيح
                      </button>
                    )}
                  </>
                ) : (
                  <span className="inline-flex items-center justify-center px-4 py-1 rounded-full text-xs font-medium leading-4 bg-[#D32F2F26] text-[#D32F2F] whitespace-nowrap">
                    لم يسلم
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
