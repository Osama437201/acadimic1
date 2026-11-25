import api from "./api";

/**
 * تسجيل الدخول
 * POST /auth/login
 * body: { email, password }
 * response: { success, token/accessToken, refreshToken?, data: {...user} }
 */
export async function login({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });

  // بعض الاستجابات بتستخدم اسم "token" وبعضها "accessToken" - بناخد أي واحد موجود
  const accessToken = data?.token || data?.accessToken;

  if (accessToken) {
    localStorage.setItem("token", accessToken);
  }
  if (data?.refreshToken) {
    localStorage.setItem("refreshToken", data.refreshToken);
  }
  if (data?.data) {
    localStorage.setItem("user", JSON.stringify(data.data));
  }

  return data;
}

/**
 * إنشاء حساب جديد
 * POST /auth/register
 * body: يختلف شوية حسب الدور (role) - parent / teacher / student
 * response: { success, message } -> بيبعت كود تحقق على الإيميل
 */
export async function register(payload) {
  const { data } = await api.post("/auth/register", payload);
  return data;
}

/**
 * تفعيل الحساب بالكود اللي اتبعت على الإيميل
 * POST /auth/verifyAccount
 * body: { email, code }
 */
export async function verifyAccount({ email, code }) {
  const { data } = await api.post("/auth/verifyAccount", { email, code });
  return data;
}

/**
 * استكمال بيانات ملف الطالب (بعد تسجيل الدخول)
 * POST /auth/completeStudentProfile
 * body: { birthDate, studyLanguage, curriculum, stage, grade, preferredSubjects: [] }
 * محتاجة Bearer Token (بيتبعت تلقائي من api.js لو المستخدم مسجل دخول)
 */
export async function completeStudentProfile(payload) {
  const { data } = await api.post("/auth/completeStudentProfile", payload);
  return data;
}

/**
 * استكمال بيانات ملف المعلم (بعد تسجيل الدخول)
 * PATCH /auth/completeTeacherProfile
 *
 * ✅ تم تأكيد الـ schema الحقيقي من Swagger:
 * - الـ endpoint ده multipart/form-data مش JSON عادي.
 * - teachingSelections لازم يبقى string فيه JSON.stringify لمصفوفة من
 *   { curriculum, stage, grade, subjects: [] } - عنصر لكل صف على حدة،
 *   مش قايمة صفوف/مواد مسطحة منفصلة.
 * - cvFile اختياري، بيتبعت تحت اسم "files".
 *
 * payload المتوقع من الكومبوننت:
 * { language, experienceYears, teachingSelections: [...], cvFile? }
 * محتاجة Bearer Token (بيتبعت تلقائي من api.js).
 */
export async function completeTeacherProfile({
  language,
  experienceYears,
  teachingSelections,
  cvFile,
}) {
  const formData = new FormData();
  formData.append("language", language);
  formData.append("experienceYears", experienceYears);
  formData.append("teachingSelections", JSON.stringify(teachingSelections));

  if (cvFile) {
    formData.append("files", cvFile);
  }

  const { data } = await api.patch("/auth/completeTeacherProfile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/**
 * نسيت كلمة المرور - بيبعت كود على الإيميل
 * POST /auth/forgotPassword
 * body: { email }
 */
export async function forgotPassword({ email }) {
  const { data } = await api.post("/auth/forgotPassword", { email });
  return data;
}

/**
 * التحقق من كود إعادة تعيين كلمة المرور
 * POST /auth/verifyResetCode
 * body: { resetCode }
 */
export async function verifyResetCode({ resetCode }) {
  const { data } = await api.post("/auth/verifyResetCode", { resetCode });
  return data;
}

/**
 * تعيين كلمة مرور جديدة بعد التحقق من الكود
 * POST /auth/resetPassword
 * body: { email, newPassword }
 */
export async function resetPassword({ email, newPassword }) {
  const { data } = await api.post("/auth/resetPassword", { email, newPassword });
  return data;
}

/**
 * تسجيل الخروج (محليًا بس - مفيش endpoint لسه)
 */
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

/**
 * جيب بيانات المستخدم المحفوظة محليًا
 */
export function getCurrentUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

export function isLoggedIn() {
  return !!localStorage.getItem("token");
}