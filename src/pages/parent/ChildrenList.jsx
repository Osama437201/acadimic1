import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo-sidebar.svg";
import {
  getMyStudents,
  getStudentsStatistics,
  getMyStudentsSubscriptions,
  removeStudent,
  getStudentById,
} from "../../services/parentService";
import { getLocalizedName } from "../../utils/getLocalizedName";

/**
 * صفحة إدارة الأبناء - نسخة مبدئية (UI أولي) لحد ما يتبعت التصميم الدقيق.
 *
 * ⚠️ أعمدة الجدول اللي مش متأكدين من مصدرها الحقيقي دلوقتي:
 * - "نوع الحساب": الباك اند أكّد إن مفيش حقل زي ده خالص في الـ API (تم التأكيد
 *   من رد GET /students/:id - كل طالب بيرجع دايمًا مع object كامل بتاع parent).
 *   الباك اند خلص شغله ومش هيضيف الحقل ده، فسيبنا العمود ده "--" نهائيًا.
 * - "الاشتراك": بنستخدم GET /parents/students/subscriptions لكنه بيرجع فاضي
 *   حاليًا لحد ما تتفعل اشتراكات فعلية.
 * - "الدروس النشطة": مفيش حقل حقيقي متاح دلوقتي.
 * - "نسبة الحضور": بنستخدم averageScore كأقرب قيمة متاحة، مش نسبة حضور فعلية.
 * - زرار الحذف: بيضرب DELETE /parents/students/:id - تم تأكيد المسار.
 * - زرار العين: بيجيب تفاصيل الطالب الكاملة من GET /students/:id
 */
const PAGE_SIZE = 10;

