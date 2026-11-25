import React from "react";

const SUBJECTS = [
  "الرياضيات",
  "الفيزياء",
  "الكيمياء",
  "الأحياء",
  "اللغة الإنجليزية",
  "اللغة الفرنسية",
  "اللغة الألمانية",
  "الحاسب الآلي",
  "البرمجة للمبتدئين",
];

export default function TrustedBy() {
  return (
    <section dir="rtl" className="w-full px-6 sm:px-10 lg:px-20 py-8">
      {/* نص الثقة */}
      <p className="font-tajawal font-medium text-sm sm:text-base leading-6 text-[#1F2937]/60 text-center">
        موثوق به من آلاف الطلاب والمعلمين
      </p>

      {/* المواد الدراسية */}
      <ul className="mt-6 sm:mt-10 flex flex-wrap items-center justify-center lg:justify-between gap-x-6 gap-y-3">
        {SUBJECTS.map((subject) => (
          <li
            key={subject}
            className="font-plex font-medium text-xs sm:text-sm leading-6 text-[#1F2937]/70 whitespace-nowrap"
          >
            {subject}
          </li>
        ))}
      </ul>
    </section>
  );
}
