import React from "react";
import missionIcon from "../assets/mission-icon.svg";
import visionIcon from "../assets/vision-icon.svg";

const CARDS = [
  {
    icon: visionIcon,
    title: "رؤيتنا",
    text: "أن نصبح منصة تعليمية رائدة توفر تجربة تعلم حديثة وآمنة، تربط بين الطلاب والمعلمين وأولياء الأمور في بيئة تعليمية أكثر كفاءة واحترافية.",
  },
  {
    icon: missionIcon,
    title: "رسالتنا",
    text: "نسعى إلى تقديم بيئة تعليمية متكاملة تساعد الطلاب على التطور الأكاديمي من خلال الحصص المباشرة، المتابعة المستمرة، والتواصل المنظم بين المعلمين وأولياء الأمور لضمان تجربة تعليمية فعالة وآمنة.",
  },
];

export default function AboutUs() {
  return (
    <section
      id="about"
      dir="rtl"
      className="w-full flex flex-col items-center gap-6 sm:gap-8 lg:gap-10 px-6 sm:px-10 lg:px-20 py-12 sm:py-16 lg:py-20"
    >
      {/* Eyebrow */}
      <div className="flex items-center gap-3">
        <span className="w-8 sm:w-12 h-0.5 bg-[#12C6B0]" />
        <span className="font-tajawal font-medium text-sm sm:text-base tracking-[0.4px] text-[#12C6B0]">
          من نحن
        </span>
        <span className="w-8 sm:w-12 h-0.5 bg-[#12C6B0]" />
      </div>

      {/* العنوان */}
      <h2 className="font-tajawal font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight lg:leading-[56px] text-[#123C91] text-center">
        عن الأكاديمية
      </h2>

      {/* الفقرة */}
      <p className="max-w-[923px] font-plex font-normal text-base sm:text-lg leading-relaxed lg:leading-6 text-[#1F2937] text-center">
        توفر الأكاديمية بيئة تعليمية متكاملة تساعد الطلاب على التطور والتعلم من
        خلال حصص مباشرة، واجبات، اختبارات، وتقارير متابعة مستمرة، مع نظام تواصل
        آمن يربط بين المعلمين وأولياء الأمور لضمان تجربة تعليمية أكثر احترافية
        وفعالية.
      </p>

      {/* الكروت */}
      <div className="w-full flex flex-col md:flex-row items-stretch gap-6">
        {CARDS.map(({ icon, title, text }) => (
          <div
            key={title}
            className="flex-1 flex flex-col gap-4 rounded-2xl border border-[#1F2937]/20 bg-white p-6 sm:p-8"
          >
            {/* الأيقونة والعنوان */}
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-[#12C6B0] to-[#123C91]">
                <img
                  src={icon}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </span>
              <h3 className="font-tajawal font-bold text-xl sm:text-2xl text-[#123C91]">
                {title}
              </h3>
            </div>

            {/* النص */}
            <p className="font-plex font-medium text-sm sm:text-base leading-6 tracking-[0.4px] text-[#1F2937] text-right">
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
