import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.svg";

/**
 * ⚠️ ملاحظة مهمة: الصفحة دي شكل واجهة بس (UI-only) دلوقتي.
 * الباك اند الحالي (/parents/students) بيعمل إنشاء فوري للحساب من غير
 * أي نظام "مراجعة إدارية" حقيقي (اتأكدنا من ده من رد الـ API نفسه).
 *
 * لما يتضاف Admin Panel يقبل/يرفض الطلبات فعلياً، هنحتاج:
 * 1. endpoint يرجع حالة الطلب الحقيقية (مثلاً GET /parents/students/:id/status)
 * 2. نستبدل الخطوات الثابتة تحت بقراءة الحالة الفعلية من الرد ده
 *
 * دلوقتي بيانات الخطوات (تم الاستلام / قيد المراجعة / تفعيل الحساب) ثابتة
 * وموجودة بس عشان تطابق التصميم.
 */
export default function AddChildSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const studentId = location.state?.studentId;
  const fullName = location.state?.fullName;

  return (
    <div dir="rtl" className="h-screen w-full flex bg-[#F8F9FC] overflow-hidden font-tajawal items-center justify-center">
      <div className="w-full max-w-[560px] bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8 flex flex-col items-center gap-6 text-center">
        <img src={logo} alt="الأكاديمية" className="h-8" />

        <div className="w-16 h-16 rounded-full bg-[#ECFDF5] flex items-center justify-center">
          <CheckIcon size={32} color="#10B981" />
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-[#1F2937]">تم إنشاء حسابك بنجاح</h2>
          <p className="text-sm text-[#6B7280]">
            حسابك الآن قيد المراجعة من قبل الإدارة{fullName ? ` - ${fullName}` : ""}
          </p>
        </div>

        <div className="w-full bg-[#F9FAFB] rounded-xl p-4 flex flex-col gap-3 text-right">
          <StatusRow label="تم إستلام طلبك بنجاح" done />
          <StatusRow label="جاري مراجعة الحساب من الإدارة" />
          <StatusRow label="سيتم إشعارك فور القبول" />
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/parent/children/add/pending", { state: { studentId, fullName } })
          }
          className="w-full h-12 bg-[#1E3B8A] text-white font-medium rounded-xl hover:bg-[#1B3275] transition-colors"
        >
          عرض حالة الطلب
        </button>
      </div>
    </div>
  );
}

function StatusRow({ label, done }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm ${done ? "text-[#1F2937]" : "text-[#9CA3AF]"}`}>{label}</span>
      {done ? (
        <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center">
          <CheckIcon size={12} color="#FFFFFF" />
        </div>
      ) : (
        <div className="w-5 h-5 rounded-full border-2 border-[#D1D5DB]" />
      )}
    </div>
  );
}

function CheckIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}