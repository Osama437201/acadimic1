import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import loginIllustration from "../assets/login-illustration.svg";
import { forgotPassword, verifyResetCode, resetPassword } from "../services/authService";
import VerifyCodeModal from "../components/VerifyCodeModal";

const PASSWORD_RULES = [
  { key: "length", label: "الحد الأدنى 8 أحرف", test: (v) => v.length >= 8 },
  { key: "upper", label: "حرف كبير واحد على الأقل", test: (v) => /[A-Z]/.test(v) },
  { key: "lower", label: "حرف صغير واحد على الأقل", test: (v) => /[a-z]/.test(v) },
  { key: "number", label: "رقم واحد على الأقل", test: (v) => /[0-9]/.test(v) },
  { key: "special", label: "رمز خاص واحد على الأقل", test: (v) => /[^A-Za-z0-9]/.test(v) },
  { key: "noSpace", label: "لا يحتوي على مسافات", test: (v) => v.length > 0 && !/\s/.test(v) },
];

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: إيميل, 2: مودال الكود (فوق نفس الصفحة), 3: كلمة مرور جديدة

  const [email, setEmail] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const passwordChecks = useMemo(
    () => PASSWORD_RULES.map((rule) => ({ ...rule, passed: rule.test(newPassword) })),
    [newPassword]
  );
  const allPassed = passwordChecks.every((c) => c.passed);

  // خطوة 1: طلب كود إعادة التعيين بالإيميل
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      await forgotPassword({ email });
      setShowVerifyModal(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "حصل خطأ أثناء إرسال الطلب، حاول تاني");
    } finally {
      setLoading(false);
    }
  };

  // خطوة 3: تعيين كلمة مرور جديدة
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!allPassed) {
      setErrorMsg("كلمة المرور لازم تحقق كل الشروط");
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setErrorMsg("كلمة المرور وتأكيدها غير متطابقين");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ email, newPassword });
      navigate("/login");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "حصل خطأ أثناء تغيير كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  const titles = {
    1: "إعادة تعيين كلمة المرور",
    3: "إعادة تعيين كلمة المرور",
  };

  return (
    <div className="h-screen w-full flex bg-white overflow-hidden">
      {/* الجانب الأيسر */}
      <div
        dir="rtl"
        className="hidden lg:flex flex-col justify-between shrink-0
                   w-[45%] xl:w-[768px] h-full p-8 xl:p-12
                   bg-gradient-to-b from-[#123C91] to-white"
      >
        <div className="flex-1 flex items-center justify-center min-h-0">
          <img src={loginIllustration} alt="منظومة تعليمية متكاملة" className="max-h-full max-w-full object-contain" />
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
      <div dir="rtl" className="flex-1 flex items-center justify-center p-6 lg:p-12 h-full overflow-y-auto lg:overflow-hidden">
        <div className="w-full max-w-[420px] my-auto flex flex-col gap-6 items-start text-right">
          <div className="flex flex-col items-start gap-2 w-full">
            <Link to="/" className="w-[176px] h-[32px] flex items-center justify-start">
              <img src={logo} alt="الأكاديمية" className="w-[176px] h-[32px] object-contain" />
            </Link>
            <h1 className="font-tajawal font-bold text-[24px] leading-[32px] text-[#1F2937]">
              {titles[step]}
            </h1>
          </div>

          {errorMsg && (
            <div className="w-full text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-right">
              {errorMsg}
            </div>
          )}

          {/* خطوة 1: الإيميل */}
          {step === 1 && (
            <form className="w-full flex flex-col gap-5 text-right" onSubmit={handleRequestCode}>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-tajawal font-medium text-[14px] leading-[16px] text-[#1F2937]">
                  البريد الإلكتروني
                </label>
                <div className="flex items-center w-full h-[48px] rounded-[8px] border border-[#E5E5E5] bg-[#F9FAFA] px-4">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="البريد الإلكتروني"
                    dir="ltr"
                    className="w-full h-full bg-transparent outline-none font-ibm text-[14px] text-[#1F2937] placeholder:text-[#8C9198] text-left"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[48px] rounded-[8px] bg-[#123C91] hover:bg-[#0e2f73] transition-colors
                           disabled:opacity-60 disabled:cursor-not-allowed
                           font-tajawal font-medium text-[16px] text-white"
              >
                {loading ? "جاري الإرسال..." : "إرسال"}
              </button>

              <div className="w-full text-center">
                <Link to="/login" className="inline-flex items-center gap-1 font-ibm text-[14px] leading-[16px] text-[#1F2937]">
                  <span>الرجوع إلى</span>
                  <span className="font-medium text-[#123C91] underline">تسجيل الدخول</span>
                </Link>
              </div>
            </form>
          )}

          {/* خطوة 3: كلمة مرور جديدة */}
          {step === 3 && (
            <form className="w-full flex flex-col gap-5 text-right" onSubmit={handleResetPassword}>
              <div className="flex flex-col gap-2">
                <label htmlFor="newPassword" className="font-tajawal font-medium text-[14px] leading-[16px] text-[#1F2937]">
                  كلمة المرور الجديدة
                </label>
                <div className="flex items-center w-full h-[48px] rounded-[8px] border border-[#E5E5E5] bg-[#F9FAFA] px-4">
                  <input
                    id="newPassword"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder=""
                    className="w-full h-full bg-transparent outline-none font-ibm text-[14px] text-[#1F2937]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="font-ibm text-[13px] text-[#8C9198]">يجب أن تتضمن كلمة المرور:</span>
                {passwordChecks.map((c) => (
                  <span
                    key={c.key}
                    className={`font-ibm text-[13px] leading-5 ${
                      c.passed ? "text-[#123C91] font-medium underline" : "text-[#8C9198]"
                    }`}
                  >
                    • {c.label}
                  </span>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="newPasswordConfirm" className="font-tajawal font-medium text-[14px] leading-[16px] text-[#1F2937]">
                  تأكيد كلمة المرور الجديدة
                </label>
                <div className="flex items-center w-full h-[48px] rounded-[8px] border border-[#E5E5E5] bg-[#F9FAFA] px-4">
                  <input
                    id="newPasswordConfirm"
                    type="password"
                    required
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                    className="w-full h-full bg-transparent outline-none font-ibm text-[14px] text-[#1F2937]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[48px] rounded-[8px] bg-[#123C91] hover:bg-[#0e2f73] transition-colors
                           disabled:opacity-60 disabled:cursor-not-allowed
                           font-tajawal font-medium text-[16px] text-white"
              >
                {loading ? "جاري الحفظ..." : "تعيين كلمة المرور"}
              </button>

              <div className="w-full text-center">
                <Link to="/login" className="inline-flex items-center gap-1 font-ibm text-[14px] leading-[16px] text-[#1F2937]">
                  <span>الرجوع إلى</span>
                  <span className="font-medium text-[#123C91] underline">تسجيل الدخول</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>

      <VerifyCodeModal
        open={showVerifyModal}
        email={email}
        displayIdentifier={email}
        title="لإكمال عملية إعادة تعيين كلمة المرور، نرجو إدخال الرمز المرسل إلى"
        onVerify={(code) => verifyResetCode({ resetCode: code })}
        onSuccess={() => {
          setShowVerifyModal(false);
          setStep(3);
        }}
        onClose={() => setShowVerifyModal(false)}
      />
    </div>
  );
}