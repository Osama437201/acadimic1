import api from "./api";

export async function addStudent(studentData) {
  const { data } = await api.post("/parents/students", studentData);
  return data;
}

/**
 * جلب قائمة أبناء ولي الأمر - endpoint حقيقي دلوقتي (كان mock قبل كده)
 * GET /parents/students
 * كل عنصر فيه حقل "status" حقيقي (مثلاً "pending") بيوضح حالة مراجعة الطالب
 */
export async function getMyStudents() {
  const { data } = await api.get("/parents/students");
  return { data: data?.data || [] };
}

/**
 * جلب إحصائيات الأبناء - endpoint حقيقي دلوقتي
 * GET /parents/students/statistics
 * الرد: { totalStudents, totalStudyHours, averageAttendance, totalLessonsThisMonth }
 */
export async function getStudentsStatistics() {
  const { data } = await api.get("/parents/students/statistics");
  return { data: data?.data || {} };
}

/**
 * جلب الإشعارات - endpoint حقيقي دلوقتي
 * GET /notifications (فولدر مستقل، مش تحت /parents)
 * الرد: { success, results, data: [] }
 * ⚠️ data لسه فاضية دايمًا في الاختبار - لسه معندناش شكل حقيقي لعنصر
 * إشعار واحد (اسم حقل النوع/الحالة/التاريخ). راجع normalizeNotification()
 * في Notifications.jsx وعدّلها لما يوصلنا رد حقيقي فيه بيانات.
 */
export async function getMyNotifications() {
  const { data } = await api.get("/notifications");
  return { data: data?.data || [] };
}

/**
 * وضع إشعار واحد كمقروء - تم التأكيد من بوستمان
 * PATCH /notifications/:id/read
 * مفيش body مطلوب
 * الرد المتوقع: { success: true/false, message? }
 */
export async function markNotificationRead(notificationId) {
  const { data } = await api.patch(`/notifications/${notificationId}/read`);
  return data;
}

/**
 * وضع كل الإشعارات كمقروءة - تم التأكيد من بوستمان
 * PATCH /notifications/read-all
 * مفيش body مطلوب
 * الرد: { success: true }
 */
export async function markAllNotificationsRead() {
  const { data } = await api.patch("/notifications/read-all");
  return data;
}

/**
 * جلب اشتراكات الأبناء - endpoint حقيقي دلوقتي
 * GET /parents/students/subscriptions
 * الرد: { success, data: [] } - فاضي حالياً لحد ما تتفعل اشتراكات فعلية
 */
export async function getMyStudentsSubscriptions() {
  const { data } = await api.get("/parents/students/subscriptions");
  return { data: data?.data || [] };
}

/**
 * حذف طالب
 * تم تأكيد المسار من بوستمان: DELETE /parents/students/:id
 */
export async function removeStudent(studentId) {
  const { data } = await api.delete(`/parents/students/${studentId}`);
  return data;
}

/**
 * جلب تفاصيل طالب واحد بالكامل - endpoint حقيقي، تم التأكيد من بوستمان
 * GET /students/:id
 * الرد: { success, data: { user, parent, grade, stage, curriculum,
 *          studyLanguage, birthDate, preferredSubjects, totalStudySessions,
 *          averageScore, status, createdAt, updatedAt, id } }
 *
 * ⚠️ ملاحظات مهمة اتأكدنا منها من رد حقيقي:
 * - مفيش حقل "نوع الحساب" (accountType) خالص - كل طالب بيرجع دايمًا مع
 *   object كامل بتاع parent. الباك اند خلص شغله ومش هيضيف الحقل ده.
 * - الطالب نفسه مفيهوش رقم هاتف - المتاح بس parent.user.phone
 */
export async function getStudentById(id) {
  const { data } = await api.get(`/students/${id}`);
  return { data: data?.data || null };
}





export async function getMySchedule() {
  const { data } = await api.get("/schedule/");
  return { data: data?.data || [] };
}