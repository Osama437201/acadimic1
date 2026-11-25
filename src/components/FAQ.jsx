import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "كيف يتم التواصل بين الطالب والمدرس؟",
    answer:
      "بالنسبة لطلاب المدارس، يتم التواصل الأساسي بين ولي الأمر والمدرس. ويمكن للطالب المشاركة في المحادثة العامة بين الأمر والمدرس داخل الدرس وفقًا لإعدادات المدرس، مما يضمن بيئة تعليمية آمنة ومنظمة.",
  },
  {
    question: "هل يمكنني اختيار مدرس معين لطفلي؟",
    answer:
      "نعم، يمكنك تصفح قائمة المدرسين المتاحين لكل مادة واختيار المدرس الأنسب لطفلك بناءً على تقييمات أولياء الأمور الآخرين وتخصصه.",
  },
  {
    question: "هل يتم تسجيل الدروس والمحاضرات؟",
    answer:
      "نعم، يتم تسجيل جميع الحصص المباشرة تلقائيًا وتكون متاحة للمراجعة في أي وقت من خلال حسابك على المنصة.",
  },
  {
    question: "ماذا يحدث إذا تغيب الطالب عن الدروس؟",
    answer:
      "في حالة غياب الطالب، يتم إشعار ولي الأمر تلقائيًا، ويظل تسجيل الحصة متاحًا للمشاهدة لاحقًا لضمان عدم فوات أي محتوى دراسي.",
  },
  {
    question: "كيف يمكنني متابعة مستوى طفلي الدراسي؟",
    answer:
      "توفر المنصة لوحة متابعة خاصة بولي الأمر تعرض الحضور، الدرجات، الواجبات، وتقارير دورية عن أداء الطالب.",
  },
  {
    question: "هل توفر المنصة واجبات واختبارات؟",
    answer:
      "نعم، يمكن للمدرسين إنشاء واجبات واختبارات إلكترونية مع إمكانية التصحيح التلقائي أو اليدوي، وتظهر النتائج مباشرة لولي الأمر.",
  },
  {
    question: "كيف تحمي المنصة خصوصية الطلاب وأولياء الأمور؟",
    answer:
      "تعتمد المنصة نظام تواصل منظم ومراقب بالكامل، مع حماية بيانات الطلاب وأولياء الأمور وفق أعلى معايير الأمان والخصوصية.",
  },
];

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div
      className={`flex flex-col rounded-2xl border p-4 sm:p-6 transition-colors ${
        isOpen
          ? "bg-[#F8FBFF] border-r-4 border-r-[#123C91] border-y-[#1F2937]/[0.08] border-l-[#1F2937]/[0.08]"
          : "bg-white border-[#1F2937]/[0.08]"
      }`}
    >
      {/* رأس السؤال */}
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between gap-3 sm:gap-4 w-full text-right"
      >
        <span className="font-tajawal font-bold text-base sm:text-[18px] leading-6 text-[#1F2937]">
          {question}
        </span>
        <span className="shrink-0 flex items-center justify-center w-4 h-4 text-[#123C91]">
          {isOpen ? (
            <Minus className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </span>
      </button>

      {/* الإجابة */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen
            ? "max-h-96 opacity-100 mt-4 sm:mt-6"
            : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <p className="font-plex text-sm sm:text-base leading-6 sm:leading-7 text-[#1F2937] text-right">
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      dir="rtl"
      className="w-full flex flex-col items-center gap-2 px-6 sm:px-10 lg:px-20 py-12 sm:py-16 lg:py-20"
    >
      {/* العنوان */}
      <h2 className="font-tajawal font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight lg:leading-[56px] text-[#1F2937] text-center">
        الأسئلة الشائعة
      </h2>

      {/* الوصف */}
      <p className="font-plex text-base sm:text-lg leading-relaxed lg:leading-6 text-[#1F2937]/70 text-center mb-6 sm:mb-8">
        كل ما تحتاج معرفته عن المنصة، الاشتراكات، وآلية الدراسة داخل الأكاديمية.
      </p>

      {/* الأسئلة */}
      <div className="w-full flex flex-col gap-4 sm:gap-6">
        {FAQ_ITEMS.map((item, index) => (
          <FAQItem
            key={item.question}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
          />
        ))}
      </div>
    </section>
  );
}
