import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import recording1Image from "../../assets/recording1.svg";
import recording2Image from "../../assets/recording2.svg";

const STATUS_META = {
  upcoming: { label: "قادمة", bg: "#EAF4FF", color: "#123C91" },
  live: {
    label: "مباشرة الآن",
    bg: "rgba(0, 166, 62, 0.15)",
    color: "#00A63E",
  },
  cancelled: { label: "ملغاة", bg: "#FEE2E2", color: "#DC2626" },
  done: { label: "منتهية", bg: "#F1F1F5", color: "#575F69" },
};

const DEFAULT_SESSION = {
  id: 1,
  title: "المصفوفات_2",
  group: "مجموعة الرياضيات A",
  status: "live",
  absence: 4,
  attendance: 18,
  totalStudents: 22,
};

const MOCK_ASSIGNMENTS = [
  {
    id: 1,
    title: "واجب التفاضل والتكامل",
    due: "الموعد النهائي : خلال يومين",
    badge: "نشط",
  },
  {
    id: 2,
    title: "واجب التفاضل والتكامل",
    due: "الموعد النهائي : خلال يومين",
    badge: "نشط",
  },
];

const MOCK_EXAMS = [
  {
    id: 1,
    title: "اختبار المعادلات التربيعية",
    meta: "المشاركين : 24/25",
    badge: "منتهي",
  },
  {
    id: 2,
    title: "اختبار المعادلات التربيعية",
    meta: "المشاركين : 24/25",
    badge: "منتهي",
  },
  {
    id: 3,
    title: "اختبار المعادلات التربيعية",
    meta: "المشاركين : 24/25",
    badge: "منتهي",
  },
];

const MOCK_FILES = [
  { id: 1, name: "شرح المصفوفات", size: "PDF 24MB" },
  { id: 2, name: "حل واجب المعادلات", size: "PDF 24MB" },
  { id: 3, name: "شرح المصفوفات", size: "PDF 24MB" },
  { id: 4, name: "حل واجب المعادلات", size: "PDF 24MB" },
];

const MOCK_RECORDINGS = [
  {
    id: 1,
    title: "حساب المتجهات والمصفوفات",
    date: "2024-06-13",
    subject: "رياضيات A",
    size: "1.8 GB",
    image: recording1Image,
  },
  {
    id: 2,
    title: "حساب المتجهات والمصفوفات",
    date: "2024-06-13",
    subject: "رياضيات A",
    size: "1.8 GB",
    image: recording2Image,
  },
];

