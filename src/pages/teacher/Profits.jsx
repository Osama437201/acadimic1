import React, { useState } from "react";
import TeacherSidebar from "./TeacherSidebar";

const stats = [
  {
    id: "total",
    label: "إجمالي الأرباح",
    value: "EGP 20,000",
    icon: "dollar",
    color: "#123C91",
    bg: "#EAF0FB",
  },
  {
    id: "available",
    label: "الرصيد المتاح",
    value: "EGP 13,000",
    icon: "dollar",
    color: "#059669",
    bg: "#E7F7F1",
  },
  {
    id: "withdrawn",
    label: "إجمالي المسحوب",
    value: "EGP 7,000",
    icon: "dollar",
    color: "#123C91",
    bg: "#EAF0FB",
  },
  {
    id: "pending",
    label: "قيد المراجعة",
    value: "EGP 3,000",
    icon: "dollar",
    color: "#D97706",
    bg: "#FEF3E2",
  },
];

const timeOptions = ["جميع الأوقات", "هذا الأسبوع", "هذا الشهر", "هذا العام"];
const statusOptions = ["جميع الحالات", "مكتمل", "قيد المراجعة"];

const transactions = [
  {
    id: "145-f578",
    date: "01/06/2026",
    account: "01012547896",
    sessions: 8,
    status: "قيد المراجعة",
    amount: "EGP 3,000",
  },
  {
    id: "145-f578",
    date: "01/06/2026",
    account: "01012547896",
    sessions: 8,
    status: "مكتمل",
    amount: "EGP 1,200",
  },
  {
    id: "145-f578",
    date: "01/06/2026",
    account: "01012547896",
    sessions: 8,
    status: "مكتمل",
    amount: "EGP 4,200",
  },
  {
    id: "d85-98745",
    date: "01/06/2026",
    account: "01012547896",
    sessions: 8,
    status: "مكتمل",
    amount: "EGP 700",
  },
];

export default function TeacherProfits() {
  const [timeFilter, setTimeFilter] = useState(timeOptions[0]);
  const [statusFilter, setStatusFilter] = useState(statusOptions[0]);
  const [search, setSearch] = useState("");

  return (
    <div
      dir="rtl"
      className="h-screen w-full flex bg-[#F9F9FF] overflow-hidden font-ibm"
    >
      <TeacherSidebar activeId="earnings" />

      <main className="flex-1 min-h-0 h-full overflow-y-auto px-8 py-8 pb-12 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-1 text-right">
          <h1 className="font-ibm font-semibold text-2xl leading-8 text-[#123C91]">
            الأرباح والمدفوعات
          </h1>
          <p className="font-ibm font-normal text-base leading-6 text-[#575F69]">
            متابعة أرباحك وسحب المستحقات
          </p>
        </div>

        {/* Hero banner */}
        <div className="relative w-full h-[200px] rounded-2xl bg-[#1F2937] overflow-hidden px-8 flex items-center">
          {/* Decorative circles - يمين وشمال */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute top-[124px] -left-10 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />

          {/* النص + الزرار - يمين */}
          <div className="relative flex flex-col items-end gap-1 text-right">
            <span className="font-ibm font-normal text-base leading-6 text-white">
              متاح للطلب
            </span>
            <span className="font-ibm font-normal text-base leading-6 text-white">
              EGP 13,000
            </span>
            <span className="font-ibm font-normal text-base leading-6 text-white">
              المبلغ الذي يمكنك طلبه من الإدارة
            </span>
            <button
              type="button"
              className="relative shrink-0 h-10 w-[160px] px-6 mt-4 rounded-lg border border-[#E5E5E5] bg-white flex items-center justify-center gap-2 font-tajawal font-medium text-base text-[#575F69] hover:bg-[#F9FAFA] transition-all whitespace-nowrap"
            >
              طلب سحب الأرباح
            </button>
          </div>

          {/* أيقونة الدولار - شمال */}
          <div className="relative w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center shrink-0 mr-auto">
            <DollarIcon size={22} color="#fff" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-[#E5E5E5] px-5 py-4 gap-5 flex items-center shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)]"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: s.bg }}
              >
                <DollarIcon size={16} color={s.color} />
              </div>
              <div className="flex flex-col gap-1 text-right flex-1">
                <span className="font-ibm font-bold text-2xl leading-8 text-[#1F2937]">
                  {s.value}
                </span>
                <span className="font-ibm font-normal text-sm leading-5 text-[#575F69] whitespace-nowrap">
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Filters + Table container */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden">
          {/* Filters */}
          <div className="px-6 py-4 flex items-center gap-3 border-b border-[#F1F1F1]">
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث عن رقم معاملة..."
                className="w-full h-10 bg-white border border-[#E5E5E5] rounded-lg pr-4 pl-9 text-sm text-[#1F2937] placeholder-[#8C9198] outline-none focus:border-[#123C91] transition-all"
              />
              <SearchIcon
                size={15}
                color="#8C9198"
                className="absolute left-3 top-1/2 -translate-y-1/2"
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none h-10 pl-8 pr-4 rounded-lg border border-[#E5E5E5] bg-white text-sm text-[#575F69] outline-none focus:border-[#123C91] cursor-pointer"
              >
                {statusOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <ChevronIcon
                size={14}
                color="#8C9198"
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>
            <div className="relative">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="appearance-none h-10 pl-8 pr-4 rounded-lg border border-[#E5E5E5] bg-white text-sm text-[#575F69] outline-none focus:border-[#123C91] cursor-pointer"
              >
                {timeOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <ChevronIcon
                size={14}
                color="#8C9198"
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-[#F9FAFA] border-b border-[#F1F1F1]">
                  <Th>رقم المعاملة</Th>
                  <Th>التاريخ</Th>
                  <Th>الحساب</Th>
                  <Th>إجمالي الحصص</Th>
                  <Th>الحالة</Th>
                  <Th>المبلغ</Th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-[#F1F1F1] last:border-b-0 hover:bg-[#F9FAFA] transition-colors"
                  >
                    <Td>{t.id}</Td>
                    <Td>{t.date}</Td>
                    <Td>{t.account}</Td>
                    <Td>{t.sessions} حصص</Td>
                    <Td>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          t.status === "مكتمل"
                            ? "bg-[#E7F7F1] text-[#059669]"
                            : "bg-[#FEF3E2] text-[#D97706]"
                        }`}
                      >
                        {t.status}
                      </span>
                    </Td>
                    <Td className="font-semibold text-[#1F2937]">{t.amount}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function Th({ children }) {
  return (
    <th className="px-6 py-3 font-ibm font-medium text-sm text-[#575F69] whitespace-nowrap">
      {children}
    </th>
  );
}
function Td({ children, className = "" }) {
  return (
    <td
      className={`px-6 py-4 font-ibm font-normal text-sm text-[#1F2937] whitespace-nowrap ${className}`}
    >
      {children}
    </td>
  );
}

/* Icons */
function DollarIcon({ size = 18, color = "currentColor" }) {
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
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
function ChevronIcon({ size = 14, color = "currentColor", className = "" }) {
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
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function SearchIcon({ size = 18, color = "currentColor", className = "" }) {
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
      className={className}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
