import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { getMyStudents } from "../../services/parentService";

/**
 * دلوقتي الصفحة دي متصلة بالـ API الحقيقي فعلاً.
 * بنجيب كل أبناء ولي الأمر (GET /parents/students) وبندور على الطالب
 * اللي عنده نفس studentId اللي جاي من صفحة النجاح، وبنقرا حقل status
 * الحقيقي بتاعه.
 *
 * ⚠️ القيم المعروفة حالياً لحقل status: "pending" بس (لسه محدش اتوافق عليه).
 * لو ظهرت قيمة تانية غير "pending" (زي "approved"/"active"/"rejected")
 * حدّث الشرط تحت (STATUS_CONFIG) بالقيمة الفعلية اللي بيرجعها الباك اند.
 *
 * القبول/الرفض نفسه بيتم من لوحة تحكم الأدمن (مش من التطبيق ده) - إحنا هنا
 * بس بنعرض الحالة الحالية، مش بنغيّرها.
 */

const STATUS_CONFIG = {
  pending: {
    title: "طلبك قيد المراجعة",
    desc: "يقوم فريقنا حالياً بمراجعة بياناتك والتحقق من المستندات المرفقة.",
    iconColor: "#F97316",
    iconBg: "#FFF7ED",
  },
  approved: {
    title: "تم قبول طلبك",
    desc: "تم تفعيل حساب الطالب بنجاح، يمكنه الآن الدخول إلى المنصة التعليمية.",
    iconColor: "#10B981",
    iconBg: "#ECFDF5",
  },
  active: {
    title: "الحساب مفعّل",
    desc: "تم تفعيل حساب الطالب بنجاح، يمكنه الآن الدخول إلى المنصة التعليمية.",
    iconColor: "#10B981",
    iconBg: "#ECFDF5",
  },
  rejected: {
    title: "تم رفض الطلب",
    desc: "للأسف لم تتم الموافقة على هذا الطلب. تواصل معنا عبر واتساب لمعرفة السبب.",
    iconColor: "#EF4444",
    iconBg: "#FEF2F2",
  },
};

export default function AddChildPendingReview() {
  const location = useLocation();
  const navigate = useNavigate();
  const studentId = location.state?.studentId;
  const fullNameFromState = location.state?.fullName;

  // 🧪 DEV ONLY: وضع معاينة مؤقت لتجربة شكل أي حالة من غير ما نستنى تغيير حقيقي
  // في السيرفر. مثال استخدام: أضف ?previewStatus=approved في آخر رابط الصفحة
  // في المتصفح (زي: http://localhost:3000/parent/children/add/pending?previewStatus=approved)
  // القيم المتاحة: pending / approved / active / rejected
  // ⚠️ لازم تتشال السطور دي (previewStatus وكل استخدامها تحت) قبل الرفع للإنتاج.
  const previewStatus = new URLSearchParams(location.search).get("previewStatus");

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [student, setStudent] = useState(null);

  useEffect(() => {
    // 🧪 DEV ONLY: لو فيه previewStatus في الرابط، منعملش fetch حقيقي خالص
    if (previewStatus) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchStatus() {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await getMyStudents();
        const list = res?.data || [];
        const found = studentId ? list.find((s) => s.id === studentId) : null;
        if (!cancelled) setStudent(found || null);
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err.response?.data?.message || "تعذر جلب حالة الطلب الآن");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchStatus();
    return () => {
      cancelled = true;
    };
  }, [studentId, previewStatus]);

  const status = previewStatus || student?.status || "pending";
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const fullName = student?.user?.fullName || fullNameFromState;

  // ⚠️ TODO: استبدل الرقم ده برقم الدعم الحقيقي بتاع الأكاديمية
  const supportWhatsappNumber = "201000000000";
  const whatsappLink = `https://wa.me/${supportWhatsappNumber}`;

  return (
    <div dir="rtl" className="h-screen w-full flex bg-[#F8F9FC] overflow-hidden font-tajawal items-center justify-center">
      <div className="w-full max-w-[560px] flex flex-col items-center gap-6 text-center">
        <img src={logo} alt="الأكاديمية" className="h-8" />

        {loading ? (
          <p className="text-sm text-[#8C9198]">جاري التحقق من حالة الطلب...</p>
        ) : errorMsg ? (
          <div className="w-full bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{errorMsg}</div>
        ) : (
          <>
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: config.iconBg }}
            >
              <ClockIcon size={32} color={config.iconColor} />
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-[#1F2937]">{config.title}</h2>
              <p className="text-sm text-[#6B7280]">
                {fullName ? `${fullName} - ` : ""}
                {config.desc}
              </p>
            </div>

            <div className="w-full bg-white rounded-xl border border-[#E5E7EB] p-4 flex flex-col gap-4 text-right">
              <StatusRow label="تم إستلام الطلب" desc="تم تسجيل بياناتك بنجاح" state="done" />
              <StatusRow
                label="قيد المراجعة"
                desc="يتم مراجعة بياناتك والتحقق من المستندات"
                state={status === "pending" ? "active" : "done"}
              />
              <StatusRow
                label="تفعيل الحساب"
                desc={status === "pending" ? "سيتم إشعارك فور الموافقة" : "تم تفعيل الحساب"}
                state={status === "pending" ? "pending" : status === "rejected" ? "rejected" : "done"}
              />
            </div>

            <div className="w-full grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 flex flex-col gap-2 text-right">
                <span className="text-sm font-semibold text-[#1F2937]">تواصل معنا عبر واتساب</span>
                <span className="text-xs text-[#6B7280]">
                  تواصل معنا في حالة وجود أي استفسار بخصوص طلبك
                </span>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 h-10 flex items-center justify-center gap-2 bg-[#1E3B8A] text-white text-sm font-medium rounded-lg"
                >
                  تواصل عبر واتساب
                </a>
              </div>

              <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 flex flex-col gap-2 text-right">
                <span className="text-sm font-semibold text-[#1F2937]">وقت المراجعة</span>
                <span className="text-xs text-[#6B7280]">عادة 1-3 أيام عمل</span>
              </div>
            </div>

            {/* لما الحساب يتقبل، يظهر زرار للانتقال المباشر للداشبورد بدل ما يفضل واقف هنا */}
            {(status === "approved" || status === "active") && (
              <button
                type="button"
                onClick={() => navigate("/parent/dashboard")}
                className="w-full h-12 bg-[#1E3B8A] text-white font-medium rounded-xl hover:bg-[#1B3275] transition-colors"
              >
                الذهاب إلى لوحة التحكم
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatusRow({ label, desc, state }) {
  const colorMap = {
    done: { bg: "#10B981", text: "#1F2937" },
    active: { bg: "#F97316", text: "#1F2937" },
    pending: { bg: "#D1D5DB", text: "#9CA3AF" },
    rejected: { bg: "#EF4444", text: "#1F2937" },
  };
  const { bg, text } = colorMap[state] || colorMap.pending;

  return (
    <div className="flex items-start gap-3">
      <div className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: bg }} />
      <div className="flex flex-col">
        <span className="text-sm font-medium" style={{ color: text }}>{label}</span>
        <span className="text-xs text-[#9CA3AF]">{desc}</span>
      </div>
    </div>
  );
}

function ClockIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </svg>
  );
}