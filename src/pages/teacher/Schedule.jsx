import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";

export default function Schedule() {
  const navigate = useNavigate();

  const [days, setDays] = useState({
    السبت: false,
    الأحد: false,
    الإثنين: false,
    الثلاثاء: false,
    الأربعاء: false,
    الخميس: false,
    الجمعة: false,
  });

  const [time, setTime] = useState("");

  const toggleDay = (day) => {
    setDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const handleCreateSchedule = () => {
    const selectedDays = Object.keys(days).filter((day) => days[day]);

    if (selectedDays.length === 0) {
      alert("من فضلك اختر يومًا واحدًا على الأقل");
      return;
    }

    if (!time) {
      alert("من فضلك اختر وقت الحصة");
      return;
    }

    console.log({
      days: selectedDays,
      time,
    });

    alert("تم إنشاء جدول الحصص بنجاح");
  };

  return (
    <div
      dir="rtl"
      className="h-screen w-full flex bg-[#F9F9FF] overflow-hidden font-ibm"
    >
      {/* ================= Sidebar ================= */}
      <TeacherSidebar activeId="groups" />

      {/* ================= Main Content ================= */}
      <main className="flex-1 h-full overflow-y-auto px-8 py-8 flex flex-col">
        {/* Page Title */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-ibm font-semibold text-2xl leading-8 text-[#123C91]">
            إنشاء جدول
          </h1>
        </div>

        {/* ================= Schedule Form Card ================= */}
        <div className="bg-white rounded-[16px] border border-[#E5E5E5] shadow-[0_0_4px_0_rgba(0,0,0,0.12)] p-8 flex flex-col gap-6">
          {/* Days */}
          <div className="flex flex-col gap-4">
            <h2 className="font-ibm font-bold text-base text-[#1F2937]">
              أيام الدراسة
            </h2>

            <div className="flex flex-col gap-3">
              {Object.keys(days).map((day) => (
                <label
                  key={day}
                  className="flex items-center gap-3 cursor-pointer w-fit select-none"
                >
                  <div className="relative flex items-center justify-center w-4 h-4">
                    <input
                      type="checkbox"
                      checked={days[day]}
                      onChange={() => toggleDay(day)}
                      className="peer appearance-none w-4 h-4 border border-[#1F2937] rounded-[4px] bg-white checked:bg-[#123C91] checked:border-[#123C91] cursor-pointer transition-colors"
                    />
                    <svg
                      className="absolute w-3 h-3 text-white pointer-events-none hidden peer-checked:block"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 3 4.5 8 2.5 6" />
                    </svg>
                  </div>

                  <span className="font-ibm text-base text-[#1F2937] font-normal">
                    {day}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Time */}
          <div className="flex flex-col gap-2">
            <h2 className="font-ibm font-medium text-sm text-[#1F2937]">
              الوقت
            </h2>

            <div className="relative flex items-center justify-between bg-[#F9FAFA] border border-[#E5E5E5] rounded-lg px-4 h-12">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-transparent text-sm text-[#8C9198] outline-none font-ibm cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 text-right"
              />
              <div className="pointer-events-none flex items-center mr-3">
                <ClockIcon size={18} color="#8C9198" />
              </div>
            </div>
          </div>
        </div>

        {/* ================= Buttons ================= */}
        <div className="bg-white rounded-[16px] border border-[#E5E5E5] shadow-[0_0_4px_0_rgba(0,0,0,0.12)] p-4 mt-6">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleCreateSchedule}
              className="flex-[2] h-11 rounded-lg bg-[#123C91] text-white font-ibm text-sm hover:bg-[#0F2F73] transition-colors"
            >
              إنشاء جدول الحصص
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 h-11 rounded-lg border border-[#E5E5E5] bg-white text-[#575F69] font-ibm text-sm hover:bg-[#F9F9FF] transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ================================================= */
/* ================= Icons ========================= */
/* ================================================= */

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

function ClockIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}