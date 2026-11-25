import React from "react";
import TeacherSidebar from "./TeacherSidebar";

/* ---------- بيانات ثابتة (Static) للعرض فقط ---------- */
const personalData = [
  { label: "الاسم الكامل", value: "محمد أحمد" },
  { label: "اسم المستخدم", value: "mohamed_1524" },
  { label: "البريد الإلكتروني", value: "adel@gmail.com" },
  { label: "رقم الهاتف", value: "+20 1000 456987" },
  { label: "الدولة", value: "مصر" },
];

const academicData = [
  { label: "اللغة", value: "العربية" },
  { label: "المنهج الدراسي", value: "المنهج المصري" },
  { label: "المرحلة الدراسية", value: "الثانوية" },
  { label: "سنوات الخبرة", value: "5 سنين" },
  { label: "المواد", value: "الرياضيات" },
];

export default function AccountSettings() {
  return (
    <div dir="rtl" className="flex h-screen font-ibm">
      <TeacherSidebar activeId="settings" />

      <main className="flex-1 overflow-y-auto">
        <div className="w-full px-8 py-8">
          <div className="bg-white rounded-2xl shadow-sm">
            {/* رأس البطاقة + بيانات البروفايل */}
            <div className="px-6 pt-6 pb-6 border-b border-gray-100">
              <h1 className="text-2xl font-semibold leading-8 text-[#123C91]">
                إعدادات الحساب
              </h1>
              <p className="text-base leading-6 text-[#575F69] mt-1">
                إدارة معلومات حسابك وتفضيلاتك
              </p>

              <div className="mt-5 flex items-center gap-6 rounded-2xl border border-[#E5E5E5] p-6">
                <div className="relative shrink-0">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Adel"
                    alt="الصورة الشخصية"
                    className="w-[120px] h-[120px] rounded-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute bottom-0 left-0 w-8 h-8 rounded-full bg-[#1F2937] flex items-center justify-center border-2 border-white"
                    aria-label="تغيير الصورة"
                  >
                    <CameraIcon size={16} color="#FFFFFF" />
                  </button>
                </div>
                <div>
                  <div className="text-2xl font-semibold leading-8 text-[#1F2937]">
                    عادل منصور
                  </div>
                  <div className="text-base leading-6 text-[#575F69]">
                    adel@gmail.com
                  </div>
                </div>
              </div>
            </div>

            {/* البيانات الشخصية */}
            <Section
              title="البيانات الشخصية"
              subtitle="هذا القسم يحتوي على بياناتك الشخصية الأساسية التي تُستخدم في جميع الخدمات الرئيسية داخل المنصة."
            >
              <FieldGrid fields={personalData} />
            </Section>

            {/* البيانات الأكاديمية */}
            <Section
              title="البيانات الأكاديمية"
              subtitle="يتضمن هذا القسم بياناتك التعليمية والمهنية الأساسية، والتي تُستخدم لإدارة الحصص والمجموعات الدراسية والتواصل مع الطلاب داخل المنصة."
            >
              <FieldGrid fields={academicData} />
            </Section>

            {/* الأمان وكلمة المرور */}
            <Section
              title="الأمان وكلمة المرور"
              subtitle="تغيير كلمة المرور وإعدادات الأمان"
              editLabel="تغيير كلمة المرور"
              last
            >
              <div className="rounded-xl border border-gray-200 px-5 py-4">
                <div className="font-medium text-[#111827]">كلمة المرور</div>
                <div className="text-sm text-gray-400 mt-1">
                  آخر تغيير منذ 3 أشهر
                </div>
              </div>
            </Section>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- مكونات فرعية ---------- */

function Section({
  title,
  subtitle,
  children,
  editLabel = "تعديل البيانات",
  last = false,
}) {
  return (
    <div className={`px-6 py-6 ${last ? "" : "border-b border-gray-100"}`}>
      <div className="flex items-start justify-between gap-4 mb-1">
        <h2 className="text-base font-semibold text-[#111827]">{title}</h2>
        <button
          type="button"
          className="flex items-center gap-1.5 text-sm font-medium text-[#12C6B0] shrink-0"
        >
          <PencilIcon size={14} color="#12C6B0" />
          {editLabel}
        </button>
      </div>
      {subtitle && (
        <p className="text-sm text-gray-400 max-w-2xl mb-4">{subtitle}</p>
      )}
      {children}
    </div>
  );
}

function FieldGrid({ fields }) {
  return (
    <div className="rounded-xl border border-gray-200 px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
      {fields.map((f) => {
        const isNumeric = /^[+\d][\d\s]*$/.test(f.value);
        return (
          <div key={f.label}>
            <div className="text-sm text-gray-400 mb-1">{f.label}</div>
            <div
              className="font-medium text-[#1F2937]"
              dir={isNumeric ? "ltr" : undefined}
              style={isNumeric ? { textAlign: "right" } : undefined}
            >
              {f.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- أيقونات ---------- */
function PencilIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}
function CameraIcon({ size = 12, color = "currentColor" }) {
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
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}
