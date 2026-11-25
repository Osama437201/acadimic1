import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * شاشات "تم الإنشاء - قيد المراجعة" + "تفاصيل حالة الطلب"
 * قابلة لإعادة الاستخدام بين الطالب والمعلم وأي دور تاني محتاج نفس المسار
 *
 * props:
 * - whatsappNumber: رقم واتساب الدعم (اختياري، له قيمة افتراضية)
 */
export default function RegistrationStatus({ whatsappNumber = "201093185678" }) {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  if (!showDetails) {
    return (
      <div className="w-full flex flex-col items-center gap-6 text-center py-6">
        <div className="w-14 h-14 rounded-full border-2 border-emerald-400 flex items-center justify-center text-emerald-500 text-2xl">
          ✓
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="font-tajawal font-bold text-xl text-[#1F2937]">
            تم إنشاء حسابك بنجاح
          </h2>
          <p className="font-ibm text-sm text-[#575F69]">
            حسابك الآن قيد المراجعة من الإدارة
          </p>
        </div>

        <div className="w-full bg-[#F9FAFA] border border-[#E5E5E5] rounded-xl p-4 flex flex-col gap-3 text-right">
          <StatusRow label="تم استلام طلبك بنجاح" done />
          <StatusRow label="جاري مراجعة الحساب من الإدارة" />
          <StatusRow label="سيتم إشعارك فور القبول" />
        </div>

        <div className="w-full flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setShowDetails(true)}
            className="w-full h-12 rounded-lg bg-[#123C91] hover:bg-[#0e2f73] transition-colors
                       font-tajawal font-medium text-white"
          >
            عرض حالة الطلب
          </button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full h-12 rounded-lg border border-[#E5E5E5] hover:border-[#123C91]
                       transition-colors font-tajawal font-medium text-[#575F69]"
          >
            العودة لتسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-6 text-center py-6">
      <div className="w-14 h-14 rounded-full border-2 border-amber-400 flex items-center justify-center text-amber-500 text-2xl">
        ⏱
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="font-tajawal font-bold text-xl text-[#1F2937]">
          طلبك قيد المراجعة
        </h2>
        <p className="font-ibm text-sm text-[#575F69] max-w-[380px]">
          شكرًا لتقديم طلبك، يقوم فريقنا حاليًا بمراجعة بياناتك والتحقق من
          المستندات المرفقة
        </p>
      </div>

      <div className="w-full bg-[#F9FAFA] border border-[#E5E5E5] rounded-xl p-4 flex flex-col gap-3 text-right">
        <StatusRow label="تم استلام الطلب" done />
        <StatusRow label="قيد المراجعة" active />
        <StatusRow label="تفعيل الحساب" />
      </div>

      <div className="w-full grid grid-cols-2 gap-3">
        <div className="border border-[#E5E5E5] rounded-xl p-3 flex flex-col gap-2 text-right">
          <span className="font-ibm text-xs text-[#8C9198]">وقت المراجعة</span>
          <span className="font-tajawal font-bold text-sm text-[#1F2937]">1-3 أيام عمل</span>
        </div>
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noreferrer"
          className="border border-[#E5E5E5] rounded-xl p-3 flex flex-col gap-2 text-right hover:border-[#123C91] transition-colors"
        >
          <span className="font-ibm text-xs text-[#8C9198]">تواصل معنا</span>
          <span className="font-tajawal font-bold text-sm text-[#123C91]">عبر واتساب</span>
        </a>
      </div>

      <button
        type="button"
        onClick={() => navigate("/login")}
        className="w-full h-12 rounded-lg border border-[#E5E5E5] hover:border-[#123C91]
                   transition-colors font-tajawal font-medium text-[#575F69]"
      >
        العودة لتسجيل الدخول
      </button>
    </div>
  );
}

function StatusRow({ label, done, active }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0
          ${
            done
              ? "bg-emerald-500 text-white"
              : active
              ? "bg-amber-400 text-white"
              : "border border-[#E5E5E5] text-transparent"
          }`}
      >
        ✓
      </span>
      <span className={`font-ibm text-sm ${done || active ? "text-[#1F2937]" : "text-[#8C9198]"}`}>
        {label}
      </span>
    </div>
  );
}