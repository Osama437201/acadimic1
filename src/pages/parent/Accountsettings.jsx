import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo-sidebar.svg";
import { getMyProfile, updateMyProfile } from "../../services/Userservice";
import { getMyStudents } from "../../services/parentService";

/**
 * صفحة إعدادات الحساب - متصلة بـ GET/PATCH /users/me الحقيقيين، والأبناء
 * دلوقتي من getMyStudents() الحقيقي (كانوا mock قبل كده).
 *
 * ⚠️ نقط لسه معلّقة:
 * - Update My Profile اتأكد إنه شغال بحقل fullName بس. اسم المستخدم
 *   والهاتف والإيميل مضافين في فورم التعديل تحت لكن لسه مش مؤكدين -
 *   جربهم واحد واحد قبل ما تعتمد عليهم، وشيل أي حقل يرجع خطأ من الـ API.
 * - مفيش حقل صورة بروفايل في الرد خالص - زرار الكاميرا تحت شكلي بس
 *   (معاينة محلية) ومش بيبعت أي حاجة للسيرفر لحد ما ييجي endpoint.
 * - مفيش endpoint تغيير كلمة مرور واضح لحد دلوقتي - الكارت شكلي بس.
 * - تابات الأبناء دلوقتي بتعرض الأسامي الحقيقية، لكن الدوس عليها لسه
 *   ملوش وظيفة فعلية (بس بيغيّر التاب المختار شكليًا) - محتاجين نتفق
 *   إيه المفروض يحصل فعليًا (فتح صفحة الطالب؟ تغيير محتوى الصفحة دي؟).
 */

