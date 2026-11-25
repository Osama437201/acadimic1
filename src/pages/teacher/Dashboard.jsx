import React from "react";
import { useNavigate } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const teacherName = "أحمد";

  const upcomingLessons = [
    {
      id: 1,
      title: "الرياضيات - الصف الثالث الثانوي",
      group: "مجموعة A",
      time: "10:00 ص",
      studentsCount: "8 طلاب",
      status: "active",
      buttonText: "بدء الدرس",
    },
    {
      id: 2,
      title: "الرياضيات - الصف الثالث الثانوي",
      group: "مجموعة B",
      time: "5:00 م",
      studentsCount: "30 طالب",
      status: "disabled",
      buttonText: "سيبدأ قريباً",
    },
    {
      id: 3,
      title: "الرياضيات - الصف الثالث الثانوي",
      group: "مجموعة B",
      time: "5:00 م",
      studentsCount: "30 طالب",
      status: "disabled",
      buttonText: "سيبدأ قريباً",
    },
  ];

  // قائمة الإشعارات المحدثة مع إضافة أنواع (type) للتخصيص
  const notifications = [
    {
      id: 1,
      type: "students",
      message: "تم انضمام 5 طلاب جديد لمجموعة الرياضيات",
      timeAgo: "منذ 10 دقائق",
    },
    {
      id: 2,
      type: "assignment",
      message: "قام الطالب محمد بإرسال الواجب الخاص بالحصة الأخيرة",
      timeAgo: "منذ ساعتين",
    },
    {
      id: 3,
      type: "lesson",
      message: "تذكير: موعد حصة الفيزياء القادمة بعد ساعتين",
      timeAgo: "منذ 5 ساعات",
    },
    {
      id: 4,
      type: "earnings",
      message: "تم طلب سحب أرباح بقيمة 1,500 EGP بنجاح",
      timeAgo: "منذ يوم واحد",
    },
  ];

  const stats = [
    {
      label: "إجمالي عدد الطلاب",
      value: "148",
      icon: UsersIcon,
      iconBg: "#E6F7F5",
      iconColor: "#12C6B0",
    },
    {
      label: "عدد الساعات",
      value: "54.5",
      icon: ClockIcon,
      iconBg: "#EAF4FF",
      iconColor: "#123C91",
    },
    {
      label: "إجمالي الأرباح",
      value: "EGP 12,500",
      icon: DollarIcon,
      iconBg: "#E6F7F5",
      iconColor: "#12C6B0",
    },
    {
      label: "متوسط التقييم",
      value: "4.9",
      icon: StarIcon,
      iconBg: "#EAF4FF",
      iconColor: "#123C91",
    },
  ];

  // دالة مساعدة لاختيار الأيقونة والألوان الخاصة بكل نوع إشعار
  const getNotificationStyle = (type) => {
    switch (type) {
      case "students":
        return {
          icon: UsersIcon,
          bg: "#DCFCE7",
          color: "#16A34A",
        };
      case "assignment":
        return {
          icon: AssignmentsIcon,
          bg: "#E0F2FE",
          color: "#0284C7",
        };
      case "lesson":
        return {
          icon: ClockIcon,
          bg: "#FEF3C7",
          color: "#D97706",
        };
      case "earnings":
        return {
          icon: DollarIcon,
          bg: "#FCE7F3",
          color: "#DB2777",
        };
      default:
        return {
          icon: BellIcon,
          bg: "#F3F4F6",
          color: "#4B5563",
        };
    }
  };

  return (
    <div
      dir="rtl"
      className="h-screen w-full flex bg-[#F9F9FF] overflow-hidden font-ibm"
    >
      {/* Sidebar */}
      <TeacherSidebar activeId="overview" />

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto px-8 py-8 flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1 text-right">
            <h1 className="font-ibm font-semibold text-2xl leading-8 text-[#123C91]">
              مرحباً بك يا {teacherName}
            </h1>
            <p className="font-ibm text-base text-[#575F69]">
              هنا يمكنك إنشاء المحتوى التعليمي، وتنظيم الحصص، ومتابعة أداء طلابك
              وتقدمهم الدراسي.
            </p>
          </div>
          <button
            type="button"
            className="h-11 px-5 rounded-lg bg-[#1F2937] text-white font-ibm font-medium text-sm hover:bg-[#111827] transition-colors"
          >
            انضم كمحاضر
          </button>
        </div>

        {/* Dynamic Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((card) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.label}
                className="bg-white rounded-lg border border-[#E5E5E5] p-6 flex flex-col gap-4 shadow-sm"
              >
                <div className="flex items-center justify-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg p-[10px] flex items-center justify-center shrink-0"
                    style={{ backgroundColor: card.iconBg }}
                  >
                    <IconComponent size={20} color={card.iconColor} />
                  </div>
                  <span className="font-ibm font-semibold text-[24px] leading-[32px] text-[#1F2937]">
                    {card.value}
                  </span>
                </div>
                <span className="font-ibm font-normal text-[16px] leading-[24px] text-[#575F69] text-right">
                  {card.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Section: Lessons & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
          {/* Upcoming Lessons Section */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-[#E5E5E5] p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-start gap-0.5">
                <h2 className="font-ibm font-semibold text-base text-[#1F2937]">
                  الدروس القادمة
                </h2>
                <span className="font-ibm text-xs text-[#8C9198]">
                  جدول دروسك القادم
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigate("/teacher/schedule")}
                className="font-ibm text-sm text-[#123C91] hover:underline"
              >
                عرض الكل
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {upcomingLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="w-full h-[120px] bg-white border border-[#E5E5E5] rounded-[8px] p-4 flex items-center justify-between"
                >
                  <div className="w-[40px] h-[40px] shrink-0 rounded-[8px] bg-[#EAF4FF] flex items-center justify-center ml-4">
                    <VideoIcon size={20} color="#123C91" />
                  </div>

                  <div className="flex-1 flex flex-col justify-center gap-2 text-right">
                    <div className="flex items-center gap-2">
                      <span className="font-ibm text-[16px] leading-[24px] font-normal text-[#1F2937]">
                        {lesson.title}
                      </span>
                      <span className="bg-[#EAF4FF] text-[#123C91] text-[16px] leading-[24px] font-normal px-2.5 py-0.5 rounded-[4px] font-ibm">
                        {lesson.group}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 font-ibm text-[14px] leading-[21px] font-normal text-[#575F69]">
                        <ClockIcon size={16} color="#575F69" />
                        {lesson.time}
                      </span>
                      <span className="flex items-center gap-1.5 font-ibm text-[14px] leading-[21px] font-normal text-[#575F69]">
                        <UsersIcon size={16} color="#575F69" />
                        {lesson.studentsCount}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={lesson.status === "disabled"}
                    className={`shrink-0 h-[40px] px-6 rounded-[8px] font-ibm text-[16px] leading-[24px] font-medium transition-colors ${
                      lesson.status === "active"
                        ? "bg-[#123C91] text-white hover:bg-[#0d2d6c]"
                        : "bg-[#F1F1F5] text-[#8C9198] cursor-not-allowed"
                    }`}
                  >
                    {lesson.buttonText}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications Section (محدثة) */}
          <div className="bg-white rounded-lg border border-[#E5E5E5] p-6 flex flex-col gap-4 max-h-[460px]">
            <div className="flex items-center justify-between border-b border-[#F1F1F5] pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <h2 className="font-ibm font-semibold text-base text-[#1F2937]">
                  الإشعارات الأخيرة
                </h2>
                <span className="bg-[#EAF4FF] text-[#123C91] text-xs font-medium px-2 py-0.5 rounded-full font-ibm">
                  {notifications.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigate("/teacher/notifications")}
                className="font-ibm text-sm text-[#123C91] hover:underline"
              >
                عرض الكل
              </button>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto pr-1">
              {notifications.map((n) => {
                const style = getNotificationStyle(n.type);
                const IconComponent = style.icon;

                return (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 bg-[#F9FAFA] hover:bg-[#F3F4F6] transition-colors rounded-lg p-3 border border-[#F1F1F5]"
                  >
                    <div
                      className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center mt-0.5"
                      style={{ backgroundColor: style.bg }}
                    >
                      <IconComponent size={16} color={style.color} />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 text-right">
                      <span className="font-ibm text-sm text-[#1F2937] leading-5 font-normal">
                        {n.message}
                      </span>
                      <span className="font-ibm text-xs text-[#8C9198]">
                        {n.timeAgo}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- الأيقونات المصممة بـ SVG ---------- */
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
function UsersIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function BellIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}
function StarIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function DollarIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v12M15 9.5c0-1.38-1.34-2.5-3-2.5s-3 1.12-3 2.5 1.34 2.5 3 2.5 3 1.12 3 2.5-1.34 2.5-3 2.5-3-1.12-3-2.5" />
    </svg>
  );
}
function ClockIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}
function AssignmentsIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </svg>
  );
}
function VideoIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <rect x="2.5" y="6" width="13" height="12" rx="2" />
      <path d="M15.5 10l6-3.5v11l-6-3.5z" />
    </svg>
  );
}