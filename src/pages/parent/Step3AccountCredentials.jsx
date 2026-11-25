import React, { useState } from "react";

/**
 * ⚠️ ملاحظة مهمة:
 * الباك اند دلوقتي مش عنده حقل "accountType" - endpoint /parents/students
 * لسه بياخد نفس الحقول القديمة بس (username, password, passwordConfirm).
 * الاختيار ده شكل واجهة زي التصميم، لكن وقت الإرسال في Step4Review
 * بنبعت فقط username/password/passwordConfirm العاديين، ومش بنبعت accountType خالص.
 *
 * 🚧 نقطة لسه مفتوحة: لو المستخدم اختار "الدخول عبر حساب ولي الأمر"،
 * الباك اند لسه هيطلب username/password إجباري (مفيش طريقة تانية دلوقتي).
 * حالياً بنمنع "التالي" في الحالة دي لحد ما نتفق على حل (مثلاً توليد
 * username/password تلقائي في الخلفية، أو انتظار تحديث الباك اند).
 */
const ACCOUNT_TYPES = {
  INDEPENDENT: "independent",
  PARENT_LINKED: "parent",
};

export default function Step3AccountCredentials({ formData, setFormData, onNext, onBack }) {
  const [touched, setTouched] = useState(false);

  const accountType = formData.accountType || "";
  const isIndependent = accountType === ACCOUNT_TYPES.INDEPENDENT;
  const isParentLinked = accountType === ACCOUNT_TYPES.PARENT_LINKED;

  const passwordsMismatch =
    touched &&
    formData.password &&
    formData.passwordConfirm &&
    formData.password !== formData.passwordConfirm;

  // "عبر ولي الأمر" ميحتاجش أي بيانات - الطالب هيستخدم نفس دخول ولي الأمر
  // (اسم المستخدم وكلمة المرور بيتولّدوا تلقائياً في الخلفية وقت الإرسال، شوف Step4Review)
  const canProceed = isParentLinked
    ? true
    : isIndependent &&
      formData.username &&
      formData.password &&
      formData.passwordConfirm &&
      formData.password === formData.passwordConfirm;

  const handleSelectType = (type) => {
    if (type === ACCOUNT_TYPES.PARENT_LINKED) {
      setFormData({
        ...formData,
        accountType: type,
        username: "",
        password: "",
        passwordConfirm: "",
      });
    } else {
      setFormData({ ...formData, accountType: type });
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-gray-800">بيانات دخول الطالب</h2>
        <p className="text-sm text-gray-500">
          حدّد طريقة تسجيل الدخول التي سيستخدمها الطالب للوصول إلى المنصة التعليمية.
        </p>
      </div>

      {/* اختيار نوع حساب الطالب */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-gray-700">
          نوع حساب الطالب <span className="text-red-500">*</span>
        </label>

        {/* حساب مستقل بالطالب */}
        <label
          className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
            isIndependent ? "border-[#1E3A8A] bg-[#EEF2FF]" : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          <input
            type="radio"
            name="accountType"
            className="mt-1"
            checked={isIndependent}
            onChange={() => handleSelectType(ACCOUNT_TYPES.INDEPENDENT)}
          />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-800">حساب مستقل بالطالب</span>
            <span className="text-xs text-gray-500">
              يتمتع الطالب بحساب خاص به باسم مستخدم وكلمة مرور مستقلة، مما يتيح له الوصول المباشر إلى المنصة.
            </span>
          </div>
        </label>

        {/* الدخول عبر حساب ولي الأمر */}
        <label
          className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
            isParentLinked ? "border-[#1E3A8A] bg-[#EEF2FF]" : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          <input
            type="radio"
            name="accountType"
            className="mt-1"
            checked={isParentLinked}
            onChange={() => handleSelectType(ACCOUNT_TYPES.PARENT_LINKED)}
          />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-800">الدخول عبر حساب ولي الأمر</span>
            <span className="text-xs text-gray-500">
              يستخدم الطالب بيانات تسجيل دخول ولي الأمر للوصول إلى المنصة، دون الحاجة إلى حساب منفصل.
            </span>
          </div>
        </label>
      </div>

      {/* حقول حساب مستقل بالطالب - نفس الحقول الأصلية بالظبط، من غير رقم تليفون */}
      {isIndependent && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600">اسم المستخدم</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="h-12 border rounded-lg px-4 bg-gray-50 focus:bg-white"
              placeholder="أدخل اسم المستخدم للطفل"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600">كلمة المرور</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="h-12 border rounded-lg px-4 bg-gray-50 focus:bg-white"
              placeholder="أدخل كلمة المرور"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600">تأكيد كلمة المرور</label>
            <input
              type="password"
              value={formData.passwordConfirm}
              onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
              onBlur={() => setTouched(true)}
              className="h-12 border rounded-lg px-4 bg-gray-50 focus:bg-white"
              placeholder="أعد إدخال كلمة المرور"
            />
            {passwordsMismatch && (
              <span className="text-xs text-red-600">كلمتا المرور غير متطابقتين</span>
            )}
          </div>
        </div>
      )}

      {/* رسالة توضيحية لحالة الدخول عبر ولي الأمر */}
      {isParentLinked && (
        <div className="bg-green-50 text-green-700 text-xs rounded-lg px-4 py-3 flex items-start gap-2">
          <span className="mt-0.5">✓</span>
          <span>
            سيتم ربط الطالب بحساب ولي الأمر. سيتمكن الطالب من الدخول إلى المنصة التعليمية باستخدام نفس بيانات اعتماد
            ولي الأمر، لا يحتاج إلى إنشاء حساب مستقل.
          </span>
        </div>
      )}

      <div className="flex gap-4 mt-2">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="flex-1 h-12 bg-blue-900 text-white rounded-lg font-medium disabled:opacity-50"
        >
          التالي
        </button>
        <button onClick={onBack} className="flex-1 h-12 border text-gray-600 rounded-lg">
          السابق
        </button>
      </div>
    </div>
  );
}