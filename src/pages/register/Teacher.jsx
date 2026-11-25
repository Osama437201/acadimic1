import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";
import loginIllustration from "../../assets/login-illustration.svg";
import { register, login } from "../../services/authService";
import { getCountries } from "../../services/lookupService";
import VerifyCodeModal from "../../components/VerifyCodeModal";

export default function RegisterTeacher() {
  const navigate = useNavigate();

  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

  const [form, setForm] = useState({
    experienceYears: "",
    username: "",
    fullName: "",
    countryId: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  useEffect(() => {
    getCountries()
      .then(setCountries)
      .catch(() => setCountries([]))
      .finally(() => setLoadingCountries(false));
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const selectedCountry = countries.find((c) => c.id === form.countryId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (form.password !== form.passwordConfirm) {
      setErrorMsg("كلمة المرور وتأكيدها غير متطابقين");
      return;
    }
    if (!selectedCountry) {
      setErrorMsg("من فضلك اختر الدولة");
      return;
    }

    setLoading(true);

    const phoneCode = selectedCountry.phoneCode || "+20";
    const fullPhone = form.phone.startsWith(phoneCode)
      ? form.phone
      : `${phoneCode}${form.phone.replace(/^0/, "")}`;

    try {
      await register({
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        countryCode: selectedCountry.code,
        phone: fullPhone,
        password: form.password,
        passwordConfirm: form.passwordConfirm,
        role: "teacher",
        // experienceYears هنبعتها بعدين في استكمال بيانات الملف
        // (completeTeacherProfile) - مش جزء من /auth/register الأساسي
      });

      setShowVerifyModal(true);
    } catch (err) {
      const msg = err.response?.data?.message || "حصل خطأ أثناء إنشاء الحساب، حاول تاني";
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
      <div dir="rtl" className="flex-1 flex items-center justify-center p-6 lg:p-10 h-full overflow-y-auto">
        <div className="w-full max-w-[512px] my-auto flex flex-col gap-6 items-start text-right">
          <div className="flex flex-col items-start gap-3 w-full">
            <Link to="/" className="w-[176px] h-[32px] flex items-center justify-start">
              <img src={logo} alt="الأكاديمية" className="w-[176px] h-[32px] object-contain" />
            </Link>
            <div className="flex flex-col gap-1">
              <h1 className="font-tajawal font-bold text-[24px] leading-[32px] text-[#1F2937]">
                مرحباً بك...
              </h1>
              <Link to="/register" className="font-ibm text-[14px] leading-[16px] text-[#123C91] underline w-fit">
                تغيير نوع الحساب
              </Link>
            </div>
          </div>

          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-right">
                {errorMsg}
              </div>
            )}

            <Field label="عدد سنوات الخبرة">
              <input
                type="number"
                min="0"
                required
                value={form.experienceYears}
                onChange={handleChange("experienceYears")}
                placeholder="أدخل عدد السنوات"
                className="w-full h-full bg-transparent outline-none font-ibm text-sm text-[#1F2937] placeholder:text-[#8C9198] text-right"
              />
            </Field>

            <Field label="اسم المستخدم">
              <input
                type="text"
                required
                value={form.username}
                onChange={handleChange("username")}
                placeholder="أدخل اسم مستخدم"
                className="w-full h-full bg-transparent outline-none font-ibm text-sm text-[#1F2937] placeholder:text-[#8C9198] text-right"
              />
            </Field>

            <Field label="الاسم بالكامل">
              <input
                type="text"
                required
                value={form.fullName}
                onChange={handleChange("fullName")}
                placeholder="أدخل اسمك الكامل"
                className="w-full h-full bg-transparent outline-none font-ibm text-sm text-[#1F2937] placeholder:text-[#8C9198] text-right"
              />
            </Field>

            <Field label="الدولة">
              <select
                required
                value={form.countryId}
                onChange={handleChange("countryId")}
                disabled={loadingCountries}
                className="w-full h-full bg-transparent outline-none font-ibm text-sm text-[#1F2937] text-right appearance-none cursor-pointer disabled:cursor-wait"
              >
                <option value="" disabled>
                  {loadingCountries ? "جاري التحميل..." : "اختر الدولة"}
                </option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.arabicName || c.name} {c.flag}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-3">
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

              <Field label="رقم الهاتف">
                <div className="flex items-center h-full w-full">
                  <span className="font-ibm text-sm text-[#1F2937] pl-2 border-l border-[#E5E5E5] shrink-0">
                    {selectedCountry?.phoneCode || "+20"}
                  </span>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleChange("phone")}
                    placeholder="رقم الهاتف"
                    dir="ltr"
                    className="w-full h-full pr-2 bg-transparent outline-none font-ibm text-sm text-[#1F2937] placeholder:text-[#8C9198] text-left"
                  />
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full h-14 px-6 rounded-lg mt-2
                         bg-[#123C91] hover:bg-[#0e2f73] transition-colors
                         disabled:opacity-60 disabled:cursor-not-allowed
                         font-tajawal font-medium text-base text-white"
            >
              {loading ? "جاري الإنشاء..." : "التالي"}
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
        onSuccess={async () => {
          setShowVerifyModal(false);
          try {
            await login({ email: form.email, password: form.password });
            navigate("/register/teacher/complete-profile", {
              state: { experienceYears: form.experienceYears },
            });
          } catch {
            navigate("/login");
          }
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