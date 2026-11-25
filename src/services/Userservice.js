import api from "./api";

/**
 * جلب بروفايل المستخدم الحالي - endpoint حقيقي، تم التأكيد من بوستمان
 * GET /users/me
 * الرد: { success, data: { user: { fullName, username, email, phone,
 *          role, country: {name, code, phoneCode, flag, id}, timezone,
 *          registrationStatus, isActive, id }, createdAt, updatedAt, id } }
 *
 * ⚠️ مفيش حقل صورة بروفايل (avatar) في الرد خالص - لسه معندناش endpoint
 * لرفع/تغيير الصورة.
 */
export async function getMyProfile() {
  const { data } = await api.get("/users/me");
  return { data: data?.data || null };
}

/**
 * تعديل بروفايل المستخدم الحالي - endpoint حقيقي، تم التأكيد من بوستمان
 * PATCH /users/me
 * body: تم اختبار { fullName } بس وشغال. مش مؤكد لسه إن username/phone/email
 * قابلين للتعديل بنفس الـ endpoint - جربهم قبل ما تعتمد عليهم في الفورم.
 * الرد: نفس شكل GET /users/me بعد التحديث.
 */
export async function updateMyProfile(payload) {
  const { data } = await api.patch("/users/me", payload);
  return { data: data?.data || null };
}
