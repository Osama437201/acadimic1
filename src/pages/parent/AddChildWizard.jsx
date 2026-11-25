import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo-sidebar.svg";
import Step1PersonalInfo from "./Step1PersonalInfo";
import Step2AcademicInfo from "./Step2AcademicInfo";
import Step3AccountCredentials from "./Step3AccountCredentials";
import Step4Review from "./Step4Review";

export default function AddChildWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
const [formData, setFormData] = useState({
  // Step 1
  fullName: "",
  birthDate: "",
  countryCode: "",
  // Step 2
  curriculum: "",
  stage: "",
  grade: "",
  studyLanguage: "",
  preferredSubjects: [],
  // Step 3
  username: "",
  password: "",
  passwordConfirm: "",
});

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const stepsHeader = [
    { id: 1, label: "المعلومات الشخصية" },
    { id: 2, label: "المعلومات الأكاديمية" },
    { id: 3, label: "بيانات دخول الطالب" },
    { id: 4, label: "مراجعة وإنشاء" },
  ];

  const navItems = [
    { id: "overview", label: "لوحة التحكم", icon: GridIcon, path: "/parent/dashboard" },
    { id: "children", label: "الأبناء", icon: UsersIcon, path: "/parent/children" },
    { id: "schedule", label: "الجدول", icon: CalendarIcon, path: "/parent/schedule" },
    { id: "messages", label: "الرسائل", icon: ChatIcon, path: "/parent/messages" },
    { id: "plans", label: "الخطط التعليمية", icon: CardIcon, path: "/parent/plans" },
    { id: "notifications", label: "الإشعارات", icon: BellIcon, path: "/parent/notifications" },
    { id: "settings", label: "الإعدادات", icon: GearIcon, path: "/parent/settings" },
  ];

  return (
    <div dir="rtl" className="h-screen w-full flex bg-[#F8F9FC] overflow-hidden font-tajawal">
      {/* القائمة الجانبية Sidebar */}
      <aside className="hidden md:flex flex-col justify-between w-64 h-full shrink-0 bg-[#1F2937] px-4 py-6 border-l border-black/10 shadow-[0_0_2px_0_rgba(0,0,0,0.25)]">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <img src={logo} alt="الأكاديمية" className="w-[176px] h-8" />
            <button
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors shrink-0"
            >
              <ChevronIcon size={16} color="#FFFFFF" />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = item.id === "children";
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 h-10 w-[224px] px-2 rounded-lg transition-colors text-base font-ibm font-medium ${
                    isActive
                      ? "bg-white border-r-4 border-[#12C6B0] text-[#123C91]"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  <item.icon size={20} color={isActive ? "#123C91" : "#FFFFFF"} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }}
          className="flex items-center gap-2 h-9 w-[224px] px-2 rounded-lg text-white/90 hover:bg-white/10 transition-colors text-base font-ibm font-medium"
        >
          <LogoutIcon size={20} color="#FFFFFF" />
          تسجيل الخروج
        </button>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 h-full overflow-y-auto p-8 flex flex-col gap-6 max-w-[1100px] mx-auto w-full">
        {/* رأس الصفحة */}
        <div className="flex flex-col gap-1">
          <h1 className="font-ibm font-bold text-2xl text-[#123C91]">إضافة ابن جديد</h1>
          <p className="font-ibm text-sm text-[#6B7280]">
            الخطوة {step} من 4 - {stepsHeader.find((s) => s.id === step)?.label}
          </p>
        </div>

        {/* مؤشر الخطوات العلوي Stepper */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm">
          <div className="flex items-center justify-between px-4">
            {stepsHeader.map((s, idx) => (
              <React.Fragment key={s.id}>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                      step >= s.id
                        ? "bg-[#1E3A8A] text-white"
                        : "bg-[#E5E7EB] text-[#9CA3AF]"
                    }`}
                  >
                    {s.id}
                  </div>
                  <span
                    className={`font-ibm text-sm font-medium ${
                      step >= s.id ? "text-[#1F2937]" : "text-[#9CA3AF]"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < stepsHeader.length - 1 && (
                  <div className="flex-1 h-[2px] bg-[#E5E7EB] mx-4" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* مكون الـ Step الحالية */}
        {step === 1 && (
          <Step1PersonalInfo
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
            onCancel={() => navigate("/parent/dashboard")}
          />
        )}

        {step === 2 && (
          <Step2AcademicInfo
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {step === 3 && (
          <Step3AccountCredentials
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {step === 4 && <Step4Review formData={formData} onBack={prevStep} />}
      </main>
    </div>
  );
}

/* ---------- أيقونات القائمة الجانبية ---------- */
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
function GridIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </svg>
  );
}
function UsersIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17.5" cy="9" r="2.6" />
      <path d="M21.5 20c0-2.6-1.9-4.8-4.4-5.4" />
    </svg>
  );
}
function CalendarIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}
function ChatIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M21 12a8 8 0 1 1-3.4-6.5L21 4l-1 4.6A7.96 7.96 0 0 1 21 12z" />
    </svg>
  );
}
function CardIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <rect x="2.5" y="5" width="19" height="14" rx="2.2" />
      <path d="M2.5 10h19" />
    </svg>
  );
}
function BellIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}
function GearIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.4-2-3.4-2.3.9a7.7 7.7 0 0 0-2.6-1.5L14 2.5h-4l-.5 2.6a7.7 7.7 0 0 0-2.6 1.5l-2.3-.9-2 3.4 2 1.4a7.6 7.6 0 0 0 0 3l-2 1.4 2 3.4 2.3-.9c.77.66 1.65 1.17 2.6 1.5L10 21.5h4l.5-2.6a7.7 7.7 0 0 0 2.6-1.5l2.3.9 2-3.4-2-1.4z" />
    </svg>
  );
}
function LogoutIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}
function ChevronIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M11 17l-5-5 5-5" />
      <path d="M18 17l-5-5 5-5" />
    </svg>
  );
}