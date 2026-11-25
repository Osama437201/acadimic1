import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import StudentSidebar from "../../components/StudentSidebar";

// ملاحظة: الصفحة دي استاتيك بالكامل (بيانات وهمية Placeholder) للعرض/التصميم فقط،
// لسه محتاجين نوصلها بالـ API الحقيقي بتاع تفاصيل الحصة (رابط البث، الملفات، التسجيلات، الواجبات، الاختبارات...).

const SESSION_INFO = {
    title: "المصفوفات_2",
    groupName: "مجموعة الرياضيات A",
    isLive: true,
};

const FILES = [
    { id: 2, title: "حل واجب المعادلات", size: "24MB" },
    { id: 1, title: "شرح المصفوفات", size: "24MB" },
    { id: 4, title: "حل واجب المعادلات", size: "24MB" },
    { id: 3, title: "شرح المصفوفات", size: "24MB" },
];

const RECORDINGS = [
    {
        id: 1,
        title: "حساب المتجهات والمصفوفات",
        date: "2024-06-13",
        subject: "رياضيات A",
        size: "1.8 GB",
        tag: "للطالب",
        tone: "amber",
    },
    {
        id: 2,
        title: "حساب المتجهات والمصفوفات",
        date: "2024-06-13",
        subject: "رياضيات A",
        size: "1.8 GB",
        tag: "الطالب",
        tone: "blue",
    },
];

const ASSIGNMENTS = [
    { id: 1, title: "واجب التفاضل والتكامل", deadline: "الموعد النهائي : خلال يومين", status: "نشط" },
    { id: 2, title: "واجب التفاضل والتكامل", deadline: "الموعد النهائي : خلال يومين", status: "نشط" },
];

const TESTS = [
    { id: 1, title: "اختبار المعادلات التربيعية", status: "منتهي" },
    { id: 2, title: "اختبار المعادلات التربيعية", status: "منتهي" },
    { id: 3, title: "اختبار المعادلات التربيعية", status: "منتهي" },
];

