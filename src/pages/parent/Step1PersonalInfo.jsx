import React, { useState, useEffect, useMemo } from "react";
import { getCountries } from "../../services/lookupService";

// أسماء الشهور بالعربي عشان تبان في القائمة المنسدلة
const MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

// بيرجع عدد أيام الشهر ده في السنة دي (بيراعي السنة الكبيسة)
function getDaysInMonth(year, month) {
  if (!year || !month) return 31;
  return new Date(year, month, 0).getDate();
}

export default function Step1PersonalInfo({ formData, setFormData, onNext, onCancel }) {
  const [countries, setCountries] = useState([]);

  // بنفكك formData.birthDate (لو موجودة بصيغة YYYY-MM-DD) لـ يوم/شهر/سنة منفصلين
  const initialParts = useMemo(() => {
    if (formData.birthDate) {
      const [y, m, d] = formData.birthDate.split("-");
      return { day: d ? String(Number(d)) : "", month: m ? String(Number(m)) : "", year: y || "" };
    }
    return { day: "", month: "", year: "" };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [day, setDay] = useState(initialParts.day);
  const [month, setMonth] = useState(initialParts.month);
  const [year, setYear] = useState(initialParts.year);

  useEffect(() => {
    getCountries()
      .then((data) => setCountries(data || []))
      .catch(console.error);
  }, []);

  // كل ما اليوم/الشهر/السنة يتغيروا، نجمعهم في formData.birthDate بصيغة موحدة YYYY-MM-DD
  useEffect(() => {
    if (day && month && year) {
      const paddedMonth = String(month).padStart(2, "0");
      const paddedDay = String(day).padStart(2, "0");
      setFormData((prev) => ({ ...prev, birthDate: `${year}-${paddedMonth}-${paddedDay}` }));
    } else {
      setFormData((prev) => ({ ...prev, birthDate: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, month, year]);

  // لو المستخدم غيّر الشهر أو السنة وبقى اليوم المختار مش موجود في الشهر الجديد (مثلاً 31 في فبراير)
  // نصفّر اليوم بدل ما نسيبه رقم غلط
  const daysInSelectedMonth = getDaysInMonth(Number(year), Number(month));
  useEffect(() => {
    if (day && Number(day) > daysInSelectedMonth) {
      setDay("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  const currentYear = new Date().getFullYear();
  // نطاق سنين منطقي لتاريخ ميلاد طالب (من عمر سنة لحد 25 سنة تقريباً)
  const years = Array.from({ length: 25 }, (_, i) => currentYear - i);
  const days = Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-[#1F2937]">المعلومات الشخصية</h2>
          <p className="text-sm text-[#6B7280]">يرجى إدخال البيانات الأساسية للطالب.</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#374151]">الاسم بالكامل</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="h-12 border border-[#E5E7EB] rounded-xl px-4 bg-[#F9FAFB] text-sm text-[#1F2937] focus:bg-white focus:outline-none focus:border-[#1E3A8A] transition-colors"
            placeholder="أدخل اسمك الكامل"
          />
        </div>

        {/* تاريخ الميلاد: ثلاث قوائم منفصلة بدل input type=date */}
        {/* السبب: input type=date الأصلي بيخفي أيقونة التقويم إلا وقت الفوكس،
            وبيدي المتصفح يحط "اليوم" كقيمة افتراضية للـ يوم لو اخترت شهر/سنة بس
            من غير ما تدوس يوم معين. القوائم دي بتحل المشكلتين. */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#374151]">تاريخ الميلاد</label>
          <div className="grid grid-cols-3 gap-3">
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="h-12 border border-[#E5E7EB] rounded-xl px-3 bg-[#F9FAFB] text-sm text-[#1F2937] focus:bg-white focus:outline-none focus:border-[#1E3A8A] transition-colors appearance-none"
            >
              <option value="">يوم</option>
              {days.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="h-12 border border-[#E5E7EB] rounded-xl px-3 bg-[#F9FAFB] text-sm text-[#1F2937] focus:bg-white focus:outline-none focus:border-[#1E3A8A] transition-colors appearance-none"
            >
              <option value="">شهر</option>
              {MONTHS.map((m, idx) => (
                <option key={m} value={idx + 1}>{m}</option>
              ))}
            </select>

            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="h-12 border border-[#E5E7EB] rounded-xl px-3 bg-[#F9FAFB] text-sm text-[#1F2937] focus:bg-white focus:outline-none focus:border-[#1E3A8A] transition-colors appearance-none"
            >
              <option value="">سنة</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#374151]">الدولة</label>
          <select
            value={formData.countryCode}
            onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
            className="h-12 border border-[#E5E7EB] rounded-xl px-4 bg-[#F9FAFB] text-sm text-[#1F2937] focus:bg-white focus:outline-none focus:border-[#1E3A8A] transition-colors appearance-none"
          >
            <option value="">اختر الدولة</option>
            {countries.map((c) => (
              <option key={c.id} value={c.code}>
                {c.arabicName || c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-12 border border-[#D1D5DB] text-[#374151] font-medium rounded-xl hover:bg-[#F3F4F6] transition-colors"
        >
          إلغاء
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!formData.fullName || !formData.birthDate || !formData.countryCode}
          className="flex-1 h-12 bg-[#1E3B8A] text-white font-medium rounded-xl hover:bg-[#1B3275] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          التالي
        </button>
      </div>
    </div>
  );
}