import React, { useEffect, useState, useRef } from "react";

const STATS = [
  { value: 40, suffix: "", label: "معلم" },
  { value: 12000, suffix: "", label: "طالب" },
  { value: 1000, suffix: "", label: "دورة تدريبية" },
  { value: 97, suffix: "%", label: "رضا العملاء" },
];

// Hook بيعمل عدّ تصاعدي من 0 للرقم المطلوب، وبيبدأ بس لما العنصر يظهر في الشاشة
function useCountUp(target, shouldStart, duration = 1500) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easing بسيط عشان العد يبدأ سريع ويهدى في الآخر
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [shouldStart, target, duration]);

  return count;
}

function StatItem({ value, suffix, label, shouldStart }) {
  const count = useCountUp(value, shouldStart);

  return (
    <div className="flex flex-col gap-1 sm:gap-2 items-center sm:items-end text-center sm:text-right">
      <span className="font-plex font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight lg:leading-[56px] text-white">
        {count.toLocaleString("en-US")}
        {suffix}
      </span>
      <span className="font-plex font-normal text-base sm:text-xl lg:text-2xl leading-normal lg:leading-8 text-white">
        {label}
      </span>
    </div>
  );
}

export default function Stats() {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  // نراقب لما السكشن يدخل الشاشة (أو نبدأ فورًا لو ظاهر من أول تحميل الصفحة)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // العد يحصل مرة واحدة بس
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      className="w-full grid grid-cols-2 lg:flex lg:items-center lg:justify-between gap-8 sm:gap-10 lg:gap-0 px-6 sm:px-10 lg:px-20 py-12 sm:py-16 lg:py-20 bg-[#1F2937]"
    >
      {STATS.map((stat) => (
        <StatItem key={stat.label} {...stat} shouldStart={inView} />
      ))}
    </section>
  );
}
