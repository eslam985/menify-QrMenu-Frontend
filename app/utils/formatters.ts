export const formatPrice = (price: number | string): string => {
  const num = Number(price);
  if (isNaN(num)) return String(price);

  return new Intl.NumberFormat("ar-EG").format(num);
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return "-";

  const d: Date = new Date(dateStr);

  if (Number.isNaN(d.getTime())) return "-";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const time = d.toLocaleTimeString("en-US", { timeStyle: "short" });

  return `${year}/${month}/${day}, ${time}`;
};
