import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import loginIllustration from "../assets/login-illustration.svg";
import { login } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [identifier, setIdentifier] = useState(""); // إيميل أو رقم هاتف
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // ملاحظة: السيرفر بيقبل "email" في الـ login حاليًا حسب اللي جربناه في بوستمان.
      // لو فعلاً بيقبل رقم هاتف أو يوزرنيم كمان، هنعرف من رسالة الخطأ لو ظهرت.
      const res = await login({ email: identifier, password });
      const user = res?.data;

      // بنحفظ بيانات المستخدم عشان نقدر نستخدمها في صفحات تانية (زي اسم ولي الأمر
      // في لوحة التحكم). لو فيه توكن راجع مع الرد، يفضل يتحفظ برضه هنا.
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
      if (res?.token) {
        localStorage.setItem("token", res.token);
      }

      // ⚠️ منطق التوجيه حسب الدور:
      // - المعلم لسه ما استكملش بياناته (منهج/صفوف/مواد) → صفحة استكمال البروفايل
      // - المعلم بروفايله مكتمل (registrationStatus === "active") → داشبورد المعلم
      // - الطالب → داشبورد الطالب مباشرة
      // - ولي الأمر → داشبورد ولي الأمر
      // نفس ملاحظة قبل كده: بنعتمد هنا على registrationStatus كإشارة اكتمال
      // البروفايل. لو الباك إند بيرجع حقل تاني أوضح (زي isProfileCompleted)،
      // قولّي عشان نظبط الشرط ده بالظبط.
      if (user?.role === "teacher") {
        if (user?.registrationStatus !== "active") {
          navigate("/register/teacher/complete-profile");
        } else {
          navigate("/teacher/dashboard");
        }
      } else if (user?.role === "student") {
        navigate("/student/dashboard");
      } else if (user?.role === "parent") {
        navigate("/parent/dashboard");
      } else {
        navigate("/"); // غيّرها للصفحة اللي المفروض باقي الأدوار تروحلها بعد الدخول
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "حصل خطأ أثناء تسجيل الدخول، حاول تاني";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-white">
      {/* الرسمة - يسار الصفحة (متخفي على الموبايل) */}
      <div
        dir="rtl"
        className="hidden lg:flex flex-col justify-between shrink-0
                   w-[45%] xl:w-[768px] h-full
                   px-10 py-10 overflow-hidden
                   bg-[linear-gradient(180deg,#123C91_0%,#FFFFFF_65%)]"
      >
        <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden">
          <img
            src={loginIllustration}
            alt="منظومة تعليمية متكاملة"
            className="max-h-full w-full max-w-[680px] h-auto object-contain"
          />
        </div>

        <div className="flex flex-col gap-2 text-right shrink-0">
          <h2 className="font-tajawal font-bold text-[32px] leading-[100%] text-[#123C91]">
            منظومة تعليمية متكاملة
          </h2>
          <p className="font-ibm text-2xl leading-[100%] text-[#575F69] max-w-[521px]">
            نجمع بين الطلاب وأولياء الأمور والمعلمين في منصة واحدة لتجربة
            تعليمية أكثر تنظيمًا وفعالية.
          </p>
        </div>
      </div>

      {/* الفورم - يمين الصفحة */}
      <div
        dir="rtl"
        className="flex-1 h-full flex items-center justify-center px-6 sm:px-10 py-6 overflow-y-auto"
      >
        <div className="w-full max-w-[512px] flex flex-col gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 w-[150px] sm:w-[176px] h-8"
          >
            <img src={logo} alt="الأكاديمية" className="h-8 w-auto" />
          </Link>

          <h1 className="font-tajawal font-bold text-2xl leading-8 text-[#1F2937]">
            مرحباً بك...
          </h1>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-right">
                {errorMsg}
              </div>
            )}

            {/* اسم المستخدم / رقم الهاتف */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="identifier"
                className="font-tajawal font-medium text-sm text-[#1F2937]"
              >
                اسم المستخدم أو رقم الهاتف
              </label>
              <div className="flex items-center h-12 px-4 rounded-lg border border-[#E5E5E5] bg-[#F9FAFA]">
                <input
                  id="identifier"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="أدخل رقم الهاتف أو اسم المستخدم"
                  className="w-full bg-transparent outline-none font-ibm text-sm text-[#1F2937] placeholder:text-[#8C9198] text-right"
                />
              </div>
            </div>

            {/* كلمة المرور */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="font-tajawal font-medium text-sm text-[#1F2937]"
              >
                كلمة المرور
              </label>
              <div className="flex items-center gap-2.5 h-12 px-4 rounded-lg border border-[#E5E5E5] bg-[#F9FAFA]">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full bg-transparent outline-none font-ibm text-sm text-[#1F2937] placeholder:text-[#8C9198] text-right"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                  }
                  className="shrink-0"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* تذكرني + نسيت كلمة المرور */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember((v) => !v)}
                  className="w-4 h-4 rounded border-[#E5E5E5] accent-[#123C91] cursor-pointer"
                />
                <span className="font-ibm text-sm text-[#1F2937]">تذكرني</span>
              </label>

              <Link
                to="/forgot-password"
                className="font-ibm font-medium text-sm text-[#123C91] underline"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* زرار الدخول */}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full h-14 px-6 rounded-lg
                         bg-[#123C91] hover:bg-[#0e2f73] transition-colors
                         disabled:opacity-60 disabled:cursor-not-allowed
                         font-tajawal font-medium text-base text-white"
            >
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>
          </form>

          <p className="text-center font-ibm text-sm text-[#575F69]">
            ليس لديك حساب؟{" "}
            <Link
              to="/create-account"
              className="font-tajawal font-medium text-[#123C91] underline"
            >
              إنشاء حساب
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#8C9198"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.77 21.77 0 0 1 5.06-6.06M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.77 21.77 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#8C9198"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}