export default function ChildrenList() {
  const navigate = useNavigate();

  const [children, setChildren] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: null,
    averageAttendance: null,
  });
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [childToDelete, setChildToDelete] = useState(null);

  // ---- مودال تفاصيل الطالب ----
  const [viewingChild, setViewingChild] = useState(null); // بيانات الصف (list row) - بتتفتح فورًا كـ placeholder
  const [viewingChildDetails, setViewingChildDetails] = useState(null); // بيانات كاملة من GET /students/:id
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setErrorMsg("");
    try {
      const [studentsRes, statsRes, subsRes] = await Promise.all([
        getMyStudents(),
        getStudentsStatistics(),
        getMyStudentsSubscriptions(),
      ]);
      setChildren(studentsRes?.data || []);
      setStats(statsRes?.data || {});
      setSubscriptions(subsRes?.data || []);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "حصل خطأ أثناء تحميل بيانات الأبناء",
      );
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = (child) => {
    setChildToDelete(child); // بيفتح المودال بدل confirm العادي
  };

  const confirmDelete = async () => {
    if (!childToDelete) return;
    const id = childToDelete.id;
    setDeletingId(id);
    try {
      await removeStudent(id);
      setChildren((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "تعذر حذف الطالب، حاول مرة أخرى");
    } finally {
      setDeletingId(null);
      setChildToDelete(null);
    }
  };

  const handleViewDetails = async (child) => {
    setViewingChild(child);
    setViewingChildDetails(null);
    setLoadingDetails(true);
    try {
      const res = await getStudentById(child.id);
      setViewingChildDetails(res?.data || null);
    } catch (err) {
      setViewingChildDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const filteredChildren = children.filter((c) =>
    (c?.user?.fullName || "")
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredChildren.length / PAGE_SIZE),
  );
  const pageItems = filteredChildren.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const navItems = [
    {
      id: "overview",
      label: "لوحة التحكم",
      icon: GridIcon,
      path: "/parent/dashboard",
    },
    {
      id: "children",
      label: "الأبناء",
      icon: UsersIcon,
      path: "/parent/children",
    },
    {
      id: "schedule",
      label: "الجدول",
      icon: CalendarIcon,
      path: "/parent/schedule",
    },
    {
      id: "messages",
      label: "الرسائل",
      icon: ChatIcon,
      path: "/parent/messages",
    },
    {
      id: "plans",
      label: "الخطط التعليمية",
      icon: CardIcon,
      path: "/parent/plans",
    },
    {
      id: "notifications",
      label: "الإشعارات",
      icon: BellIcon,
      path: "/parent/notifications",
    },
    {
      id: "settings",
      label: "الإعدادات",
      icon: GearIcon,
      path: "/parent/settings",
    },
  ];

  return (
    <div
      dir="rtl"
      className="h-screen w-full flex bg-[#F9F9FF] overflow-hidden font-tajawal"
    >
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
              const isActive = item.id === "children";
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
                  <item.icon
                    size={20}
                    color={isActive ? "#123C91" : "#FFFFFF"}
                  />
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
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="font-ibm font-semibold text-2xl leading-8 text-[#123C91]">
              إدارة الأبناء
            </h1>
            <p className="font-ibm text-base text-[#575F69]">
              إدارة ومتابعة بيانات وأداء أبنائك
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/parent/children/add")}
            className="h-11 px-5 rounded-lg bg-[#123C91] text-white font-ibm font-medium text-sm hover:bg-[#0e2f73] transition-colors"
          >
            إضافة ابن
          </button>
        </div>

        {errorMsg && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-right">
            {errorMsg}
          </div>
        )}

        {/* كروت الإحصائيات - الترتيب من اليمين: عدد الأبناء، الاختبارات، الواجبات، الحضور */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<UsersIcon size={20} color="#12C6B0" />}
            value={stats.totalStudents ?? children.length ?? "--"}
            label="عدد الأبناء"
          />
          {/* ⚠️ إجمالي الاختبارات محتاج endpoint لسه مش معروف مكانه */}
          <StatCard
            icon={<CardIcon size={20} />}
            value="--"
            label="إجمالي الاختبارات"
          />
          {/* ⚠️ /assignments/my endpoint مخصص لحساب الطالب بس (بيرجع 403 لولي الأمر).
              محتاجين endpoint جديد من نوع /parents/students/assignments لو حابب
              تطلبه من الباك اند، عشان نعرض الرقم ده صح */}
          <StatCard
            icon={<BookIcon size={20} />}
            value="--"
            label="إجمالي الواجبات"
          />
          <StatCard
            icon={<TrendIcon size={20} />}
            value={
              stats.averageAttendance != null
                ? `${stats.averageAttendance}%`
                : "--"
            }
            label="متوسط الحضور"
          />
        </div>

        {/* شريط البحث */}
        <div className="bg-white rounded-2xl border-b border-[#E5E5E5] shadow-sm p-6 flex items-center">
          <div className="relative w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="بحث عن ابن..."
              className="w-full h-12 border border-[#E5E5E5] rounded-lg pr-10 pl-4 bg-[#F9FAFA] text-sm text-[#1F2937] text-right focus:outline-none focus:border-[#1E3A8A] transition-colors"
            />
            <SearchIcon
              size={17}
              color="#1F2937"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>

        {/* الجدول - مطابق لمواصفات الفيجما */}
        <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
          {loading ? (
            <div className="py-14 text-center text-sm text-[#8C9198]">
              جاري التحميل...
            </div>
          ) : pageItems.length === 0 ? (
            <div className="py-14 text-center text-sm text-[#8C9198]">
              لا يوجد أبناء مطابقين للبحث
            </div>
          ) : (
            <table className="w-full text-right">
              <thead>
                <tr>
                  <th className="py-3 px-4 font-ibm font-medium text-sm text-[#575F69] text-right">
                    الابن
                  </th>
                  <th className="py-3 px-4 font-ibm font-medium text-sm text-[#575F69] text-center">
                    نسبة الحضور
                  </th>
                  <th className="py-3 px-4 font-ibm font-medium text-sm text-[#575F69] text-center">
                    نوع الحساب
                  </th>
                  <th className="py-3 px-4 font-ibm font-medium text-sm text-[#575F69] text-center">
                    الدروس النشطة
                  </th>
                  <th className="py-3 px-4 font-ibm font-medium text-sm text-[#575F69] text-center">
                    الدروس المكتملة
                  </th>
                  <th className="py-3 px-4 font-ibm font-medium text-sm text-[#575F69] text-center">
                    الاشتراك
                  </th>
                  <th className="py-3 px-4 font-ibm font-medium text-sm text-[#575F69] text-center">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((child) => {
                  const fullName = child?.user?.fullName || "-";
                  const gradeName = getLocalizedName(child?.grade?.name);
                  const initial = fullName.trim().charAt(0) || "?";
                  const score =
                    typeof child?.averageScore === "number"
                      ? child.averageScore
                      : null;

                  // ⚠️ شكل ربط الاشتراك بالطالب مش مؤكد 100% (الـ subscriptions API
                  // بيرجع array فاضي دلوقتي). عدّل الفلتر ده لما تشوف عنصر اشتراك حقيقي.
                  const sub = subscriptions.find(
                    (s) =>
                      s.student === child.id ||
                      s.studentId === child.id ||
                      s?.student?.id === child.id,
                  );

                  return (
                    <tr key={child.id} className="border-t border-[#E5E5E5]">
                      <td className="py-6 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 shrink-0 rounded-lg bg-[#123C91] flex items-center justify-center text-white font-semibold text-sm">
                            {initial}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-tajawal font-medium text-base leading-5 text-[#1F2937] text-right">
                              {fullName}
                            </span>
                            <span className="font-ibm font-normal text-base leading-6 text-[#575F69] text-right">
                              {gradeName || "-"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-4 font-ibm font-normal text-base leading-6 text-[#575F69] text-center">
                        {score != null ? `${score}%` : "--"}
                      </td>
                      {/* ⚠️ الباك اند مش بيرجع نوع الحساب خالص - تم التأكيد نهائيًا */}
                      <td className="py-6 px-4 font-ibm font-normal text-base leading-6 text-[#575F69] text-center">
                        --
                      </td>
                      <td className="py-6 px-4 font-ibm font-normal text-base leading-6 text-[#575F69] text-center">
                        --
                      </td>
                      <td className="py-6 px-4 font-ibm font-normal text-base leading-6 text-[#575F69] text-center">
                        {child?.totalStudySessions ?? "--"}
                      </td>
                      <td className="py-6 px-4 text-center">
                        <SubscriptionBadge subscription={sub} />
                      </td>
                      <td className="py-6 px-4">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleViewDetails(child)}
                            className="text-[#575F69] hover:text-[#1F2937]"
                            title="عرض التفاصيل"
                          >
                            <EyeIcon size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(child)}
                            disabled={deletingId === child.id}
                            className="text-red-400 hover:text-red-600 disabled:opacity-50"
                            title="حذف"
                          >
                            <TrashIcon size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* الترقيم - client-side بس دلوقتي، بيظهر دايماً زي التصميم */}
        {children.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="font-ibm font-normal text-sm leading-4 text-[#575F69] text-right">
              عرض {pageItems.length} من أصل {filteredChildren.length} أبناء
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg border border-[#E5E5E5] flex items-center justify-center disabled:opacity-40"
              >
                <ChevronRightIcon size={14} color="#1F2937" />
              </button>
              <span className="w-8 h-8 rounded-lg bg-[#123C91] text-white flex items-center justify-center text-sm font-medium">
                {page}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-lg border border-[#E5E5E5] flex items-center justify-center disabled:opacity-40"
              >
                <ChevronLeftIcon size={14} color="#1F2937" />
              </button>
            </div>
          </div>
        )}
      </main>

      {childToDelete && (
        <DeleteConfirmModal
          child={childToDelete}
          isDeleting={deletingId === childToDelete.id}
          onConfirm={confirmDelete}
          onCancel={() => setChildToDelete(null)}
        />
      )}

      {viewingChild && (
        <StudentDetailsModal
          child={viewingChildDetails || viewingChild}
          loading={loadingDetails}
          onClose={() => {
            setViewingChild(null);
            setViewingChildDetails(null);
          }}
        />
      )}
    </div>
  );
}

/* ---------- شارة حالة الاشتراك - مطابقة لمواصفات الفيجما ---------- */
function SubscriptionBadge({ subscription }) {
  if (!subscription) {
    return (
      <span
        className="inline-flex items-center justify-center rounded-full font-ibm font-bold text-xs"
        style={{
          backgroundColor: "rgba(140,145,152,0.15)",
          color: "#8C9198",
          padding: "4px 16px",
        }}
      >
        لا يوجد اشتراك
      </span>
    );
  }

  // ⚠️ منطق تحديد اللون (ساري/قريب الانتهاء) افتراضي لحد ما نشوف شكل بيانات
  // اشتراك حقيقي - عدّل الشرط ده وقتها لو الحقول مختلفة
  const isExpiringSoon =
    subscription.daysRemaining != null && subscription.daysRemaining <= 3;
  const color = isExpiringSoon ? "#DC2626" : "#00A63E";
  const label = subscription.status || subscription.planName || "مفعّل";

  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-ibm font-bold text-xs"
      style={{ backgroundColor: `${color}26`, color, padding: "4px 16px" }}
    >
      {label}
    </span>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div className="bg-white rounded-lg border border-[#E5E5E5] p-6 flex items-start gap-4">
      <div className="w-10 h-10 shrink-0 rounded-lg bg-[#12C6B0]/10 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-ibm font-semibold text-2xl leading-8 text-[#1F2937]">
          {value}
        </span>
        <span className="font-ibm font-normal text-base leading-6 text-[#575F69]">
          {label}
        </span>
      </div>
    </div>
  );
}

/* ---------- مودال تأكيد الحذف ---------- */
function DeleteConfirmModal({ child, isDeleting, onConfirm, onCancel }) {
  const fullName = child?.user?.fullName || "-";
  const gradeName = getLocalizedName(child?.grade?.name);
  const username = child?.user?.username || child?.username || "";
  const initial = fullName.trim().charAt(0) || "?";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onCancel}
    >
      <div
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[420px] bg-white rounded-2xl p-6 flex flex-col items-center gap-4 shadow-xl"
      >
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
          <WarningIcon size={26} color="#DC2626" />
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="font-tajawal font-semibold text-lg text-[#1F2937]">
            هل أنت متأكد من الحذف؟
          </h3>
          <p className="font-ibm font-normal text-sm text-[#575F69] max-w-[320px]">
            سيتم حذف كافة البيانات المتعلقة بهذا الطالب نهائياً ولا يمكن التراجع
            عن هذا الإجراء.
          </p>
        </div>

        <div className="w-full flex items-center gap-3 bg-[#F3F6FF] rounded-lg p-3">
          <div className="w-10 h-10 shrink-0 rounded-full bg-[#123C91] flex items-center justify-center text-white font-semibold">
            {initial}
          </div>
          <div className="flex flex-col text-right">
            <span className="font-tajawal font-medium text-sm text-[#1F2937]">
              {fullName}
            </span>
            <span className="font-ibm font-normal text-xs text-[#575F69]">
              {gradeName || "-"}
            </span>
            {username && (
              <span className="font-ibm font-normal text-xs text-[#8C9198]">
                اسم المستخدم: {username}
              </span>
            )}
          </div>
        </div>

        <div className="w-full flex items-center gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 h-11 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-ibm font-medium text-sm transition-colors"
          >
            {isDeleting ? "جارِ الحذف..." : "تأكيد الحذف"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 h-11 rounded-lg border border-[#E5E5E5] text-[#1F2937] font-ibm font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            تراجع
          </button>
        </div>

        <p className="font-ibm font-normal text-[11px] text-[#8C9198] text-center">
          بالضغط على تأكيد، فإنك توافق على شروط حذف البيانات الأكاديمية.
        </p>
      </div>
    </div>
  );
}

/* ---------- مودال تفاصيل الطالب - مبني على الحقول الحقيقية من GET /students/:id ---------- */
function StudentDetailsModal({ child, loading, onClose }) {
  const fullName = child?.user?.fullName || "-";
  const gradeName = getLocalizedName(child?.grade?.name);
  const stageName = getLocalizedName(child?.stage?.name);
  const curriculumName = getLocalizedName(child?.curriculum?.name);
  const initial = fullName.trim().charAt(0) || "?";

  // ⚠️ الطالب نفسه مفيهوش رقم هاتف في الـ API - المتاح بس رقم ولي الأمر
  const parentName = child?.parent?.user?.fullName || "--";
  const parentPhone = child?.parent?.user?.phone || "--";

  const joinDate = child?.createdAt
    ? new Date(child.createdAt).toLocaleDateString("ar-EG")
    : "--";

  const statusMap = {
    active: { label: "نشط", color: "#12B981" },
    pending: { label: "قيد المراجعة", color: "#F59E0B" },
    removed: { label: "محذوف", color: "#DC2626" },
  };
  const statusInfo = statusMap[child?.status] || {
    label: child?.status || "--",
    color: "#8C9198",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[380px] bg-white rounded-2xl p-6 flex flex-col gap-5 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-tajawal font-semibold text-lg text-[#1F2937]">
            تفاصيل الطالب
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 text-[#575F69]"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {loading ? (
          <div className="py-10 text-center text-sm text-[#8C9198]">
            جاري التحميل...
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2 items-end">
                <span className="font-tajawal font-medium text-base text-[#1F2937]">
                  {fullName}
                </span>
                <span
                  className="h-6 px-2 flex items-center rounded-full font-ibm font-medium text-xs"
                  style={{
                    backgroundColor: `${statusInfo.color}1A`,
                    color: statusInfo.color,
                  }}
                >
                  {statusInfo.label}
                </span>
              </div>
              <div className="w-11 h-11 shrink-0 rounded-full bg-[#123C91] flex items-center justify-center text-white font-semibold">
                {initial}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <DetailField label="المرحلة" value={stageName || "--"} />
              <DetailField label="الصف" value={gradeName || "--"} />
              <DetailField label="المنهج" value={curriculumName || "--"} />
              <DetailField label="تاريخ الانضمام" value={joinDate} />
              <DetailField
                label="متوسط الدرجات"
                value={
                  typeof child?.averageScore === "number"
                    ? `${child.averageScore}%`
                    : "--"
                }
              />
              <DetailField
                label="عدد الحصص"
                value={child?.totalStudySessions ?? "--"}
              />
            </div>

            <div className="border-t border-[#E5E5E5] pt-4 flex flex-col gap-2">
              <span className="font-ibm font-medium text-xs text-[#8C9198] text-right">
                بيانات ولي الأمر
              </span>
              <div className="grid grid-cols-2 gap-3">
                <DetailField label="الاسم" value={parentName} />
                <DetailField label="رقم الهاتف" value={parentPhone} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DetailField({ label, value }) {
  return (
    <div className="bg-[#F9FAFA] rounded-lg p-3 flex flex-col gap-1 items-end">
      <span className="font-ibm font-normal text-xs text-[#8C9198]">
        {label}
      </span>
      <span className="font-ibm font-medium text-sm text-[#1F2937]">
        {value}
      </span>
    </div>
  );
}

/* ---------- أيقونات ---------- */
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
function UsersIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17.5" cy="9" r="2.6" />
      <path d="M21.5 20c0-2.6-1.9-4.8-4.4-5.4" />
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
function CardIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <rect x="2.5" y="5" width="19" height="14" rx="2.2" />
      <path d="M2.5 10h19" />
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
function TrendIcon(p) {
  return (
    <svg {...iconProps({ ...p, color: p.color || "#12B981" })}>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  );
}
function BookIcon(p) {
  return (
    <svg {...iconProps({ ...p, color: p.color || "#123C91" })}>
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5" />
      <path d="M4 4.5v17" />
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
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}
function EyeIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function TrashIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
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
function ChevronLeftIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function WarningIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.29 3.86l-8.18 14.18A1.5 1.5 0 0 0 3.4 20.5h17.2a1.5 1.5 0 0 0 1.29-2.46L13.71 3.86a1.5 1.5 0 0 0-2.42 0z" />
    </svg>
  );
}
function CloseIcon(p) {
  return (
    <svg {...iconProps(p)}>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}