import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";

const steps = [
  { id: 3, label: "مراجعة وإنشاء" },
  { id: 2, label: "الأسئلة" },
  { id: 1, label: "المعلومات الأساسية" },
];

let uid = 0;
const nextId = () => `q_${Date.now()}_${uid++}`;

function makeQuestion() {
  return {
    id: nextId(),
    text: "",
    options: [
      { id: nextId(), text: "" },
      { id: nextId(), text: "" },
    ],
    score: 0,
  };
}

export default function CreateExamQuestions() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([makeQuestion()]);

  const totalScore = questions.reduce(
    (sum, q) => sum + (Number(q.score) || 0),
    0,
  );

  const addQuestion = () => {
    setQuestions((prev) => [...prev, makeQuestion()]);
  };

  const removeQuestion = (qid) => {
    setQuestions((prev) => prev.filter((q) => q.id !== qid));
  };

  const updateQuestionText = (qid, text) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qid ? { ...q, text } : q)),
    );
  };

  const updateScore = (qid, score) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qid ? { ...q, score } : q)),
    );
  };

  const updateOptionText = (qid, oid, text) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === oid ? { ...o, text } : o,
              ),
            }
          : q,
      ),
    );
  };

  const addOption = (qid) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid
          ? { ...q, options: [...q.options, { id: nextId(), text: "" }] }
          : q,
      ),
    );
  };

  const removeOption = (qid, oid) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid
          ? { ...q, options: q.options.filter((o) => o.id !== oid) }
          : q,
      ),
    );
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
            الخطوة 2 من 3 - الأسئلة
          </p>
        </div>

        {/* Stepper */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] px-6 py-5 flex items-center shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)]">
          <div className="flex-1 flex flex-row-reverse items-center">
            {steps.map((step, idx) => {
              const isActive = step.id === 2;
              const isDone = step.id < 2;
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

        {/* زر إضافة سؤال اختيار من متعدد (تم زيادة حجمه وارتفاعه أكثر) */}
        <button
          type="button"
          onClick={addQuestion}
          className="w-full h-30 rounded-xl bg-[#123C91] text-white flex items-center justify-center gap-3 px-6 font-tajawal font-bold text-xl hover:bg-[#0d2d6c] transition-all shadow-lg"
        >
          <PlusIcon size={28} color="#fff" />
          سؤال اختيار من متعدد
        </button>

        {/* بطاقات الأسئلة */}
        <div className="flex flex-col gap-6">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className="bg-white rounded-[16px] border border-[#E5E5E5] p-6 flex flex-col gap-5 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)]"
            >
              {/* رأس البطاقة */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-ibm font-bold text-2xl leading-8 text-[#123C91]">
                    اختيار من متعدد
                  </span>
                  <span className="flex items-center gap-1 text-sm font-normal leading-5 text-[#575F69] bg-[#EAF0FB] px-2.5 py-1 rounded-lg">
                    <BoltIcon size={16} color="#575F69" />
                    تصحيح تلقائي
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => removeQuestion(q.id)}
                  className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] text-[#DC2626] hover:bg-[#FEF2F2] transition-all"
                >
                  <TrashIcon size={18} color="#DC2626" />
                </button>
              </div>

              {/* نص السؤال */}
              <div className="flex flex-col gap-2 text-right">
                <label className="font-tajawal font-medium text-[14px] leading-[16px] text-[#1F2937]">
                  السؤال
                </label>
                <textarea
                  rows={2}
                  value={q.text}
                  onChange={(e) => updateQuestionText(q.id, e.target.value)}
                  placeholder="ما مجموع زوايا المثلث؟"
                  className="w-full bg-[#F9FAFA] border border-[#E5E5E5] rounded-[8px] px-4 py-3 text-[14px] leading-[16px] text-[#1F2937] placeholder-[#8C9198] outline-none resize-none focus:border-[#123C91] transition-all"
                />
              </div>

              {/* الخيارات */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {q.options.map((opt, oi) => (
                  <div key={opt.id} className="relative">
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) =>
                        updateOptionText(q.id, opt.id, e.target.value)
                      }
                      placeholder={`خيار ${oi + 1}`}
                      className="w-full h-[48px] bg-[#F9FAFA] border border-[#E5E5E5] rounded-[8px] px-4 pl-10 text-[14px] text-[#1F2937] placeholder-[#8C9198] outline-none focus:border-[#123C91] transition-all"
                    />
                    {q.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(q.id, opt.id)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C9198] hover:text-[#DC2626] transition-colors"
                      >
                        <XIcon size={16} color="currentColor" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* زر إضافة خيار جديد */}
              <button
                type="button"
                onClick={() => addOption(q.id)}
                style={{
                  borderStyle: "dashed",
                  borderWidth: "1px",
                  borderColor: "#E5E5E5",
                }}
                className="w-full h-[48px] rounded-[8px] bg-white text-[#575F69] flex items-center justify-start gap-[8px] px-[24px] font-tajawal font-medium text-[16px] leading-[100%] hover:bg-[#F9FAFA] transition-all"
              >
                <PlusIcon size={24} color="#575F69" />
                إضافة خيار جديد
              </button>

              {/* درجة السؤال */}
              <div className="flex items-center pt-2 border-t border-[#F1F1F1]">
                <div className="flex items-center h-[24px]">
                  <label className="font-ibm font-normal text-[16px] leading-[24px] text-[#575F69]">
                    درجة السؤال:
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={q.score}
                    onChange={(e) => updateScore(q.id, e.target.value)}
                    className="w-[44px] h-[24px] bg-[#F9FAFA] border border-[#E5E5E5] rounded-[4px] text-[16px] font-bold leading-[24px] text-center text-[#1F2937] outline-none focus:border-[#123C91]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ملخص الأسئلة */}
        <div className="flex items-center justify-between px-1">
          <span className="font-ibm font-normal text-[14px] leading-[24px] text-[#575F69]">
            اختيار من متعدد:{" "}
            <b className="font-bold text-[#1F2937]">{questions.length}</b>
          </span>
          <span className="font-ibm font-normal text-[14px] leading-[24px] text-[#575F69]">
            الدرجة الكلية:{" "}
            <b className="font-bold text-[#1F2937]">{totalScore}</b>
          </span>
        </div>

        {/* تنبيه */}
        <div className="flex items-center gap-2 bg-[#EAF0FB] border border-[#DCE6F7] rounded-lg px-4 py-3">
          <div className="w-[24px] h-[24px] shrink-0 flex items-center justify-center">
            <InfoIcon size={24} color="#123C91" />
          </div>
          <p className="font-ibm font-normal text-[16px] leading-[24px] text-[#123C91]">
            يرجى استكمال جميع الأسئلة (النص مطلوب، والخيارات يجب ألا تكون فارغة
            ثم قم بتحديد الإجابة الصحيحة)
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate("/teacher/exams/create/review")}
            className="flex-1 h-14 px-4 rounded-lg bg-[#123C91] text-white flex items-center justify-center gap-2 font-tajawal font-medium text-base leading-[22px] hover:bg-[#0d2d6c] transition-all"
          >
            التالي
          </button>
          <button
            type="button"
            onClick={() => navigate("/teacher/exams/create")}
            className="w-[352px] shrink-0 h-14 px-6 rounded-lg border border-[#E5E5E5] bg-white text-[#575F69] font-tajawal font-medium text-base leading-[22px] hover:bg-[#F1F1F1] transition-all"
          >
            السابق
          </button>
        </div>
      </main>
    </div>
  );
}

/* Icons */
function PlusIcon({ size = 18, color = "currentColor" }) {
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
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function TrashIcon({ size = 18, color = "currentColor" }) {
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
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
    </svg>
  );
}
function BoltIcon({ size = 18, color = "currentColor" }) {
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
      <path d="M13 2 3 14h7l-1 8 11-14h-7l0-6Z" />
    </svg>
  );
}
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
function XIcon({ size = 14, color = "currentColor" }) {
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
      <path d="M18 6 6 18M6 6l12 12" />
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