export default function AccountSettings() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("self"); // "self" | studentId
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: "", username: "", phone: "" });
  const [savingInfo, setSavingInfo] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [profileRes, studentsRes] = await Promise.all([
          getMyProfile(),
          getMyStudents(),
        ]);
        if (cancelled) return;

        const user = profileRes.data?.user || null;
        setProfile(user);
        setEditForm({
          fullName: user?.fullName || "",
          username: user?.username || "",
          phone: user?.phone || "",
        });

        const studentsList = (studentsRes.data || []).map((s) => ({
          id: s.id || s._id,
          name: s.user?.name || s.name || "--",
        }));
        setChildren(studentsList);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);


  function startEditingInfo() {
    setEditForm({
      fullName: profile?.fullName || "",
      username: profile?.username || "",
      phone: profile?.phone || "",
    });
    setSaveError(null);
    setIsEditingInfo(true);
  }

  async function handleSaveInfo() {
    setSavingInfo(true);
    setSaveError(null);
    try {
      // بنبعت بس الحقول اللي اتغيّرت عن القيمة الأصلية، عشان نقلل خطر
      // إن حقل مش مدعوم فعليًا يكسر الطلب كله.
      const payload = {};
      if (editForm.fullName !== profile.fullName) payload.fullName = editForm.fullName;
      if (editForm.username !== profile.username) payload.username = editForm.username;
      if (editForm.phone !== profile.phone) payload.phone = editForm.phone;

      if (Object.keys(payload).length === 0) {
        setIsEditingInfo(false);
        return;
      }

      const res = await updateMyProfile(payload);
      setProfile(res.data?.user || { ...profile, ...payload });
      setIsEditingInfo(false);
    } catch (err) {
      setSaveError(err);
    } finally {
      setSavingInfo(false);
    }
  }

  // ⚠️ دلوقتي بيعرض الصورة محليًا بس كمعاينة (مفيش endpoint حقيقي).
  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
  }

  const navItems = [
    { id: "overview", label: "لوحة التحكم", icon: GridIcon, path: "/parent/dashboard" },
    { id: "children", label: "الأبناء", icon: UsersIcon, path: "/parent/children" },
    { id: "schedule", label: "الجدول", icon: CalendarIcon, path: "/parent/schedule" },
    { id: "messages", label: "الرسائل", icon: ChatIcon, path: "/parent/messages" },
    { id: "plans", label: "الخطط التعليمية", icon: CardIcon, path: "/parent/plans" },
    { id: "notifications", label: "الإشعارات", icon: BellIcon, path: "/parent/notifications" },
    { id: "settings", label: "الإعدادات", icon: GearIcon, path: "/parent/settings" },
  ];

  return (
    <div dir="rtl" className="h-screen w-full flex bg-[#F9F9FF] overflow-hidden font-tajawal">
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
              const isActive = item.id === "settings";
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
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }}
          className="flex items-center gap-2 h-9 w-[224px] px-2 rounded-lg text-white/90 hover:bg-white/10 transition-colors text-base font-ibm font-medium"
        >
          <LogoutIcon size={20} color="#FFFFFF" />
          تسجيل الخروج
        </button>
      </aside>

      <main className="flex-1 h-full overflow-y-auto px-8 py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="font-ibm font-semibold text-2xl leading-8 text-right text-[#123C91]">
            إعدادات الحساب
          </h1>
          <p className="font-ibm font-normal text-base leading-6 text-right text-[#575F69]">
            إدارة معلومات حسابك وتفضيلاتك
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg border border-[#E5E5E5] p-10 text-center text-sm text-[#8C9198] font-ibm">
            جاري تحميل بياناتك...
          </div>
        ) : error ? (
          <div className="bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] rounded-lg p-4 flex items-center justify-between font-ibm text-sm">
            <span>حصل خطأ أثناء تحميل بيانات الحساب. حاول تاني.</span>
            <button type="button" onClick={() => window.location.reload()} className="underline font-medium">
              إعادة المحاولة
            </button>
          </div>
        ) : (
        <>
        {/* كارت البروفايل + تابات الأبناء */}
        <div className="bg-white rounded-lg border border-[#E5E5E5] p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-end gap-1">
              <span className="font-tajawal font-semibold text-lg text-[#1F2937]">{profile.fullName}</span>
              <span className="font-ibm text-sm text-[#8C9198]">{profile.email}</span>
            </div>

            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-full bg-[#E5E5E5] overflow-hidden flex items-center justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-ibm font-semibold text-xl text-[#575F69]">
                    {profile.fullName?.trim().charAt(0)}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -left-1 w-7 h-7 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center shadow-sm hover:bg-[#F9FAFA] transition-colors"
              >
                <CameraIcon size={14} color="#575F69" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          <div className="border-t border-[#E5E5E5] pt-4 flex items-center justify-end gap-2">
            {children.map((child) => (
              <button
                key={child.id}
                type="button"
                onClick={() => setActiveTab(child.id)}
                className={`h-9 px-4 rounded-lg font-ibm text-sm font-medium transition-colors ${
                  activeTab === child.id
                    ? "bg-[#123C91] text-white"
                    : "bg-white text-[#575F69] hover:bg-[#F9FAFA]"
                }`}
              >
                {child.name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setActiveTab("self")}
              className={`h-9 px-4 rounded-lg font-ibm text-sm font-medium transition-colors ${
                activeTab === "self"
                  ? "bg-[#123C91] text-white"
                  : "bg-white text-[#575F69] hover:bg-[#F9FAFA]"
              }`}
            >
              حسابي
            </button>
          </div>
        </div>


        {/* البيانات الشخصية */}
        <div className="bg-white rounded-lg border border-[#E5E5E5] p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            {isEditingInfo ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveInfo}
                  disabled={savingInfo}
                  className="h-8 px-3 rounded-lg bg-[#123C91] text-white font-ibm text-sm font-medium hover:bg-[#0e2f73] transition-colors disabled:opacity-60"
                >
                  {savingInfo ? "جاري الحفظ..." : "حفظ"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingInfo(false)}
                  disabled={savingInfo}
                  className="font-ibm text-sm font-medium text-[#575F69] hover:underline"
                >
                  إلغاء
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={startEditingInfo}
                className="flex items-center gap-1.5 font-ibm text-sm font-medium text-[#123C91] hover:underline"
              >
                <PencilIcon size={14} />
                تعديل البيانات
              </button>
            )}
            <div className="flex flex-col items-end gap-1 text-right">
              <h2 className="font-ibm font-semibold text-lg text-[#1F2937]">البيانات الشخصية</h2>
              <p className="font-ibm text-sm text-[#8C9198] max-w-md">
                هذا القسم يحتوي على بياناتك الشخصية الأساسية التي تُستخدم في جميع الخدمات الرئيسية داخل المنصة.
              </p>
            </div>
          </div>

          {saveError && (
            <div className="bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] rounded-lg p-3 font-ibm text-sm text-right">
              حصل خطأ أثناء الحفظ. جرب حقل أقل (يمكن الحقل ده مش قابل للتعديل من الـ API حاليًا).
            </div>
          )}

          <div className="border border-[#E5E5E5] rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {isEditingInfo ? (
              <>
                <EditField
                  label="الاسم الكامل"
                  value={editForm.fullName}
                  onChange={(v) => setEditForm((f) => ({ ...f, fullName: v }))}
                />
                <EditField
                  label="اسم المستخدم"
                  value={editForm.username}
                  onChange={(v) => setEditForm((f) => ({ ...f, username: v }))}
                />
                {/* ⚠️ الإيميل مش هنسيبه قابل للتعديل هنا - غالبًا محتاج
                    تحقق منفصل (كود على الإيميل الجديد) زي أي منصة تانية.
                    لو الباك اند بيدعمه من نفس الـ endpoint، ممكن نضيفه. */}
                <InfoField label="البريد الإلكتروني" value={profile.email} />
                <EditField
                  label="رقم الهاتف"
                  value={editForm.phone}
                  onChange={(v) => setEditForm((f) => ({ ...f, phone: v }))}
                  dir="ltr"
                />
              </>
            ) : (
              <>
                <InfoField label="الاسم الكامل" value={profile.fullName} />
                <InfoField label="اسم المستخدم" value={profile.username} />
                <InfoField label="البريد الإلكتروني" value={profile.email} />
                <InfoField label="رقم الهاتف" value={profile.phone} dir="ltr" />
              </>
            )}
          </div>
        </div>


        {/* الأمان وكلمة المرور */}
        <div className="bg-white rounded-lg border border-[#E5E5E5] p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <button
              type="button"
              onClick={() => {
                // ⚠️ TODO: فتح فورم/مودال تغيير كلمة المرور لما يبقى في
                // endpoint حقيقي (المفروض current password + new password).
                // لسه معندناش endpoint مؤكد لده - راجع رسالتي في الشات.
              }}
              className="flex items-center gap-1.5 font-ibm text-sm font-medium text-[#123C91] hover:underline"
            >
              <PencilIcon size={14} />
              تغيير كلمة المرور
            </button>
            <div className="flex flex-col items-end gap-1 text-right">
              <h2 className="font-ibm font-semibold text-lg text-[#1F2937]">الأمان وكلمة المرور</h2>
              <p className="font-ibm text-sm text-[#8C9198]">تغيير كلمة المرور وإعدادات الأمان</p>
            </div>
          </div>

          <div className="border border-[#E5E5E5] rounded-lg p-4">
            <div className="flex flex-col items-end gap-1">
              <span className="font-ibm font-medium text-sm text-[#1F2937]">كلمة المرور</span>
              {/* ⚠️ مفيش حقل "آخر تغيير" في رد GET /users/me - النص ده
                  شكلي بس لحد ما نلاقي المصدر الصح للمعلومة دي. */}
              <span className="font-ibm text-xs text-[#8C9198]">••••••••</span>
            </div>
          </div>
        </div>
        </>
        )}
      </main>
    </div>
  );
}

