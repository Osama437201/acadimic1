import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";
import loginIllustration from "../../assets/login-illustration.svg";
import {
  getCurriculums,
  getStagesByCurriculum,
  getGradesByStage,
  getSubjectsByGrade,
} from "../../services/lookupService";
import { completeStudentProfile } from "../../services/authService";
import RegistrationStatus from "../../components/RegistrationStatus";

const SERVICE_TYPES = [
  { value: "private", label: "خاص" },
  { value: "group", label: "مجموعة" },
];

const LANGUAGES = [
  { value: "ar", label: "العربية" },
  { value: "en", label: "الإنجليزية" },
];

export default function StudentCompleteProfile() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = تفاصيل دراسية, 2 = المواد, 3 = نجاح

  const [curriculums, setCurriculums] = useState([]);
  const [stages, setStages] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [form, setForm] = useState({
    serviceType: "",
    birthDate: "",
    studyLanguage: "",
    curriculum: "",
    stage: "",
    grade: "",
    preferredSubjects: [],
  });

  const [loading, setLoading] = useState(false);
  const [loadingLists, setLoadingLists] = useState({ curriculums: false, stages: false, grades: false, subjects: false });
  const [errorMsg, setErrorMsg] = useState("");

  // جيب المناهج أول ما الصفحة تفتح
  useEffect(() => {
    setLoadingLists((s) => ({ ...s, curriculums: true }));
    getCurriculums()
      .then(setCurriculums)
      .catch(() => setCurriculums([]))
      .finally(() => setLoadingLists((s) => ({ ...s, curriculums: false })));
  }, []);

  // لما يختار منهج -> جيب المراحل بتاعته
  useEffect(() => {
    if (!form.curriculum) {
      setStages([]);
      return;
    }
    setLoadingLists((s) => ({ ...s, stages: true }));
    getStagesByCurriculum(form.curriculum)
      .then(setStages)
      .catch(() => setStages([]))
      .finally(() => setLoadingLists((s) => ({ ...s, stages: false })));
    setForm((f) => ({ ...f, stage: "", grade: "" }));
    setGrades([]);
  }, [form.curriculum]);

  // لما يختار مرحلة -> جيب الصفوف بتاعتها
  useEffect(() => {
    if (!form.stage) {
      setGrades([]);
      return;
    }
    setLoadingLists((s) => ({ ...s, grades: true }));
    getGradesByStage(form.stage)
      .then(setGrades)
      .catch(() => setGrades([]))
      .finally(() => setLoadingLists((s) => ({ ...s, grades: false })));
    setForm((f) => ({ ...f, grade: "" }));
  }, [form.stage]);

  // لما يختار صف -> جيب المواد بتاعته
  useEffect(() => {
    if (!form.grade) {
      setSubjects([]);
      return;
    }
    setLoadingLists((s) => ({ ...s, subjects: true }));
    getSubjectsByGrade(form.grade)
      .then(setSubjects)
      .catch(() => setSubjects([]))
      .finally(() => setLoadingLists((s) => ({ ...s, subjects: false })));
    setForm((f) => ({ ...f, preferredSubjects: [] }));
  }, [form.grade]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const toggleSubject = (id) => {
    setForm((prev) => {
      const exists = prev.preferredSubjects.includes(id);
      return {
        ...prev,
        preferredSubjects: exists
          ? prev.preferredSubjects.filter((s) => s !== id)
          : [...prev.preferredSubjects, id],
      };
    });
  };

  const goToSubjectsStep = (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!form.birthDate || !form.studyLanguage || !form.curriculum || !form.stage || !form.grade) {
      setErrorMsg("من فضلك أكمل كل الحقول قبل المتابعة");
      return;
    }
    setStep(2);
  };

  const handleFinalSubmit = async () => {
    setErrorMsg("");
    if (form.preferredSubjects.length === 0) {
      setErrorMsg("اختر مادة واحدة على الأقل");
      return;
    }
    setLoading(true);
    try {
      await completeStudentProfile({
        birthDate: form.birthDate,
        studyLanguage: form.studyLanguage,
        curriculum: form.curriculum,
        stage: form.stage,
        grade: form.grade,
        preferredSubjects: form.preferredSubjects,
      });
      setStep(3);
    } catch (err) {
      const msg = err.response?.data?.message || "حصل خطأ أثناء حفظ البيانات، حاول تاني";
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
        <div className={`w-full max-w-[512px] my-auto flex flex-col gap-6 ${step >= 3 ? "items-center text-center" : "items-start text-right"}`}>
          <div className={`flex flex-col items-center gap-3 w-full ${step >= 3 ? "text-center" : "items-start text-right"}`}>
            <Link to="/" className="w-[176px] h-[32px] flex items-center justify-center">
              <img src={logo} alt="الأكاديمية" className="w-[176px] h-[32px] object-contain" />
            </Link>
            {step < 3 && (
              <h1 className="font-tajawal font-bold text-[24px] leading-[32px] text-[#1F2937] self-start">
                مرحباً بك...
              </h1>
            )}
          </div>

          {errorMsg && (
            <div className="w-full text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-right">
              {errorMsg}
            </div>
          )}

          {/* ------- الخطوة 1: التفاصيل الدراسية ------- */}
          {step === 1 && (
            <form className="w-full flex flex-col gap-4" onSubmit={goToSubjectsStep}>
              <div className="flex flex-col gap-2 w-full">
                <label className="font-tajawal font-medium text-sm text-[#1F2937]">اختر نوع الخدمة</label>
                <div className="flex gap-3">
                  {SERVICE_TYPES.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, serviceType: opt.value }))}
                      className={`flex-1 h-12 rounded-lg border font-ibm text-sm transition-colors
                        ${form.serviceType === opt.value
                          ? "border-[#123C91] bg-[#EAF1FF] text-[#123C91]"
                          : "border-[#E5E5E5] bg-[#F9FAFA] text-[#575F69]"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <Field label="تاريخ الميلاد">
                <input
                  type="date"
                  required
                  value={form.birthDate}
                  onChange={handleChange("birthDate")}
                  className="w-full h-full bg-transparent outline-none font-ibm text-sm text-[#1F2937] text-right"
                />
              </Field>

              <Field label="لغة التعلم المفضلة">
                <select
                  required
                  value={form.studyLanguage}
                  onChange={handleChange("studyLanguage")}
                  className="w-full h-full bg-transparent outline-none font-ibm text-sm text-[#1F2937] text-right appearance-none cursor-pointer"
                >
                  <option value="" disabled>اختر لغة التعلم</option>
                  {LANGUAGES.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </Field>

              <Field label="المنهج الدراسي">
                <select
                  required
                  value={form.curriculum}
                  onChange={handleChange("curriculum")}
                  disabled={loadingLists.curriculums}
                  className="w-full h-full bg-transparent outline-none font-ibm text-sm text-[#1F2937] text-right appearance-none cursor-pointer"
                >
                  <option value="" disabled>
                    {loadingLists.curriculums ? "جاري التحميل..." : "اختر المنهج"}
                  </option>
                  {curriculums.map((c) => (
                    <option key={c.id} value={c.id}>{c.name?.ar || c.name?.en}</option>
                  ))}
                </select>
              </Field>

              <Field label="المرحلة الدراسية">
                <select
                  required
                  value={form.stage}
                  onChange={handleChange("stage")}
                  disabled={!form.curriculum || loadingLists.stages}
                  className="w-full h-full bg-transparent outline-none font-ibm text-sm text-[#1F2937] text-right appearance-none cursor-pointer disabled:cursor-not-allowed"
                >
                  <option value="" disabled>
                    {!form.curriculum ? "اختر المنهج أولًا" : loadingLists.stages ? "جاري التحميل..." : "اختر المرحلة"}
                  </option>
                  {stages.map((s) => (
                    <option key={s.id} value={s.id}>{s.name?.ar || s.name?.en}</option>
                  ))}
                </select>
              </Field>

              <Field label="الصف الدراسي">
                <select
                  required
                  value={form.grade}
                  onChange={handleChange("grade")}
                  disabled={!form.stage || loadingLists.grades}
                  className="w-full h-full bg-transparent outline-none font-ibm text-sm text-[#1F2937] text-right appearance-none cursor-pointer disabled:cursor-not-allowed"
                >
                  <option value="" disabled>
                    {!form.stage ? "اختر المرحلة أولًا" : loadingLists.grades ? "جاري التحميل..." : "اختر الصف"}
                  </option>
                  {grades.map((g) => (
                    <option key={g.id} value={g.id}>{g.name?.ar || g.name?.en}</option>
                  ))}
                </select>
              </Field>

              <button
                type="submit"
                className="flex items-center justify-center w-full h-14 px-6 rounded-lg mt-2
                           bg-[#123C91] hover:bg-[#0e2f73] transition-colors
                           font-tajawal font-medium text-base text-white"
              >
                التالي
              </button>
            </form>
          )}

          {/* ------- الخطوة 2: المواد ------- */}
          {step === 2 && (
            <div className="w-full flex flex-col gap-5">
              <label className="font-tajawal font-medium text-sm text-[#1F2937]">
                المواد التي ترغب بدراستها
              </label>
              <div className="flex flex-wrap gap-2">
                {loadingLists.subjects && (
                  <span className="font-ibm text-sm text-[#8C9198]">جاري تحميل المواد...</span>
                )}
                {subjects.map((s) => {
                  const active = form.preferredSubjects.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleSubject(s.id)}
                      className={`px-4 h-10 rounded-full border font-ibm text-sm transition-colors
                        ${active
                          ? "border-[#123C91] bg-[#123C91] text-white"
                          : "border-[#E5E5E5] bg-white text-[#575F69]"}`}
                    >
                      {s.name?.ar || s.name?.en}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 h-12 rounded-lg border border-[#E5E5E5] font-tajawal font-medium text-[#575F69]"
                >
                  رجوع
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={loading}
                  className="flex-1 h-12 rounded-lg bg-[#123C91] hover:bg-[#0e2f73]
                             disabled:opacity-60 disabled:cursor-not-allowed
                             font-tajawal font-medium text-white transition-colors"
                >
                  {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
                </button>
              </div>
            </div>
          )}

          {/* ------- الخطوة 3: نجاح - قيد المراجعة ------- */}
          {step === 3 && <RegistrationStatus />}
        </div>
      </div>
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