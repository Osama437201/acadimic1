import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addStudent } from "../../services/parentService";
import {
  getCountries,
  getCurriculums,
  getStagesByCurriculum,
  getGradesByStage,
  getSubjectsByGrade,
} from "../../services/lookupService";
import { getLocalizedName } from "../../utils/getLocalizedName";

/**
 * توليد اسم مستخدم وكلمة مرور تلقائيين لحالة "الدخول عبر حساب ولي الأمر"
 * (نفس التعليق اللي في النسخة السابقة - الباك اند لسه محتاج username/password
 * إجباري، فبنولّدهم في الخلفية بدل ما نطلب من ولي الأمر يكتبهم).
 */
function generateAutoCredentials(fullName) {
  const cleanName = (fullName || "student")
    .trim()
    .replace(/\s+/g, "")
    .replace(/[^a-zA-Zء-ي0-9]/g, "")
    .toLowerCase()
    .slice(0, 12) || "student";

  const randomSuffix = Math.random().toString(36).slice(2, 8);
  const randomPassword = Math.random().toString(36).slice(2, 10) + "A1";

  return {
    username: `${cleanName}_${randomSuffix}`,
    password: randomPassword,
  };
}

// بيرتب تاريخ من "YYYY-MM-DD" لعرض عربي بسيط "YYYY/MM/DD"
function formatDateForDisplay(isoDate) {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-");
  if (!y || !m || !d) return isoDate;
  return `${y}/${m}/${d}`;
}

