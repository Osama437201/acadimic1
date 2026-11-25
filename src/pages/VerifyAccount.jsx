import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";
import loginIllustration from "../assets/login-illustration.svg";
import { verifyAccount } from "../services/authService";

export default function VerifyAccount() {
  const navigate = useNavigate();
  const location = useLocation();

  // بنستقبل الإيميل من صفحة التسجيل (لو المستخدم دخل الصفحة مباشرة، هيدخله يدوي)
  const emailFromRegister = location.state?.email || "";

  const [email, setEmail] = useState(emailFromRegister);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const data = await verifyAccount({ email, code });
      setSuccessMsg(data?.message || "تم تفعيل الحساب بنجاح");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const msg =
        err.response?.data?.message || "الكود غير صحيح أو منتهي الصلاحية";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-white overflow-hidden">
      {/* الجانب الأيسر */}
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

      {/* الجانب الأيمن */}
      <div
        dir="rtl"
        className="flex-1 flex items-center justify-center p-6 lg:p-12 h-full overflow-y-auto lg:overflow-hidden"
      >
        <div className="w-full max-w-[512px] my-auto flex flex-col gap-8 items-start text-right">
          <div className="flex flex-col items-start gap-4 w-full">
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

            <h1 className="font-tajawal font-bold text-[24px] leading-[32px] text-[#1F2937]">
              تفعيل الحساب
            </h1>
            <p className="font-ibm text-sm text-[#575F69]">
              أدخل الكود اللي وصلك على بريدك الإلكتروني
            </p>
          </div>

          <div className="w-full max-w-[512px] bg-white border border-[#E5E5E5] rounded-2xl p-6 sm:p-8 shadow-sm">
            <form
              className="flex flex-col gap-5 text-right"
              onSubmit={handleSubmit}
            >
              {errorMsg && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-right">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-right">
                  {successMsg}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="font-tajawal font-medium text-[14px] leading-[16px] text-[#1F2937]"
                >
                  البريد الإلكتروني
                </label>
                <div className="flex items-center w-full h-[48px] rounded-[8px] border border-[#E5E5E5] bg-[#F9FAFA] px-4">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    dir="ltr"
                    className="w-full h-full bg-transparent outline-none font-ibm text-[14px] text-[#1F2937] placeholder:text-[#8C9198] text-left"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="code"
                  className="font-tajawal font-medium text-[14px] leading-[16px] text-[#1F2937]"
                >
                  كود التحقق
                </label>
                <div className="flex items-center w-full h-[48px] rounded-[8px] border border-[#E5E5E5] bg-[#F9FAFA] px-4">
                  <input
                    id="code"
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="******"
                    dir="ltr"
                    className="w-full h-full bg-transparent outline-none font-ibm text-[14px] text-[#1F2937] placeholder:text-[#8C9198] text-left tracking-widest"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[48px] rounded-[8px] bg-[#123C91] hover:bg-[#0e2f73] transition-colors
                           disabled:opacity-60 disabled:cursor-not-allowed
                           font-tajawal font-medium text-[16px] text-white mt-2 shrink-0"
              >
                {loading ? "جاري التفعيل..." : "تفعيل الحساب"}
              </button>

              <div className="text-center mt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 font-ibm text-[14px] leading-[16px] text-[#1F2937]"
                >
                  <span>الرجوع إلى</span>
                  <span className="font-medium text-[#123C91] underline">
                    تسجيل الدخول
                  </span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
