import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo-sidebar.svg";

const navItems = [
  {
    id: "overview",
    label: "لوحة التحكم",
    icon: GridIcon,
    path: "/teacher/dashboard",
  },
  {
    id: "groups",
    label: "المجموعات",
    icon: GroupsIcon,
    path: "/teacher/groups",
  },
  {
    id: "schedule",
    label: "الجدول",
    icon: CalendarIcon,
    path: "/teacher/schedule",
  },
  {
    id: "assignments",
    label: "الواجبات",
    icon: AssignmentsIcon,
    path: "/teacher/assignments",
  },
  {
    id: "exams",
    label: "الاختبارات",
    icon: ExamsIcon,
    path: "/teacher/exams",
  },
  {
    id: "messages",
    label: "الرسائل",
    icon: ChatIcon,
    path: "/teacher/messages",
  },
  {
    id: "notifications",
    label: "الإشعارات",
    icon: BellIcon,
    path: "/teacher/notifications",
  },
  {
    id: "earnings",
    label: "الأرباح",
    icon: EarningsIcon,
    path: "/teacher/earnings",
  },
  {
    id: "settings",
    label: "الإعدادات",
    icon: GearIcon,
    path: "/teacher/settings",
  },
];

export default function TeacherSidebar({ activeId }) {
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex flex-col justify-between w-64 h-full shrink-0 bg-[#1F2937] px-4 py-6 border-l border-black/10 shadow-[0_0_2px_0_rgba(0,0,0,0.25)]">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <img src={logo} alt="الأكاديمية" className="w-[176px] h-8" />
          <button
            type="button"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors shrink-0"
          >
            <ChevronIcon size={16} color="#FFFFFF" />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 h-10 w-[224px] px-2 rounded-lg transition-colors text-base font-ibm font-medium ${
                  isActive
                    ? "bg-white border-r-4 border-[#12C6B0] text-[#123C91]"
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                <item.icon size={20} color={isActive ? "#123C91" : "#FFFFFF"} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <button
        type="button"
        onClick={() => navigate("/login")}
        className="flex items-center gap-2 h-9 w-[224px] px-2 rounded-lg text-white/90 hover:bg-white/10 transition-colors text-base font-ibm font-medium"
      >
        <LogoutIcon size={20} color="#FFFFFF" />
        تسجيل الخروج
      </button>
    </aside>
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
function GridIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </svg>
  );
}
function CalendarIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}
function ChatIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M21 12a8 8 0 1 1-3.4-6.5L21 4l-1 4.6A7.96 7.96 0 0 1 21 12z" />
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
function GearIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.4-2-3.4-2.3.9a7.7 7.7 0 0 0-2.6-1.5L14 2.5h-4l-.5 2.6a7.7 7.7 0 0 0-2.6 1.5l-2.3-.9-2 3.4 2 1.4a7.6 7.6 0 0 0 0 3l-2 1.4 2 3.4 2.3-.9c.77.66 1.65 1.17 2.6 1.5L10 21.5h4l.5-2.6a7.7 7.7 0 0 0 2.6-1.5l2.3.9 2-3.4-2-1.4z" />
    </svg>
  );
}
function LogoutIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}
function ChevronIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M11 17l-5-5 5-5" />
      <path d="M18 17l-5-5 5-5" />
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
function EarningsIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M17 7h4v4" />
    </svg>
  );
}