/* ---------- حقل بيانات واحد (عرض فقط) ---------- */
function InfoField({ label, value, dir = "rtl" }) {
  return (
    <div className="flex flex-col items-end gap-1">
      <span className="font-ibm text-xs text-[#8C9198]">{label}</span>
      <span className="font-ibm font-medium text-sm text-[#1F2937]" dir={dir}>
        {value}
      </span>
    </div>
  );
}

/* ---------- حقل بيانات واحد (وضع التعديل) ---------- */
function EditField({ label, value, onChange, dir = "rtl" }) {
  return (
    <div className="flex flex-col items-end gap-1">
      <span className="font-ibm text-xs text-[#8C9198]">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={dir}
        className="w-full h-9 border border-[#E5E5E5] rounded-lg px-3 font-ibm text-sm text-[#1F2937] text-right focus:outline-none focus:border-[#123C91] transition-colors"
      />
    </div>
  );
}

/* ---------- أيقونات ---------- */
function iconProps({ size = 18, color = "currentColor", strokeWidth = 1.8 }) {
  return {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round",
  };
}
function GridIcon(p) { return (<svg {...iconProps(p)}><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" /></svg>); }
function UsersIcon(p) { return (<svg {...iconProps(p)}><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17.5" cy="9" r="2.6" /><path d="M21.5 20c0-2.6-1.9-4.8-4.4-5.4" /></svg>); }
function CalendarIcon(p) { return (<svg {...iconProps(p)}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>); }
function ChatIcon(p) { return (<svg {...iconProps(p)}><path d="M21 12a8 8 0 1 1-3.4-6.5L21 4l-1 4.6A7.96 7.96 0 0 1 21 12z" /></svg>); }
function CardIcon(p) { return (<svg {...iconProps(p)}><rect x="2.5" y="5" width="19" height="14" rx="2.2" /><path d="M2.5 10h19" /></svg>); }
function BellIcon(p) { return (<svg {...iconProps(p)}><path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9z" /><path d="M10 19a2 2 0 0 0 4 0" /></svg>); }
function GearIcon(p) { return (<svg {...iconProps(p)}><circle cx="12" cy="12" r="3.2" /><path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.4-2-3.4-2.3.9a7.7 7.7 0 0 0-2.6-1.5L14 2.5h-4l-.5 2.6a7.7 7.7 0 0 0-2.6 1.5l-2.3-.9-2 3.4 2 1.4a7.6 7.6 0 0 0 0 3l-2 1.4 2 3.4 2.3-.9c.77.66 1.65 1.17 2.6 1.5L10 21.5h4l.5-2.6a7.7 7.7 0 0 0 2.6-1.5l2.3.9 2-3.4-2-1.4z" /></svg>); }
function LogoutIcon(p) { return (<svg {...iconProps(p)}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></svg>); }
function ChevronIcon(p) { return (<svg {...iconProps(p)}><path d="M11 17l-5-5 5-5" /><path d="M18 17l-5-5 5-5" /></svg>); }
function PencilIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}
function CameraIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}