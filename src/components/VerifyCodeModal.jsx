import React, { useState, useEffect, useRef } from "react";
import { verifyAccount } from "../services/authService";

const CODE_LENGTH = 6;
const COUNTDOWN_SECONDS = 60;

export default function VerifyCodeModal({
  open,
  email,
  displayIdentifier,
  title,
  onVerify,
  onSuccess,
  onClose,
}) {
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const inputsRef = useRef([]);

  // إعادة ضبط النافذة كل ما تتفتح من جديد
  useEffect(() => {
    if (open) {
      setDigits(Array(CODE_LENGTH).fill(""));
      setSecondsLeft(COUNTDOWN_SECONDS);
      setErrorMsg("");
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
    }
  }, [open]);

  // العد التنازلي
  useEffect(() => {
    if (!open || secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [open, secondsLeft]);

  if (!open) return null;

  const handleDigitChange = (index, value) => {
    const clean = value.replace(/[^0-9]/g, "").slice(-1);
    const next = [...digits];
    next[index] = clean;
    setDigits(next);

    if (clean && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (!pasted) return;
    e.preventDefault();
    const next = pasted.slice(0, CODE_LENGTH).split("");
    setDigits((prev) => next.concat(prev.slice(next.length)));
    inputsRef.current[Math.min(next.length, CODE_LENGTH - 1)]?.focus();
  };

  const handleVerify = async () => {
    const code = digits.join("");
    if (code.length < CODE_LENGTH) {
      setErrorMsg("من فضلك أدخل الكود كاملًا");
      return;
    }

    setErrorMsg("");
    setLoading(true);
    try {
      if (onVerify) {
        await onVerify(code);
      } else {
        await verifyAccount({ email, code });
      }
      onSuccess?.();
    } catch (err) {
      const msg =
        err.response?.data?.message || "الكود غير صحيح أو منتهي الصلاحية";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      dir="rtl"
    >
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col items-center gap-5 text-center">
        <p className="font-tajawal font-medium text-[15px] leading-6 text-[#1F2937]">
          {title || "لإكمال عملية التسجيل، نرجو إدخال رمز التفعيل المرسل إلى"}
        </p>

        <p dir="ltr" className="font-tajawal font-bold text-lg text-[#123C91]">
          {displayIdentifier}
        </p>

        {errorMsg && (
          <div className="w-full text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {errorMsg}
          </div>
        )}

        {/* خانات الكود */}
        <div dir="ltr" className="flex justify-center gap-2">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              className="w-11 h-12 rounded-lg border border-[#E5E5E5] bg-[#F9FAFA]
                         text-center font-tajawal font-bold text-lg text-[#1F2937]
                         outline-none focus:border-[#123C91]"
            />
          ))}
        </div>

        {/* العد التنازلي */}
        <div className="flex flex-col items-center gap-1">
          <p className="font-ibm text-[13px] text-[#8C9198] leading-5">
            إذا لم يصلك رمز التحقق بعد، نرجو منك الانتظار حتى انتهاء المهلة
            المحددة:
          </p>
          <p className="font-tajawal font-bold text-base text-[#1F2937]">
            {secondsLeft > 0 ? `${secondsLeft} ثانية` : "انتهت المهلة"}
          </p>
        </div>

        {/* الأزرار */}
        <div className="w-full flex flex-col sm:flex-row gap-3 mt-1">
          <button
            type="button"
            onClick={handleVerify}
            disabled={loading}
            className="flex-1 h-12 rounded-lg bg-[#123C91] hover:bg-[#0e2f73] transition-colors
                       disabled:opacity-60 disabled:cursor-not-allowed
                       font-tajawal font-medium text-white"
          >
            {loading ? "جاري التحقق..." : "تحقق"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-12 rounded-lg border border-[#E5E5E5] bg-white
                       hover:border-[#123C91] hover:text-[#123C91] transition-colors
                       font-tajawal font-medium text-[#575F69]"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
