import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";

const steps = [
  { id: 3, label: "مراجعة وإنشاء" },
  { id: 2, label: "الأسئلة" },
  { id: 1, label: "المعلومات الأساسية" },
];

export default function CreateExam() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    shuffle: false,
    notifyOnPublish: false,
    remindBeforeEnd: false,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      dir="rtl"
      className="h-screen w-full flex bg-[#F9F9FF] overflow-hidden font-ibm"
    >
      <TeacherSidebar activeId="exams" />

      <main className="flex-1 min-h-0 h-full overflow-y-auto px-8 py-8 pb-12 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-1 text-right">
          <h1 className="font-ibm font-semibold text-2xl leading-8 text-[#1F2937]">
            إنشاء اختبار جديد
          </h1>
          <p className="font-ibm font-normal text-sm leading-5 text-[#575F69]">
            الخطوة 1من 3 - المعلومات الأساسية
          </p>
        </div>

        {/* Stepper */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] px-6 py-5 flex items-center shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)]">
          <div className="flex-1 flex flex-row-reverse items-center">
            {steps.map((step, idx) => {
              const isActive = step.id === 1;
              return (
                <React.Fragment key={step.id}>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                        isActive
                          ? "bg-[#123C91] text-white"
                          : "bg-[#F1F1F1] text-[#8C9198]"
                      }`}
                    >
                      {step.id}
                    </span>
                    <span
                      className={`font-ibm text-sm font-medium whitespace-nowrap ${
                        isActive ? "text-[#123C91]" : "text-[#8C9198]"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx !== steps.length - 1 && (
                    <div className="flex-1 h-px bg-[#E5E5E5] mx-4" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* كونتينر واحد يجمع بيانات الاختبار الأساسية + الإعدادات الإضافية */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 flex flex-col gap-8 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)]">
          {/* بيانات الاختبار الأساسية */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <FormIcon size={18} color="#123C91" />
              <h2 className="font-ibm font-bold text-base leading-6 text-[#1F2937]">
                بيانات الاختبار الأساسية
              </h2>
            </div>

            {/* عنوان الاختبار */}
            <Field label="عنوان الاختبار">
              <input
                type="text"
                placeholder="مثال: حل مسائل التفاضل"
                className="w-full h-12 bg-[#F9FAFA] border border-[#E5E5E5] rounded-lg px-4 text-sm text-[#1F2937] placeholder-[#8C9198] outline-none"
              />
            </Field>

            {/* مدة الاختبار + درجة النجاح */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="مدة الاختبار بالدقائق">
                <input
                  type="text"
                  defaultValue="30"
                  className="w-full h-12 bg-[#F9FAFA] border border-[#E5E5E5] rounded-lg px-4 text-sm text-[#1F2937] outline-none"
                />
              </Field>
              <Field label="درجة النجاح ">
                <input
                  type="text"
                  defaultValue="%50"
                  className="w-full h-12 bg-[#F9FAFA] border border-[#E5E5E5] rounded-lg px-4 text-sm text-[#1F2937] outline-none"
                />
              </Field>
            </div>

            {/* المجموعة + الحصة */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="المجموعة المستهدفة">
                <div className="relative w-full h-12 bg-[#F9FAFA] border border-[#E5E5E5] rounded-lg px-4 flex items-center justify-between cursor-pointer">
                  <select className="w-full bg-transparent text-[#1F2937] text-sm outline-none cursor-pointer appearance-none">
                    <option>جميع المجموعات</option>
                  </select>
                  <ChevronDownIcon
                    size={20}
                    color="#1F2937"
                    className="pointer-events-none"
                  />
                </div>
              </Field>
              <Field label="الحصة المستهدفة (اختياري)">
                <div className="relative w-full h-12 bg-[#F9FAFA] border border-[#E5E5E5] rounded-lg px-4 flex items-center justify-between cursor-pointer">
                  <select className="w-full bg-transparent text-[#1F2937] text-sm outline-none cursor-pointer appearance-none">
                    <option>اختر المجموعة أولا</option>
                  </select>
                  <ChevronDownIcon
                    size={20}
                    color="#1F2937"
                    className="pointer-events-none"
                  />
                </div>
              </Field>
            </div>

            {/* تاريخ البدء + وقت البدء */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="تاريخ البدء">
                <div className="relative w-full h-12 bg-[#F9FAFA] border border-[#E5E5E5] rounded-lg px-4 flex items-center justify-between">
                  <span className="text-sm text-[#8C9198]">
                    يوم / شهر / سنة
                  </span>
                  <CalendarIcon size={18} color="#575F69" />
                </div>
              </Field>
              <Field label="وقت البدء">
                <div className="relative w-full h-12 bg-[#F9FAFA] border border-[#E5E5E5] rounded-lg px-4 flex items-center justify-between">
                  <span className="text-sm text-[#8C9198]">-- : --</span>
                  <ClockIcon size={18} color="#575F69" />
                </div>
              </Field>
            </div>

            {/* تاريخ الانتهاء + وقت الانتهاء */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="تاريخ الإنتهاء">
                <div className="relative w-full h-12 bg-[#F9FAFA] border border-[#E5E5E5] rounded-lg px-4 flex items-center justify-between">
                  <span className="text-sm text-[#8C9198]">
                    يوم / شهر / سنة
                  </span>
                  <CalendarIcon size={18} color="#575F69" />
                </div>
              </Field>
              <Field label="وقت الإنتهاء">
                <div className="relative w-full h-12 bg-[#F9FAFA] border border-[#E5E5E5] rounded-lg px-4 flex items-center justify-between">
                  <span className="text-sm text-[#8C9198]">-- : --</span>
                  <ClockIcon size={18} color="#575F69" />
                </div>
              </Field>
            </div>
          </div>

          {/* إعدادات إضافية */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <SettingsIcon size={18} color="#123C91" />
              <h2 className="font-ibm font-bold text-base leading-6 text-[#1F2937]">
                إعدادات إضافية
              </h2>
            </div>

            <Checkbox
              label="خلط الأسئلة والإجابات عشوائيا"
              checked={settings.shuffle}
              onChange={() => toggleSetting("shuffle")}
            />
            <Checkbox
              label="إرسال إشعار للطلاب عند نشر الاختبار"
              checked={settings.notifyOnPublish}
              onChange={() => toggleSetting("notifyOnPublish")}
            />
            <Checkbox
              label="إرسال تذكير قبل إنتهاء الموعد"
              checked={settings.remindBeforeEnd}
              onChange={() => toggleSetting("remindBeforeEnd")}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate("/teacher/exams/create/questions")}
            className="flex-1 h-14 px-4 rounded-lg bg-[#123C91] text-white flex items-center justify-center gap-2 font-tajawal font-medium text-base leading-[22px] hover:bg-[#0d2d6c] transition-all"
          >
            التالي
          </button>
          <button
            type="button"
            onClick={() => navigate("/teacher/exams")}
            className="w-[352px] shrink-0 h-14 px-6 rounded-lg border border-[#E5E5E5] bg-white text-[#575F69] font-tajawal font-medium text-base leading-[22px] hover:bg-[#F1F1F1] transition-all"
          >
            إلغاء
          </button>
        </div>
      </main>
    </div>
  );
}

/* Helper subcomponents */
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-2 text-right">
      <label className="font-ibm font-medium text-sm leading-5 text-[#575F69]">
        {label}
      </label>
      {children}
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="w-full flex items-center justify-between rounded border border-[#E5E5E5] px-2 py-2 h-10 cursor-pointer select-none">
      <span className="font-ibm font-normal text-base leading-6 text-[#1F2937] text-right">
        {label}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-[#E5E5E5] text-[#123C91] focus:ring-[#123C91] cursor-pointer shrink-0"
      />
    </label>
  );
}

/* Icons */
function FormIcon({ size = 18, color = "currentColor" }) {
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
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}
function SettingsIcon({ size = 18, color = "currentColor" }) {
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
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.4-2-3.4-2.3.9a7.7 7.7 0 0 0-2.6-1.5L14 2.5h-4l-.5 2.6a7.7 7.7 0 0 0-2.6 1.5l-2.3-.9-2 3.4 2 1.4a7.6 7.6 0 0 0 0 3l-2 1.4 2 3.4 2.3-.9c.77.66 1.65 1.17 2.6 1.5L10 21.5h4l.5-2.6a7.7 7.7 0 0 0 2.6-1.5l2.3.9 2-3.4-2-1.4z" />
    </svg>
  );
}
function CalendarIcon({ size = 18, color = "currentColor" }) {
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
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}
function ClockIcon({ size = 18, color = "currentColor" }) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
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
