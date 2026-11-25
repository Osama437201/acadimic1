import React from "react";
import dashboardPreview from "../assets/dashboard-preview.svg";

export default function Hero() {
  return (
    <section
      id="hero"
      dir="rtl"
      className="w-full min-h-[760px]
                 flex flex-col lg:flex-row
                 items-center justify-center lg:justify-between
                 gap-10 lg:gap-12
                 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20
                 py-12 sm:py-16 lg:py-20
                 bg-gradient-to-b from-[#EAF4FF] to-[#F8F9FF]"
    >
      {/* النص والأزرار */}
      <div
        className="w-full lg:flex-1
                   flex flex-col items-center lg:items-start
                   gap-6 sm:gap-7 lg:gap-8
                   max-w-[654px]"
      >
        {/* العنوان */}
        <h1
          className="w-full max-w-[500px]
                     font-tajawal font-bold
                     text-[38px] sm:text-[46px] md:text-[54px] lg:text-[64px]
                     leading-[1.15] lg:leading-[1]
                     text-center lg:text-right"
        >
          <span className="text-[#123C91]">منصة واحدة </span>
          <span className="text-[#1F2937]">لإدارة تعليمية متكاملة</span>
        </h1>

        {/* الفقرة */}
        <p
          className="w-full max-w-[600px]
                     font-plex font-normal
                     text-base sm:text-lg lg:text-xl
                     leading-7 sm:leading-8
                     text-[#1F2937]
                     text-center lg:text-right"
        >
          منصة متكاملة تدير الاشتراكات، الحصص، الامتحانات، حضور وغياب الطلاب،
          وتضمن تواصلاً آمناً بين الجميع في نظام ذكي ومحمى بالكامل.
        </p>

        {/* الأزرار */}
        <div
          className="w-full
                     flex flex-col sm:flex-row
                     items-center justify-center lg:justify-start
                     gap-3 sm:gap-4"
        >
          {/* ابدأ الآن */}
          <a
            href="/login"
            className="flex items-center justify-center
                       w-full sm:w-52 lg:w-60
                       h-12 sm:h-14 px-4
                       rounded-lg bg-[#123C91]
                       hover:bg-[#0e2f73] transition-colors
                       font-tajawal font-medium
                       text-lg sm:text-xl lg:text-2xl
                       text-white whitespace-nowrap"
          >
            ابدأ الآن
          </a>

          {/* استكشف المنصة */}
          <a
            href="/register"
            className="flex items-center justify-center
                       w-full sm:w-52 lg:w-60
                       h-12 sm:h-14 px-4 sm:px-6
                       rounded-lg border border-[#E5E5E5]
                       font-tajawal font-medium
                       text-lg sm:text-xl lg:text-2xl
                       text-[#575F69] whitespace-nowrap
                       hover:border-[#123C91]
                       hover:text-[#123C91]
                       transition-colors"
          >
            استكشف المنصة
          </a>
        </div>
      </div>

      {/* صورة الـ Dashboard */}
      <div
        className="w-full
                   max-w-[340px] sm:max-w-[380px]
                   md:max-w-[420px]
                   lg:w-[400px] xl:w-[420px]
                   h-auto
                   lg:h-[510px]
                   shrink-0
                   flex items-center justify-center"
      >
        <img
          src={dashboardPreview}
          alt="لوحة تحكم الأكاديمية"
          className="w-full h-auto lg:h-full object-contain"
        />
      </div>
    </section>
  );
}
