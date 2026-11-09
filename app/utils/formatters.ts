// app/utils/formatters.ts
export const formatPrice = (price: number | string): string => {
  const num = Number(price);
  if (isNaN(num)) return String(price);

  // استخدام اللغة العربية لتنسيق الأرقام (تظهر بالأرقام العربية المشرقية ٠١٢٣٤٥٦٧٨٩)
  return new Intl.NumberFormat("ar-EG").format(num);
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return "-";

  const d: Date = new Date(dateStr);

  // التعديل هنا: استخدمنا Number.isNaN لأن دالة getTime ترجع رقماً
  if (Number.isNaN(d.getTime())) return "-";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const time = d.toLocaleTimeString("en-US", { timeStyle: "short" });

  return `${year}/${month}/${day}, ${time}`;
};