export default function SessionDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = { ...DEFAULT_SESSION, ...(location.state?.session || {}) };
  const status = STATUS_META[session.status] || STATUS_META.upcoming;

  const statCards = [
    {
      label: "إجمالي الطلاب",
      value: session.totalStudents,
      iconBg: "rgba(18, 198, 176, 0.1)",
      iconColor: "#12C6B0",
      textColor: "#1F2937",
    },
    {
      label: "الحضور",
      value: session.attendance,
      iconBg: "#EAF4FF",
      iconColor: "#123C91",
      textColor: "#123C91",
    },
    {
      label: "الغياب",
      value: session.absence,
      iconBg: "#FEE2E2",
      iconColor: "#DC2626",
      textColor: "#DC2626",
    },
  ];

  return (
    <div
      dir="rtl"
      className="h-screen w-full flex bg-[#F9F9FF] overflow-hidden font-ibm"
    >
      {/* الشريط الجانبي Sidebar */}
      <TeacherSidebar activeId="groups" />

      {/* المحتوى الرئيسي */}
      <main className="flex-1 h-full overflow-y-auto px-8 py-8 flex flex-col gap-6">
        {/* الهيدر */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start gap-1 text-right">
            <div className="flex items-center gap-2.5">
              <h1 className="font-ibm font-semibold text-[24px] leading-[32px] text-[#123C91]">
                {session.title}
              </h1>
              <span
                className="inline-flex items-center justify-center font-ibm font-bold text-[12px] leading-[16px]"
                style={{
                  backgroundColor: status.bg,
                  color: status.color,
                  height: "24px",
                  padding: "4px 16px",
                  borderRadius: "999px",
                  gap: "10px",
                }}
              >
                {status.label}
              </span>
            </div>
            <p className="font-ibm font-normal text-[16px] leading-[24px] text-[#575F69]">
              {session.group}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-[40px] h-[40px] rounded-[8px] border border-[#E5E5E5] bg-white flex items-center justify-center hover:bg-[#F9F9FF] transition-colors"
            >
              <ShareIcon size={16} color="#1F2937" />
            </button>
            <button
              type="button"
              onClick={() =>
                navigate("/teacher/groups/sessions/attendance", {
                  state: { session },
                })
              }
              className="w-[168px] h-[48px] px-6 rounded-[8px] bg-[#123C91] text-white font-tajawal font-medium text-[16px] leading-[22px] hover:bg-[#0F2F73] transition-colors flex items-center justify-center"
            >
              تسجيل الحضور
            </button>
          </div>
        </div>

        {/* كروت الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-white p-[24px] rounded-[8px] border border-[#E5E5E5] flex flex-row items-center justify-between shadow-sm"
              style={{ height: "112px" }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="rounded-[8px] flex items-center justify-center shrink-0"
                  style={{
                    width: "40px",
                    height: "40px",
                    padding: "10px",
                    gap: "10px",
                    backgroundColor: card.iconBg,
                    color: card.iconColor,
                  }}
                >
                  <UsersIcon size={20} color={card.iconColor} />
                </div>
                <div className="flex flex-col items-start justify-center gap-1">
                  <span
                    className="font-ibm text-[24px] leading-[32px] font-semibold"
                    style={{ color: card.textColor }}
                  >
                    {card.value}
                  </span>
                  <span className="font-ibm text-[16px] leading-[24px] text-[#575F69] text-right">
                    {card.label}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* باقي أقسام الصفحة */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* رابط الحصة المباشرة */}
            <div className="bg-[#1F2937] rounded-[16px] p-[24px] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1 text-right w-full">
                <h3 className="font-['IBM_Plex_Sans_Arabic'] font-semibold text-white text-[20px] leading-[24px]">
                  رابط الحصة المباشرة
                </h3>
                <p className="font-['IBM_Plex_Sans_Arabic'] text-[16px] leading-[24px] text-white/60 mt-0.5">
                  شارك الرابط مع الطلاب للانضمام
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  className="h-10 px-6 rounded-lg bg-white border border-[#E5E5E5] text-[#575F69] font-['Tajawal'] text-base font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  بدء الدرس
                </button>
                <button
                  type="button"
                  className="w-10 h-10 rounded-lg bg-white border border-[#E5E5E5] flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <ShareIcon size={16} color="#1F2937" />
                </button>
              </div>
            </div>

            {/* الملفات */}
            <div>
              <h3 className="font-ibm font-semibold text-[#1F2937] text-base mb-3 text-right">
                الملفـات
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MOCK_FILES.map((f) => (
                  <div
                    key={f.id}
                    className="bg-white border border-[#E5E5E5] rounded-[16px] p-[16px] flex items-center justify-between gap-[8px]"
                    style={{ minHeight: "72px" }}
                  >
                    <button
                      type="button"
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F1F5] transition-colors shrink-0"
                    >
                      <DownloadIcon size={16} color="#575F69" />
                    </button>
                    <div className="flex-1 text-right">
                      <p className="font-['IBM_Plex_Sans_Arabic'] text-[14px] font-medium leading-[16px] text-[#1F2937]">
                        {f.name}
                      </p>
                      <p className="font-['IBM_Plex_Sans_Arabic'] text-[12px] font-normal leading-[16px] text-[#575F69] mt-0.5">
                        {f.size}
                      </p>
                    </div>
                    <div className="w-6 h-6 flex items-center justify-center shrink-0">
                      <FileIcon size={24} color="#123C91" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* التسجيلات */}
            <div>
              <h3 className="font-ibm font-semibold text-[#1F2937] text-base mb-3 text-right">
                التسجيلات
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MOCK_RECORDINGS.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white border border-[#E5E5E5] rounded-[16px] overflow-hidden flex flex-col"
                  >
                    {/* صورة التسجيل مع بادج "للطلاب" في أقصى اليسار */}
                    <div className="relative w-full h-[200px] bg-[#F1F1F5]">
                      <img
                        src={r.image}
                        alt={r.title}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute top-2 left-2 flex items-center gap-[8px] bg-white bg-opacity-90 rounded-[8px]"
                        style={{
                          padding: "4px 8px",
                          height: "24px",
                        }}
                      >
                        <span className="font-['IBM_Plex_Sans_Arabic'] text-[12px] font-normal leading-[16px] text-[#00A63E] text-right">
                          للطلاب
                        </span>
                        <UsersIcon size={16} color="#00A63E" />
                      </div>
                    </div>

                    {/* تفاصيل التسجيل: العنوان يمين والتفاصيل والازرار يسار */}
                    <div className="p-4 flex flex-col justify-between flex-1 gap-4">
                      <p className="font-tajawal font-medium text-[16px] leading-[24px] text-[#1F2937] text-right">
                        {r.title}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-['IBM_Plex_Sans_Arabic'] text-[12px] font-normal leading-[16px] text-[#575F69] text-right">
                          {r.date} &middot; {r.subject} &middot; {r.size}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F1F1F5] transition-colors"
                          >
                            <DownloadIcon size={16} color="#575F69" />
                          </button>
                          <button
                            type="button"
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F1F1F5] transition-colors"
                          >
                            <ShareIcon size={16} color="#575F69" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* عمود الواجبات والاختبارات */}
          <div className="col-span-1 flex flex-col gap-4">
            <SectionCard title="الواجبات">
              {MOCK_ASSIGNMENTS.map((a) => (
                <ListRow
                  key={a.id}
                  badge={a.badge}
                  badgeBg="#DCFCE7"
                  badgeColor="#16A34A"
                  title={a.title}
                  meta={a.due}
                  icon={<AssignmentsIcon size={16} color="#575F69" />}
                />
              ))}
            </SectionCard>

            <SectionCard title="الاختبارات">
              {MOCK_EXAMS.map((e) => (
                <ListRow
                  key={e.id}
                  badge={e.badge}
                  badgeBg="#F1F1F5"
                  badgeColor="#575F69"
                  title={e.title}
                  meta={e.meta}
                  icon={<ExamsIcon size={16} color="#575F69" />}
                />
              ))}
            </SectionCard>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- مكونات مساعدة ---------- */
function SectionCard({ title, children }) {
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-ibm font-semibold text-[#1F2937] text-base">
          {title}
        </h3>
        <button
          type="button"
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#E5E5E5] hover:bg-[#F9F9FF] transition-colors"
        >
          <PlusIcon size={14} color="#575F69" />
        </button>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function ListRow({ badge, badgeBg, badgeColor, title, meta, icon }) {
  return (
    <div className="flex items-center justify-between gap-2 border border-[#F1F1F5] rounded-lg p-2.5">
      <button
        type="button"
        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F1F1F5] transition-colors shrink-0"
      >
        {icon}
      </button>
      <div className="flex-1 text-right">
        <p className="font-ibm text-sm font-medium text-[#1F2937]">{title}</p>
        <p className="font-ibm text-xs text-[#8C9198] mt-0.5">{meta}</p>
      </div>
      <span
        className="h-6 px-2 inline-flex items-center rounded-full font-ibm text-xs font-medium shrink-0"
        style={{ backgroundColor: badgeBg, color: badgeColor }}
      >
        {badge}
      </span>
    </div>
  );
}

/* ---------- أيقونات SVG ---------- */
function iconProps({
  size = 18,
  color = "currentColor",
  strokeWidth = 1.8,
  className = "",
}) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
  };
}

function AssignmentsIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </svg>
  );
}
function ExamsIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M9 9l1.8 1.8L14.5 7.3" />
      <path d="M8 15h8" />
    </svg>
  );
}
function ShareIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.2 10.7l7.6-4.4M8.2 13.3l7.6 4.4" />
    </svg>
  );
}
function UsersIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 19c0-3.3 2.9-6 6.5-6s6.5 2.7 6.5 6" />
      <path d="M16 4.5c1.8.4 3 1.9 3 3.7s-1.2 3.3-3 3.7" />
      <path d="M18.5 13.2c2 .6 3.5 2.5 3.5 4.8" />
    </svg>
  );
}
function PlusIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function FileIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}
function DownloadIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M4 19h16" />
    </svg>
  );
}