import api from "./api";

/**
 * ✅ تأكيد Swagger: "مجموعة" في تصميم الفيجما = Course بيرجعه المعلم
 * الحالي كـ instructor (مفيش /groups منفصل في الـ API).
 *
 * ✅ الشكل الحقيقي لعنصر واحد جوه GET /courses/me (متأكد من Swagger):
 * {
 *   id, instructor,
 *   title: { ar, en },        // ⚠️ object مش string - لازم title?.ar
 *   slug, description,
 *   requirements: [], targetAudience: [],
 *   category,                  // string بسيط
 *   courseType,                 // "general" وغيرها
 *   curriculum, stage, grade, subject,  // ✅ موجودين فعليًا كحقول منفصلة
 *   level, language,
 *   coverImage, promoVideo,
 *   pricingType, price, discountPercentage, effectivePrice,
 *   status,                     // draft | pending_review | published | rejected | archived
 *   submittedAt, publishedAt, archivedAt,
 *   reviewHistory: [...],
 *   curriculum_sections: [...], // منهج الكورس بالكامل (سكاشن + دروس)
 *   createdAt, updatedAt
 * }
 *
 * ⚠️ لو الحساب معندوش Instructor profile، الـ endpoint بيرجع 404 برسالة
 * "No instructor profile for this account" - مش array فاضية زي ما كنا
 * متوقعين. لازم نتعامل مع الحالة دي في الواجهة بشكل مختلف عن أي خطأ عام
 * (شوف noInstructorProfile في Groups.jsx).
 *
 * GET /courses/me
 */
export async function getMyCourses() {
  const { data } = await api.get("/courses/me");
  return { data: data?.data || [] };
}

/**
 * تفاصيل مجموعة (كورس) واحدة بالكامل - منهج + كويزات.
 * GET /courses/me/{id}
 */
export async function getCourseDetails(courseId) {
  const { data } = await api.get(`/courses/me/${courseId}`);
  return { data: data?.data || null };
}

/**
 * ⚠️ TODO - غير مستخدم دلوقتي في صفحة المجموعات:
 * مفيش endpoint مؤكد بيرجع "عدد الطلاب المسجلين" في كورس المعلم نفسه.
 * الموجود في الـ Swagger هو GET /courses/admin/{courseId}/enrollments
 * وده تحت مسار /admin، على الأغلب admin-only مش instructor-scoped.
 */
export async function getCourseEnrollments(courseId) {
  const { data } = await api.get(`/courses/admin/${courseId}/enrollments`);
  return { data: data?.data || [] };
}