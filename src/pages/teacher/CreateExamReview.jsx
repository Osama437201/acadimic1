import React from "react";
import { useNavigate } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";

const steps = [
  { id: 3, label: "مراجعة وإنشاء" },
  { id: 2, label: "الأسئلة" },
  { id: 1, label: "المعلومات الأساسية" },
];

export default function CreateExamReview() {
  const navigate = useNavigate();

  // بيانات استاتيك (Placeholder) لحد ما نربطها بالباك اند
  const examSummary = {
    title: "حل المعادلات التربيعية الآتية",
    group: "مجموعة رياضيات A",
    class: "الصف: المعادلات التربيعية",
    startDate: "2026-06-13",
    endDate: "2026-06-14",
    duration: "15 دقيقة",
    totalScore: 2,
  };

  const questions = [
    {
      id: 1,
      type: "اختيار من متعدد",
      score: 2,
      text: "ما مجموع 2+2؟",
      answer: 'الخيار الأول "A"',
    },
  ];

  const handleCreate = () => {
    // TODO: هنا هيتضاف فعلياً call للـ API عشان ينشئ الاختبار
    console.log("إنشاء الاختبار", { examSummary, questions });
  };

  return (
    <div
      dir="rtl"
      className="h-screen w-full flex bg-[#F9F9FF] overflow-hidden font-ibm"
    >
      <TeacherSidebar activeId="exams" />

      <main className="flex-1 min-h-0 h-full overflow-y-auto px-8 py-8 pb-12 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-1 text-right">
          <h1 className="font-ibm font-semibold text-2xl leading-8 text-[#123C91]">
            إنشاء اختبار جديد
          </h1>
          <p className="font-ibm font-normal text-base leading-6 text-[#575F69]">
            الخطوة 3 من 3 - مراجعة و إنشاء
          </p>
        </div>

        {/* Stepper */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] px-6 py-5 flex items-center shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)]">
          <div className="flex-1 flex flex-row-reverse items-center">
            {steps.map((step, idx) => {
              const isActive = step.id === 3;
              const isDone = step.id < 3;
              return (
                <React.Fragment key={step.id}>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full flex items-center justify-center font-medium shrink-0 ${
                        isActive
                          ? "w-10 h-10 text-base border-2 border-[#123C91] bg-[#123C91]/80 text-white shadow-[0_0_0_4px_rgba(93,58,130,0.2)]"
                          : isDone
                            ? "w-7 h-7 text-sm bg-[#123C91] text-white"
                            : "w-7 h-7 text-sm bg-[#F1F1F1] text-[#8C9198]"
                      }`}
                    >
                      {isDone ? <CheckIcon size={14} color="#fff" /> : step.id}
                    </span>
                    <span
                      className={`font-ibm text-sm font-medium whitespace-nowrap ${
                        isActive
                          ? "text-[#123C91]"
                          : isDone
                            ? "text-[#1F2937]"
                            : "text-[#8C9198]"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx !== steps.length - 1 && (
                    <div className="flex-1 h-px bg-[#E5E5E5] mx-4" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ملخص الاختبار */}
        <div className="bg-white rounded-[16px] border border-[#E5E5E5] p-8 flex flex-col gap-4 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)] text-right">
          <div className="flex items-center gap-2">
            <DocIcon size={18} color="#1F2937" />
            <h2 className="font-ibm font-bold text-lg text-[#1F2937]">
              ملخص الاختبار
            </h2>
          </div>

          <div className="w-full bg-[#F9FAFA] border border-[#E5E5E5] rounded-[8px] px-4 py-4 font-ibm text-[16px] font-medium text-[#1F2937]">
            {examSummary.title}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            <SummaryRow label="المجموعة:" value={examSummary.group} />
            <SummaryRow label="الصف:" value={examSummary.class} />
            <SummaryRow label="يبدأ:" value={examSummary.startDate} />
            <SummaryRow label="ينتهي:" value={examSummary.endDate} />
            <SummaryRow label="المدة:" value={examSummary.duration} />
            <SummaryRow
              label="الدرجة الكلية:"
              value={String(examSummary.totalScore)}
            />
          </div>
        </div>

        {/* الأسئلة */}
        <div className="bg-white rounded-[16px] border border-[#E5E5E5] p-8 flex flex-col gap-4 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)] text-right">
          <div className="flex items-center gap-2">
            <DocIcon size={18} color="#1F2937" />
            <h2 className="font-ibm font-bold text-lg text-[#1F2937]">
              الأسئلة
            </h2>
          </div>

          {questions.map((q) => (
            <div
              key={q.id}
              className="flex flex-col gap-2 border border-[#F1F1F1] rounded-[10px] p-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-ibm font-semibold text-[#1F2937]">
                  {q.id}. {q.text}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#575F69] bg-[#EAF0FB] px-2.5 py-1 rounded-lg">
                    {q.type}
                  </span>
                  <span className="text-xs font-medium text-[#575F69] bg-[#F1F1F1] px-2.5 py-1 rounded-lg">
                    {q.score} درجة
                  </span>
                </div>
              </div>
              <p className="text-sm text-[#575F69]">الإجابة: {q.answer}</p>
            </div>
          ))}
        </div>

        {/* تنبيه */}
        <div className="flex items-center gap-3 bg-[#EAF0FB] border border-[#DCE6F7] rounded-xl px-4 py-4">
          <div className="w-[24px] h-[24px] shrink-0 flex items-center justify-center">
            <InfoIcon size={24} color="#123C91" />
          </div>
          <p className="font-ibm font-normal text-[15px] leading-[22px] text-[#123C91]">
            بعد النشر سيتلقى طلاب المجموعة B إشعاراً بالاختبار و ستصبح نتائجه
            متاحة تلقائياً بعد انتهاء الاختبار
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleCreate}
            className="flex-1 h-14 px-4 rounded-lg bg-[#123C91] text-white flex items-center justify-center gap-2 font-ibm font-medium text-base leading-[22px] hover:bg-[#0d2d6c] transition-all shadow-sm"
          >
            إنشاء الاختبار
          </button>
          <button
            type="button"
            onClick={() => navigate("/teacher/exams/create/questions")}
            className="w-[352px] shrink-0 h-14 px-6 rounded-lg border border-[#E5E5E5] bg-white text-[#575F69] font-ibm font-medium text-base leading-[22px] hover:bg-[#F1F1F1] transition-all"
          >
            السابق
          </button>
        </div>
      </main>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center gap-2 bg-[#F9FAFA] border border-[#E5E5E5] rounded-[8px] px-4 py-2.5 text-right">
      <span className="text-xs font-normal text-[#575F69]">{label}</span>
      <span className="text-xs font-medium text-[#1F2937]">{value}</span>
    </div>
  );
}

/* Icons */
function CheckIcon({ size = 14, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}
function InfoIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M11 12h1v4h1" />
    </svg>
  );
}
function DocIcon({ size = 18, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}
