import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";

const MOCK_STUDENTS = [
  { id: 1, name: "أحمد محمد" },
  { id: 2, name: "أحمد محمد" },
  { id: 3, name: "أحمد محمد" },
  { id: 4, name: "أحمد محمد" },
  { id: 5, name: "أحمد محمد" },
  { id: 6, name: "أحمد محمد" },
  { id: 7, name: "أحمد محمد" },
  { id: 8, name: "أحمد محمد" },
  { id: 9, name: "أحمد محمد" },
  { id: 10, name: "أحمد محمد" },
  { id: 11, name: "أحمد محمد" },
  { id: 12, name: "أحمد محمد" },
  { id: 13, name: "أحمد محمد" },
];

export default function Attendance() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = location.state?.session || { title: "المصفوفات_2" };

  const [attendanceState, setAttendanceState] = useState({});

  const handleSelect = (index, status) => {
    setAttendanceState((prev) => ({ ...prev, [index]: status }));
  };

  return (
    <div
      dir="rtl"
      className="h-screen w-full flex bg-[#F9F9FF] overflow-hidden font-ibm"
    >
      {/* الشريط الجانبي Sidebar */}
      <TeacherSidebar activeId="groups" />

      {/* المحتوى الرئيسي */}
      <main className="flex-1 h-full overflow-y-auto px-8 py-8 flex flex-col justify-between">
        <div className="flex flex-col gap-6">
          {/* الهيدر */}
          <div className="flex items-center justify-between">
            <h1 className="font-ibm font-semibold text-[24px] leading-[32px] text-[#123C91]">
              تسجيل الحضور
            </h1>
          </div>

          {/* جدول تسجيل الحضور */}
          <div className="bg-white border border-[#E5E5E5] rounded-[16px] p-8 shadow-[0_4px_4px_rgba(0,0,0,0.12)] flex flex-col gap-6">
            <div className="grid grid-cols-2 items-center pb-4 border-b border-[#E5E5E5] font-ibm font-bold text-[#1F2937] text-base">
              <div className="text-right">الطالب</div>
              <div className="grid grid-cols-2 text-center">
                <div>حاضر</div>
                <div>غائب</div>
              </div>
            </div>

            <div className="flex flex-col divide-y divide-[#F1F1F5]">
              {MOCK_STUDENTS.map((student, index) => {
                const currentStatus = attendanceState[index];
                return (
                  <div
                    key={index}
                    className="grid grid-cols-2 items-center py-4"
                  >
                    {/* اسم الطالب */}
                    <div className="text-right font-ibm font-normal text-base text-[#1F2937]">
                      {student.name}
                    </div>

                    {/* أزرار الاختيار (حاضر / غائب) متوافقة مع تصميم الجدول */}
                    <div className="grid grid-cols-2 text-center justify-items-center">
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => handleSelect(index, "present")}
                          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                            currentStatus === "present"
                              ? "border-[#00A63E] bg-white"
                              : "border-[#D1D5DB] bg-white"
                          }`}
                        >
                          {currentStatus === "present" && (
                            <div className="w-4 h-4 rounded-full bg-[#00A63E]" />
                          )}
                        </button>
                      </div>

                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => handleSelect(index, "absent")}
                          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                            currentStatus === "absent"
                              ? "border-[#DC2626] bg-white"
                              : "border-[#D1D5DB] bg-white"
                          }`}
                        >
                          {currentStatus === "absent" && (
                            <div className="w-4 h-4 rounded-full bg-[#DC2626]" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* أزرار الحفظ والإلغاء (زر الحفظ يمين وزر الإلغاء يسار) */}
        <div className="bg-white border border-[#E5E5E5] rounded-[16px] p-4 shadow-sm flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 h-[56px] rounded-[8px] bg-[#123C91] px-[16px] font-tajawal font-medium text-[16px] leading-[100%] text-white hover:bg-[#0F2F73] transition-colors flex items-center justify-center"
          >
            حفظ
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{ width: "352px" }}
            className="h-[56px] rounded-[8px] border border-[#E5E5E5] bg-white px-[24px] font-tajawal font-medium text-[16px] leading-[100%] text-[#575F69] hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            إلغاء
          </button>
        </div>
      </main>
    </div>
  );
}