export default function StudentSessionDetails() {
    const navigate = useNavigate();
    const { groupId, sessionId } = useParams();

    const handleStartLesson = () => {
        // TODO: يتوصل برابط البث الحقيقي بتاع الحصة
        console.log("بدء الدرس للحصة رقم:", sessionId);
    };

    const handleShare = () => {
        // TODO: منطق المشاركة الحقيقي (نسخ رابط، فتح مودال...)
        console.log("مشاركة الحصة رقم:", sessionId);
    };

    const handleDownloadFile = (fileId) => {
        // TODO: تحميل الملف الحقيقي بالـ API
        console.log("تحميل الملف:", fileId);
    };

    const handleRecordingAction = (recordingId, action) => {
        // TODO: مشاركة/تحميل التسجيل الحقيقي بالـ API
        console.log(action, "للتسجيل:", recordingId);
    };

    const handleAssignmentOpen = (assignmentId) => {
        // TODO: فتح/معاينة الواجب الحقيقي
        console.log("فتح الواجب:", assignmentId);
    };

    const handleAssignmentDownload = (assignmentId) => {
        // TODO: تحميل الواجب الحقيقي
        console.log("تحميل الواجب:", assignmentId);
    };

    const handleTestOpen = (testId) => {
        // TODO: فتح/معاينة الاختبار الحقيقي
        console.log("فتح الاختبار:", testId);
    };

    const handleTestDownload = (testId) => {
        // TODO: تحميل نتيجة/تفاصيل الاختبار الحقيقي
        console.log("تحميل الاختبار:", testId);
    };

    return (
        <div dir="rtl" className="h-screen w-full flex overflow-hidden bg-[#F9FAFA]">
            <StudentSidebar activeId="groups" />

            <main className="flex-1 h-full overflow-y-auto p-5 lg:p-8 flex flex-col gap-6">

                {/* رأس الحصة - بعرض الصفحة كله فوق */}
                <div className="w-full flex items-start justify-between">
                    {/* النص - يمين */}
                    <div className="flex flex-col items-end gap-1 text-right">
                        <div className="flex items-start gap-2">
                            <div className="flex flex-col items-end gap-1 text-right">
                                <h2 className="font-ibm font-semibold text-[24px] leading-[32px] text-[#123C91]">
                                    {SESSION_INFO.title}
                                </h2>
                                <p className="font-ibm text-[16px] leading-[24px] text-[#575F69]">
                                    {SESSION_INFO.groupName}
                                </p>
                            </div>
                            {SESSION_INFO.isLive && (
                                <span className="inline-flex items-center rounded-full bg-[rgba(0,166,62,0.15)] text-[#00A63E] font-ibm text-xs font-bold py-1 px-4 shrink-0 mt-1">
                                    مباشرة الآن
                                </span>
                            )}
                        </div>
                    </div>

                    {/* أيقونة الشير - شمال */}
                    <button
                        type="button"
                        onClick={handleShare}
                        className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#E5E5E5] bg-white hover:bg-gray-50 transition-colors shrink-0"
                        title="مشاركة"
                    >
                        <ShareIcon size={16} color="#1F2937" />
                    </button>
                </div>

                {/* الصف اللي تحت العنوان: المحتوى الرئيسي (يمين) + الشريط الجانبي (شمال) */}
                <div className="w-full flex items-start gap-5">

                    {/* العمود الرئيسي - يمين (أول عنصر في الكود) */}
                    <div className="flex-1 flex flex-col gap-5 min-w-0">

                        {/* بانر الحصة المباشرة */}
                        <div className="w-full bg-[#1F2937] rounded-2xl p-6 flex items-center justify-between gap-[10px] flex-wrap">
                            <div className="flex flex-col items-start gap-1 text-right">
                                <h3 className="font-ibm font-semibold text-[20px] leading-6 text-white">
                                    رابط الحصة المباشرة
                                </h3>
                                <p className="font-ibm text-[16px] leading-6 text-white">
                                    انضم الآن للتفاعل مع المعلم وزملائك.
                                </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={handleStartLesson}
                                    className="h-10 w-[160px] px-6 rounded-lg border border-[#E5E5E5] bg-white text-[#1F2937] font-ibm font-semibold text-[15px] hover:bg-gray-100 transition-colors flex items-center justify-center"
                                >
                                    بدء الدرس
                                </button>
                                <button
                                    type="button"
                                    onClick={handleShare}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-white hover:bg-gray-100 transition-colors shrink-0"
                                    title="مشاركة"
                                >
                                    <ShareIcon size={16} color="#1F2937" />
                                </button>
                            </div>
                        </div>

                        {/* الملفات */}
                        <section className="w-full bg-white rounded-2xl p-6 flex flex-col gap-4 border border-[#E5E5E5]">
                            <h3 className="font-ibm font-semibold text-[20px] leading-6 text-[#1F2937] text-right">
                                الملفات
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {FILES.map((file) => (
                                    <div
                                        key={file.id}
                                        className="flex items-center justify-between gap-2 rounded-2xl border border-[#E5E5E5] p-4"
                                    >
                                        <div className="flex items-center gap-2 flex-1 text-right">
                                            <PdfIcon size={24} color="#D32F2F" />
                                            <div className="flex flex-col items-end gap-0.5">
                                                <span className="font-ibm font-medium text-[14px] leading-4 text-[#1F2937]">
                                                    {file.title}
                                                </span>
                                                <span className="font-ibm text-[12px] leading-4 text-[#575F69]">
                                                    PDF {file.size}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleDownloadFile(file.id)}
                                            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                                            title="تحميل"
                                        >
                                            <DownloadIcon size={16} color="#575F69" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* التسجيلات */}
                        <section className="w-full bg-white rounded-2xl p-6 flex flex-col gap-4 border border-[#E5E5E5]">
                            <h3 className="font-tajawal font-semibold text-[18px] leading-6 text-[#1F2937] text-right">
                                التسجيلات
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {RECORDINGS.map((rec) => (
                                    <div
                                        key={rec.id}
                                        className="rounded-2xl border border-[#E5E5E5] overflow-hidden flex flex-col"
                                    >
                                        <div className="relative h-[160px] w-full bg-gradient-to-br from-[#1F2937] to-[#374151] flex items-center justify-center">
                                            <span
                                                className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-lg font-ibm text-xs font-semibold py-1 px-2.5"
                                                style={{
                                                    backgroundColor:
                                                        rec.tone === "amber"
                                                            ? "rgba(217, 119, 6, 0.9)"
                                                            : "rgba(18, 60, 145, 0.9)",
                                                    color: "#FFFFFF",
                                                }}
                                            >
                                                <UsersIcon size={13} color="#FFFFFF" />
                                                {rec.tag}
                                            </span>
                                            <MathIllustrationIcon size={72} color="#4B5563" />
                                        </div>

                                        <div className="p-4 flex flex-col gap-2 text-right">
                                            <span className="font-tajawal font-medium text-[16px] leading-5 text-[#1F2937]">
                                                {rec.title}
                                            </span>

                                            <div className="flex items-center justify-end gap-2">
                                                <span className="inline-flex items-center rounded-lg bg-[rgba(18,60,145,0.1)] text-[#123C91] font-ibm text-xs font-semibold py-1 px-2.5">
                                                    {rec.subject}
                                                </span>
                                                <span className="font-ibm text-[13px] text-[#8C9198]">
                                                    {rec.date}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between pt-2 border-t border-[#E5E5E5] mt-1">
                                                <span className="font-ibm text-[13px] text-[#8C9198]">
                                                    {rec.size}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRecordingAction(rec.id, "تحميل")}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                                                        title="تحميل"
                                                    >
                                                        <DownloadIcon size={16} color="#575F69" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRecordingAction(rec.id, "مشاركة")}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                                                        title="مشاركة"
                                                    >
                                                        <ShareIcon size={16} color="#575F69" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* الشريط الجانبي - شمال (376px) - تاني عنصر في الكود */}
                    <div className="w-[376px] shrink-0 flex flex-col gap-6">

                        {/* الواجبات */}
                        <section className="w-full bg-white rounded-2xl p-6 flex flex-col gap-4 border border-[#E5E5E5]">
                            <h3 className="font-ibm font-semibold text-[20px] leading-6 text-[#1F2937] text-right">
                                الواجبات
                            </h3>

                            <div className="flex flex-col gap-4">
                                {ASSIGNMENTS.map((item) => (
                                    <div
                                        key={item.id}
                                        className="w-full flex items-center justify-between gap-4 rounded-2xl border border-[#E5E5E5] p-4"
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0 text-right">
                                            <button
                                                type="button"
                                                onClick={() => handleAssignmentOpen(item.id)}
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#EAF4FF] shrink-0"
                                                title="فتح الواجب"
                                            >
                                                <PlayIcon size={16} color="#123C91" />
                                            </button>
                                            <div className="flex flex-col items-end gap-0.5 min-w-0">
                                                <span className="font-ibm font-medium text-[14px] leading-4 text-[#1F2937] truncate w-full text-right">
                                                    {item.title}
                                                </span>
                                                <span className="font-ibm text-[12px] leading-4 text-[#575F69] truncate w-full text-right">
                                                    {item.deadline}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="inline-flex items-center rounded-full bg-[rgba(0,166,62,0.15)] text-[#00A63E] font-ibm text-xs font-bold py-1 px-4">
                                                {item.status}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleAssignmentDownload(item.id)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E5E5] bg-white hover:bg-gray-50 transition-colors"
                                                title="تحميل"
                                            >
                                                <DownloadIcon size={16} color="#575F69" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* الاختبارات */}
                        <section className="w-full bg-white rounded-2xl p-6 flex flex-col gap-4 border border-[#E5E5E5]">
                            <h3 className="font-ibm font-semibold text-[20px] leading-6 text-[#1F2937] text-right">
                                الاختبارات
                            </h3>

                            <div className="flex flex-col gap-4">
                                {TESTS.map((test) => (
                                    <div
                                        key={test.id}
                                        className="w-full flex items-center justify-between gap-4 rounded-2xl border border-[#E5E5E5] p-4"
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0 text-right">
                                            <button
                                                type="button"
                                                onClick={() => handleTestOpen(test.id)}
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#EAF4FF] shrink-0"
                                                title="فتح الاختبار"
                                            >
                                                <PlayIcon size={16} color="#123C91" />
                                            </button>
                                            <span className="font-ibm font-medium text-[14px] leading-4 text-[#1F2937] truncate w-full text-right">
                                                {test.title}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="inline-flex items-center rounded-full bg-[rgba(31,41,55,0.15)] text-[#1F2937] font-ibm text-xs font-bold py-1 px-4">
                                                {test.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

/* ---------- عناصر مساعدة ---------- */

function iconProps({ size = 18, color = "currentColor", strokeWidth = 1.8, fill = "none" }) {
    return {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: fill,
        stroke: color,
        strokeWidth,
        strokeLinecap: "round",
        strokeLinejoin: "round",
    };
}

function ShareIcon(p) {
    return (
        <svg {...iconProps(p)}>
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
        </svg>
    );
}

function DownloadIcon(p) {
    return (
        <svg {...iconProps(p)}>
            <path d="M12 3v12" />
            <path d="M7 10l5 5 5-5" />
            <path d="M5 21h14" />
        </svg>
    );
}

function PdfIcon(p) {
    return (
        <svg {...iconProps(p)}>
            <path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8Z" />
            <path d="M14 3v5h5" />
        </svg>
    );
}

function UsersIcon(p) {
    return (
        <svg {...iconProps(p)}>
            <circle cx="9" cy="8" r="3" />
            <path d="M2 20c0-3 3-5 7-5s7 2 7 5" />
            <path d="M16 8a3 3 0 1 1 0 6" />
            <path d="M22 20c0-2.5-2-4.2-5-4.8" />
        </svg>
    );
}

function MathIllustrationIcon(p) {
    return (
        <svg {...iconProps(p)}>
            <path d="M4 5h5l-3 7 3 7H4" />
            <path d="M15 5h5l-3 7 3 7h-5" />
        </svg>
    );
}

function PlayIcon(p) {
    return (
        <svg {...iconProps({ ...p, fill: p.color, strokeWidth: 0 })}>
            <path d="M8 5v14l11-7z" />
        </svg>
    );
}