export default function Step4Review({ formData, onBack }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingLabels, setLoadingLabels] = useState(true);

  // أسماء العرض المقابلة للـ IDs المخزنة في formData
  const [labels, setLabels] = useState({
    countryName: "",
    curriculumName: "",
    stageName: "",
    gradeName: "",
    subjectNames: [],
  });

  const isParentLinked = formData.accountType === "parent";

  // بنجيب أسماء العرض الحقيقية بدل الـ IDs عشان نعرضها في صفحة المراجعة
  useEffect(() => {
    let cancelled = false;

    async function loadLabels() {
      setLoadingLabels(true);
      try {
        const [countries, curriculums, stages, grades, subjects] = await Promise.all([
          getCountries(),
          getCurriculums(),
          formData.curriculum ? getStagesByCurriculum(formData.curriculum) : Promise.resolve([]),
          formData.stage ? getGradesByStage(formData.stage) : Promise.resolve([]),
          formData.grade ? getSubjectsByGrade(formData.grade) : Promise.resolve([]),
        ]);

        if (cancelled) return;

        const country = countries.find((c) => c.code === formData.countryCode);
        const curriculum = curriculums.find((c) => (c._id || c.id) === formData.curriculum);
        const stage = stages.find((s) => (s._id || s.id) === formData.stage);
        const grade = grades.find((g) => (g._id || g.id) === formData.grade);
        const selectedSubjects = subjects.filter((s) =>
          (formData.preferredSubjects || []).includes(s._id || s.id)
        );

        setLabels({
          countryName: country ? country.arabicName || country.name : formData.countryCode,
          curriculumName: getLocalizedName(curriculum?.name) || getLocalizedName(curriculum?.title),
          stageName: getLocalizedName(stage?.name) || getLocalizedName(stage?.title),
          gradeName: getLocalizedName(grade?.name) || getLocalizedName(grade?.title),
          subjectNames: selectedSubjects.map(
            (s) => getLocalizedName(s.name) || getLocalizedName(s.title)
          ),
        });
      } catch (err) {
        console.error("خطأ في تحميل بيانات المراجعة:", err);
      } finally {
        if (!cancelled) setLoadingLabels(false);
      }
    }

    loadLabels();
    return () => {
      cancelled = true;
    };
  }, [formData.countryCode, formData.curriculum, formData.stage, formData.grade, formData.preferredSubjects]);

  const handleSubmit = async () => {
    setErrorMsg("");
    setSubmitting(true);
    try {
      let username = formData.username;
      let password = formData.password;
      let passwordConfirm = formData.passwordConfirm;

      if (isParentLinked) {
        const generated = generateAutoCredentials(formData.fullName);
        username = generated.username;
        password = generated.password;
        passwordConfirm = generated.password;
      }

      const payload = {
        fullName: formData.fullName,
        birthDate: formData.birthDate,
        countryCode: formData.countryCode,
        studyLanguage: formData.studyLanguage,
        curriculum: formData.curriculum,
        stage: formData.stage,
        grade: formData.grade,
        preferredSubjects: formData.preferredSubjects,
        username,
        password,
        passwordConfirm,
      };

      const result = await addStudent(payload);
      const studentId = result?.data?.studentId;

      navigate("/parent/children/add/success", {
        state: { studentId, fullName: formData.fullName },
      });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "فشل إضافة الطالب، حاول مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-[#1F2937]">مراجعة وإنشاء</h2>
          <p className="text-sm text-[#6B7280]">يرجى مراجعة البيانات قبل تأكيد الإضافة.</p>
        </div>

        {loadingLabels ? (
          <div className="py-10 text-center text-sm text-[#8C9198]">جاري تحميل بيانات المراجعة...</div>
        ) : (
          <>
            {/* المعلومات الشخصية */}
            <div className="border border-[#E5E7EB] rounded-xl p-5 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-[#1F2937]">المعلومات الشخصية</h3>
              <ReviewRow label="الاسم الكامل" value={formData.fullName} />
              <ReviewRow label="تاريخ الميلاد" value={formatDateForDisplay(formData.birthDate)} />
              <ReviewRow label="الدولة" value={labels.countryName} />
            </div>

            {/* المعلومات الأكاديمية */}
            <div className="border border-[#E5E7EB] rounded-xl p-5 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-[#1F2937]">المعلومات الأكاديمية</h3>
              <ReviewRow label="المرحلة الدراسية" value={labels.stageName} />
              <ReviewRow label="الصف الدراسي" value={labels.gradeName} />
              <ReviewRow label="المنهج الدراسي" value={labels.curriculumName} />
              <ReviewRow
                label="لغة التعلم المفضلة"
                value={formData.studyLanguage === "ar" ? "العربية" : "الإنجليزية"}
              />
              <ReviewRow
                label="المواد المفضلة"
                value={labels.subjectNames.length ? labels.subjectNames.join("، ") : "-"}
              />
            </div>

            {/* بيانات دخول الطالب */}
            <div className="border border-[#E5E7EB] rounded-xl p-5 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-[#1F2937]">بيانات دخول الطالب</h3>
              {isParentLinked ? (
                <ReviewRow label="طريقة الدخول" value="عبر حساب ولي الأمر" />
              ) : (
                <>
                  <ReviewRow label="اسم المستخدم" value={formData.username} />
                  <ReviewRow label="كلمة السر" value="••••••••" />
                </>
              )}
            </div>

            {/*
              ملاحظة: النص ده بيطابق فكرة التصميم (الحساب هيتعمل وهيدخل مراجعة إدارية).
              دلوقتي الحساب بيتفعّل فورياً فعلياً من ناحية الباك اند، لكن واجهة
              المستخدم هتوريله إنه "قيد المراجعة" تجهيزاً لمرحلة الأدمن القادمة.
            */}
            <div className="bg-[#EEF2FF] text-[#123C91] text-xs rounded-lg px-4 py-3 text-center">
              سيتم إرسال هذا الطلب وإنشاء حساب الطالب، وستتمكن من متابعة حالة الطلب من الصفحة التالية.
            </div>
          </>
        )}

        {errorMsg && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-right">
            {errorMsg}
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="flex-1 h-12 border border-[#D1D5DB] text-[#374151] font-medium rounded-xl hover:bg-[#F3F4F6] transition-colors disabled:opacity-50"
        >
          السابق
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || loadingLabels}
          className="flex-1 h-12 bg-[#1E3B8A] text-white font-medium rounded-xl hover:bg-[#1B3275] transition-colors disabled:opacity-50"
        >
          {submitting ? "جاري الإرسال..." : "إرسال الطلب"}
        </button>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-[#8C9198]">{label}</span>
      <span className="text-sm font-medium text-[#123C91]">{value || "-"}</span>
    </div>
  );
}