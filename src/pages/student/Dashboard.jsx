import React from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "../../components/StudentSidebar";

// ملاحظة: الصفحة دي استاتيك بالكامل (بيانات وهمية Placeholder) للعرض/التصميم فقط،
// لسه محتاجين نوصلها بالـ API الحقيقي بتاع الطالب (الحصص، المجموعات، الاشتراكات...).

const STUDENT_NAME = "محمد";

const STATS = [
  {
    id: "groups",
    value: 4,
    label: "المجموعات النشطة",
    icon: GroupsIcon,
    tint: "teal",
  },
  {
    id: "assignments",
    value: 2,
    label: "الواجبات النشطة",
    icon: AssignmentIcon,
    tint: "blue",
  },
  {
    id: "exams",
    value: 1,
    label: "الاختبارات النشطة",
    icon: ExamIcon,
    tint: "teal",
  },
  {
    id: "sessions",
    value: 4,
    label: "الحصص القادمة",
    icon: SessionsIcon,
    tint: "blue",
  },
];

const SUBSCRIPTION_SUMMARY = { done: 7, completed: 9, total: 16 };

const SUBSCRIPTION_PROGRESS = [
  { id: 1, name: "مجموعة الرياضيات A", done: 5, total: 8 },
  { id: 2, name: "مجموعة الفيزياء A", done: 3, total: 8 },
  { id: 3, name: "مجموعة الفيزياء A", done: 3, total: 8 },
];

// تعديل: badgeTone بقى يشاور على أسماء الـ tones الجديدة (teal / sky / green / red)
// بدل (blue / gray) الأصليين عشان تطابق ألوان الفيجما بالظبط
const MY_GROUPS = [
  {
    id: 2,
    badge: "خاصة",
    badgeTone: "sky",
    name: "مجموعة الرياضيات A",
    teacher: "أ/ عادل منصور",
    nextSession: "الحصة القادمة غداً",
    statusLabel: "متبقي 2 حصص",
    statusTone: "red",
    progress: "6/8 حصص",
  },
  {
    id: 1,
    badge: "مجموعة",
    badgeTone: "teal",
    name: "مجموعة الفيزياء A",
    teacher: "أ/ علاء محمد",
    nextSession: "الحصة القادمة غداً",
    statusLabel: "متبقي 5 حصص",
    statusTone: "green",
    progress: "3/8 حصص",
  },
];

// ترتيب الأعمدة بحيث يبدأ الأسبوع من السبت على أقصى اليمين (dir="rtl")
const WEEK_DAYS = [
  "السبت",
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
];

const CALENDAR_WEEKS = [
  [
    { day: 28, muted: true },
    { day: 29, muted: true },
    { day: 30, muted: true },
    { day: 1 },
    { day: 2 },
    { day: 3 },
    { day: 4, selected: true },
  ],
  [
    { day: 5 },
    { day: 6 },
    { day: 7 },
    { day: 8 },
    { day: 9 },
    { day: 10, hasEvent: true },
    { day: 11 },
  ],
  [
    { day: 12 },
    { day: 13 },
    { day: 14 },
    { day: 15 },
    { day: 16, hasEvent: true },
    { day: 17 },
    { day: 18 },
  ],
  [
    { day: 19 },
    { day: 20 },
    { day: 21 },
    { day: 22 },
    { day: 23 },
    { day: 24 },
    { day: 25 },
  ],
  [
    { day: 26 },
    { day: 27 },
    { day: 28 },
    { day: 29 },
    { day: 30 },
    { day: 31 },
    { day: 1, muted: true },
  ],
];

const TODAY_SESSIONS = [
  {
    id: 2,
    badge: "منتهية",
    badgeTone: "green",
    name: "مجموعة الرياضيات A",
    teacher: "الاختبارات",
    time: "10:00 ص - 45 د",
    ctaLabel: "التسجيل",
    ctaTone: "outline",
  },
  {
    id: 1,
    badge: "تبدأ الآن",
    badgeTone: "teal",
    name: "مجموعة الفيزياء A",
    teacher: "أ/ علاء محمد",
    time: "12:00 م - 60 د",
    ctaLabel: "انضم الآن",
    ctaTone: "filled",
  },
];

