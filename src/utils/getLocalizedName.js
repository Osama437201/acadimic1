/**
 * بعض حقول الـ API (name) بترجع كـ object بلغتين: { ar: "...", en: "..." }
 * بدل ما تكون نص عادي. الدالة دي بتتعامل مع الحالتين عشان
 * React ميرفضش يرندرها كـ child مباشر.
 */
export function getLocalizedName(value, lang = "ar") {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") return value[lang] || value.ar || value.en || "";
  return String(value);
}