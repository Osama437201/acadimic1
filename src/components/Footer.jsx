import React from "react";
import logo from "../assets/logo.svg";
// حط صور أيقونات السوشيال ميديا (المصدّرة من فيجما) هنا
import facebookIcon from "../assets/social-facebook.svg";
import twitterIcon from "../assets/social-twitter.svg";
import instagramIcon from "../assets/social-instagram.svg";
import youtubeIcon from "../assets/social-youtube.svg";

/**
 * Footer Section
 * --------------
 * مطابق لمواصفات الفيجما:
 * - خلفية: Soft Sky Blue #EAF4FF, padding 80px, gap 24px
 * - عناوين الأعمدة: Tajawal Bold 24px, لون #1F2937
 * - الروابط والوصف: IBM Plex Sans Arabic, لون #1F2937 / Deep Royal Blue
 * - أيقونات السوشيال ميديا: دائرية 32x32, لون #123C91
 */

const PLATFORM_LINKS = [
  { label: "الرئيسية", href: "#hero" },
  { label: "المميزات", href: "#features" },
  { label: "الباقات", href: "#pricing" },
];

const SUPPORT_LINKS = [
  { label: "عن الأكاديمية", href: "#about" },
  { label: "الأسئلة الشائعة", href: "#faq" },
];

const SOCIAL_LINKS = [
  { icon: facebookIcon, href: "#", label: "Facebook" },
  { icon: twitterIcon, href: "#", label: "Twitter" },
  { icon: instagramIcon, href: "#", label: "Instagram" },
  { icon: youtubeIcon, href: "#", label: "Youtube" },
];

function FooterColumn({ title, links }) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-tajawal font-bold text-2xl text-[#1F2937]">
        {title}
      </h4>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="font-plex text-base text-[#123C91] hover:underline"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer dir="rtl" className="w-full flex flex-col gap-6 px-6 sm:px-10 lg:px-20 py-12 sm:py-16 lg:py-20 bg-[#EAF4FF]">
      {/* الصف العلوي */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-start lg:justify-between gap-8 lg:gap-12">
        {/* اللوجو والوصف */}
        <div className="flex flex-col items-start gap-4 max-w-[344px] sm:col-span-2 lg:col-span-1">
          <img src={logo} alt="الأكاديمية" className="h-8 w-auto" />
          <p className="font-plex text-sm sm:text-base leading-6 text-[#1F2937] text-right">
            منصة متكاملة تدير الاشتراكات، الحصص، الامتحانات، حضور وغياب
            الطلاب، وتضمن تواصلاً آمناً بين الجميع.
          </p>
        </div>

        {/* المنصة */}
        <FooterColumn title="المنصة" links={PLATFORM_LINKS} />

        {/* الدعم ومعلومات */}
        <FooterColumn title="الدعم ومعلومات" links={SUPPORT_LINKS} />

        {/* تابعنا */}
        <div className="flex flex-col gap-4">
          <h4 className="font-tajawal font-bold text-xl sm:text-2xl text-[#1F2937]">
            تابعنا
          </h4>
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden hover:opacity-80 transition-opacity"
              >
                <img src={icon} alt={label} className="w-full h-full object-cover" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* خط فاصل */}
      <div className="w-full border-t border-[#E5E5E5]" />

      {/* الحقوق */}
      <p className="font-plex font-normal text-sm sm:text-base leading-relaxed sm:leading-none text-[#123C91] text-center">
        © 2026 الأكاديمية. جميع الحقوق محفوظة.
      </p>
    </footer>
  );
}