export default function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <div dir="rtl" className="h-screen w-full flex overflow-hidden">
      <StudentSidebar activeId="dashboard" />

      <main className="flex-1 h-full overflow-y-auto p-5 lg:p-8 flex flex-col gap-5">
        {/* الترحيب + الإحصائيات */}
        <section className="w-full bg-white rounded-2xl p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-1 text-right">
            <h2 className="font-tajawal font-semibold text-[24px] leading-[32px] text-[#123C91]">
              مرحباً بك يا {STUDENT_NAME}
            </h2>
            <p className="font-ibm text-[16px] leading-[24px] text-[#575F69]">
              هنا يمكنك الوصول إلى محتوى دروسك، متابعة جدول الحصص، تسليم
              الواجبات ومراقبة تقدمك الدراسي ودرجاتك بسهولة
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {STATS.map((s) => (
              <div
                key={s.id}
                className="flex items-center rounded-lg border border-[#E5E5E5] bg-white p-6 gap-4"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 p-[10px]"
                  style={{
                    backgroundColor:
                      s.tint === "blue"
                        ? "rgba(18, 60, 145, 0.1)"
                        : "rgba(18, 198, 176, 0.1)",
                  }}
                >
                  <s.icon
                    size={20}
                    color={s.tint === "blue" ? "#123C91" : "#12C6B0"}
                  />
                </div>
                <div className="flex flex-col items-start gap-1">
                  <span className="font-tajawal font-semibold text-[24px] leading-[32px] text-[#1F2937]">
                    {s.value}
                  </span>
                  <span className="font-ibm text-[16px] leading-[24px] font-normal text-[#575F69]">
                    {s.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* الاشتراكات + مجموعاتي */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* مجموعاتي */}
          <div className="lg:col-span-3 bg-white border border-[#E5E5E5] rounded-2xl p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-0.5">
              <span className="font-tajawal font-bold text-[16px] leading-[16px] text-[#1F2937]">
                مجموعاتي
              </span>
              <span className="font-ibm text-[16px] leading-[24px] font-normal text-[#8C9198]">
                المواد والمجموعات المشترك بيها
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MY_GROUPS.map((g) => (
                <div
                  key={g.id}
                  onClick={() => navigate(`/student/groups/${g.id}/sessions`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      navigate(`/student/groups/${g.id}/sessions`);
                    }
                  }}
                  className="flex flex-col gap-4 p-6 rounded-2xl border border-[#E5E5E5] cursor-pointer hover:border-[#123C91] hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between">
                    <Badge tone={g.badgeTone}>{g.badge}</Badge>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-ibm font-medium text-[16px] leading-[24px] text-[#1F2937]">
                      {g.name}
                    </span>
                    <span className="font-ibm text-sm leading-4 text-[#123C91]">
                      {g.teacher}
                    </span>
                  </div>
                  <div className="h-px bg-[#E5E5E5]" />
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-start gap-2">
                      <div className="flex items-center gap-1">
                        <ClockIcon size={16} color="#8C9198" />
                        <span className="font-ibm text-sm leading-4 text-[#575F69]">
                          {g.nextSession}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GroupsIcon size={16} color="#8C9198" />
                        <span className="font-ibm text-sm leading-4 text-[#575F69]">
                          {g.progress}
                        </span>
                      </div>
                    </div>
                    <Badge tone={g.statusTone}>{g.statusLabel}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* الاشتراكات */}
          <div className="lg:col-span-2 bg-white border border-[#E5E5E5] rounded-2xl p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="font-tajawal font-bold text-base leading-[16px] text-[#1F2937]">
                الاشتراكات
              </span>
              <button
                type="button"
                className="flex items-center gap-2 h-8 px-4 py-2 rounded-lg border border-[#E5E5E5] font-ibm text-sm leading-4 font-normal text-black"
              >
                الشهر الحالي
                <ChevronDownIcon size={16} color="#000000" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { value: SUBSCRIPTION_SUMMARY.done, label: "حصص منتهية" },
                { value: SUBSCRIPTION_SUMMARY.completed, label: "حصص مكتملة" },
                { value: SUBSCRIPTION_SUMMARY.total, label: "إجمالي الحصص" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-[#F3F4F6] border border-[#E5E5E5]"
                >
                  <span className="font-ibm font-semibold text-[24px] leading-[32px] text-[#1F2937]">
                    {item.value}
                  </span>
                  <span className="font-ibm text-sm leading-4 font-normal text-[#1F2937]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {SUBSCRIPTION_PROGRESS.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="font-ibm text-sm leading-4 font-normal text-[#1F2937] flex-1 min-w-0 truncate text-right">
                    {p.name}
                  </span>
                  <span className="font-ibm text-sm leading-4 text-[#575F69] shrink-0">
                    {p.done}/{p.total}
                  </span>
                  <div
                    dir="ltr"
                    className="w-[145px] h-2 rounded-lg bg-[#E5E5E5] overflow-hidden shrink-0"
                  >
                    <div
                      className="h-full bg-[#12C6B0] rounded-lg"
                      style={{ width: `${(p.done / p.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* جدول الحصص - التقويم */}
        <section className="w-full bg-white border border-[#E5E5E5] rounded-2xl p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="font-ibm font-normal text-base leading-6 text-[#575F69]">
              جدول الحصص
            </span>
            <span className="font-ibm font-medium text-base leading-6 text-[#1F2937]">
              4 يوليو 2026
            </span>
            <div className="flex items-center gap-2 font-ibm font-normal text-base leading-6 text-[#1F2937]">
              <button type="button" className="p-1">
                <ChevronRightIcon size={24} color="#1F2937" />
              </button>
              يوليو 2026
              <button type="button" className="p-1">
                <ChevronLeftIcon size={24} color="#1F2937" />
              </button>
            </div>
          </div>

          <div className="border border-[#E5E5E5] rounded-2xl overflow-hidden">
            <div className="grid grid-cols-7 bg-[#F9FAFA] border-b-2 border-[#E5E5E5]">
              {WEEK_DAYS.map((d) => (
                <div
                  key={d}
                  className="h-20 flex items-center justify-center font-ibm font-normal text-base leading-6 text-[#575F69]"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="bg-white p-8 flex flex-col gap-6">
              {CALENDAR_WEEKS.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7">
                  {week.map((d, di) => (
                    <div
                      key={di}
                      className="h-[72px] flex items-center justify-center relative"
                    >
                      <span
                        className={`w-14 h-14 flex items-center justify-center rounded-full font-ibm font-bold text-base leading-6 ${
                          d.selected
                            ? "bg-[#123C91] text-white"
                            : d.muted
                              ? "text-[#8C9198]"
                              : "text-[#1F2937]"
                        }`}
                        style={
                          d.selected
                            ? {
                                boxShadow:
                                  "0 0 0 4px rgba(18, 60, 145, 0.4), 0 0 0 8px rgba(18, 60, 145, 0.2)",
                              }
                            : undefined
                        }
                      >
                        {d.day}
                      </span>
                      {d.hasEvent && (
                        <span className="absolute bottom-2 w-1 h-1 rounded-full bg-[#123C91]" />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* حصص اليوم */}
        <section className="w-full flex flex-col gap-3 pb-4">
          <div className="flex items-center justify-between">
            <span className="font-ibm font-semibold text-base leading-6 text-[#1F2937]">
              حصص السبت
            </span>
            <span className="font-ibm font-normal text-base leading-6 text-[#8C9198]">
              2 حصة
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {TODAY_SESSIONS.map((s) => (
              <div
                key={s.id}
                onClick={() => navigate(`/student/groups/${s.id}/sessions`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate(`/student/groups/${s.id}/sessions`);
                  }
                }}
                className="w-[320px] flex flex-col gap-3 p-6 rounded-2xl border border-[#E5E5E5] cursor-pointer hover:border-[#123C91] hover:shadow-sm transition-all"
                style={{ borderRight: "3px solid rgba(18, 60, 145, 0.5)" }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-ibm font-semibold text-base leading-6 text-[#1F2937]">
                      {s.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <GroupsIcon size={16} color="#8C9198" />
                      <span className="font-ibm font-normal text-xs leading-4 text-[#8C9198]">
                        {s.teacher}
                      </span>
                    </div>
                  </div>
                  <Badge tone={s.badgeTone}>{s.badge}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 font-ibm font-medium text-sm leading-4 text-[#8C9198]">
                    <ClockIcon size={16} color="#8C9198" />
                    {s.time}
                  </div>

                  {s.ctaTone === "filled" ? (
                    <button
                      type="button"
                      onClick={(e) => e.stopPropagation()}
                      className="w-[104px] h-8 rounded-lg bg-[#123C91] hover:bg-[#0e2f73] transition-colors font-ibm font-normal text-base leading-6 text-white"
                    >
                      {s.ctaLabel}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => e.stopPropagation()}
                      className="w-[104px] h-8 rounded-lg border border-[#E5E5E5] font-ibm font-normal text-base leading-6 text-[#575F69]"
                    >
                      {s.ctaLabel}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

/* ---------- عناصر مساعدة ---------- */

// تعديل: خريطة الألوان بقت مطابقة للفيجما بالظبط:
// - teal  (بادچ "مجموعة" / "تبدأ الآن")  -> نص #12C6B0 على خلفية شفافة منه
// - sky   (بادچ "خاصة")                  -> خلفية Soft Sky Blue #EAF4FF ثابتة + نص Deep Royal Blue #123C91
// - green (بادچ "متبقي X حصص" الأخضر)    -> نص #00A63E (كان #1E9E5A غلط)
// - red   (بادچ "متبقي X حصص" الأحمر)    -> نص #D32F2F
// وبرضو الحجم اتغيّر من 11px/medium لـ 12px/bold + توسيط النص، زي ما موضّح في خصائص الفيجما
const BADGE_TONES = {
  teal: { bg: "rgba(18, 198, 176, 0.15)", text: "#12C6B0" },
  sky: { bg: "#EAF4FF", text: "#123C91" },
  green: { bg: "rgba(0, 166, 62, 0.15)", text: "#00A63E" },
  red: { bg: "rgba(211, 47, 47, 0.15)", text: "#D32F2F" },
};

function Badge({ tone = "teal", children }) {
  const { bg, text } = BADGE_TONES[tone] || BADGE_TONES.teal;
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-ibm text-[12px] font-bold py-1 px-4 text-center"
      style={{ backgroundColor: bg, color: text }}
    >
      {children}
    </span>
  );
}

/* ---------- الأيقونات ---------- */
function iconProps({ size = 18, color = "currentColor", strokeWidth = 1.8 }) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
}
function SessionsIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <path d="M9 15l2 2 4-4" />
    </svg>
  );
}
function ExamIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M9 9l1.8 1.8L14.5 7.3" />
      <path d="M8 15h8" />
    </svg>
  );
}
function AssignmentIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </svg>
  );
}
function GroupsIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <rect x="3" y="4" width="7" height="7" rx="1.5" />
      <rect x="14" y="4" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <circle cx="17.5" cy="17.5" r="3.5" />
    </svg>
  );
}
function ClockIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}
function ChevronDownIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
function ChevronLeftIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function ChevronRightIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}