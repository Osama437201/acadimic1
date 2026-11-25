import React from "react";
import { useNavigate } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";

export default function TeacherSchedule() {
  const navigate = useNavigate();
  const teacherName = "أحمد";

  // بيانات أيام التقويم لشهر يوليو 2026
  const calendarDays = [
    { day: 28, currentMonth: false },
    { day: 29, currentMonth: false },
    { day: 30, currentMonth: false },
    { day: 1, currentMonth: true },
    { day: 2, currentMonth: true },
    { day: 3, currentMonth: true },
    { day: 4, currentMonth: true, active: true, hasDot: false },
    { day: 5, currentMonth: true },
    { day: 6, currentMonth: true },
    { day: 7, currentMonth: true },
    { day: 8, currentMonth: true },
    { day: 9, currentMonth: true },
    { day: 10, currentMonth: true, hasDot: true },
    { day: 11, currentMonth: true },
    { day: 12, currentMonth: true },
    { day: 13, currentMonth: true },
    { day: 14, currentMonth: true },
    { day: 15, currentMonth: true },
    { day: 16, currentMonth: true, hasDot: true },
    { day: 17, currentMonth: true },
    { day: 18, currentMonth: true },
    { day: 19, currentMonth: true },
    { day: 20, currentMonth: true },
    { day: 21, currentMonth: true },
    { day: 22, currentMonth: true },
    { day: 23, currentMonth: true },
    { day: 24, currentMonth: true },
    { day: 25, currentMonth: true },
    { day: 26, currentMonth: true },
    { day: 27, currentMonth: true },
    { day: 28, currentMonth: true },
    { day: 29, currentMonth: true },
    { day: 30, currentMonth: true },
    { day: 31, currentMonth: true },
    { day: 1, currentMonth: false },
  ];

  // تقسيم الأيام إلى أسابيع (صفوف من 7 أيام) لتسهيل التحكم في المسافات (Frame 427319961)
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  const weekDays = [
    "السبت",
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ];

  return (
    <div
      dir="rtl"
      className="h-screen w-full flex bg-[#F9F9FF] overflow-hidden font-ibm"
    >
      {/* Sidebar */}
      <TeacherSidebar activeId="schedule" />

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto px-8 py-8 flex flex-col gap-6">
        {/* Top Header & Stats Cards */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1 text-right">
            <h1 className="font-ibm font-semibold text-2xl leading-8 text-[#123C91]">
              جدول حصصك
            </h1>
            <p className="font-ibm text-base text-[#575F69]">
              متابعة حصصك القادمة وسجل حصصك السابقة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* الكارد الأول: الحصص القادمة */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 flex items-center gap-4 shadow-[0px_0px_4px_rgba(0,0,0,0.12)]">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#EAF4FF" }}
              >
                <CalendarIcon size={24} color="#12C6B0" />
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="text-2xl font-semibold text-[#1F2937]">3</span>
                <span className="text-sm font-normal text-[#575F69]">
                  الحصص القادمة
                </span>
              </div>
            </div>

            {/* الكارد الثاني: الحصص المكتملة */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 flex items-center gap-4 shadow-[0px_0px_4px_rgba(0,0,0,0.12)]">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "rgba(18, 198, 176, 0.1)" }}
              >
                <CheckCircleIcon size={24} color="#123C91" />
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="text-2xl font-semibold text-[#1F2937]">3</span>
                <span className="text-sm font-normal text-[#575F69]">
                  الحصص المكتملة
                </span>
              </div>
            </div>

            {/* الكارد الثالث: إجمالي الساعات */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 flex items-center gap-4 shadow-[0px_0px_4px_rgba(0,0,0,0.12)]">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "rgba(18, 198, 176, 0.1)" }}
              >
                <ClockIcon size={24} color="#12C6B0" />
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="text-2xl font-semibold text-[#1F2937]">64</span>
                <span className="text-sm font-normal text-[#575F69]">
                  إجمالي الساعات
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar + Selected Day Classes — single card (Frame 427319966) */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-6 shadow-[0px_0px_4px_rgba(0,0,0,0.12)]">
          {/* Header row (Frame 427319932): label / date / month nav */}
          <div className="flex items-center justify-between h-10 w-full">
            {/* يمين: عنوان الجدول */}
            <span className="flex items-center gap-2 text-base font-normal leading-6 text-[#575F69]">
              <CalendarIcon size={18} color="#575F69" />
              جدول الحصص
            </span>

            {/* منتصف: التاريخ المحدد */}
            <span className="text-base font-medium leading-6 text-[#1F2937]">
              4 يوليو 2026
            </span>

            {/* يسار: التنقل بين الأشهر */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="الشهر السابق"
                className="w-6 h-6 flex items-center justify-center"
              >
                <ChevronRightIcon size={24} color="#1F2937" />
              </button>
              <span className="text-base font-normal leading-6 text-[#1F2937]">
                يوليو 2026
              </span>
              <button
                type="button"
                aria-label="الشهر التالي"
                className="w-6 h-6 flex items-center justify-center"
              >
                <ChevronLeftIcon size={24} color="#1F2937" />
              </button>
            </div>
          </div>

          {/* التقويم */}
          <div className="flex flex-col border border-[#E5E5E5] rounded-xl overflow-hidden">
            {/* Week days row (Frame 427319963) */}
            <div className="flex items-center justify-between bg-[#F9FAFA] border-b-2 border-[#E5E5E5] h-20 px-8">
              {weekDays.map((d, index) => (
                <span
                  key={index}
                  className="flex-1 text-center text-base font-normal leading-6 text-[#575F69]"
                >
                  {d}
                </span>
              ))}
            </div>

            {/* Days grid (Frame 427319961) */}
            <div className="flex flex-col gap-6 bg-white p-8">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex items-center justify-between">
                  {week.map((item, di) => (
                    <div
                      key={di}
                      className="flex-1 flex items-center justify-center"
                    >
                      <DayCell item={item} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Selected Day Classes */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-base font-semibold text-[#1F2937]">
                حصص السبت
              </span>
              <span className="text-base font-normal text-[#8C9198]">
                2 حصة
              </span>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-1">
              {/* الدرس الأول - منتهية (درس_معلم) */}
              <div className="w-[320px] shrink-0 rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-2 bg-white shadow-[0px_0px_4px_rgba(0,0,0,0.12)]">
                {/* عنوان + شارة الحالة */}
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-[#1F2937]">
                    مجموعة الرياضيات A
                  </span>
                  <span
                    className="flex items-center justify-center px-2 py-1 rounded-lg text-xs font-semibold text-[#00A63E]"
                    style={{ backgroundColor: "rgba(0, 166, 62, 0.15)" }}
                  >
                    منتهية
                  </span>
                </div>

                {/* الصف الدراسي */}
                <div className="flex items-center justify-end gap-1">
                  <span className="text-xs font-normal text-[#8C9198]">
                    الصف الثالث الثانوي
                  </span>
                  <GroupIcon size={16} color="#8C9198" />
                </div>

                {/* المدة/الوقت + زر */}
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#8C9198]">
                    <span>45 د</span>
                    <span>10:00 ص</span>
                    <ClockIcon size={16} color="#8C9198" />
                  </div>
                  <button
                    type="button"
                    disabled
                    className="px-4 py-2 rounded-lg border border-[#E5E5E5] text-[#8C9198] text-sm bg-gray-50 cursor-not-allowed"
                  >
                    التسجيل
                  </button>
                </div>
              </div>

              {/* الدرس الثاني - تبدأ الآن (درس_معلم) */}
              <div className="w-[320px] shrink-0 rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-2 bg-white shadow-[0px_0px_4px_rgba(0,0,0,0.12)]">
                {/* عنوان + وسم "تبدأ الآن" */}
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-[#1F2937]">
                    مجموعة الرياضيات B
                  </span>
                  <span className="bg-[#EAF4FF] text-[#123C91] text-[10px] px-2 py-0.5 rounded">
                    تبدأ الآن
                  </span>
                </div>

                {/* الصف الدراسي */}
                <div className="flex items-center justify-end gap-1">
                  <span className="text-xs font-normal text-[#8C9198]">
                    الصف الثالث الثانوي
                  </span>
                  <GroupIcon size={16} color="#8C9198" />
                </div>

                {/* المدة/الوقت + زر */}
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#8C9198]">
                    <span>60 د</span>
                    <span>12:00 ص</span>
                    <ClockIcon size={16} color="#8C9198" />
                  </div>
                  <button
                    type="button"
                    className="bg-[#123C91] text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-[#0d2d6c] transition-colors"
                  >
                    بدء الدرس
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- خلية اليوم في التقويم (calender component) ---------- */
function DayCell({ item }) {
  const isOtherMonth = !item.currentMonth;

  return (
    <div
      className={`w-[72px] h-[72px] rounded-full flex items-center justify-center relative transition-colors ${
        item.currentMonth ? "hover:bg-[#123C91]/10 cursor-pointer" : ""
      }`}
    >
      {item.active ? (
        <span className="w-14 h-14 rounded-full bg-[#123C91] flex items-center justify-center text-base font-bold text-white">
          {item.day}
        </span>
      ) : (
        <span
          className={`text-base font-bold ${
            isOtherMonth ? "text-[#8C9198]" : "text-[#1F2937]"
          }`}
        >
          {item.day}
        </span>
      )}

      {item.hasDot && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#123C91] absolute bottom-2"></span>
      )}
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

function CalendarIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
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

function ClockIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

function CheckCircleIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function GroupIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <circle cx="9" cy="8" r="3" />
      <path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6" />
      <path d="M16 4.3a3 3 0 0 1 0 5.4" />
      <path d="M20.5 20c0-2.6-1.9-4.8-4.5-5.6" />
    </svg>
  );
}