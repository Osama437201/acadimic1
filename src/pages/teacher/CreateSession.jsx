import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";

/**
 * صفحة "إنشاء حصة جديدة" - صفحة مستقلة بالكامل بنفس تصميم الشريط الجانبي
 */
export default function CreateSession() {
  const navigate = useNavigate();
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [sessionDuration, setSessionDuration] = useState("");
  const [sessionDesc, setSessionDesc] = useState("");
  const [hasAttachment, setHasAttachment] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <div
      dir="rtl"
      className="h-screen w-full flex bg-[#F9F9FF] overflow-hidden font-ibm"
    >
      {/* الشريط الجانبي Sidebar */}
      <TeacherSidebar activeId="groups" />

      {/* محتوى الصفحة الرئيسي */}
      <main className="flex-1 h-full overflow-y-auto px-8 py-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="font-ibm font-semibold text-2xl leading-8 text-[#123C91]">
            إنشاء حصة جديدة
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          {/* بيانات الحصة الأساسية */}
          <div className="bg-white p-8 rounded-2xl border border-[#E5E5E5] shadow-sm flex flex-col gap-8">
            <h2 className="font-ibm font-bold text-base leading-6 text-[#1F2937] text-right">
              بيانات الحصة الأساسية
            </h2>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-ibm text-sm text-[#575F69] text-right">
                  عنوان الحصة
                </label>
                <select
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-[#E5E5E5] bg-[#F9FAFA] font-ibm text-sm text-[#1F2937]/50 outline-none text-right"
                >
                  <option value="">اختر المادة الدراسية أو عنوان الحصة</option>
                  <option value="مراجعة عامة">مراجعة عامة</option>
                  <option value="الأعداد المركبة">الأعداد المركبة</option>
                  <option value="الهندسة الفراغية">الهندسة الفراغية</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-ibm text-sm text-[#575F69] text-right">
                  التاريخ
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="يوم / شهر / سنة"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full h-12 pr-4 pl-10 rounded-lg border border-[#E5E5E5] bg-[#F9FAFA] font-ibm text-sm text-[#1F2937] placeholder:text-[#1F2937]/50 outline-none text-right"
                  />
                  <CalendarCardIcon
                    size={18}
                    color="#8C9198"
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-ibm text-sm text-[#575F69] text-right">
                  المدة (بالدقائق)
                </label>
                <input
                  type="text"
                  placeholder="60 دقيقة"
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-[#E5E5E5] bg-[#F9FAFA] font-ibm text-sm text-[#1F2937] placeholder:text-[#1F2937]/50 outline-none text-right"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-ibm text-sm text-[#575F69] text-right">
                  وصف الحصة (اختياري)
                </label>
                <input
                  type="text"
                  placeholder="رياضيات - الصف الثاني الثانوي...."
                  value={sessionDesc}
                  onChange={(e) => setSessionDesc(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-[#E5E5E5] bg-[#F9FAFA] font-ibm text-sm text-[#1F2937] placeholder:text-[#1F2937]/50 outline-none text-right"
                />
              </div>
            </div>
          </div>

          {/* مرفقات الحصة */}
          <div className="bg-white p-8 rounded-2xl border border-[#E5E5E5] shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UploadIcon size={16} color="#1F2937" />
              <div className="flex flex-col text-right gap-1">
                <span className="font-ibm font-bold text-base leading-6 text-[#1F2937]">
                  مرفقات الحصة
                </span>
                <span className="font-ibm text-sm leading-4 text-[#575F69]">
                  أضف الملفات أو المستندات التي يحتاجها الطلاب أثناء الحصة.
                </span>
              </div>
            </div>

            {/* Toggle switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={hasAttachment}
                onChange={(e) => setHasAttachment(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:right-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#123C91]"></div>
            </label>
          </div>

          {/* أزرار الحفظ والإلغاء */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="flex-1 h-14 px-4 rounded-lg bg-[#123C91] text-white font-tajawal font-medium text-base hover:bg-[#0F2F73] transition-colors"
            >
              إنشاء حصة
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-[352px] h-14 px-6 rounded-lg border border-[#E5E5E5] text-[#575F69] font-tajawal font-medium text-base hover:bg-gray-50 transition-colors bg-white shrink-0"
            >
              إلغاء
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

/* ---------- الأيقونات المستخدمة ---------- */
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
function UploadIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M12 16V4M8 8l4-4 4 4" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}