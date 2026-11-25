import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import loginIllustration from "../assets/login-illustration.svg";

export default function Register() {
  const navigate = useNavigate();

  // أنواع الحسابات المتاحة
  const accountTypes = [
    {
      id: "student",
      title: "طالب",
      description: "طوّر مهاراتك وتابع رحلتك التعليمية.",
      path: "/register/student",
    },
    {
      id: "parent",
      title: "ولي أمر",
      description: "تابع تقدم الأبناء واطلع على إنجازاتهم.",
      path: "/register/parent",
    },
    {
      id: "teacher",
      title: "معلم",
      description: "أنشئ المحتوى التعليمي وتابع طلابك.",
      path: "/register/teacher",
    },
    {
      id: "lecturer",
      title: "محاضر",
      description: "أنشئ دوراتك التعليمية، شارك خبراتك.",
      path: "/register/lecturer",
    },
  ];

  return (
    <div className="h-screen w-full flex bg-white overflow-hidden">
      {/* الجانب الأيسر - ثابت كما بالسكاشن السابقة */}
      <div
        dir="rtl"
        className="hidden lg:flex flex-col justify-between shrink-0
                   w-[45%] xl:w-[768px] h-full
                   p-8 xl:p-12
                   bg-gradient-to-b from-[#123C91] to-white"
      >
        <div className="flex-1 flex items-center justify-center min-h-0">
          <img
            src={loginIllustration}
            alt="منظومة تعليمية متكاملة"
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <div className="flex flex-col gap-2 text-right shrink-0">
          <h2 className="font-tajawal font-bold text-2xl xl:text-[32px] leading-tight text-[#123C91]">
            منظومة تعليمية متكاملة
          </h2>
          <p className="font-ibm text-base xl:text-xl leading-relaxed text-[#575F69] max-w-[521px]">
            نجمع بين الطلاب وأولياء الأمور والمعلمين في منصة واحدة لتجربة
            تعليمية أكثر تنظيمًا وفعالية.
          </p>
        </div>
      </div>

      {/* الجانب الأيمن - مطبق بالكامل طبقاً لـ Figma Specs */}
      <div
        dir="rtl"
        className="flex-1 flex items-center justify-center p-6 lg:p-12 h-full overflow-y-auto lg:overflow-hidden"
      >
        <div className="w-full max-w-[512px] my-auto flex flex-col gap-8 items-start text-right">
          {/* الشعار والترحيب */}
          <div className="flex flex-col items-start gap-4 w-full">
            {/* اللوجو: Width 176px, Height 32px */}
            <Link
              to="/"
              className="w-[176px] h-[32px] flex items-center justify-start"
            >
              <img
                src={logo}
                alt="الأكاديمية"
                className="w-[176px] h-[32px] object-contain"
              />
            </Link>

            {/* العنوان: Tajawal Bold 24px/32px, Color: #1F2937 */}
            <h1 className="font-tajawal font-bold text-[24px] leading-[32px] text-[#1F2937]">
              مرحباً بك...
            </h1>
          </div>

          {/* اختيار نوع الحساب */}
          <div className="w-full flex flex-col gap-4">
            {/* Sub-heading: Tajawal Medium 14px/16px, Color: #1F2937 (أو حسب المطلوب) */}
            <p className="font-tajawal font-medium text-[14px] leading-[16px] text-[#1F2937]">
              اختر نوع الحساب
            </p>

            {/* قائمة أنواع الحسابات */}
            <div className="flex flex-col gap-3 w-full">
              {accountTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => navigate(type.path)}
                  className="w-full min-h-[80px] bg-white border border-[#E5E5E5] rounded-[8px]
                             px-[24px] py-[16px] flex flex-col justify-center gap-1
                             cursor-pointer hover:border-[#123C91] hover:shadow-md transition-all duration-200"
                >
                  {/* العنوان: IBM Plex Sans Arabic Regular 16px/24px, Color: #575F69 */}
                  <span className="font-ibm font-normal text-[16px] leading-[24px] text-[#575F69]">
                    {type.title}
                  </span>

                  {/* الوصف: IBM Plex Sans Arabic Regular 14px/16px, Color: #8C9198 */}
                  <span className="font-ibm font-normal text-[14px] leading-[16px] text-[#8C9198]">
                    {type.description}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* رابط تسجيل الدخول */}
          <div className="w-full text-center flex items-center justify-center gap-2">
            {/* النص العادي: IBM Plex Sans Arabic Regular 14px/16px, Color: #1F2937 */}
            <span className="font-ibm font-normal text-[14px] leading-[16px] text-[#1F2937]">
              لديك حساب؟
            </span>

            {/* الزر/الرابط: IBM Plex Sans Arabic Medium 14px/16px, Underline, Color: #123C91 */}
            <Link
              to="/login"
              className="font-ibm font-medium text-[14px] leading-[16px] text-[#123C91] underline hover:opacity-80 transition-opacity"
            >
              تسجيل دخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
