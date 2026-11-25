import React from "react";
import { Crown } from "lucide-react";

const PLANS = [
  {
    title: "المادة الواحدة",
    description: "مثالية للتجربة والتعرف على المنصة",
    price: "250 جنيه مصرى",
    sessions: "8 حصص شهريًا",
    highlighted: false,
  },
  {
    title: "الثلاث مواد",
    description: "أفضل اختيار للمتابعة الكاملة والتفوق الدراسي",
    price: "650 جنيه مصرى",
    sessions: "24 حصة شهريًا",
    highlighted: true,
  },
  {
    title: "الأساسية",
    description: "مناسبة للمتابعة الدراسية المنتظمة",
    price: "1,200 جنيه مصرى",
    sessions: "48 حصة شهريًا",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      dir="rtl"
      className="w-full flex flex-col items-center gap-6 sm:gap-8 lg:gap-10 px-6 sm:px-10 lg:px-20 py-12 sm:py-16 lg:py-20"
    >
      {/* العنوان */}
      <h2 className="font-tajawal font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight lg:leading-[56px] text-[#1F2937] text-center">
        الباقات و الأسعار
      </h2>

      {/* الوصف */}
      <p className="font-plex text-base sm:text-lg leading-relaxed lg:leading-6 text-[#1F2937]/70 text-center">
        اختر الباقة المناسبه لك ولأبنائك واستمتع بتجربة تعليمية متميزة
      </p>

      {/* الكروت */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-6 mt-2">
        {PLANS.map((plan) => (
          <div
            key={plan.title}
            className={`relative flex flex-col gap-6 sm:gap-8 rounded-2xl bg-white px-6 sm:px-8 py-8 sm:py-10 border border-[#E5E5E5] ${
              plan.highlighted ? "shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]" : ""
            }`}
          >
            {/* شارة الأكثر اختيارًا */}
            {plan.highlighted && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 w-[120px] py-1 px-2 rounded-2xl bg-[#EAF4FF]">
                <Crown className="w-6 h-6 text-[#123C91]" />
                <span className="font-plex text-xs text-[#123C91] whitespace-nowrap">
                  الأكثر اختيارًا
                </span>
              </span>
            )}

            {/* العنوان */}
            <h3 className="font-tajawal font-bold text-xl sm:text-2xl leading-8 text-[#1F2937] text-right">
              {plan.title}
            </h3>

            {/* الوصف */}
            <p className="font-plex text-sm leading-5 text-[#1F2937] text-right">
              {plan.description}
            </p>

            {/* السعر */}
            <p className="font-tajawal font-bold text-2xl sm:text-[32px] leading-10 text-[#1F2937] text-right">
              {plan.price}
            </p>

            {/* عدد الحصص */}
            <p className="font-plex text-sm leading-5 text-[#123C91] text-right">
              {plan.sessions}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
