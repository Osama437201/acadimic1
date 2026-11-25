import api from "./api";

/**
 * جلب جدول حصص المعلم - نفس endpoint المستخدم في جانب ولي الأمر
 * (endpoint مشترك بين الأدوار، مؤكد من Swagger).
 * GET /schedule/
 */
export async function getMySchedule() {
  const { data } = await api.get("/schedule/");
  return { data: data?.data || [] };
}

/**
 * جلب إشعارات المعلم - نفس endpoint ولي الأمر (مشترك بين الأدوار)
 * GET /notifications
 */
export async function getMyNotifications() {
  const { data } = await api.get("/notifications");
  return { data: data?.data || [] };
}

/**
 * جلب اختيارات المعلم التدريسية (منهج/مرحلة/صف/مواد)
 * GET /teachers/me/teaching-selections
 * يتطلب role: teacher و بروفايل معلم مكتمل.
 */
export async function getTeachingSelections() {
  const { data } = await api.get("/teachers/me/teaching-selections");
  return { data: data?.data || null };
}

/**
 * جلب كل المعلمين - endpoint مؤكد شغال بدون قيود أدمن (جربناه فعليًا).
 * GET /teachers
 */
export async function getAllTeachers() {
  const { data } = await api.get("/teachers");
  return { data: data?.data || [] };
}

/**
 * ✅ الحل العملي لمشكلة "مفيش /teachers/me":
 * بما إن GET /teachers بيرجع كل معلم ومعاه user.id بتاعه، بنجيب كل
 * المعلمين ونلاقي العنصر اللي user.id بتاعه بيطابق المستخدم المسجل دخول
 * حاليًا (من localStorage). كده بنجيب بروفايل المعلم الحالي (rating,
 * totalStudents, totalEarnings, totalSessions, totalTeachingMinutes...)
 * من غير ما نحتاج endpoint مخصص "/teachers/me" أصلاً.
 *
 * ⚠️ الحل ده عملي كويس لمشروع بحجمنا دلوقتي، لكنه بيجيب كل المعلمين في كل
 * مرة (مش efficient لو عدد المعلمين كبر جدًا مستقبلاً). لو حبيت تحسّنه بعدين
 * ينفع تضيف query param فلترة بالـ email/username لو الـ endpoint بيدعمها.
 *
 * بيرجع null لو الحساب الحالي معندوش بروفايل معلم لسه (يعني لازم يكمل
 * completeTeacherProfile الأول).
 */
export async function getMyTeacherProfile() {
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  if (!storedUser?.id) return { data: null };

  const res = await getAllTeachers();
  const match = (res.data || []).find((t) => t?.user?.id === storedUser.id);
  return { data: match || null };
}