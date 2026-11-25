import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";

export default function CreateAssignment() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetGroup: "",
    targetSession: "",
    dueDate: "",
    dueTime: "",
    totalGrade: "100",
    successGrade: "50",
    showGradeToStudent: true,
    notifyParent: true,
    attachment: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        attachment: file,
      }));
    }
  };

  const handleToggle = (name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Assignment Data:", formData);
    navigate("/teacher/assignments");
  };

  return (
    <div
      dir="rtl"
      className="h-screen w-full flex bg-[#F9F9FF] overflow-hidden font-ibm"
    >
      <TeacherSidebar activeId="assignments" />

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto px-8 py-8 flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-ibm font-semibold text-2xl leading-8 text-[#123C91]">
            إضافة واجب
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Right Column: Main Details + Upload */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* بيانات الواجب الأساسية */}
              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 flex flex-col gap-6 shadow-[0px_4px_0px_0px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-2.5 border-b border-[#E5E5E5] pb-4">
                  <DocIcon size={22} color="#123C91" />
                  <span className="font-ibm font-bold text-base leading-6 text-[#1F2937]">
                    بيانات الواجب الأساسية
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-medium text-sm text-[#1F2937]">
                    عنوان الواجب <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="مثال: حل مسائل التفاضل والتكامل"
                    className="w-full h-12 px-4 bg-[#F9FAFA] border border-[#E5E5E5] rounded-xl text-sm text-[#1F2937] placeholder-[#8C9198] outline-none transition-all focus:bg-white focus:border-[#123C91] focus:ring-2 focus:ring-[#123C91]/10"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-medium text-sm text-[#1F2937]">
                    وصف الواجب وتعليمات التنفيذ{" "}
                    <span className="text-xs text-[#8C9198] font-normal">
                      (اختياري)
                    </span>
                  </label>
                  <textarea
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="اكتب تعليمات مفصلة للطلاب لمساعدتهم في إنجاز الواجب..."
                    className="w-full p-4 bg-[#F9FAFA] border border-[#E5E5E5] rounded-xl text-sm text-[#1F2937] placeholder-[#8C9198] outline-none transition-all focus:bg-white focus:border-[#123C91] focus:ring-2 focus:ring-[#123C91]/10 resize-none"
                  ></textarea>
                </div>
              </div>

              {/* مرفقات الواجب */}
              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 flex flex-col gap-4 shadow-[0px_4px_0px_0px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-2.5 border-b border-[#E5E5E5] pb-4">
                  <UploadFolderIcon size={22} color="#123C91" />
                  <span className="font-ibm font-bold text-base leading-6 text-[#1F2937]">
                    مرفقات الواجب
                  </span>
                </div>
                <p className="text-xs text-[#575F69]">
                  أضف ملف الواجب وأي ملفات إضافية تدعم عملية الحل أو الفهم.
                </p>

                <label className="border-2 border-dashed border-[#E5E5E5] rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-[#F9FAFA] cursor-pointer hover:border-[#123C91] hover:bg-[#F4F6FB] transition-all group">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.jpg,.jpeg,.png,.ppt,.pptx"
                  />
                  <div className="w-12 h-12 rounded-full bg-[#123C91]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UploadCloudIcon size={24} color="#123C91" />
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <span className="text-sm font-semibold text-[#1F2937]">
                      {formData.attachment ? (
                        <span className="text-[#123C91]">
                          تم اختيار الملف: {formData.attachment.name}
                        </span>
                      ) : (
                        <>
                          اسحب الملفات هنا أو{" "}
                          <span className="text-[#123C91] underline">
                            اضغط للاختيار
                          </span>
                        </>
                      )}
                    </span>
                    <span className="text-xs text-[#8C9198]">
                      PDF, DOCX, JPG, PPT (الحد الأقصى للملف 20MB)
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Left Column: Settings */}
            <div className="flex flex-col gap-6">
              {/* إعدادات الواجب */}
              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-4 shadow-[0px_4px_0px_0px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-2 border-b border-[#E5E5E5] pb-3">
                  <SettingsIcon size={20} color="#123C91" />
                  <span className="font-bold text-base text-[#1F2937]">
                    إعدادات الواجب
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#575F69]">
                    المجموعة المستهدفة
                  </label>
                  <select
                    name="targetGroup"
                    value={formData.targetGroup}
                    onChange={handleChange}
                    className="h-11 px-3 bg-[#F9FAFA] border border-[#E5E5E5] rounded-xl text-sm text-[#1F2937] outline-none focus:border-[#123C91] focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="">جميع المجموعات</option>
                    <option value="group-a">رياضيات A</option>
                    <option value="group-b">رياضيات B</option>
                    <option value="group-c">رياضيات C</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#575F69]">
                    الحصة المستهدفة{" "}
                    <span className="text-[#8C9198]">(اختياري)</span>
                  </label>
                  <select
                    name="targetSession"
                    value={formData.targetSession}
                    onChange={handleChange}
                    className="h-11 px-3 bg-[#F9FAFA] border border-[#E5E5E5] rounded-xl text-sm text-[#1F2937] outline-none focus:border-[#123C91] focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="">اختر الحصة المرتبطة</option>
                    <option value="session-1">المعادلات التربيعية</option>
                    <option value="session-2">الهندسة التحليلية</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#575F69]">
                    تاريخ ووقت التسليم
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      className="h-11 px-3 bg-[#F9FAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#1F2937] outline-none focus:border-[#123C91] focus:bg-white transition-all"
                    />
                    <input
                      type="time"
                      name="dueTime"
                      value={formData.dueTime}
                      onChange={handleChange}
                      className="h-11 px-3 bg-[#F9FAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#1F2937] outline-none focus:border-[#123C91] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#575F69]">
                      الدرجة الكلية
                    </label>
                    <input
                      type="number"
                      name="totalGrade"
                      value={formData.totalGrade}
                      onChange={handleChange}
                      className="h-11 px-3 bg-[#F9FAFA] border border-[#E5E5E5] rounded-xl text-sm font-semibold text-center text-[#1F2937] outline-none focus:border-[#123C91] focus:bg-white transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#575F69]">
                      درجة النجاح
                    </label>
                    <input
                      type="number"
                      name="successGrade"
                      value={formData.successGrade}
                      onChange={handleChange}
                      className="h-11 px-3 bg-[#F9FAFA] border border-[#E5E5E5] rounded-xl text-sm font-semibold text-center text-[#1F2937] outline-none focus:border-[#123C91] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* إعدادات إضافية */}
              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-4 shadow-[0px_4px_0px_0px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-2 border-b border-[#E5E5E5] pb-3">
                  <SettingsIcon size={20} color="#123C91" />
                  <span className="font-bold text-base text-[#1F2937]">
                    إعدادات إضافية
                  </span>
                </div>

                {/* زر تشغيل: عرض الدرجة للطلاب (تم ضبط حركة الاتجاه باللغة العربية) */}
                <div
                  className="flex items-center justify-between py-1 cursor-pointer select-none"
                  onClick={() => handleToggle("showGradeToStudent")}
                >
                  <span className="text-sm text-[#1F2937]">
                    عرض الدرجة للطلاب
                  </span>
                  <div
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                      formData.showGradeToStudent
                        ? "bg-[#123C91]"
                        : "bg-[#E5E5E5]"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                        formData.showGradeToStudent
                          ? "translate-x-0"
                          : "-translate-x-6"
                      }`}
                    ></div>
                  </div>
                </div>

                {/* زر تشغيل: إعلام ولي الأمر بالدرجة (تم ضبط حركة الاتجاه باللغة العربية) */}
                <div
                  className="flex items-center justify-between py-1 cursor-pointer select-none"
                  onClick={() => handleToggle("notifyParent")}
                >
                  <span className="text-sm text-[#1F2937]">
                    إعلام ولي الأمر بالدرجة
                  </span>
                  <div
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                      formData.notifyParent ? "bg-[#123C91]" : "bg-[#E5E5E5]"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                        formData.notifyParent
                          ? "translate-x-0"
                          : "-translate-x-6"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] px-8 py-4 flex items-center gap-4 shadow-[0px_4px_0px_0px_rgba(0,0,0,0.04)]">
            <button
              type="submit"
              className="flex-1 h-14 rounded-lg bg-[#123C91] px-4 flex items-center justify-center gap-2 text-white font-medium text-base font-ibm hover:bg-[#0d2d6c] transition-all"
            >
              إضافة الواجب
            </button>
            <button
              type="button"
              onClick={() => navigate("/teacher/assignments")}
              className="w-[352px] h-14 shrink-0 rounded-lg border border-[#E5E5E5] px-6 flex items-center justify-center gap-2 text-[#575F69] font-medium text-base font-ibm hover:bg-[#F9FAFA] transition-all"
            >
              إلغاء
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

/* Helper Icons */
function DocIcon({ size = 18, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 3h7l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14 3v4h4" />
      <path d="M9 13h6M9 17h4" />
    </svg>
  );
}

function UploadFolderIcon({ size = 18, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      <path d="M12 11v6M9 14l3-3 3 3" />
    </svg>
  );
}

function UploadCloudIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 16l-4-4-4 4" />
      <path d="M12 12v9" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  );
}

function SettingsIcon({ size = 18, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.4-2-3.4-2.3.9a7.7 7.7 0 0 0-2.6-1.5L14 2.5h-4l-.5 2.6a7.7 7.7 0 0 0-2.6 1.5l-2.3-.9-2 3.4 2 1.4a7.6 7.6 0 0 0 0 3l-2 1.4 2 3.4 2.3-.9c.77.66 1.65 1.17 2.6 1.5L10 21.5h4l.5-2.6a7.7 7.7 0 0 0 2.6-1.5l2.3.9 2-3.4-2-1.4z" />
    </svg>
  );
}
