import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";
import loginIllustration from "../../assets/login-illustration.svg";
import {
  getCurriculums,
  getStagesByCurriculum,
  getGradesByStage,
  getSubjectsByGrade,
} from "../../services/lookupService";
import { completeTeacherProfile } from "../../services/authService";

const LANGUAGES = [
  { value: "ar", label: "العربية" },
  { value: "en", label: "الإنجليزية" },
];

export default function TeacherCompleteProfile() {
  const location = useLocation();
  const navigate = useNavigate();

  const [curriculums, setCurriculums] = useState([]);
  // كل عنصر هنا: { id, name, stageId } - محتفظين بالـ stageId عشان نبعته
  // في الـ payload النهائي لكل صف
  const [grades, setGrades] = useState([]);
  // المواد بتاعة كل صف مختار، مفتاحها gradeId: { [gradeId]: [subjects] }
  const [subjectsByGrade, setSubjectsByGrade] = useState({});

  const [loadingLists, setLoadingLists] = useState({
    curriculums: false,
    grades: false,
    subjects: false,
  });

  const [form, setForm] = useState({
    curriculum: "",
    language: "",
    experienceYears: location.state?.experienceYears || "",
    selectedGradeIds: [], // ["gradeId1", "gradeId2"]
    selectedSubjectsByGrade: {}, // { gradeId: ["subjectId1", "subjectId2"] }
    cvFile: null,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setLoadingLists((s) => ({ ...s, curriculums: true }));
    getCurriculums()
      .then(setCurriculums)
      .catch(() => setCurriculums([]))
      .finally(() => setLoadingLists((s) => ({ ...s, curriculums: false })));
  }, []);

  // لما يختار منهج -> جيب كل الصفوف بتاعت كل مراحل المنهج ده، ونحتفظ
  // بالـ stageId بتاع كل صف
  useEffect(() => {
    if (!form.curriculum) {
      setGrades([]);
      return;
    }
    let cancelled = false;
    setLoadingLists((s) => ({ ...s, grades: true }));
    setForm((f) => ({
      ...f,
      selectedGradeIds: [],
      selectedSubjectsByGrade: {},
    }));
    setSubjectsByGrade({});

    getStagesByCurriculum(form.curriculum)
      .then(async (stages) => {
        const gradesPerStage = await Promise.all(
          stages.map(async (stage) => {
            const stageGrades = await getGradesByStage(stage.id);
            // بنلصق stageId على كل grade عشان نستخدمه وقت بناء الـ payload
            return stageGrades.map((g) => ({ ...g, stageId: stage.id }));
          }),
        );
        if (!cancelled) setGrades(gradesPerStage.flat());
      })
      .catch(() => !cancelled && setGrades([]))
      .finally(
        () => !cancelled && setLoadingLists((s) => ({ ...s, grades: false })),
      );

    return () => {
      cancelled = true;
    };
  }, [form.curriculum]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // لما يختار/يلغي صف -> نجيب مواد الصف ده تحديدًا (لو لسه ماجبناهاش)
  const toggleGrade = async (gradeId) => {
    const isSelected = form.selectedGradeIds.includes(gradeId);

    if (isSelected) {
      setForm((prev) => {
        const nextSubjects = { ...prev.selectedSubjectsByGrade };
        delete nextSubjects[gradeId];
        return {
          ...prev,
          selectedGradeIds: prev.selectedGradeIds.filter((g) => g !== gradeId),
          selectedSubjectsByGrade: nextSubjects,
        };
      });
      return;
    }

    setForm((prev) => ({
      ...prev,
      selectedGradeIds: [...prev.selectedGradeIds, gradeId],
    }));

    if (!subjectsByGrade[gradeId]) {
      setLoadingLists((s) => ({ ...s, subjects: true }));
      try {
        const subjects = await getSubjectsByGrade(gradeId);
        setSubjectsByGrade((prev) => ({ ...prev, [gradeId]: subjects }));
      } catch {
        setSubjectsByGrade((prev) => ({ ...prev, [gradeId]: [] }));
      } finally {
        setLoadingLists((s) => ({ ...s, subjects: false }));
      }
    }
  };

  const toggleSubject = (gradeId, subjectId) => {
    setForm((prev) => {
      const current = prev.selectedSubjectsByGrade[gradeId] || [];
      const next = current.includes(subjectId)
        ? current.filter((s) => s !== subjectId)
        : [...current, subjectId];
      return {
        ...prev,
        selectedSubjectsByGrade: {
          ...prev.selectedSubjectsByGrade,
          [gradeId]: next,
        },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const hasAtLeastOneSubject = form.selectedGradeIds.some(
      (gradeId) => (form.selectedSubjectsByGrade[gradeId] || []).length > 0,
    );

    if (
      !form.curriculum ||
      !form.language ||
      !form.experienceYears ||
      form.selectedGradeIds.length === 0 ||
      !hasAtLeastOneSubject
    ) {
      setErrorMsg(
        "من فضلك أكمل كل الحقول المطلوبة، واختر مادة واحدة على الأقل لكل صف",
      );
      return;
    }

    // ✅ الشكل الصحيح المؤكد: منهج واحد يحتوي على array من المراحل، كل مرحلة
    // تحتوي على array من الصفوف، كل صف معاه المواد بتاعته.
    // بنجمع الصفوف المختارة حسب المرحلة (stageId) بتاعتها الأول.
    const stagesMap = {};
    form.selectedGradeIds.forEach((gradeId) => {
      const gradeObj = grades.find((g) => g.id === gradeId);
      const subjects = form.selectedSubjectsByGrade[gradeId] || [];
      if (!gradeObj || subjects.length === 0) return;

      if (!stagesMap[gradeObj.stageId]) {
        stagesMap[gradeObj.stageId] = [];
      }
      stagesMap[gradeObj.stageId].push({ grade: gradeId, subjects });
    });

    const stages = Object.entries(stagesMap).map(([stageId, gradesArr]) => ({
      stage: stageId,
      grades: gradesArr,
    }));

    if (stages.length === 0) {
      setErrorMsg("من فضلك اختر صف واحد على الأقل ومادة واحدة على الأقل له");
      return;
    }

    const teachingSelections = [
      {
        curriculum: form.curriculum,
        stages,
      },
    ];

    setLoading(true);
    try {
      await completeTeacherProfile({
        language: form.language,
        experienceYears: Number(form.experienceYears),
        teachingSelections,
        cvFile: form.cvFile,
      });

      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (storedUser) {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...storedUser, registrationStatus: "active" }),
        );
      }

      navigate("/teacher/dashboard");
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "حصل خطأ أثناء إرسال الطلب، حاول تاني",
      );
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
          <div className="flex flex-col items-start gap-3 w-full">
            <Link
              to="/"
              className="w-[176px] h-[32px] flex items-center justify-center"
            >
              <img
                src={logo}
                alt="الأكاديمية"
                className="w-[176px] h-[32px] object-contain"
              />
            </Link>
            <h1 className="font-tajawal font-bold text-[24px] leading-[32px] text-[#1F2937] self-start">
              مرحباً بك...
            </h1>
          </div>

          {errorMsg && (
            <div className="w-full text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-right">
              {errorMsg}
            </div>
          )}

          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
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
                  <option key={c.id} value={c.id}>
                    {c.name?.ar || c.name?.en}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="لغة التدريس">
              <select
                required
                value={form.language}
                onChange={handleChange("language")}
                className="w-full h-full bg-transparent outline-none font-ibm text-sm text-[#1F2937] text-right appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  اختر لغة التدريس
                </option>
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="عدد سنوات الخبرة">
              <input
                type="number"
                min="0"
                required
                value={form.experienceYears}
                onChange={handleChange("experienceYears")}
                className="w-full h-full bg-transparent outline-none font-ibm text-sm text-[#1F2937] text-right"
              />
            </Field>

            {/* الصفوف + المواد الخاصة بكل صف */}
            <div className="flex flex-col gap-3 w-full">
              <label className="font-tajawal font-medium text-sm text-[#1F2937]">
                الصفوف والمواد التي ترغب بتدريسها
              </label>

              {!form.curriculum && (
                <span className="font-ibm text-sm text-[#8C9198]">
                  اختر المنهج أولًا
                </span>
              )}
              {loadingLists.grades && (
                <span className="font-ibm text-sm text-[#8C9198]">
                  جاري تحميل الصفوف...
                </span>
              )}

              {grades.map((g) => {
                const isGradeSelected = form.selectedGradeIds.includes(g.id);
                const gradeSubjects = subjectsByGrade[g.id] || [];
                const selectedSubjectsForGrade =
                  form.selectedSubjectsByGrade[g.id] || [];

                return (
                  <div
                    key={g.id}
                    className="border border-[#E5E5E5] rounded-lg p-3 flex flex-col gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => toggleGrade(g.id)}
                      className={`self-start px-4 h-10 rounded-full border font-ibm text-sm transition-colors
                        ${isGradeSelected ? "border-[#123C91] bg-[#123C91] text-white" : "border-[#E5E5E5] bg-white text-[#575F69]"}`}
                    >
                      {g.name?.ar || g.name?.en}
                    </button>

                    {isGradeSelected && (
                      <div className="flex flex-wrap gap-2 pr-2">
                        {gradeSubjects.length === 0 ? (
                          <span className="font-ibm text-xs text-[#8C9198]">
                            جاري تحميل المواد...
                          </span>
                        ) : (
                          gradeSubjects.map((s) => {
                            const active = selectedSubjectsForGrade.includes(
                              s.id,
                            );
                            return (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => toggleSubject(g.id, s.id)}
                                className={`px-3 h-8 rounded-full border font-ibm text-xs transition-colors
                                  ${active ? "border-[#12C6B0] bg-[#12C6B0] text-white" : "border-[#E5E5E5] bg-white text-[#575F69]"}`}
                              >
                                {s.name?.ar || s.name?.en}
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* رفع السيرة الذاتية */}
            <div className="flex flex-col gap-2 w-full">
              <label className="font-tajawal font-medium text-sm text-[#1F2937]">
                إرفاق ملف السيرة الذاتية
              </label>
              <label className="w-full border-2 border-dashed border-[#E5E5E5] rounded-lg py-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#123C91] transition-colors">
                <span className="font-ibm text-sm text-[#8C9198]">
                  {form.cvFile
                    ? form.cvFile.name
                    : "اسحب وأفلت هنا أو اضغط لرفع ملف من الجهاز (اختياري)"}
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      cvFile: e.target.files?.[0] || null,
                    }))
                  }
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full h-14 px-6 rounded-lg mt-2
                         bg-[#123C91] hover:bg-[#0e2f73] transition-colors
                         disabled:opacity-60 disabled:cursor-not-allowed
                         font-tajawal font-medium text-base text-white"
            >
              {loading ? "جاري الإرسال..." : "تقديم طلب التسجيل"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="font-tajawal font-medium text-sm text-[#1F2937]">
        {label}
      </label>
      <div className="flex items-center h-12 px-4 rounded-lg border border-[#E5E5E5] bg-[#F9FAFA]">
        {children}
      </div>
    </div>
  );
}
