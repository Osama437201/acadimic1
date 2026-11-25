import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";

const NAV_LINKS = [
  { label: "الرئيسية", href: "#hero" },
  { label: "عن الأكاديمية", href: "#about" },
  { label: "المميزات", href: "#features" },
  { label: "الباقات", href: "#pricing" },
  { label: "الأسئلة الشائعة", href: "#faq" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      dir="rtl"
      className="relative z-50 w-full min-h-20 flex items-center justify-between
                 px-4 sm:px-6 lg:px-12 xl:px-20 py-4
                 bg-[#EAF4FF]/60 backdrop-blur-[12px]
                 border-b border-[#1F2937]/[0.08]
                 shadow-[0_4px_20px_0_rgba(0,0,0,0.05)]"
    >
      {/* الشعار */}
      <Link
        to="/"
        className="flex items-center gap-2 w-[150px] sm:w-[176px] h-8 shrink-0"
      >
        <img src={logo} alt="الأكاديمية" className="h-8 w-auto" />
      </Link>

      {/* روابط التنقل - Desktop */}
      <ul className="hidden lg:flex items-center gap-5 xl:gap-8">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="font-tajawal font-medium text-sm xl:text-base text-[#123C91]
                         hover:text-[#0e2f73] transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* الأزرار - Desktop */}
      <div className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0">
        <Link
          to="/register"
          className="flex items-center justify-center
                     w-28 xl:w-32 h-10 px-3 xl:px-4
                     rounded-lg bg-[#123C91] hover:bg-[#0e2f73]
                     transition-colors
                     font-tajawal font-medium text-sm xl:text-base text-white"
        >
          إنشاء حساب
        </Link>

        <Link
          to="/login"
          className="flex items-center justify-center
                     w-28 xl:w-32 h-10 px-3 xl:px-6
                     rounded-lg border border-[#E5E5E5]
                     font-tajawal font-medium text-sm xl:text-base
                     text-[#575F69] whitespace-nowrap
                     hover:border-[#123C91] hover:text-[#123C91]
                     transition-colors"
        >
          تسجيل الدخول
        </Link>
      </div>

      {/* زر القائمة للموبايل */}
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className="lg:hidden flex flex-col items-center justify-center gap-1.5
                   w-10 h-10 rounded-lg border border-[#E5E5E5]
                   bg-white/70"
        aria-label="فتح القائمة"
      >
        <span
          className={`block w-5 h-0.5 bg-[#123C91] transition-transform ${
            menuOpen ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`block w-5 h-0.5 bg-[#123C91] transition-opacity ${
            menuOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`block w-5 h-0.5 bg-[#123C91] transition-transform ${
            menuOpen ? "-translate-y-2 -rotate-45" : ""
          }`}
        />
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="absolute top-full right-0 w-full lg:hidden
                     bg-white/95 backdrop-blur-md
                     border-b border-[#1F2937]/10
                     shadow-lg px-5 py-5"
        >
          <ul className="flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block font-tajawal font-medium text-base
                             text-[#123C91] hover:text-[#0e2f73]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center
                         w-full h-11 rounded-lg bg-[#123C91]
                         font-tajawal font-medium text-base text-white"
            >
              إنشاء حساب
            </Link>

            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center
                         w-full h-11 rounded-lg border border-[#E5E5E5]
                         font-tajawal font-medium text-base text-[#575F69]"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
