export const CURRENCY_LABELS: Record<string, string> = {
  EGP: "ج.م",
  SAR: "ر.س",
  AED: "د.إ",
  USD: "$",
  EUR: "€",
};

export const LABEL_TO_ISO_CURRENCY: Record<string, string> = Object.fromEntries(
  Object.entries(CURRENCY_LABELS).map(([iso, label]) => [label, iso]),
);

/**
 * تحويل رمز العملة المعروض في الواجهة (مثل "ج.م") إلى رمز ISO 4217 القياسي (مثل "EGP")
 * المتوافق مع معايير Schema.org ومحركات البحث
 */
export const toIsoCurrency = (currency?: string | null): string => {
  if (!currency) return "EGP";
  const trimmed = currency.trim();
  if (/^[A-Z]{3}$/.test(trimmed)) return trimmed;
  return LABEL_TO_ISO_CURRENCY[trimmed] ?? "EGP";
};
