import React, { useState, useEffect } from "react";
import {
  getCurriculums,
  getStagesByCurriculum,
  getGradesByStage,
  getSubjectsByGrade,
} from "../../services/lookupService";
import { getLocalizedName } from "../../utils/getLocalizedName";

export default function Step2AcademicInfo({ formData, setFormData, onNext, onBack }) {
  // حماية احتياطية: لو formData.preferredSubjects جات undefined (بسبب state قديم في الأب)
  // منستخدمش .map على undefined ونطيح الصفحة
  const preferredSubjects = formData.preferredSubjects || [];

  const [curriculums, setCurriculums] = useState([]);
  const [stages, setStages] = useState([]);
  const [grades, setGrades] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);

  useEffect(() => {
    getCurriculums()
      .then((data) => setCurriculums(data || []))
      .catch((err) => console.error("خطأ في جلب المناهج:", err));
  }, []);

  useEffect(() => {
    if (formData.curriculum) {
      getStagesByCurriculum(formData.curriculum)
        .then((data) => setStages(data || []))
        .catch((err) => console.error("خطأ في جلب المراحل:", err));
    } else {
      setStages([]);
      setGrades([]);
      setAvailableSubjects([]);
    }
  }, [formData.curriculum]);

  useEffect(() => {
    if (formData.stage) {
      getGradesByStage(formData.stage)
        .then((data) => setGrades(data || []))
        .catch((err) => console.error("خطأ في جلب الصفوف:", err));
    } else {
      setGrades([]);
      setAvailableSubjects([]);
    }
  }, [formData.stage]);

  useEffect(() => {
    if (formData.grade) {
      getSubjectsByGrade(formData.grade)
        .then((data) => setAvailableSubjects(data || []))
        .catch((err) => console.error("خطأ في جلب المواد:", err));
    } else {
      setAvailableSubjects([]);
    }
  }, [formData.grade]);

  const handleRemoveSubject = (subjectId) => {
    setFormData({
      ...formData,
      preferredSubjects: preferredSubjects.filter((id) => id !== subjectId),
    });
  };

  const handleSelectSubject = (e) => {
    const selectedId = e.target.value;
    if (selectedId && !preferredSubjects.includes(selectedId)) {
      setFormData({
        ...formData,
        preferredSubjects: [...preferredSubjects, selectedId],
      });
    }
  };

  return (
    <div className="w-full bg-white rounded-[16px] border border-[#E5E5E5] p-[32px] flex flex-col gap-[32px]">
      <div className="flex flex-col gap-1">
        <h2 className="font-ibm font-bold text-[20px] text-[#1F2937]">المعلومات الأكاديمية</h2>
        <p className="font-ibm text-[14px] text-[#575F69]">يرجى إدخال المعلومات الدراسية للطالب.</p>
      </div>

      <div className="flex flex-col gap-4">
        {/* المنهج الدراسي */}
        <div className="flex flex-col gap-2">
          <label className="font-tajawal text-[14px] text-[#1F2937]">المنهج الدراسي</label>
          <select
            value={formData.curriculum}
            onChange={(e) =>
              setFormData({
                ...formData,
                curriculum: e.target.value,
                stage: "",
                grade: "",
                preferredSubjects: [],
              })
            }
            className="h-[48px] border border-[#E5E5E5] bg-[#F9FAFA] rounded-[8px] px-4 font-ibm text-[14px]"
          >
            <option value="">اختر المنهج</option>
            {curriculums.map((c) => (
              <option key={c._id || c.id} value={c._id || c.id}>
                {getLocalizedName(c.name) || getLocalizedName(c.title)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* المرحلة الدراسية */}
          <div className="flex flex-col gap-2">
            <label className="font-tajawal text-[14px] text-[#1F2937]">المرحلة الدراسية</label>
            <select
              value={formData.stage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stage: e.target.value,
                  grade: "",
                  preferredSubjects: [],
                })
              }
              disabled={!formData.curriculum}
              className="h-[48px] border border-[#E5E5E5] bg-[#F9FAFA] rounded-[8px] px-4 font-ibm text-[14px] disabled:opacity-50"
            >
              <option value="">
                {formData.curriculum ? "اختر المرحلة الدراسية" : "اختر المنهج أولاً"}
              </option>
              {stages.map((stg) => (
                <option key={stg._id || stg.id} value={stg._id || stg.id}>
                  {getLocalizedName(stg.name) || getLocalizedName(stg.title)}
                </option>
              ))}
            </select>
          </div>

          {/* الصف الدراسي */}
          <div className="flex flex-col gap-2">
            <label className="font-tajawal text-[14px] text-[#1F2937]">الصف الدراسي</label>
            <select
              value={formData.grade}
              onChange={(e) =>
                setFormData({ ...formData, grade: e.target.value, preferredSubjects: [] })
              }
              disabled={!formData.stage}
              className="h-[48px] border border-[#E5E5E5] bg-[#F9FAFA] rounded-[8px] px-4 font-ibm text-[14px] disabled:opacity-50"
            >
              <option value="">
                {formData.stage ? "اختر الصف الدراسي" : "اختر المرحلة أولاً"}
              </option>
              {grades.map((grd) => (
                <option key={grd._id || grd.id} value={grd._id || grd.id}>
                  {getLocalizedName(grd.name) || getLocalizedName(grd.title)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* لغة التعلم المفضلة */}
        <div className="flex flex-col gap-2">
          <label className="font-tajawal text-[14px] text-[#1F2937]">لغة التعلم المفضلة</label>
          <select
            value={formData.studyLanguage}
            onChange={(e) => setFormData({ ...formData, studyLanguage: e.target.value })}
            className="h-[48px] border border-[#E5E5E5] bg-[#F9FAFA] rounded-[8px] px-4 font-ibm text-[14px]"
          >
            <option value="">اختر لغة التعلم</option>
            <option value="ar">اللغة العربية</option>
            <option value="en">اللغة الإنجليزية</option>
          </select>
        </div>

        {/* اختيار المواد */}
        <div className="flex flex-col gap-2">
          <label className="font-tajawal text-[14px] text-[#1F2937]">المواد التي ترغب بدراستها</label>

          <div className="flex flex-wrap gap-2 mb-2">
            {preferredSubjects.map((subId) => {
              const subObj = availableSubjects.find((s) => (s._id || s.id) === subId);
              return (
                <span
                  key={subId}
                  className="bg-[#EBF5FF] text-[#0066CC] px-3 py-1.5 rounded-full text-xs flex items-center gap-2"
                >
                  {getLocalizedName(subObj?.name) || getLocalizedName(subObj?.title) || subId}
                  <button type="button" onClick={() => handleRemoveSubject(subId)}>✕</button>
                </span>
              );
            })}
          </div>

          <select
            onChange={handleSelectSubject}
            disabled={!formData.grade}
            value=""
            className="h-[48px] border border-[#E5E5E5] bg-[#F9FAFA] rounded-[8px] px-4 font-ibm text-[14px] disabled:opacity-50"
          >
            <option value="">
              {formData.grade ? "اختر المادة لإضافتها" : "اختر الصف أولاً لإظهار المواد"}
            </option>
            {availableSubjects.map((sub) => (
              <option key={sub._id || sub.id} value={sub._id || sub.id}>
                {getLocalizedName(sub.name) || getLocalizedName(sub.title)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* الأزرار */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onNext}
          disabled={!formData.curriculum || !formData.stage || !formData.grade}
          className="w-full h-[56px] bg-[#123C91] text-white rounded-[8px] font-medium disabled:opacity-50"
        >
          التالي
        </button>
        <button
          type="button"
          onClick={onBack}
          className="w-full h-[56px] border border-[#E5E5E5] text-[#575F69] rounded-[8px] font-medium"
        >
          السابق
        </button>
      </div>
    </div>
  );
}