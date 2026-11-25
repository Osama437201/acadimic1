import React from "react";
import {
  Video,
  ListChecks,
  CreditCard,
  ShieldCheck,
  BarChart3,
  MessageSquare,
} from "lucide-react";
import bigLogo from "../assets/logo-mark.svg";

const FEATURES = [
  {
    icon: CreditCard,
    title: "إدارة مرنة للاشتراكات",
    text: "اختيار الباقات التعليمية وإدارة الدروس والاشتراكات بسهولة من خلال المنصة.",
  },
  {
    icon: ListChecks,
    title: "اختبارات وواجبات ذكية",
    text: "إنشاء واجبات واختبارات مع إمكانية التصحيح اليدوي أو التلقائي لتقييم الطلاب بدقة.",
  },
  {
    icon: Video,
    title: "حصص مباشرة وتفاعلية",
    text: "إدارة الحصص المباشرة مع إمكانية مشاركة الشاشة، الملفات، والتفاعل داخل الدرس بسهولة.",
  },
  {
    icon: MessageSquare,
    title: "تواصل فعال",
    text: "نظام تواصل مباشر بين المعلمين وأولياء الأمور لمتابعة التقدم وحل أي استفسار بسهولة.",
  },
  {
    icon: BarChart3,
    title: "متابعة مستمرة للأداء",
    text: "لوحات متابعة وإحصائيات تساعد أولياء الأمور على متابعة الأبناء بشكل مستمر.",
  },
  {
    icon: ShieldCheck,
    title: "بيئة تعليمية آمنة",
    text: "نظام تواصل منظم يحافظ على خصوصية الطلاب ويوفر بيئة تعليمية آمنة تحت إشراف كامل.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      dir="rtl"
      className="w-full flex flex-col items-center px-6 sm:px-10 lg:px-20 py-12 sm:py-16 lg:py-20"
      style={{
        background:
          "radial-gradient(160% 160% at 50% -20%, rgba(18,198,176,0.10) 0%, rgba(234,244,255,0.35) 35%, rgba(234,244,255,0.15) 65%, #FFFFFF 100%)",
      }}
    >
      {/* دائرة اللوجو */}
      <div className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] lg:w-[180px] lg:h-[180px] rounded-full bg-white/80 shadow-sm flex items-center justify-center p-2.5">
        <img
          src={bigLogo}
          alt="الأكاديمية"
          className="w-full h-full object-contain"
        />
      </div>

      {/* العنوان */}
      <h2 className="mt-4 font-tajawal font-bold text-xl sm:text-2xl text-[#123C91]">
        مميزاتنا
      </h2>

      {/* الكروت */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 sm:mt-10 lg:mt-12">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="flex flex-col gap-4 sm:gap-6 rounded-2xl bg-white p-5 sm:p-6"
          >
            {/* الأيقونة */}
            <span className="w-10 h-10 flex items-center justify-center rounded bg-[#EAF4FF] p-2">
              <Icon className="w-full h-full text-[#123C91]" />
            </span>

            {/* العنوان */}
            <h3 className="font-tajawal font-bold text-xl sm:text-2xl tracking-[0.4px] text-[#1F2937] text-right">
              {title}
            </h3>

            {/* الوصف */}
            <p className="font-plex text-sm sm:text-base leading-6 text-[#1F2937] text-right">
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
