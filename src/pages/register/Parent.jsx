import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";
import loginIllustration from "../../assets/login-illustration.svg";
import { register } from "../../services/authService";
import VerifyCodeModal from "../../components/VerifyCodeModal";

export default function RegisterParent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (form.password !== form.passwordConfirm) {
      setErrorMsg("كلمة المرور وتأكيدها غير متطابقين");
      return;
    }

    setLoading(true);

    // السيرفر عايز الرقم بالصيغة الدولية كاملة (+20...)
    const fullPhone = form.phone.startsWith("+20")
      ? form.phone
      : `+20${form.phone.replace(/^0/, "")}`;

    try {
      await register({
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        countryCode: "EG",
        phone: fullPhone,
        password: form.password,
        passwordConfirm: form.passwordConfirm,
        role: "parent",
      });

      // بعد التسجيل، السيرفر بيبعت كود تحقق على الإيميل - نفتح نافذة التفعيل
      setShowVerifyModal(true);
    } catch (err) {
      const msg =
        err.response?.data?.message || "حصل خطأ أثناء إنشاء الحساب، حاول تاني";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-white overflow-hidden">
      {/* الجانب الأيسر - ثابت */}
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
        className="flex-1 flex items-center justify-center p-6 lg:p-10 h-full overflow-y-auto"
      >
        <div className="w-full max-w-[512px] my-auto flex flex-col gap-6 items-start text-right">
          {/* اللوجو + العنوان */}
          <div className="flex flex-col items-start gap-3 w-full">
            <Link to="/" className="w-[176px] h-[32px] flex items-center justify-start">
              <img src={logo} alt="الأكاديمية" className="w-[176px] h-[32px] object-contain" />
            </Link>

            <div className="flex flex-col gap-1">
              <h1 className="font-tajawal font-bold text-[24px] leading-[32px] text-[#1F2937]">
                إنشاء حساب ولي أمر
              </h1>
              <Link
                to="/register"
                className="font-ibm text-[14px] leading-[16px] text-[#123C91] underline w-fit"
              >
                تغيير نوع الحساب
              </Link>
            </div>
          </div>

          {/* الفورم */}
          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-right">
                {errorMsg}
              </div>
            )}

            {/* الاسم الكامل */}
            <Field label="الاسم بالكامل">
              <input
                type="text"
                required
                value={form.fullName}
                onChange={handleChange("fullName")}
                placeholder="أدخل اسمك بالكامل"
                className="w-full h-full bg-transparent outline-none font-ibm text-sm text-[#1F2937] placeholder:text-[#8C9198] text-right"
              />
            </Field>

            {/* اسم المستخدم */}
            <Field label="اسم المستخدم">
              <input
                type="text"
                required
                value={form.username}
                onChange={handleChange("username")}
                placeholder="اختر اسم مستخدم"
                className="w-full h-full bg-transparent outline-none font-ibm text-sm text-[#1F2937] placeholder:text-[#8C9198] text-right"
              />
            </Field>

            {/* الإيميل */}
            <Field label="البريد الإلكتروني">
              <input
                type="email"
                required
                value={form.email}
                onChange={handleChange("email")}
                placeholder="example@email.com"
                dir="ltr"
                className="w-full h-full bg-transparent outline-none font-ibm text-sm text-[#1F2937] placeholder:text-[#8C9198] text-left"
              />
            </Field>

            {/* رقم الهاتف */}
            <Field label="رقم الهاتف">
              <div className="flex items-center h-full w-full">
                <span className="font-ibm text-sm text-[#1F2937] pl-2 border-l border-[#E5E5E5] shrink-0">
                  +20
                </span>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={handleChange("phone")}
                  placeholder="1011111111"
                  dir="ltr"
                  className="w-full h-full pr-3 bg-transparent outline-none font-ibm text-sm text-[#1F2937] placeholder:text-[#8C9198] text-left"
                />
              </div>
            </Field>

            {/* كلمة المرور */}
            <Field label="كلمة المرور">
              <input
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={handleChange("password")}
                placeholder="********"
                className="w-full h-full bg-transparent outline-none font-ibm text-sm text-[#1F2937] placeholder:text-[#8C9198] text-right"
              />
            </Field>

            {/* تأكيد كلمة المرور */}
            <Field label="تأكيد كلمة المرور">
              <input
                type="password"
                required
                minLength={8}
                value={form.passwordConfirm}
                onChange={handleChange("passwordConfirm")}
                placeholder="********"
                className="w-full h-full bg-transparent outline-none font-ibm text-sm text-[#1F2937] placeholder:text-[#8C9198] text-right"
              />
            </Field>

            {/* زرار الإنشاء */}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full h-14 px-6 rounded-lg mt-2
                         bg-[#123C91] hover:bg-[#0e2f73] transition-colors
                         disabled:opacity-60 disabled:cursor-not-allowed
                         font-tajawal font-medium text-base text-white"
            >
              {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
            </button>
          </form>

          <p className="w-full text-center font-ibm text-sm text-[#575F69]">
            لديك حساب بالفعل؟{" "}
            <Link to="/login" className="font-tajawal font-medium text-[#123C91] underline">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>

      <VerifyCodeModal
        open={showVerifyModal}
        email={form.email}
        displayIdentifier={form.email}
        onSuccess={() => {
          setShowVerifyModal(false);
          navigate("/login");
        }}
        onClose={() => setShowVerifyModal(false)}
      />
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="font-tajawal font-medium text-sm text-[#1F2937]">{label}</label>
      <div className="flex items-center h-12 px-4 rounded-lg border border-[#E5E5E5] bg-[#F9FAFA]">
        {children}
      </div>
    </div>
  );
}